"use client";

import React, { useEffect, useState } from "react";

interface AnimatedCounterProps {
    value: number;
    duration?: number;
    suffix?: string;
    prefix?: string;
    decimals?: number;
    className?: string;
}

export default function AnimatedCounter({
    value,
    duration = 1500,
    suffix = "",
    prefix = "",
    decimals = 0,
    className = "",
}: AnimatedCounterProps) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let startTime: number | null = null;
        let animationFrame: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            // Ease out cubic
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            setDisplayValue(easedProgress * value);

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [value, duration]);

    return (
        <span className={className}>
            {prefix}
            {displayValue.toFixed(decimals)}
            {suffix}
        </span>
    );
}
