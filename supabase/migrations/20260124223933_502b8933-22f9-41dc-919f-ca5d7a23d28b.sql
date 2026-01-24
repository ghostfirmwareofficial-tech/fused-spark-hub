-- Create application status enum
CREATE TYPE public.application_status AS ENUM ('pending', 'reviewing', 'accepted', 'rejected');

-- Create applications table
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  ign TEXT NOT NULL,
  discord_username TEXT,
  age INTEGER,
  region TEXT,
  experience TEXT,
  pr_score INTEGER,
  why_join TEXT NOT NULL,
  availability TEXT,
  status application_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  reviewed_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Users can view their own applications
CREATE POLICY "Users can view their own applications"
ON public.applications
FOR SELECT
USING (auth.uid() = user_id);

-- Admins and moderators can view all applications
CREATE POLICY "Admins can view all applications"
ON public.applications
FOR SELECT
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'moderator'));

-- Authenticated users can submit applications
CREATE POLICY "Users can submit applications"
ON public.applications
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins and moderators can update applications
CREATE POLICY "Admins can update applications"
ON public.applications
FOR UPDATE
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'moderator'));

-- Trigger for updated_at
CREATE TRIGGER update_applications_updated_at
BEFORE UPDATE ON public.applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();