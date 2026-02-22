"use client";

import React from "react";
import BrandOfTheDay from "./BrandOfTheDay";
import StatsBar from "./StatsBar";
import Leaderboard from "./Leaderboard";
import TrendChart from "./TrendChart";
import PromptMatrix from "./PromptMatrix";
import ScoreBreakdown from "./ScoreBreakdown";
import {
    analyzeBrands,
    getBrandOfTheDay,
    getRecurringWinners,
    buildPromptMatrix,
    getDailyTrends,
} from "@/lib/analysis";
import { Radar, Clock, Shield } from "lucide-react";

export default function Dashboard() {
    const brands = analyzeBrands();
    const brandOfTheDay = getBrandOfTheDay();
    const recurringWinners = getRecurringWinners();
    const promptMatrix = buildPromptMatrix();
    const dailyTrends = getDailyTrends();
    const topBrandNames = brands.slice(0, 6).map((b) => b.brand);
    const verticals = [...new Set(brands.map((b) => b.vertical))];

    return (
        <div className="min-h-screen bg-[#06060a]">
            {/* Ambient background effects */}
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
                                AI Recommendation Pattern Tracker · 2026 LLM Landscape
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-white/20">
                        <span className="flex items-center gap-1.5">
                            <Clock className="h-3 w-3" />
                            Last scan: Feb 22, 2026 · 08:00 IST
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
                        totalMentions={brands.reduce((sum, b) => sum + b.frequency, 0)}
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
                                    .filter((b) => b.isEmergingBrand)
                                    .slice(0, 6)
                                    .map((brand) => (
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
                                                    {brand.preferenceScore}
                                                </p>
                                                <p className="text-[10px] text-white/30">
                                                    {brand.llmCoverage.length} LLM
                                                    {brand.llmCoverage.length > 1 ? "s" : ""}
                                                </p>
                                            </div>
                                        </div>
                                    ))}

                                {brands.filter((b) => b.isEmergingBrand).length === 0 && (
                                    <p className="py-8 text-center text-xs text-white/20">
                                        No emerging brands detected in current scan
                                    </p>
                                )}
                            </div>
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
