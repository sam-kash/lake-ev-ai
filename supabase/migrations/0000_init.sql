-- Migration: Initialize Ghost Recon Schema
-- Creates tables for raw agent logs and processed brand rankings

-- 1. Raw Logs Table
CREATE TABLE IF NOT EXISTS public.raw_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vertical TEXT NOT NULL,
    llm TEXT NOT NULL,
    raw_response TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Brand Rankings Table
CREATE TABLE IF NOT EXISTS public.brand_rankings (
    id TEXT PRIMARY KEY, -- e.g. pm-cg-1
    vertical TEXT NOT NULL,
    llm TEXT NOT NULL,
    brand TEXT NOT NULL,
    rank INTEGER NOT NULL,
    cited_reason TEXT NOT NULL,
    date DATE NOT NULL,
    sentiment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) setup (optional but good practice)
ALTER TABLE public.raw_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_rankings ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access to brand_rankings
CREATE POLICY "Allow public read access to brand_rankings" 
    ON public.brand_rankings 
    FOR SELECT 
    USING (true);

-- For raw_logs, it might be for internal API use only, so we can require authenticated role if this was a full prod setup.
-- For now, allow public inserts/reads for the agent.
CREATE POLICY "Allow public read access to raw_logs" 
    ON public.raw_logs 
    FOR SELECT 
    USING (true);

CREATE POLICY "Allow public insert to raw_logs" 
    ON public.raw_logs 
    FOR INSERT 
    WITH CHECK (true);
    
CREATE POLICY "Allow public insert to brand_rankings" 
    ON public.brand_rankings 
    FOR INSERT 
    WITH CHECK (true);
