-- Create a security definer function to assign admin role
-- This bypasses RLS and can only be called by authenticated users
CREATE OR REPLACE FUNCTION public.assign_admin_role_if_eligible()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id uuid;
  _is_admin_signup boolean;
BEGIN
  _user_id := auth.uid();
  
  -- Check if user metadata indicates admin signup
  SELECT (raw_user_meta_data->>'is_admin_signup')::boolean INTO _is_admin_signup
  FROM auth.users WHERE id = _user_id;
  
  IF _is_admin_signup = true THEN
    -- Insert admin role if not exists
    INSERT INTO public.user_roles (user_id, role)
    VALUES (_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    -- Clear the flag from metadata
    UPDATE auth.users 
    SET raw_user_meta_data = raw_user_meta_data - 'is_admin_signup'
    WHERE id = _user_id;
    
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;