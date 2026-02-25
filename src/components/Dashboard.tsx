"use client";

import React from "react";
import useSWR from "swr";
import BrandOfTheDay from "./BrandOfTheDay";
import StatsBar from "./StatsBar";
import Leaderboard from "./Leaderboard";
import TrendChart from "./TrendChart";
import PromptMatrix from "./PromptMatrix";
import ScoreBreakdown from "./ScoreBreakdown";
import GapIntelligence from "./GapIntelligence";
import NarrativeCard from "./NarrativeCard";
import AuditDownload from "./AuditDownload";
import {
    analyzeBrands,
    getBrandOfTheDay,
    getRecurringWinners,
    buildPromptMatrix,
} from "@/lib/analysis";
import { Radar, Clock, Shield } from "lucide-react";
import { BrandScore } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Dashboard() {
    const { data, error, isLoading } = useSWR("/api/brands", fetcher, {
        refreshInterval: 300000, // 5 minutes
    });

    if (error) return <div className="p-8 text-center text-red-500">Failed to load brand intelligence data.</div>;
    if (isLoading || !data) return (
        <div className="flex min-h-screen items-center justify-center bg-[#06060a]">
            <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
        </div>
    );

    const { mentions = [], brandScores: apiBrandScores = [], dailySnapshots = [] } = data;

    // Handle case where DB is completely empty
    if (mentions.length === 0 && apiBrandScores.length === 0) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#06060a] p-8 text-center">
                <Radar className="mb-4 h-16 w-16 text-cyan-500 animate-pulse" />
                <h2 className="text-2xl font-bold text-white mb-2">No Intel Found</h2>
                <p className="text-slate-400">The Antigravity Browser Agent has not populated the database yet.</p>
            </div>
        );
    }

    // Use API brand scores if available (includes AVS, TSOV, etc.) otherwise compute locally
    const brands = apiBrandScores.length > 0
        ? apiBrandScores
        : analyzeBrands(mentions, dailySnapshots);
    const brandOfTheDay = brands[0] || getBrandOfTheDay(mentions, dailySnapshots);
    const recurringWinners = getRecurringWinners(mentions, dailySnapshots);
    const promptMatrix = buildPromptMatrix(mentions);
    const dailyTrends = dailySnapshots;
    const topBrandNames = brands.slice(0, 6).map((b: BrandScore) => b.brand);
    const verticals = [...new Set(brands.map((b: BrandScore) => b.vertical))];

    return (
        <div className="min-h-screen bg-[#06060a]">
            {/* Hero Brand Background Effects */}
            {brandOfTheDay && (
                <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden mix-blend-screen opacity-30">
                    <div className="absolute inset-0 bg-[url('/hero-bg.webp')] bg-cover bg-center brightness-150 contrast-125 saturate-200 transition-all duration-1000 ease-in-out"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#06060a]/50 to-[#06060a]"></div>
                </div>
            )}

            <div className="pointer-events-none fixed inset-0 z-0">
                <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-cyan-500/[0.03] blur-[120px]" />
                <div className="absolute right-1/4 top-1/3 h-[400px] w-[400px] rounded-full bg-violet-500/[0.03] blur-[120px]" />
                <div className="absolute bottom-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-emerald-500/[0.02] blur-[120px]" />
            </div>

            {/* Grid pattern */}
            <div
                className="pointer-events-none fixed inset-0 z-0 opacity-[0.015]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />

            <div className="relative z-10 mx-auto max-w-[1400px] px-4 py-8 md:px-6 lg:px-8">
                {/* Header */}
                <header className="mb-8">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="relative flex h-10 w-10 items-center justify-center">
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 opacity-20 blur-md" />
                            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]">
                                <Radar className="h-5 w-5 text-cyan-400" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-white md:text-2xl">
                                Ghost Recon{" "}
                                <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                                    Intelligence
                                </span>
                            </h1>
                            <p className="text-xs text-white/30">
                                AI Recommendation Intelligence Platform · 2026
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-white/20">
                        <span className="flex items-center gap-1.5">
                            <Clock className="h-3 w-3" />
                            Last scan: {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Shield className="h-3 w-3" />
                            Sources: ChatGPT · Perplexity · Gemini
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                            </span>
                            Monitoring Active
                        </span>
                    </div>
                </header>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {/* Stats Bar */}
                    <StatsBar
                        totalBrands={brands.length}
                        totalMentions={brands.reduce((sum: number, b: BrandScore) => sum + b.frequency, 0)}
                        verticals={verticals.length}
                        recurringWinners={recurringWinners.length}
                    />

                    {/* Brand of the Day */}
                    <BrandOfTheDay brand={brandOfTheDay} />

                    {/* Trend Chart */}
                    <TrendChart dailyTrends={dailyTrends} topBrands={topBrandNames} />

                    {/* Leaderboard + Prompt Matrix */}
                    <Leaderboard brands={brands} />
                    <PromptMatrix matrix={promptMatrix} />

                    {/* Score Breakdown */}
                    <div className="col-span-full grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <ScoreBreakdown brands={brands} />

                        {/* Emerging Brands Section */}
                        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-xl">
                            <div className="mb-4 flex items-center gap-2">
                                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/20">
                                    <span className="text-xs">🌱</span>
                                </div>
                                <h3 className="text-sm font-semibold text-white">
                                    Emerging Brands
                                </h3>
                                <span className="text-xs text-white/30">
                                    Low coverage, high sentiment
                                </span>
                            </div>

                            <div className="space-y-3">
                                {brands
                                    .filter((b: BrandScore) => b.isEmergingBrand)
                                    .slice(0, 6)
                                    .map((brand: BrandScore) => (
                                        <div
                                            key={brand.brand}
                                            className="group flex items-center justify-between rounded-xl p-3 transition-all hover:bg-white/[0.04]"
                                        >
                                            <div>
                                                <p className="text-sm font-medium text-white group-hover:text-emerald-300 transition-colors">
                                                    {brand.brand}
                                                </p>
                                                <p className="text-[10px] text-white/30 truncate max-w-[200px]">
                                                    {brand.topCitedReason}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-mono text-sm font-semibold text-emerald-400">
                                                    AVS {brand.avs}
                                                </p>
                                                <p className="text-[10px] text-white/30">
                                                    TSOV {brand.tsov}%
                                                </p>
                                            </div>
                                        </div>
                                    ))}

                                {brands.filter((b: BrandScore) => b.isEmergingBrand).length === 0 && (
                                    <p className="py-8 text-center text-xs text-white/20">
                                        No emerging brands detected in current scan
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Gap Intelligence + Narrative + Audit */}
                    <div className="col-span-full grid grid-cols-1 gap-4 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <GapIntelligence />
                        </div>
                        <div className="flex flex-col gap-4">
                            <AuditDownload />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-12 border-t border-white/[0.06] pt-6 text-center">
                    <p className="text-xs text-white/15">
                        Project Ghost Recon · Sovereign Market Analyst · {new Date().getFullYear()}
                    </p>
                </footer>
            </div>
        </div>
    );
}
