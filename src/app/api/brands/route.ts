// ============================
// API Route: /api/brands
// ============================

import { NextResponse } from "next/server";
import {
    analyzeBrands,
    getBrandOfTheDay,
    getRecurringWinners,
    getEmergingBrands,
    buildPromptMatrix,
    getDailyTrends,
} from "@/lib/analysis";

export async function GET() {
    const allBrands = analyzeBrands();
    const brandOfTheDay = getBrandOfTheDay();
    const recurringWinners = getRecurringWinners();
    const emergingBrands = getEmergingBrands();
    const promptMatrix = buildPromptMatrix();
    const dailyTrends = getDailyTrends();

    return NextResponse.json({
        brands: allBrands,
        brandOfTheDay,
        recurringWinners,
        emergingBrands,
        promptMatrix,
        dailyTrends,
        meta: {
            lastUpdated: "2026-02-22T08:00:00+05:30",
            totalBrands: allBrands.length,
            totalMentions: allBrands.reduce((sum, b) => sum + b.frequency, 0),
            verticals: [...new Set(allBrands.map((b) => b.vertical))],
        },
    });
}
