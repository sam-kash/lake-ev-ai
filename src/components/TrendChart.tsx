"use client";

import React, { useState } from "react";
import GlassCard from "./ui/GlassCard";
import { DailySnapshot } from "@/lib/types";
import { TrendingUp } from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    TooltipProps,
} from "recharts";
import { clsx } from "clsx";

interface TrendChartProps {
    dailyTrends: DailySnapshot[];
    topBrands: string[];
}

const brandColors: Record<string, string> = {
    Figma: "#f43e5c",
    Notion: "#06b6d4",
    "Google Drive": "#10b981",
    HubSpot: "#f59e0b",
    Jasper: "#8b5cf6",
    Salesforce: "#3b82f6",
    Grammarly: "#ec4899",
    Linear: "#a78bfa",
    Canva: "#14b8a6",
    Dropbox: "#6366f1",
};

function CustomTooltip({
    active,
    payload,
    label,
}: any) {
    if (!active || !payload) return null;

    return (
        <div className="rounded-xl border border-white/10 bg-[#0d0d14]/95 px-4 py-3 shadow-2xl backdrop-blur-xl">
            <p className="mb-2 text-xs font-medium text-white/40">{label}</p>
            {payload
                .sort((a: any, b: any) => (b.value || 0) - (a.value || 0))
                .map((entry: any) => (
                    <div
                        key={entry.dataKey}
                        className="flex items-center justify-between gap-4 text-xs"
                    >
                        <span className="flex items-center gap-1.5">
                            <span
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-white/70">{entry.dataKey}</span>
                        </span>
                        <span className="font-mono font-semibold text-white">
                            {entry.value}
                        </span>
                    </div>
                ))}
        </div>
    );
}

export default function TrendChart({ dailyTrends, topBrands }: TrendChartProps) {
    const [activeBrand, setActiveBrand] = useState<string | null>(null);

    // Transform dailyTrends into recharts data
    const chartData = dailyTrends.map((snap) => ({
        date: snap.date.slice(5), // MM-DD
        ...snap.brandScores,
    }));

    const displayBrands = topBrands.slice(0, 6);

    return (
        <GlassCard glow="emerald" padding="md" className="col-span-full">
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                    <h3 className="text-sm font-semibold text-white">Score Trends</h3>
                    <span className="text-xs text-white/30">Last 7 days</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {displayBrands.map((brand) => (
                        <button
                            key={brand}
                            onMouseEnter={() => setActiveBrand(brand)}
                            onMouseLeave={() => setActiveBrand(null)}
                            className={clsx(
                                "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium transition-all",
                                activeBrand === brand
                                    ? "bg-white/15 text-white"
                                    : "bg-white/[0.05] text-white/40 hover:text-white/70"
                            )}
                        >
                            <span
                                className="h-1.5 w-1.5 rounded-full"
                                style={{
                                    backgroundColor: brandColors[brand] || "#666",
                                }}
                            />
                            {brand}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={chartData}
                        margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                    >
                        <defs>
                            {displayBrands.map((brand) => (
                                <linearGradient
                                    key={brand}
                                    id={`gradient-${brand.replace(/\s/g, "")}`}
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor={brandColors[brand] || "#666"}
                                        stopOpacity={0.3}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor={brandColors[brand] || "#666"}
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                            ))}
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(255,255,255,0.04)"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }}
                            axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                            tickLine={false}
                        />
                        <YAxis
                            domain={[40, 100]}
                            tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        {displayBrands.map((brand) => (
                            <Area
                                key={brand}
                                type="monotone"
                                dataKey={brand}
                                stroke={brandColors[brand] || "#666"}
                                strokeWidth={activeBrand === brand ? 3 : 1.5}
                                fill={`url(#gradient-${brand.replace(/\s/g, "")})`}
                                fillOpacity={activeBrand === null || activeBrand === brand ? 1 : 0.1}
                                strokeOpacity={activeBrand === null || activeBrand === brand ? 1 : 0.2}
                            />
                        ))}
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </GlassCard>
    );
}
