// ============================
// Project Ghost Recon — Analysis Engine
// "The Pattern Recon" — Agent 3
// ============================

import { BrandMention, BrandScore, LLMSource, Vertical, DailySnapshot } from "./types";

/**
 * Calculate Preference Score for a brand:
 *   Score = (frequency × 0.6) + (rankScore × 0.25) + (sentimentBonus × 0.15)
 *
 * - frequency: normalized to 0–100 based on max mentions
 * - rankScore: inverse of average rank (1st = 100, 5th = 20)
 * - sentimentBonus: % of positive mentions × 100
 */
function calculatePreferenceScore(
    mentions: BrandMention[],
    maxFrequency: number
): number {
    if (mentions.length === 0) return 0;

    const frequency = (mentions.length / maxFrequency) * 100;

    const avgRank =
        mentions.reduce((sum, m) => sum + m.rank, 0) / mentions.length;
    const rankScore = Math.max(0, ((6 - avgRank) / 5) * 100); // 1st=100, 5th=20

    const positiveCount = mentions.filter(
        (m) => m.sentiment === "Positive"
    ).length;
    const sentimentBonus = (positiveCount / mentions.length) * 100;

    return Math.round(
        frequency * 0.6 + rankScore * 0.25 + sentimentBonus * 0.15
    );
}

/**
 * Analyze all brand mentions and produce scored results
 */
export function analyzeBrands(
    data: BrandMention[],
    snapshots: DailySnapshot[] = []
): BrandScore[] {
    // Group mentions by brand
    const brandMap = new Map<string, BrandMention[]>();
    data.forEach((mention) => {
        const existing = brandMap.get(mention.brand) || [];
        existing.push(mention);
        brandMap.set(mention.brand, existing);
    });

    // Find max frequency for normalization
    const maxFrequency = Math.max(
        ...Array.from(brandMap.values()).map((mentions) => mentions.length)
    );

    const scores: BrandScore[] = [];

    brandMap.forEach((mentions, brand) => {
        const preferenceScore = calculatePreferenceScore(mentions, maxFrequency);

        const avgRank =
            mentions.reduce((sum, m) => sum + m.rank, 0) / mentions.length;

        const sentimentBreakdown = {
            positive: mentions.filter((m) => m.sentiment === "Positive").length,
            neutral: mentions.filter((m) => m.sentiment === "Neutral").length,
            negative: mentions.filter((m) => m.sentiment === "Negative").length,
        };

        const llmCoverage = [
            ...new Set(mentions.map((m) => m.llm)),
        ] as LLMSource[];

        // Get trend data from daily snapshots
        const trend = snapshots.map(
            (snap) => snap.brandScores[brand] || 0
        );

        // Get the most common vertical for this brand
        const verticalCounts = new Map<Vertical, number>();
        mentions.forEach((m) => {
            verticalCounts.set(m.vertical, (verticalCounts.get(m.vertical) || 0) + 1);
        });
        const vertical = [...verticalCounts.entries()].sort(
            (a, b) => b[1] - a[1]
        )[0][0];

        // Most cited reason (from highest-ranked mention)
        const topMention = [...mentions].sort((a, b) => a.rank - b.rank)[0];

        scores.push({
            brand,
            vertical,
            preferenceScore,
            frequency: mentions.length,
            avgRank: Math.round(avgRank * 10) / 10,
            sentimentBreakdown,
            llmCoverage,
            trend,
            isRecurringWinner: preferenceScore >= 75,
            isEmergingBrand:
                llmCoverage.length <= 2 &&
                sentimentBreakdown.positive > sentimentBreakdown.neutral,
            topCitedReason: topMention.citedReason,
        });
    });

    // Sort by preference score descending
    return scores.sort((a, b) => b.preferenceScore - a.preferenceScore);
}

/**
 * Get the Brand of the Day (highest scoring brand)
 */
export function getBrandOfTheDay(
    data: BrandMention[],
    snapshots: DailySnapshot[] = []
): BrandScore {
    return analyzeBrands(data, snapshots)[0];
}

/**
 * Get recurring winners
 */
export function getRecurringWinners(
    data: BrandMention[],
    snapshots: DailySnapshot[] = []
): BrandScore[] {
    return analyzeBrands(data, snapshots).filter((b) => b.isRecurringWinner);
}

/**
 * Get emerging niche brands
 */
export function getEmergingBrands(
    data: BrandMention[],
    snapshots: DailySnapshot[] = []
): BrandScore[] {
    return analyzeBrands(data, snapshots).filter((b) => b.isEmergingBrand);
}

/**
 * Build prompt matrix: for each prompt × LLM, which brand ranked #1
 */
export function buildPromptMatrix(data: BrandMention[]) {
    const matrix: Record<
        string,
        Record<LLMSource, { brand: string; rank: number } | null>
    > = {};

    const verticals = [...new Set(data.map((m) => m.vertical))];

    verticals.forEach((vertical) => {
        matrix[vertical] = {
            ChatGPT: null,
            Perplexity: null,
            Gemini: null,
        };

        (["ChatGPT", "Perplexity", "Gemini"] as LLMSource[]).forEach((llm) => {
            const topMention = data
                .filter(
                    (m) =>
                        m.vertical === vertical &&
                        m.llm === llm &&
                        m.date === "2026-02-22"
                )
                .sort((a, b) => a.rank - b.rank)[0];

            if (topMention) {
                matrix[vertical][llm] = {
                    brand: topMention.brand,
                    rank: topMention.rank,
                };
            }
        });
    });

    return matrix;
}

/**
 * Get daily snapshots for trending chart
 */
