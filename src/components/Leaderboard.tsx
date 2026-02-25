"use client";

import React, { useState } from "react";
import GlassCard from "./ui/GlassCard";
import { BrandScore, LLMSource, Vertical } from "@/lib/types";
import {
    ChevronUp,
    ChevronDown,
    Trophy,
    Zap,
    Sparkles,
    Filter,
} from "lucide-react";
import { clsx } from "clsx";

interface LeaderboardProps {
    brands: BrandScore[];
}

const verticalColors: Record<Vertical, string> = {
    "Project Management": "text-cyan-400 bg-cyan-400/10",
    CRM: "text-violet-400 bg-violet-400/10",
    "Cloud Storage": "text-emerald-400 bg-emerald-400/10",
    "AI Writing": "text-amber-400 bg-amber-400/10",
    "Design Tools": "text-rose-400 bg-rose-400/10",
};

const llmColors: Record<LLMSource, string> = {
    ChatGPT: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    Perplexity: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    Gemini: "bg-violet-500/20 text-violet-400 border-violet-500/30",
};

type SortKey = "avs" | "frequency" | "avgRank" | "brand" | "tsov";

export default function Leaderboard({ brands }: LeaderboardProps) {
    const [sortKey, setSortKey] = useState<SortKey>("avs");
    const [sortAsc, setSortAsc] = useState(false);
    const [filterVertical, setFilterVertical] = useState<Vertical | "All">("All");

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortAsc(!sortAsc);
        } else {
            setSortKey(key);
            setSortAsc(false);
        }
    };

    const filteredBrands = brands
        .filter((b) => filterVertical === "All" || b.vertical === filterVertical)
        .sort((a, b) => {
            const multiplier = sortAsc ? 1 : -1;
            if (sortKey === "brand") {
                return multiplier * a.brand.localeCompare(b.brand);
            }
            return multiplier * ((a[sortKey] as number) - (b[sortKey] as number));
        });

    const verticals: (Vertical | "All")[] = [
        "All",
        "Project Management",
        "CRM",
        "Cloud Storage",
        "AI Writing",
        "Design Tools",
    ];

    const SortIcon = ({ column }: { column: SortKey }) => {
        if (sortKey !== column)
            return <ChevronDown className="h-3 w-3 text-white/20" />;
        return sortAsc ? (
            <ChevronUp className="h-3 w-3 text-cyan-400" />
        ) : (
            <ChevronDown className="h-3 w-3 text-cyan-400" />
        );
    };

    return (
        <GlassCard glow="violet" padding="sm" className="col-span-full lg:col-span-2">
            <div className="mb-4 flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-amber-400" />
                    <h3 className="text-sm font-semibold text-white">
                        AI Visibility Leaderboard
                    </h3>
                </div>
                <div className="flex items-center gap-1">
                    <Filter className="mr-1 h-3 w-3 text-white/40" />
                    {verticals.map((v) => (
                        <button
                            key={v}
                            onClick={() => setFilterVertical(v)}
                            className={clsx(
                                "rounded-md px-2 py-1 text-[10px] font-medium transition-all duration-200",
                                filterVertical === v
                                    ? "bg-white/10 text-white"
                                    : "text-white/30 hover:text-white/60"
                            )}
                        >
                            {v === "All" ? "All" : v.split(" ")[0]}
                        </button>
                    ))}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/[0.06] text-left">
                            <th className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-white/30">
                                #
                            </th>
                            <th
                                className="cursor-pointer px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-white/30 hover:text-white/50"
                                onClick={() => handleSort("brand")}
                            >
                                <span className="flex items-center gap-1">
                                    Brand <SortIcon column="brand" />
                                </span>
                            </th>
                            <th className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-white/30">
                                Vertical
                            </th>
                            <th
                                className="cursor-pointer px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-white/30 hover:text-white/50"
                                onClick={() => handleSort("avs")}
                            >
                                <span className="flex items-center gap-1">
                                    AVS <SortIcon column="avs" />
                                </span>
                            </th>
                            <th className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-white/30">
                                Δ
                            </th>
                            <th
                                className="cursor-pointer px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-white/30 hover:text-white/50"
                                onClick={() => handleSort("tsov")}
                            >
                                <span className="flex items-center gap-1">
                                    TSOV% <SortIcon column="tsov" />
                                </span>
                            </th>
                            <th
                                className="cursor-pointer px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-white/30 hover:text-white/50"
                                onClick={() => handleSort("frequency")}
                            >
                                <span className="flex items-center gap-1">
                                    Mentions <SortIcon column="frequency" />
                                </span>
                            </th>
                            <th
                                className="cursor-pointer px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-white/30 hover:text-white/50"
                                onClick={() => handleSort("avgRank")}
                            >
                                <span className="flex items-center gap-1">
                                    Avg Rank <SortIcon column="avgRank" />
                                </span>
                            </th>
                            <th className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-white/30">
                                LLM Coverage
                            </th>
                            <th className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-white/30">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBrands.map((brand, idx) => (
                            <tr
                                key={brand.brand}
                                className="group border-b border-white/[0.03] transition-colors hover:bg-white/[0.03]"
                                style={{
                                    animationDelay: `${idx * 50}ms`,
                                }}
                            >
                                <td className="px-3 py-3 font-mono text-xs text-white/30">
                                    {idx + 1}
                                </td>
                                <td className="px-3 py-3">
                                    <span className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                                        {brand.brand}
                                    </span>
                                </td>
                                <td className="px-3 py-3">
                                    <span
                                        className={clsx(
                                            "rounded-full px-2 py-0.5 text-[10px] font-medium",
                                            verticalColors[brand.vertical]
                                        )}
                                    >
                                        {brand.vertical}
                                    </span>
                                </td>
                                <td className="px-3 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/[0.06]">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 transition-all duration-700"
                                                style={{ width: `${brand.avs}%` }}
                                            />
                                        </div>
                                        <span className="font-mono text-xs font-semibold text-white">
                                            {brand.avs}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-3 py-3">
                                    <span className={`font-mono text-xs font-semibold ${brand.avsDelta > 0 ? "text-emerald-400" :
                                            brand.avsDelta < 0 ? "text-rose-400" : "text-white/20"
                                        }`}>
                                        {brand.avsDelta > 0 ? "▲" : brand.avsDelta < 0 ? "▼" : "—"}
                                        {brand.avsDelta !== 0 ? Math.abs(brand.avsDelta) : ""}
                                    </span>
                                </td>
                                <td className="px-3 py-3 font-mono text-xs text-white/60">
                                    {brand.tsov}%
                                </td>
                                <td className="px-3 py-3 font-mono text-xs text-white/60">
                                    {brand.frequency}
                                </td>
                                <td className="px-3 py-3 font-mono text-xs text-white/60">
                                    #{brand.avgRank}
                                </td>
                                <td className="px-3 py-3">
                                    <div className="flex gap-1">
                                        {brand.llmCoverage.map((llm) => (
                                            <span
                                                key={llm}
                                                className={clsx(
                                                    "rounded-md border px-1.5 py-0.5 text-[9px] font-medium",
                                                    llmColors[llm]
                                                )}
                                            >
                                                {llm === "ChatGPT"
                                                    ? "GPT"
                                                    : llm === "Perplexity"
                                                        ? "PPX"
                                                        : "GEM"}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-3 py-3">
                                    {brand.isRecurringWinner ? (
                                        <span className="flex items-center gap-1 text-[10px] font-medium text-amber-400">
                                            <Zap className="h-3 w-3" /> Winner
                                        </span>
                                    ) : brand.isEmergingBrand ? (
                                        <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-400">
                                            <Sparkles className="h-3 w-3" /> Emerging
                                        </span>
                                    ) : (
                                        <span className="text-[10px] text-white/20">—</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </GlassCard>
    );
}
