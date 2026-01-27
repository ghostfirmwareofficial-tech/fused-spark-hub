-- Create tournament status enum
CREATE TYPE public.tournament_status AS ENUM ('draft', 'registration', 'active', 'completed', 'cancelled');

-- Create tournaments table
CREATE TABLE public.tournaments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    entry_fee INTEGER NOT NULL DEFAULT 250,
    base_prize_pool DECIMAL(10,2) NOT NULL DEFAULT 25.00,
    current_prize_pool DECIMAL(10,2) NOT NULL DEFAULT 25.00,
    status tournament_status NOT NULL DEFAULT 'draft',
    starts_at TIMESTAMP WITH TIME ZONE,
    ends_at TIMESTAMP WITH TIME ZONE,
    max_participants INTEGER DEFAULT 100,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tournament entries table
CREATE TABLE public.tournament_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    epic_games_id TEXT NOT NULL,
    entry_paid BOOLEAN NOT NULL DEFAULT false,
    initial_wins INTEGER DEFAULT 0,
    initial_kills INTEGER DEFAULT 0,
    current_wins INTEGER DEFAULT 0,
    current_kills INTEGER DEFAULT 0,
    total_score INTEGER GENERATED ALWAYS AS ((current_wins - initial_wins) * 100 + (current_kills - initial_kills) * 10) STORED,
    placement INTEGER,
    prize_amount DECIMAL(10,2),
    payout_status TEXT DEFAULT 'pending',
    payout_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(tournament_id, user_id)
);

-- Create prize tier configuration table
CREATE TABLE public.prize_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    min_participants INTEGER NOT NULL,
    max_participants INTEGER,
    prize_pool DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default prize tiers
INSERT INTO public.prize_tiers (min_participants, max_participants, prize_pool) VALUES
(1, 9, 25.00),
(10, 19, 50.00),
(20, 29, 100.00),
(30, 49, 150.00),
(50, NULL, 200.00);

-- Enable RLS
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prize_tiers ENABLE ROW LEVEL SECURITY;

-- Tournaments policies
CREATE POLICY "Anyone can view tournaments" ON public.tournaments
FOR SELECT USING (true);

CREATE POLICY "Admins can create tournaments" ON public.tournaments
FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update tournaments" ON public.tournaments
FOR UPDATE USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete tournaments" ON public.tournaments
FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Tournament entries policies
CREATE POLICY "Anyone can view entries" ON public.tournament_entries
FOR SELECT USING (true);

CREATE POLICY "Users can enter tournaments" ON public.tournament_entries
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their entries" ON public.tournament_entries
FOR UPDATE USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete entries" ON public.tournament_entries
FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Prize tiers policies
CREATE POLICY "Anyone can view prize tiers" ON public.prize_tiers
FOR SELECT USING (true);

CREATE POLICY "Admins can manage prize tiers" ON public.prize_tiers
FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Add realtime for tournament entries
ALTER PUBLICATION supabase_realtime ADD TABLE public.tournament_entries;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tournaments;

-- Create trigger for updated_at
CREATE TRIGGER update_tournaments_updated_at
BEFORE UPDATE ON public.tournaments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tournament_entries_updated_at
BEFORE UPDATE ON public.tournament_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to calculate prize pool based on participants
CREATE OR REPLACE FUNCTION public.update_tournament_prize_pool()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    participant_count INTEGER;
    new_prize DECIMAL(10,2);
BEGIN
    -- Count participants for this tournament
    SELECT COUNT(*) INTO participant_count
    FROM tournament_entries
    WHERE tournament_id = COALESCE(NEW.tournament_id, OLD.tournament_id)
    AND entry_paid = true;
    
    -- Get prize pool from tiers
    SELECT prize_pool INTO new_prize
    FROM prize_tiers
    WHERE participant_count >= min_participants
    AND (max_participants IS NULL OR participant_count <= max_participants)
    LIMIT 1;
    
    -- Update tournament prize pool
    UPDATE tournaments
    SET current_prize_pool = COALESCE(new_prize, base_prize_pool)
    WHERE id = COALESCE(NEW.tournament_id, OLD.tournament_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- Trigger to update prize pool when entries change
CREATE TRIGGER update_prize_pool_on_entry
AFTER INSERT OR UPDATE OR DELETE ON public.tournament_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_tournament_prize_pool();