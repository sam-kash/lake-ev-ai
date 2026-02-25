"use client";

import React from "react";
import GlassCard from "./ui/GlassCard";
import AnimatedCounter from "./ui/AnimatedCounter";
import { BrandScore } from "@/lib/types";
import { BarChart3, Target, Cpu } from "lucide-react";

interface ScoreBreakdownProps {
    brands: BrandScore[];
}

export default function ScoreBreakdown({ brands }: ScoreBreakdownProps) {
    const topBrands = brands.slice(0, 5);

    return (
        <GlassCard glow="rose" padding="md" className="col-span-full lg:col-span-1">
            <div className="mb-4 flex items-center gap-2">
                <Cpu className="h-4 w-4 text-rose-400" />
                <h3 className="text-sm font-semibold text-white">AVS Breakdown</h3>
                <span className="text-xs text-white/30">Top 5</span>
            </div>

            <div className="space-y-4">
                {topBrands.map((brand, idx) => {
                    const c = brand.avsComponents;
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
                                <div className="flex items-center gap-2">
                                    <span className={`font-mono text-[10px] ${brand.avsDelta > 0 ? "text-emerald-400" :
                                            brand.avsDelta < 0 ? "text-rose-400" : "text-white/20"
                                        }`}>
                                        {brand.avsDelta > 0 ? "▲" : brand.avsDelta < 0 ? "▼" : ""}
                                        {brand.avsDelta !== 0 ? Math.abs(brand.avsDelta) : ""}
                                    </span>
                                    <AnimatedCounter
                                        value={brand.avs}
                                        className="font-mono text-lg font-bold text-white"
                                    />
                                </div>
                            </div>

                            {/* AVS 4-component stacked bar */}
                            <div className="mb-1 flex gap-0.5 overflow-hidden rounded-full">
                                <div className="h-1.5 rounded-l-full bg-cyan-500 transition-all duration-500" style={{ width: `${c.frequencyScore * 0.4}%` }} title={`Frequency: ${c.frequencyScore}`} />
                                <div className="h-1.5 bg-violet-500 transition-all duration-500" style={{ width: `${c.positionScore * 0.3}%` }} title={`Position: ${c.positionScore}`} />
                                <div className="h-1.5 bg-emerald-500 transition-all duration-500" style={{ width: `${c.sentimentScore * 0.2}%` }} title={`Sentiment: ${c.sentimentScore}`} />
                                <div className="h-1.5 rounded-r-full bg-amber-500 transition-all duration-500" style={{ width: `${c.crossLLMScore * 0.1}%` }} title={`Cross-LLM: ${c.crossLLMScore}`} />
                            </div>
                            <div className="mb-2 flex gap-3 text-[9px] text-white/25">
                                <span className="text-cyan-400/60">Freq {c.frequencyScore}</span>
                                <span className="text-violet-400/60">Pos {c.positionScore}</span>
                                <span className="text-emerald-400/60">Sent {c.sentimentScore}</span>
                                <span className="text-amber-400/60">xLLM {c.crossLLMScore}</span>
                            </div>

                            {/* Per-LLM mini breakdown */}
                            <div className="flex gap-3 text-[9px]">
                                <span className="text-emerald-400/70">GPT {brand.avsBreakdown.chatgpt}</span>
                                <span className="text-violet-400/70">GEM {brand.avsBreakdown.gemini}</span>
                                <span className="text-blue-400/70">PPX {brand.avsBreakdown.perplexity}</span>
                                <span className="ml-auto flex items-center gap-1 text-white/30">
                                    <BarChart3 className="h-3 w-3" />{brand.frequency}
                                </span>
                                <span className="flex items-center gap-1 text-white/30">
                                    <Target className="h-3 w-3" />#{brand.avgRank}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="mt-3 flex items-center justify-center gap-3 border-t border-white/[0.06] pt-3">
                <span className="flex items-center gap-1.5 text-[9px] text-white/25">
                    <span className="h-2 w-2 rounded-full bg-cyan-500" /> Frequency ×0.4
                </span>
                <span className="flex items-center gap-1.5 text-[9px] text-white/25">
                    <span className="h-2 w-2 rounded-full bg-violet-500" /> Position ×0.3
                </span>
                <span className="flex items-center gap-1.5 text-[9px] text-white/25">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" /> Sentiment ×0.2
                </span>
                <span className="flex items-center gap-1.5 text-[9px] text-white/25">
                    <span className="h-2 w-2 rounded-full bg-amber-500" /> xLLM ×0.1
                </span>
            </div>
        </GlassCard>
    );
}
