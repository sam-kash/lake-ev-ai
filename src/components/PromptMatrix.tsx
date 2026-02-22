"use client";

import React from "react";
import GlassCard from "./ui/GlassCard";
import { LLMSource, Vertical } from "@/lib/types";
import { Grid3X3, MessageSquare } from "lucide-react";
import { clsx } from "clsx";

interface PromptMatrixProps {
    matrix: Record<
        string,
        Record<LLMSource, { brand: string; rank: number } | null>
    >;
}

const llmHeaders: { key: LLMSource; label: string; color: string }[] = [
    { key: "ChatGPT", label: "ChatGPT", color: "text-emerald-400" },
    { key: "Perplexity", label: "Perplexity", color: "text-blue-400" },
    { key: "Gemini", label: "Gemini", color: "text-violet-400" },
];

const verticalIcons: Record<Vertical, string> = {
    "Project Management": "📋",
    CRM: "🤝",
    "Cloud Storage": "☁️",
    "AI Writing": "✍️",
    "Design Tools": "🎨",
};

export default function PromptMatrix({ matrix }: PromptMatrixProps) {
    const verticals = Object.keys(matrix) as Vertical[];

    // Check if a brand is #1 across all 3 LLMs
    const isUnanimous = (vertical: Vertical): boolean => {
        const brands = llmHeaders
            .map((h) => matrix[vertical]?.[h.key]?.brand)
            .filter(Boolean);
        return brands.length === 3 && new Set(brands).size === 1;
    };

    return (
        <GlassCard glow="amber" padding="md" className="col-span-full lg:col-span-1">
            <div className="mb-4 flex items-center gap-2">
                <Grid3X3 className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-white">
                    Prompt Matrix
                </h3>
                <span className="text-xs text-white/30">#1 Picks by LLM</span>
            </div>

            <div className="space-y-3">
                {/* Header */}
                <div className="grid grid-cols-4 gap-2 px-2">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-white/20">
                        Vertical
                    </div>
                    {llmHeaders.map((h) => (
                        <div
                            key={h.key}
                            className={clsx(
                                "text-center text-[10px] font-semibold uppercase tracking-wider",
                                h.color
                            )}
                        >
                            {h.label}
                        </div>
                    ))}
                </div>

                {/* Rows */}
                {verticals.map((vertical) => (
                    <div
                        key={vertical}
                        className={clsx(
                            "group grid grid-cols-4 gap-2 rounded-xl px-2 py-2.5 transition-all",
                            isUnanimous(vertical)
                                ? "bg-amber-500/[0.06] border border-amber-500/10"
                                : "hover:bg-white/[0.03]"
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-sm">{verticalIcons[vertical]}</span>
                            <span className="text-xs font-medium text-white/60 truncate">
                                {vertical}
                            </span>
                            {isUnanimous(vertical) && (
                                <span className="text-[9px] text-amber-400 font-semibold">
                                    👑
                                </span>
                            )}
                        </div>
                        {llmHeaders.map((h) => {
                            const cell = matrix[vertical]?.[h.key];
                            return (
                                <div
                                    key={h.key}
                                    className="flex items-center justify-center"
                                >
                                    {cell ? (
                                        <span className="rounded-lg bg-white/[0.06] px-2 py-1 text-[11px] font-medium text-white/70 group-hover:text-white/90 transition-colors truncate max-w-full">
                                            {cell.brand}
                                        </span>
                                    ) : (
                                        <span className="text-[10px] text-white/15">—</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-lg bg-white/[0.03] px-3 py-2">
                <MessageSquare className="h-3 w-3 text-white/20" />
                <p className="text-[10px] text-white/30">
                    👑 indicates unanimous #1 pick across all LLMs
                </p>
            </div>
        </GlassCard>
    );
}
