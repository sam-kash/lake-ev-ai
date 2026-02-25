// ============================
// Project Ghost Recon — Narrative Intelligence Engine
// Agent 2: Narrative Intelligence
// Uses Gemini 2.0 Flash for synthesis, adjective extraction, drift detection
// Caches results in Supabase — LLM only called on fresh/changed snapshots
// ============================

import { GoogleGenAI } from "@google/genai";
import { BrandMention, NarrativeResult, Vertical } from "./types";
import { loadCachedNarrative, saveNarrativeSnapshot, loadPreviousNarrative } from "./snapshot-store";

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
const TODAY = new Date().toISOString().split("T")[0];


// ──────────────────────────────────────────────
// AUTHORITY STRENGTH SCORE (computed before Gemini, used as input)
// Signals: high-authority phrases, rank dominance, cross-LLM consistency
// ──────────────────────────────────────────────

const AUTHORITY_PHRASES = [
    "industry standard",
    "leading",
    "best-in-class",
    "top choice",
    "most recommended",
    "market leader",
    "gold standard",
    "enterprise-grade",
    "preferred by",
    "trusted by",
    "dominant",
    "number one",
    "#1",
    "widely adopted",
    "category leader",
];

export function computeAuthorityStrengthScore(
    citedReasons: string[],
    avgRank: number,
    llmCoverageCount: number
): number {
    const text = citedReasons.join(" ").toLowerCase();

    // Phrase frequency score (0–50)
    const phraseHits = AUTHORITY_PHRASES.filter((p) => text.includes(p)).length;
    const phraseScore = Math.min(50, phraseHits * 8);

    // Rank dominance score (0–30) — rank 1 avg = 30, rank 5 = 0
    const rankScore = Math.max(0, Math.round(((5 - avgRank) / 4) * 30));

    // Cross-LLM consistency (0–20) — 3 LLMs = 20, 2 = 13, 1 = 7, 0 = 0
    const llmScore = [0, 7, 13, 20][Math.min(llmCoverageCount, 3)];

    return Math.min(100, phraseScore + rankScore + llmScore);
}

// ──────────────────────────────────────────────
// NARRATIVE EXTRACTION (Gemini 2.0 Flash)
// Cached per brand+vertical+snapshotDate — no redundant LLM calls
// ──────────────────────────────────────────────

export async function extractBrandNarrative(
    brand: string,
    vertical: Vertical,
    mentions: BrandMention[],
    snapshotDate: string = TODAY
): Promise<NarrativeResult> {
    // 1. Check cache first
    const cached = await loadCachedNarrative(brand, vertical, snapshotDate);
    if (cached) return cached;

    const citedReasons = mentions.map((m) => m.citedReason).filter(Boolean);
    const avgRank = mentions.reduce((s, m) => s + m.rank, 0) / Math.max(mentions.length, 1);
    const llmCount = new Set(mentions.map((m) => m.llm)).size;
    const authorityStrengthScore = computeAuthorityStrengthScore(citedReasons, avgRank, llmCount);

    const prompt = `
You are an AI visibility analyst for a B2B SaaS intelligence platform.

Brand: "${brand}"
Vertical: "${vertical}"
Number of AI mentions: ${mentions.length}
Average rank position: ${avgRank.toFixed(1)}
LLMs that mention this brand: ${[...new Set(mentions.map((m) => m.llm))].join(", ")}

Here are the reasons AI systems cite when recommending this brand:
${citedReasons.slice(0, 20).map((r, i) => `${i + 1}. ${r}`).join("\n")}

Respond ONLY with valid JSON matching this exact structure:
{
  "narrativeSummary": "2–3 sentence summary of how AI platforms position this brand",
  "positioningCategory": "one of: Leader, Challenger, Niche, Emerging, Legacy",
  "signatureAdjectives": ["array", "of", "5-8", "adjectives", "AI uses for this brand"],
  "differentiationSignals": ["array", "of", "3-5", "unique positioning signals"]
}
`;

    let parsed: {
        narrativeSummary: string;
        positioningCategory: string;
        signatureAdjectives: string[];
        differentiationSignals: string[];
    };

    try {
        const response = await getAI().models.generateContent({
            model: MODEL,
            contents: prompt,
        });

        const text = response.text || "";
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("No JSON in response");
        parsed = JSON.parse(jsonMatch[0]);
    } catch (err) {
        console.error("[NarrativeEngine] Gemini error:", err);
        // Graceful fallback so the rest of the platform still works
        parsed = {
            narrativeSummary: `${brand} is mentioned across AI platforms in the ${vertical} vertical. Narrative data is being computed.`,
            positioningCategory: "Emerging",
            signatureAdjectives: ["reliable", "popular", "versatile"],
            differentiationSignals: ["Present across multiple AI platforms"],
        };
    }

    // 2. Check for narrative drift vs previous snapshot
    const previousNarrative = await loadPreviousNarrative(brand, vertical);
    let narrativeShift: string | undefined;
    let emergingThemes: string[] | undefined;
    let lostThemes: string[] | undefined;

    if (previousNarrative) {
        const driftResult = await detectNarrativeDrift(parsed, previousNarrative, brand);
        narrativeShift = driftResult.narrativeShift;
        emergingThemes = driftResult.emergingThemes;
        lostThemes = driftResult.lostThemes;
    }

    const result: NarrativeResult = {
        brand,
        vertical,
        snapshotDate,
        narrativeSummary: parsed.narrativeSummary,
        positioningCategory: parsed.positioningCategory,
        signatureAdjectives: parsed.signatureAdjectives || [],
        authorityStrengthScore,
        differentiationSignals: parsed.differentiationSignals || [],
        narrativeShift,
        emergingThemes,
        lostThemes,
    };

    // 3. Persist to cache
    await saveNarrativeSnapshot(result);

    return result;
}

// ──────────────────────────────────────────────
// NARRATIVE DRIFT DETECTION
// Compares current vs previous narrative using Gemini reasoning
// ──────────────────────────────────────────────

export async function detectNarrativeDrift(
    current: { narrativeSummary: string; signatureAdjectives: string[] },
    previous: NarrativeResult,
    brand: string
): Promise<{ narrativeShift: string; emergingThemes: string[]; lostThemes: string[] }> {
    const prompt = `
You are analyzing narrative positioning drift for a B2B brand called "${brand}" in AI recommendation systems.

PREVIOUS narrative summary: "${previous.narrativeSummary}"
PREVIOUS signature adjectives: ${JSON.stringify(previous.signatureAdjectives)}

CURRENT narrative summary: "${current.narrativeSummary}"
CURRENT signature adjectives: ${JSON.stringify(current.signatureAdjectives)}

Respond ONLY with valid JSON:
{
  "narrativeShift": "1–2 sentence description of how the brand positioning changed",
  "emergingThemes": ["new themes that appeared in current vs previous"],
  "lostThemes": ["themes that were present before but dropped"]
}
`;

    try {
        const response = await getAI().models.generateContent({
            model: MODEL,
            contents: prompt,
        });
        const text = response.text || "";
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("No JSON");
        const parsed = JSON.parse(jsonMatch[0]);
        return {
            narrativeShift: parsed.narrativeShift || "No significant shift detected.",
            emergingThemes: parsed.emergingThemes || [],
            lostThemes: parsed.lostThemes || [],
        };
    } catch {
        return {
            narrativeShift: "Unable to compute drift at this time.",
            emergingThemes: [],
            lostThemes: [],
        };
    }
}
