"use client";

import React from "react";
import GlassCard from "./ui/GlassCard";
import AnimatedCounter from "./ui/AnimatedCounter";
import { BrandScore } from "@/lib/types";
import { PieChart, BarChart3, Target } from "lucide-react";

interface ScoreBreakdownProps {
    brands: BrandScore[];
}

export default function ScoreBreakdown({ brands }: ScoreBreakdownProps) {
    const topBrands = brands.slice(0, 5);

    return (
        <GlassCard glow="rose" padding="md" className="col-span-full lg:col-span-1">
            <div className="mb-4 flex items-center gap-2">
                <PieChart className="h-4 w-4 text-rose-400" />
                <h3 className="text-sm font-semibold text-white">Score Breakdown</h3>
                <span className="text-xs text-white/30">Top 5</span>
            </div>

            <div className="space-y-4">
                {topBrands.map((brand, idx) => {
                    const total =
                        brand.sentimentBreakdown.positive +
                        brand.sentimentBreakdown.neutral +
                        brand.sentimentBreakdown.negative;
                    const posPercent = Math.round(
                        (brand.sentimentBreakdown.positive / total) * 100
                    );
                    const neuPercent = Math.round(
                        (brand.sentimentBreakdown.neutral / total) * 100
                    );

                    return (
                        <div
                            key={brand.brand}
                            className="group rounded-xl p-3 transition-all hover:bg-white/[0.03]"
                        >
                            <div className="mb-2 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-violet-500/20 font-mono text-[10px] font-bold text-white/60">
                                        {idx + 1}
                                    </span>
                                    <span className="text-sm font-semibold text-white">
                                        {brand.brand}
                                    </span>
                                </div>
                                <AnimatedCounter
                                    value={brand.preferenceScore}
                                    className="font-mono text-lg font-bold text-white"
                                />
                            </div>

                            {/* Score components bar */}
                            <div className="mb-2 flex gap-0.5 overflow-hidden rounded-full">
                                <div
                                    className="h-1.5 rounded-l-full bg-emerald-500 transition-all duration-500"
                                    style={{ width: `${posPercent}%` }}
                                    title={`Positive: ${posPercent}%`}
                                />
                                <div
                                    className="h-1.5 bg-amber-500 transition-all duration-500"
                                    style={{ width: `${neuPercent}%` }}
                                    title={`Neutral: ${neuPercent}%`}
                                />
                                <div
                                    className="h-1.5 rounded-r-full bg-rose-500 transition-all duration-500"
                                    style={{ width: `${100 - posPercent - neuPercent}%` }}
                                    title={`Negative: ${100 - posPercent - neuPercent}%`}
                                />
                            </div>

                            {/* Metrics */}
                            <div className="flex items-center gap-4 text-[10px]">
                                <span className="flex items-center gap-1 text-white/30">
                                    <BarChart3 className="h-3 w-3" />
                                    Mentions: {brand.frequency}
                                </span>
                                <span className="flex items-center gap-1 text-white/30">
                                    <Target className="h-3 w-3" />
                                    Avg Rank: {brand.avgRank}
                                </span>
                                <span className="text-emerald-400/60">
                                    ↑ {posPercent}% positive
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="mt-3 flex items-center justify-center gap-4 border-t border-white/[0.06] pt-3">
                <span className="flex items-center gap-1.5 text-[10px] text-white/30">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" /> Positive
                </span>
                <span className="flex items-center gap-1.5 text-[10px] text-white/30">
                    <span className="h-2 w-2 rounded-full bg-amber-500" /> Neutral
                </span>
                <span className="flex items-center gap-1.5 text-[10px] text-white/30">
                    <span className="h-2 w-2 rounded-full bg-rose-500" /> Negative
                </span>
            </div>
        </GlassCard>
    );
}
