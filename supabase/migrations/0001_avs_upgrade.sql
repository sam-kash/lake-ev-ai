-- Migration: AVS Platform Upgrade
-- Adds avs_snapshots, narrative_snapshots, prompt_catalog tables

-- 1. AVS Snapshots — timestamped per brand/vertical/date
CREATE TABLE IF NOT EXISTS public.avs_snapshots (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    brand TEXT NOT NULL,
    vertical TEXT NOT NULL,
    snapshot_date DATE NOT NULL,
    avs NUMERIC(5,2) NOT NULL DEFAULT 0,
    weighted_avs NUMERIC(5,2) NOT NULL DEFAULT 0,
    tsov NUMERIC(5,2) NOT NULL DEFAULT 0,
    avs_chatgpt NUMERIC(5,2) NOT NULL DEFAULT 0,
    avs_gemini NUMERIC(5,2) NOT NULL DEFAULT 0,
    avs_perplexity NUMERIC(5,2) NOT NULL DEFAULT 0,
    frequency INTEGER NOT NULL DEFAULT 0,
    avg_rank NUMERIC(4,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(brand, vertical, snapshot_date)
);

-- 2. Narrative Snapshots — cached Gemini outputs per brand/vertical/date
CREATE TABLE IF NOT EXISTS public.narrative_snapshots (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    brand TEXT NOT NULL,
    vertical TEXT NOT NULL,
    snapshot_date DATE NOT NULL,
    narrative_summary TEXT NOT NULL,
    positioning_category TEXT,
    signature_adjectives TEXT[] DEFAULT '{}',
    authority_strength_score INTEGER DEFAULT 0,
    differentiation_signals TEXT[] DEFAULT '{}',
    narrative_shift TEXT,
    emerging_themes TEXT[],
    lost_themes TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(brand, vertical, snapshot_date)
);

-- 3. Prompt Catalog — intent-classified prompt library
CREATE TABLE IF NOT EXISTS public.prompt_catalog (
    id TEXT PRIMARY KEY,
    vertical TEXT NOT NULL,
    prompt TEXT NOT NULL,
    intent_type TEXT NOT NULL CHECK (intent_type IN ('best','comparison','enterprise','budget','feature-specific')),
    buying_intent_weight NUMERIC(3,2) NOT NULL DEFAULT 0.5,
    difficulty_score INTEGER NOT NULL DEFAULT 50,
    last_queried DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for new tables
ALTER TABLE public.avs_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.narrative_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_catalog ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read avs_snapshots" ON public.avs_snapshots FOR SELECT USING (true);
CREATE POLICY "Allow public insert avs_snapshots" ON public.avs_snapshots FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public upsert avs_snapshots" ON public.avs_snapshots FOR UPDATE USING (true);

CREATE POLICY "Allow public read narrative_snapshots" ON public.narrative_snapshots FOR SELECT USING (true);
CREATE POLICY "Allow public insert narrative_snapshots" ON public.narrative_snapshots FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public upsert narrative_snapshots" ON public.narrative_snapshots FOR UPDATE USING (true);

CREATE POLICY "Allow public read prompt_catalog" ON public.prompt_catalog FOR SELECT USING (true);
CREATE POLICY "Allow public insert prompt_catalog" ON public.prompt_catalog FOR INSERT WITH CHECK (true);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_avs_snapshots_brand_vertical ON public.avs_snapshots(brand, vertical);
CREATE INDEX IF NOT EXISTS idx_avs_snapshots_date ON public.avs_snapshots(snapshot_date DESC);
CREATE INDEX IF NOT EXISTS idx_narrative_snapshots_brand_vertical ON public.narrative_snapshots(brand, vertical);
CREATE INDEX IF NOT EXISTS idx_narrative_snapshots_date ON public.narrative_snapshots(snapshot_date DESC);
