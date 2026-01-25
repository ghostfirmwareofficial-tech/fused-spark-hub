-- Insert admin role for the dev email (yaroszluke@gmail.com user)
-- First, we need to get the user_id from auth.users and ensure they have admin role
-- This will be done via a trigger that runs on profile creation/update

-- Create a function to ensure the dev email always has admin role
CREATE OR REPLACE FUNCTION public.ensure_dev_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_email text;
BEGIN
  -- Get the email from auth.users
  SELECT email INTO _user_email FROM auth.users WHERE id = NEW.user_id;
  
  -- If this is the dev email, ensure they have admin role
  IF _user_email = 'yaroszluke@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to run on profile insert
DROP TRIGGER IF EXISTS ensure_dev_admin_trigger ON public.profiles;
CREATE TRIGGER ensure_dev_admin_trigger
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_dev_admin();

-- Also ensure existing dev user has admin role
DO $$
DECLARE
  _dev_user_id uuid;
BEGIN
  SELECT id INTO _dev_user_id FROM auth.users WHERE email = 'yaroszluke@gmail.com';
  IF _dev_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (_dev_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;

-- Allow admins to insert/update/delete roles
CREATE POLICY "Admins can manage roles"
  ON public.user_roles
  FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));