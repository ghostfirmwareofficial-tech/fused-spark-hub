-- =============================================
-- SOCIAL SYSTEM: Follows & Friend Requests
-- =============================================

-- User follows (one-way)
CREATE TABLE public.user_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Friend requests (mutual)
CREATE TYPE public.friend_request_status AS ENUM ('pending', 'accepted', 'rejected');

CREATE TABLE public.friend_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status friend_request_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(sender_id, receiver_id),
  CHECK (sender_id != receiver_id)
);

-- Friendships (accepted friend requests)
CREATE TABLE public.friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, friend_id),
  CHECK (user_id != friend_id)
);

-- =============================================
-- MODERATION SYSTEM: Bans, Timeouts, Restrictions
-- =============================================

CREATE TYPE public.moderation_action_type AS ENUM ('ban', 'timeout', 'restrict', 'kick', 'warn');

CREATE TABLE public.user_moderation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type moderation_action_type NOT NULL,
  reason TEXT,
  moderator_id UUID NOT NULL REFERENCES auth.users(id),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add counters to profiles for social features
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS followers_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS following_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS friends_count INTEGER NOT NULL DEFAULT 0;

-- =============================================
-- RLS POLICIES
-- =============================================

-- User follows
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view follows"
ON public.user_follows FOR SELECT USING (true);

CREATE POLICY "Users can follow others"
ON public.user_follows FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow"
ON public.user_follows FOR DELETE USING (auth.uid() = follower_id);

-- Friend requests
ALTER TABLE public.friend_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their friend requests"
ON public.friend_requests FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send friend requests"
ON public.friend_requests FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update received requests"
ON public.friend_requests FOR UPDATE USING (auth.uid() = receiver_id);

CREATE POLICY "Users can delete their sent requests"
ON public.friend_requests FOR DELETE USING (auth.uid() = sender_id);

-- Friendships
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view friendships"
ON public.friendships FOR SELECT USING (true);

CREATE POLICY "System manages friendships"
ON public.friendships FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove friends"
ON public.friendships FOR DELETE USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- User moderation (admin only)
ALTER TABLE public.user_moderation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all moderation"
ON public.user_moderation FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create moderation actions"
ON public.user_moderation FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update moderation"
ON public.user_moderation FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Function to update follow counts
CREATE OR REPLACE FUNCTION public.update_follow_counts()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profiles SET following_count = following_count + 1 WHERE user_id = NEW.follower_id;
    UPDATE profiles SET followers_count = followers_count + 1 WHERE user_id = NEW.following_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE profiles SET following_count = following_count - 1 WHERE user_id = OLD.follower_id;
    UPDATE profiles SET followers_count = followers_count - 1 WHERE user_id = OLD.following_id;
    RETURN OLD;
  END IF;
END;
$$;

CREATE TRIGGER on_follow_change
AFTER INSERT OR DELETE ON public.user_follows
FOR EACH ROW EXECUTE FUNCTION public.update_follow_counts();

-- Function to handle accepted friend requests
CREATE OR REPLACE FUNCTION public.handle_friend_request_acceptance()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
    -- Create bidirectional friendship
    INSERT INTO friendships (user_id, friend_id) VALUES (NEW.sender_id, NEW.receiver_id) ON CONFLICT DO NOTHING;
    INSERT INTO friendships (user_id, friend_id) VALUES (NEW.receiver_id, NEW.sender_id) ON CONFLICT DO NOTHING;
    -- Update friend counts
    UPDATE profiles SET friends_count = friends_count + 1 WHERE user_id IN (NEW.sender_id, NEW.receiver_id);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_friend_request_update
AFTER UPDATE ON public.friend_requests
FOR EACH ROW EXECUTE FUNCTION public.handle_friend_request_acceptance();

-- Function to check if user is moderated
CREATE OR REPLACE FUNCTION public.is_user_moderated(_user_id UUID, _action_type moderation_action_type)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_moderation
    WHERE user_id = _user_id
      AND action_type = _action_type
      AND is_active = true
      AND (expires_at IS NULL OR expires_at > now())
  )
$$;

-- Enable realtime for social tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_follows;
ALTER PUBLICATION supabase_realtime ADD TABLE public.friend_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_moderation;