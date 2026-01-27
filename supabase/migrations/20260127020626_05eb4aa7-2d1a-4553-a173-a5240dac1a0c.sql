-- Add column to track when user last received post points
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_post_points_date date;

-- Create point transfers table
CREATE TABLE public.point_transfers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL,
  receiver_id UUID NOT NULL,
  amount INTEGER NOT NULL CHECK (amount > 0),
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.point_transfers ENABLE ROW LEVEL SECURITY;

-- Users can view transfers they sent or received
CREATE POLICY "Users can view their transfers"
  ON public.point_transfers FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Users can create transfers (from themselves)
CREATE POLICY "Users can send points"
  ON public.point_transfers FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Enable realtime for transfers
ALTER PUBLICATION supabase_realtime ADD TABLE public.point_transfers;