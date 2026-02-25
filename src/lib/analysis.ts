// ============================
// Project Ghost Recon — AVS Analysis Engine
// Agent 1: Data Intelligence
// Replaces old preferenceScore with AVS
// ============================

import {
    BrandMention,
    BrandScore,
    LLMSource,
    Vertical,
    DailySnapshot,
    AVSSnapshot,
    LLMAVSBreakdown,
} from "./types";
import { getWeightedAVS } from "./prompt-engine";

// ──────────────────────────────────────────────
// AVS FORMULA
// AVS = (Frequency×0.4) + (AvgPositionScore×0.3) + (SentimentWeight×0.2) + (CrossLLMCoverage×0.1)
// ──────────────────────────────────────────────

function calculateAVS(
    mentions: BrandMention[],
    maxFrequency: number
): {
    avs: number;
    frequencyScore: number;
    positionScore: number;
    sentimentScore: number;
    crossLLMScore: number;
} {
    if (mentions.length === 0) {
        return { avs: 0, frequencyScore: 0, positionScore: 0, sentimentScore: 0, crossLLMScore: 0 };
    }

    // Frequency: normalized to 0–100 relative to the most-mentioned brand
    const frequencyScore = (mentions.length / maxFrequency) * 100;

    // Position: avg rank → inverse score (rank 1 = 100, rank 5 = 20, etc.)
    const avgRank = mentions.reduce((sum, m) => sum + m.rank, 0) / mentions.length;
    const positionScore = Math.max(0, ((6 - avgRank) / 5) * 100);

    // Sentiment: % positive ×100
    const positiveCount = mentions.filter((m) => m.sentiment === "Positive").length;
    const sentimentScore = (positiveCount / mentions.length) * 100;

    // CrossLLM Coverage: how many of the 3 LLMs mention this brand (0, 1, 2, or 3 → 0, 33, 67, 100)
    const uniqueLLMs = new Set(mentions.map((m) => m.llm)).size;
    const crossLLMScore = (uniqueLLMs / 3) * 100;

    const avs = Math.round(
        frequencyScore * 0.4 +
        positionScore * 0.3 +
        sentimentScore * 0.2 +
        crossLLMScore * 0.1
    );

    return {
        avs: Math.min(100, avs),
        frequencyScore: Math.round(frequencyScore),
        positionScore: Math.round(positionScore),
        sentimentScore: Math.round(sentimentScore),
        crossLLMScore: Math.round(crossLLMScore),
    };
}

// ──────────────────────────────────────────────
// PER-LLM AVS BREAKDOWN
// ──────────────────────────────────────────────

function computeLLMSpecificAVS(
    mentions: BrandMention[],
    maxFreqPerLLM: Record<LLMSource, number>
): LLMAVSBreakdown {
    const llms: LLMSource[] = ["ChatGPT", "Gemini", "Perplexity"];
    const result: LLMAVSBreakdown = { chatgpt: 0, gemini: 0, perplexity: 0 };

    for (const llm of llms) {
        const llmMentions = mentions.filter((m) => m.llm === llm);
        const maxFreq = maxFreqPerLLM[llm] || 1;
        const { avs } = calculateAVS(llmMentions, maxFreq);
        const key = llm === "ChatGPT" ? "chatgpt" : llm === "Gemini" ? "gemini" : "perplexity";
        result[key] = avs;
    }
    return result;
}

// ──────────────────────────────────────────────
// TRACKED SHARE OF VOICE
// TSOV = (brand_mentions / total_mentions_in_vertical) × 100
// Labelled "Tracked SOV" — sums to 100 within the tracked set only
// ──────────────────────────────────────────────

export function computeTSOV(
    brandMentions: number,
    totalMentionsInVertical: number
): number {
    if (totalMentionsInVertical === 0) return 0;
    return Math.round((brandMentions / totalMentionsInVertical) * 100 * 10) / 10;
}

// ──────────────────────────────────────────────
// AVS DELTA (trend vs. previous snapshot)
// ──────────────────────────────────────────────

export function computeAvsDelta(
    brand: string,
    currentAVS: number,
    snapshots: AVSSnapshot[]
): number {
    const brandSnaps = snapshots
        .filter((s) => s.brand === brand)
        .sort((a, b) => b.snapshotDate.localeCompare(a.snapshotDate));
    if (brandSnaps.length < 1) return 0;
    const prev = brandSnaps[0].avs;
    return currentAVS - prev;
}

// ──────────────────────────────────────────────
// MAIN ANALYSIS FUNCTION
// ──────────────────────────────────────────────

export function analyzeBrands(
    data: BrandMention[],
    snapshots: DailySnapshot[] = [],
    avsSnapshots: AVSSnapshot[] = []
): BrandScore[] {
    // Group by brand
    const brandMap = new Map<string, BrandMention[]>();
    data.forEach((mention) => {
        const existing = brandMap.get(mention.brand) || [];
        existing.push(mention);
        brandMap.set(mention.brand, existing);
    });

    const maxFrequency = Math.max(
        ...Array.from(brandMap.values()).map((m) => m.length),
        1
    );

    // Compute per-LLM max frequency for normalized per-LLM AVS
    const maxFreqPerLLM: Record<LLMSource, number> = {
        ChatGPT: 1,
        Gemini: 1,
        Perplexity: 1,
    };
    for (const [, mentions] of brandMap) {
        for (const llm of ["ChatGPT", "Gemini", "Perplexity"] as LLMSource[]) {
            const count = mentions.filter((m) => m.llm === llm).length;
            if (count > maxFreqPerLLM[llm]) maxFreqPerLLM[llm] = count;
        }
    }

    const totalMentions = data.length;

    const scores: BrandScore[] = [];

    brandMap.forEach((mentions, brand) => {
        const { avs, frequencyScore, positionScore, sentimentScore, crossLLMScore } =
            calculateAVS(mentions, maxFrequency);

        // Dominant vertical for this brand
        const verticalCounts = new Map<Vertical, number>();
        mentions.forEach((m) => {
            verticalCounts.set(m.vertical, (verticalCounts.get(m.vertical) || 0) + 1);
        });
        const vertical = [...verticalCounts.entries()].sort((a, b) => b[1] - a[1])[0][0];

        const avgRank = mentions.reduce((sum, m) => sum + m.rank, 0) / mentions.length;
        const sentimentBreakdown = {
            positive: mentions.filter((m) => m.sentiment === "Positive").length,
            neutral: mentions.filter((m) => m.sentiment === "Neutral").length,
            negative: mentions.filter((m) => m.sentiment === "Negative").length,
        };
        const llmCoverage = [...new Set(mentions.map((m) => m.llm))] as LLMSource[];
        const avsBreakdown = computeLLMSpecificAVS(mentions, maxFreqPerLLM);
        const tsov = computeTSOV(mentions.length, totalMentions);
        const avsDelta = computeAvsDelta(brand, avs, avsSnapshots);
        const weightedAvs = getWeightedAVS(avs, vertical);

        // Trend from daily snapshots
        const trend = snapshots.map((snap) => snap.brandScores[brand] || 0);

        const topMention = [...mentions].sort((a, b) => a.rank - b.rank)[0];

        scores.push({
            brand,
            vertical,
            avs,
            weightedAvs,
            avsDelta,
            avsComponents: { frequencyScore, positionScore, sentimentScore, crossLLMScore },
            avsBreakdown,
            tsov,
            frequency: mentions.length,
            avgRank: Math.round(avgRank * 10) / 10,
            sentimentBreakdown,
            llmCoverage,
            trend,
            isRecurringWinner: avs >= 75,
            isEmergingBrand: llmCoverage.length <= 2 && sentimentBreakdown.positive > sentimentBreakdown.neutral,
            topCitedReason: topMention.citedReason,
        });
    });

    return scores.sort((a, b) => b.avs - a.avs);
}

// ──────────────────────────────────────────────
// HELPER EXPORTS (legacy + new)
// ──────────────────────────────────────────────

export function getBrandOfTheDay(
    data: BrandMention[],
    snapshots: DailySnapshot[] = [],
    avsSnapshots: AVSSnapshot[] = []
): BrandScore {
    return analyzeBrands(data, snapshots, avsSnapshots)[0];
}

export function getRecurringWinners(
    data: BrandMention[],
    snapshots: DailySnapshot[] = [],
    avsSnapshots: AVSSnapshot[] = []
): BrandScore[] {
    return analyzeBrands(data, snapshots, avsSnapshots).filter((b) => b.isRecurringWinner);
}

export function getEmergingBrands(
    data: BrandMention[],
    snapshots: DailySnapshot[] = [],
    avsSnapshots: AVSSnapshot[] = []
): BrandScore[] {
    return analyzeBrands(data, snapshots, avsSnapshots).filter((b) => b.isEmergingBrand);
}

export function buildPromptMatrix(data: BrandMention[]) {
    const matrix: Record<string, Record<LLMSource, { brand: string; rank: number } | null>> = {};
    const verticals = [...new Set(data.map((m) => m.vertical))];

    verticals.forEach((vertical) => {
        matrix[vertical] = { ChatGPT: null, Perplexity: null, Gemini: null };
        (["ChatGPT", "Perplexity", "Gemini"] as LLMSource[]).forEach((llm) => {
            const topMention = data
                .filter((m) => m.vertical === vertical && m.llm === llm)
                .sort((a, b) => a.rank - b.rank)[0];
            if (topMention) {
                matrix[vertical][llm] = { brand: topMention.brand, rank: topMention.rank };
            }
        });
    });

    return matrix;
}

/**
 * Build SOV ranking for all brands in a specific vertical
 * Returns sorted array — clearly labelled as Tracked SOV
 */
export function buildVerticalSOV(
    data: BrandMention[],
    vertical: Vertical
): { brand: string; tsov: number; mentions: number }[] {
    const filtered = data.filter((m) => m.vertical === vertical);
    const total = filtered.length;
    const brandCounts = new Map<string, number>();
    filtered.forEach((m) => brandCounts.set(m.brand, (brandCounts.get(m.brand) || 0) + 1));

    return [...brandCounts.entries()]
        .map(([brand, count]) => ({
            brand,
            tsov: computeTSOV(count, total),
            mentions: count,
        }))
        .sort((a, b) => b.tsov - a.tsov);
}

/**
 * Build per-LLM SOV for a vertical
 */
export function buildLLMSOV(
    data: BrandMention[],
    vertical: Vertical,
    llm: LLMSource
): { brand: string; tsov: number }[] {
    const filtered = data.filter((m) => m.vertical === vertical && m.llm === llm);
    const total = filtered.length;
    const brandCounts = new Map<string, number>();
    filtered.forEach((m) => brandCounts.set(m.brand, (brandCounts.get(m.brand) || 0) + 1));

    return [...brandCounts.entries()]
        .map(([brand, count]) => ({ brand, tsov: computeTSOV(count, total) }))
        .sort((a, b) => b.tsov - a.tsov);
}
