-- Fix: ensure the transfer function can update both users' balances even with profiles RLS
-- We explicitly disable row security inside the SECURITY DEFINER function and use UPDATE ... RETURNING to ensure rows are affected.

CREATE OR REPLACE FUNCTION public.transfer_fused_points(
  _receiver_id uuid,
  _amount integer,
  _message text DEFAULT NULL
)
RETURNS TABLE (
  transfer_id uuid,
  sender_balance integer,
  receiver_balance integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _sender_id uuid;
  _transfer_id uuid;
  _sender_balance integer;
  _receiver_balance integer;
BEGIN
  -- Bypass RLS for the duration of this function (function is owned by postgres)
  PERFORM set_config('row_security', 'off', true);

  _sender_id := auth.uid();

  IF _sender_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF _receiver_id IS NULL THEN
    RAISE EXCEPTION 'Receiver required';
  END IF;

  IF _receiver_id = _sender_id THEN
    RAISE EXCEPTION 'Cannot send points to yourself';
  END IF;

  IF _amount IS NULL OR _amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be positive';
  END IF;

  -- Lock both rows to prevent race conditions
  SELECT fused_points
    INTO _sender_balance
  FROM public.profiles
  WHERE user_id = _sender_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Sender profile not found';
  END IF;

  IF _sender_balance < _amount THEN
    RAISE EXCEPTION 'Insufficient points';
  END IF;

  SELECT fused_points
    INTO _receiver_balance
  FROM public.profiles
  WHERE user_id = _receiver_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Receiver profile not found';
  END IF;

  -- Apply balance changes (RETURNING ensures we actually updated a row)
  UPDATE public.profiles
  SET fused_points = fused_points - _amount
  WHERE user_id = _sender_id
  RETURNING fused_points INTO _sender_balance;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Failed to update sender balance';
  END IF;

  UPDATE public.profiles
  SET fused_points = fused_points + _amount
  WHERE user_id = _receiver_id
  RETURNING fused_points INTO _receiver_balance;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Failed to update receiver balance';
  END IF;

  INSERT INTO public.point_transfers (sender_id, receiver_id, amount, message)
  VALUES (_sender_id, _receiver_id, _amount, _message)
  RETURNING id INTO _transfer_id;

  RETURN QUERY SELECT _transfer_id, _sender_balance, _receiver_balance;
END;
$$;

REVOKE ALL ON FUNCTION public.transfer_fused_points(uuid, integer, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.transfer_fused_points(uuid, integer, text) TO authenticated;
