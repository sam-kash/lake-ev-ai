"use client";

import React from "react";
import GlassCard from "./ui/GlassCard";
import AnimatedCounter from "./ui/AnimatedCounter";
import { BrandScore } from "@/lib/types";
import { Activity, Layers, Hash, Radio } from "lucide-react";

interface StatsBarProps {
    totalBrands: number;
    totalMentions: number;
    verticals: number;
    recurringWinners: number;
}

export default function StatsBar({
    totalBrands,
    totalMentions,
    verticals,
    recurringWinners,
}: StatsBarProps) {
    const stats = [
        {
            label: "Tracked Brands",
            value: totalBrands,
            icon: Layers,
            color: "text-cyan-400",
            bg: "bg-cyan-500/10",
        },
        {
            label: "Total Mentions",
            value: totalMentions,
            icon: Hash,
            color: "text-violet-400",
            bg: "bg-violet-500/10",
        },
        {
            label: "Verticals",
            value: verticals,
            icon: Activity,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
        },
        {
            label: "Recurring Winners",
            value: recurringWinners,
            icon: Radio,
            color: "text-amber-400",
            bg: "bg-amber-500/10",
        },
    ];

    return (
        <div className="col-span-full grid grid-cols-2 gap-3 lg:grid-cols-4">
            {stats.map((stat) => (
                <GlassCard key={stat.label} padding="sm" hover>
                    <div className="flex items-center gap-3">
                        <div
                            className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}
                        >
                            <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        </div>
                        <div>
                            <AnimatedCounter
                                value={stat.value}
                                className="font-mono text-2xl font-bold text-white"
                            />
                            <p className="text-[10px] font-medium uppercase tracking-wider text-white/30">
                                {stat.label}
                            </p>
                        </div>
                    </div>
                </GlassCard>
            ))}
        </div>
    );
}
