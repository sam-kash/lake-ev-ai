"use client";

import React from "react";
import GlassCard from "./ui/GlassCard";
import AnimatedCounter from "./ui/AnimatedCounter";
import { BrandScore } from "@/lib/types";
import { Crown, TrendingUp, Sparkles, Quote } from "lucide-react";

interface BrandOfTheDayProps {
    brand: BrandScore;
}

export default function BrandOfTheDay({ brand }: BrandOfTheDayProps) {
    return (
        <GlassCard glow="cyan" padding="lg" className="relative overflow-hidden col-span-full">
            {/* Background decoration */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-cyan-500/[0.07] blur-3xl" />
            <div className="pointer-events-none absolute -left-10 bottom-0 h-60 w-60 rounded-full bg-violet-500/[0.05] blur-3xl" />

            <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                {/* Left side: Brand info */}
                <div className="flex-1">
                    <div className="mb-3 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20">
                            <Crown className="h-4 w-4 text-cyan-400" />
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                            Brand of the Day
                        </span>
                    </div>

                    <h2 className="mb-2 text-4xl font-bold tracking-tight text-white md:text-5xl">
                        {brand.brand}
                    </h2>

                    <div className="mb-4 flex items-center gap-3">
                        <span className="rounded-full bg-white/[0.08] px-3 py-1 text-xs font-medium text-white/60">
                            {brand.vertical}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-emerald-400">
                            <TrendingUp className="h-3 w-3" />
                            Trending Up
                        </span>
                    </div>

                    <div className="flex items-start gap-2 rounded-xl bg-white/[0.04] p-4">
                        <Quote className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400/60" />
                        <p className="text-sm leading-relaxed text-white/50">
                            {brand.topCitedReason}
                        </p>
                    </div>
                </div>

                {/* Right side: Score */}
                <div className="flex flex-col items-center gap-3">
                    <div className="relative flex h-36 w-36 items-center justify-center md:h-44 md:w-44">
                        {/* Outer ring */}
                        <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 120 120">
                            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                            <circle
                                cx="60" cy="60" r="52" fill="none"
                                stroke="url(#scoreGradient)"
                                strokeWidth="6"
                                strokeLinecap="round"
                                strokeDasharray={`${(brand.preferenceScore / 100) * 327} 327`}
                                className="transition-all duration-1000"
                            />
                            <defs>
                                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#06b6d4" />
                                    <stop offset="100%" stopColor="#8b5cf6" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="text-center">
                            <AnimatedCounter
                                value={brand.preferenceScore}
                                className="font-mono text-4xl font-bold text-white md:text-5xl"
                            />
                            <p className="mt-1 text-xs text-white/40">Preference Score</p>
                        </div>
                    </div>

                    {/* LLM Coverage badges */}
                    <div className="flex items-center gap-2">
                        {brand.llmCoverage.map((llm) => (
                            <div
                                key={llm}
                                className="flex items-center gap-1 rounded-full bg-white/[0.08] px-2.5 py-1"
                            >
                                <Sparkles className="h-3 w-3 text-violet-400" />
                                <span className="text-[10px] font-medium text-white/60">
                                    {llm}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </GlassCard>
    );
}
