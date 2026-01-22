-- Create posts table with media support
CREATE TABLE public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    video_url TEXT,
    likes_count INTEGER NOT NULL DEFAULT 0,
    comments_count INTEGER NOT NULL DEFAULT 0,
    reposts_count INTEGER NOT NULL DEFAULT 0,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view posts" 
ON public.posts 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create posts" 
ON public.posts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" 
ON public.posts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" 
ON public.posts 
FOR DELETE 
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_posts_updated_at
BEFORE UPDATE ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for posts
ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;

-- Create post_media bucket for images and videos
INSERT INTO storage.buckets (id, name, public) VALUES ('post-media', 'post-media', true);

-- Storage policies for post media
CREATE POLICY "Post media is publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'post-media');

CREATE POLICY "Authenticated users can upload post media" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'post-media' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own post media" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'post-media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add discord_username to profiles if not exists (for storing connected Discord info)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS discord_username TEXT;