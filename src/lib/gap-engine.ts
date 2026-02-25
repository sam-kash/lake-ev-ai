// ============================
// Project Ghost Recon — Competitor Gap Intelligence Engine
// Agent 1: Data Intelligence (gap module)
// "Why Competitor X Is Beating You"
// ============================

import { GoogleGenAI } from "@google/genai";
import { BrandMention, GapAnalysis, LLMSource, Vertical, AVSSnapshot } from "./types";
import { analyzeBrands, buildLLMSOV } from "./analysis";

// Lazy client — only created on first call, so build succeeds without GEMINI_API_KEY
let _ai: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
    if (!_ai) {
        const key = process.env.GEMINI_API_KEY;
        if (!key) throw new Error("GEMINI_API_KEY is not set.");
        _ai = new GoogleGenAI({ apiKey: key });
    }
    return _ai;
}

const MODEL = "gemini-2.0-flash";


// ──────────────────────────────────────────────
// GAP ANALYSIS ENGINE
// gapAnalysis(brandA, brandB) → revenue-critical competitor intelligence
// ──────────────────────────────────────────────

export async function gapAnalysis(
    brandA: string,
    brandB: string,
    mentions: BrandMention[],
    avsSnapshots: AVSSnapshot[] = []
): Promise<GapAnalysis> {
    const vertical = detectDominantVertical(mentions, brandA, brandB);

    // Score both brands
    const allScores = analyzeBrands(mentions, [], avsSnapshots);
    const scoreA = allScores.find((s) => s.brand === brandA);
    const scoreB = allScores.find((s) => s.brand === brandB);

    if (!scoreA || !scoreB) {
        throw new Error(`Cannot find scores for ${!scoreA ? brandA : brandB}`);
    }

    const avsDifference = scoreA.avs - scoreB.avs;
    const sovDifference = scoreA.tsov - scoreB.tsov;
    const sentimentGap =
        (scoreA.sentimentBreakdown.positive / Math.max(scoreA.frequency, 1)) * 100 -
        (scoreB.sentimentBreakdown.positive / Math.max(scoreB.frequency, 1)) * 100;

    // Identify LLMs where brandB outperforms brandA
    const llmsCompetitorLeads: LLMSource[] = [];
    const llms: LLMSource[] = ["ChatGPT", "Gemini", "Perplexity"];
    for (const llm of llms) {
        const key = llm === "ChatGPT" ? "chatgpt" : llm === "Gemini" ? "gemini" : "perplexity";
        if (scoreB.avsBreakdown[key] > scoreA.avsBreakdown[key]) {
            llmsCompetitorLeads.push(llm);
        }
    }

    // Identify intent clusters where brandB dominates (has more mentions)
    const intentTypes = ["best", "comparison", "enterprise", "budget", "feature-specific"] as const;
    const promptClustersCompetitorDominates: string[] = [];
    for (const intent of intentTypes) {
        // Simple heuristic: if brandB has higher frequency mentions when filtered conceptually
        // In a full impl, this would join against the prompt catalog
        // For V1 we detect dominance by checking rank in vertical-filtered mentions
        const vertMentionsA = mentions.filter((m) => m.brand === brandA && m.vertical === vertical);
        const vertMentionsB = mentions.filter((m) => m.brand === brandB && m.vertical === vertical);
        if (vertMentionsB.length > vertMentionsA.length && intent === "best") {
            promptClustersCompetitorDominates.push(intent);
        }
        if (scoreB.avsBreakdown.chatgpt > scoreA.avsBreakdown.chatgpt && intent === "enterprise") {
            promptClustersCompetitorDominates.push(intent);
        }
    }

    // Narrative adjective comparison
    const narrativeAdjectiveComparison = {
        brandA: extractTopAdjectives(mentions.filter((m) => m.brand === brandA)),
        brandB: extractTopAdjectives(mentions.filter((m) => m.brand === brandB)),
    };

    // Gemini-generated competitive summary
    const summary = await generateGapSummary(
        brandA, brandB, vertical,
        avsDifference, sovDifference, sentimentGap,
        llmsCompetitorLeads, promptClustersCompetitorDominates,
        narrativeAdjectiveComparison
    );

    return {
        brandA,
        brandB,
        vertical,
        computedAt: new Date().toISOString(),
        avsDifference,
        sovDifference,
        sentimentGap: Math.round(sentimentGap * 10) / 10,
        promptClustersCompetitorDominates: [...new Set(promptClustersCompetitorDominates)],
        llmsCompetitorLeads,
        narrativeAdjectiveComparison,
        summary,
    };
}

// ──────────────────────────────────────────────
// GAP SUMMARY GENERATION (Gemini 2.0 Flash)
// ──────────────────────────────────────────────

async function generateGapSummary(
    brandA: string,
    brandB: string,
    vertical: Vertical,
    avsDiff: number,
    sovDiff: number,
    sentimentGap: number,
    llmsLosing: LLMSource[],
    intentClusters: string[],
    adjComparison: { brandA: string[]; brandB: string[] }
): Promise<string> {
    const isLosing = avsDiff < 0;
    const prompt = `
You are a competitive AI positioning analyst. Write a sharp, direct 3–4 sentence analysis.

Brand being analyzed: "${brandA}"
Competitor: "${brandB}"
Vertical: "${vertical}"

Data:
- AVS difference: ${avsDiff.toFixed(1)} (negative means ${brandA} is LOSING)
- Tracked SOV difference: ${sovDiff.toFixed(1)}%
- Sentiment gap: ${sentimentGap.toFixed(1)}% (positive means ${brandA} has better sentiment)
- LLMs where ${brandB} outperforms: ${llmsLosing.length > 0 ? llmsLosing.join(", ") : "none"}
- Intent clusters where ${brandB} dominates: ${intentClusters.length > 0 ? intentClusters.join(", ") : "none identified"}
- ${brandA} is described as: ${adjComparison.brandA.join(", ") || "insufficient data"}
- ${brandB} is described as: ${adjComparison.brandB.join(", ") || "insufficient data"}

Write a competitive gap summary starting with "Why ${brandB} Is ${isLosing ? "Beating" : "Trailing"} ${brandA}:".
Be direct. Cite the numbers. Give 1 actionable insight at the end.
`;

    try {
        const response = await getAI().models.generateContent({
            model: MODEL,
            contents: prompt,
        });
        return response.text?.trim() || buildFallbackSummary(brandA, brandB, avsDiff, sovDiff);
    } catch (err) {
        console.error("[GapEngine] Gemini error:", err);
        return buildFallbackSummary(brandA, brandB, avsDiff, sovDiff);
    }
}

function buildFallbackSummary(
    brandA: string,
    brandB: string,
    avsDiff: number,
    sovDiff: number
): string {
    if (avsDiff < 0) {
        return `Why ${brandB} Is Beating ${brandA}: ${brandB} holds a ${Math.abs(avsDiff).toFixed(1)}-point AVS advantage and ${Math.abs(sovDiff).toFixed(1)}% more Tracked Share of Voice. To close this gap, ${brandA} should focus on improving rank positions in AI recommendation outputs and building stronger citation authority.`;
    }
    return `${brandA} currently leads ${brandB} by ${avsDiff.toFixed(1)} AVS points and ${sovDiff.toFixed(1)}% SOV. Maintaining narrative consistency across all three major AI platforms will protect this lead.`;
}

// ──────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────

function detectDominantVertical(
    mentions: BrandMention[],
    brandA: string,
    brandB: string
): Vertical {
    const relevant = mentions.filter((m) => m.brand === brandA || m.brand === brandB);
    const vertCount = new Map<Vertical, number>();
    relevant.forEach((m) => vertCount.set(m.vertical, (vertCount.get(m.vertical) || 0) + 1));
    const sorted = [...vertCount.entries()].sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] || "Project Management";
}

function extractTopAdjectives(mentions: BrandMention[]): string[] {
    const DESCRIPTORS = [
        "powerful", "intuitive", "scalable", "affordable", "reliable", "fast",
        "flexible", "simple", "robust", "enterprise", "modern", "collaborative",
        "feature-rich", "easy", "efficient", "comprehensive", "innovative", "trusted",
        "popular", "leading", "advanced", "customizable", "integrations", "secure",
    ];
    const text = mentions.map((m) => m.citedReason).join(" ").toLowerCase();
    return DESCRIPTORS.filter((adj) => text.includes(adj)).slice(0, 6);
}
