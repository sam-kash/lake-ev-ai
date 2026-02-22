"use client";

import React from "react";
import { clsx } from "clsx";

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    glow?: "cyan" | "violet" | "emerald" | "amber" | "rose" | "none";
    hover?: boolean;
    padding?: "sm" | "md" | "lg";
}

const glowColors = {
    cyan: "shadow-[0_0_30px_rgba(6,182,212,0.12)] hover:shadow-[0_0_40px_rgba(6,182,212,0.2)]",
    violet: "shadow-[0_0_30px_rgba(139,92,246,0.12)] hover:shadow-[0_0_40px_rgba(139,92,246,0.2)]",
    emerald: "shadow-[0_0_30px_rgba(16,185,129,0.12)] hover:shadow-[0_0_40px_rgba(16,185,129,0.2)]",
    amber: "shadow-[0_0_30px_rgba(245,158,11,0.12)] hover:shadow-[0_0_40px_rgba(245,158,11,0.2)]",
    rose: "shadow-[0_0_30px_rgba(244,63,94,0.12)] hover:shadow-[0_0_40px_rgba(244,63,94,0.2)]",
    none: "",
};

const paddings = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
};

export default function GlassCard({
    children,
    className,
    glow = "none",
    hover = true,
    padding = "md",
}: GlassCardProps) {
    return (
        <div
            className={clsx(
                "relative rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl",
                "transition-all duration-500 ease-out",
                hover && "hover:border-white/[0.12] hover:bg-white/[0.05]",
                glowColors[glow],
                paddings[padding],
                className
            )}
        >
            {/* Subtle gradient inner border */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.06] to-transparent opacity-50" style={{ maskImage: "linear-gradient(to bottom, black 0%, transparent 30%)" }} />
            {children}
        </div>
    );
}
