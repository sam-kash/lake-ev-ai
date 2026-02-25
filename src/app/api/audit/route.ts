import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { analyzeBrands } from "@/lib/analysis";
import { extractBrandNarrative } from "@/lib/narrative-engine";
import { gapAnalysis } from "@/lib/gap-engine";
import { GoogleGenAI } from "@google/genai";
import { BrandMention, AVSSnapshot, Vertical, AuditReport } from "@/lib/types";
import { loadAllAVSSnapshots } from "@/lib/snapshot-store";

// Lazy client — only instantiated when the GET handler is actually called
let _ai: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
    if (!_ai) {
        const key = process.env.GEMINI_API_KEY;
        if (!key) throw new Error("GEMINI_API_KEY is not set.");
        _ai = new GoogleGenAI({ apiKey: key });
    }
    return _ai;
}


export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const brand = searchParams.get("brand");
    const vertical = searchParams.get("vertical") as Vertical | null;

    if (!brand || !vertical) {
        return NextResponse.json({ error: "brand and vertical params required" }, { status: 400 });
    }

    try {
        // 1. Fetch all mentions
        const { data: rows, error } = await supabase
            .from("brand_rankings")
            .select("*")
            .order("date", { ascending: false });
        if (error) throw error;

        const allMentions: BrandMention[] = (rows || []).map((m: Record<string, unknown>) => ({
            id: m.id as string,
            brand: m.brand as string,
            vertical: m.vertical as BrandMention["vertical"],
            llm: m.llm as BrandMention["llm"],
            rank: m.rank as number,
            citedReason: m.cited_reason as string,
            date: m.date as string,
            sentiment: m.sentiment as BrandMention["sentiment"],
        }));

        const brandMentions = allMentions.filter(
            (m) => m.brand === brand && m.vertical === vertical
        );

        if (brandMentions.length === 0) {
            return NextResponse.json({ error: `No data for ${brand} in ${vertical}` }, { status: 404 });
        }

        // 2. Compute scores
        const avsHistory = await loadAllAVSSnapshots(brand);
        const allScores = analyzeBrands(allMentions, [], avsHistory);
        const score = allScores.find((s) => s.brand === brand && s.vertical === vertical)
            || allScores.find((s) => s.brand === brand);

        if (!score) {
            return NextResponse.json({ error: "Score computation failed" }, { status: 500 });
        }

        // 3. Narrative intelligence
        const today = new Date().toISOString().split("T")[0];
        const narrative = await extractBrandNarrative(brand, vertical, brandMentions, today);

        // 4. Top competitor gap (find highest-AVS brand in same vertical)
        const competitors = allScores
            .filter((s) => s.vertical === vertical && s.brand !== brand)
            .sort((a, b) => b.avs - a.avs);
        let topCompetitorGap = null;
        if (competitors.length > 0) {
            const topComp = competitors[0];
            topCompetitorGap = await gapAnalysis(brand, topComp.brand, allMentions, avsHistory);
        }

        // 5. Gemini strategic recommendations
        const recPrompt = `
You are a B2B SaaS AI positioning strategist for a platform called Ghost Recon.

Brand: "${brand}" | Vertical: "${vertical}"
AI Visibility Score (AVS): ${score.avs}/100
Weighted AVS: ${score.weightedAvs}/100
Tracked Share of Voice: ${score.tsov}%
AVS Trend Delta: ${score.avsDelta > 0 ? "+" : ""}${score.avsDelta} vs last snapshot
Narrative: ${narrative.narrativeSummary}
Authority Score: ${narrative.authorityStrengthScore}/100
Signature adjectives AI uses: ${narrative.signatureAdjectives.join(", ")}
${topCompetitorGap ? `Top competitor: ${topCompetitorGap.brandB} (AVS gap: ${topCompetitorGap.avsDifference.toFixed(1)})` : ""}

Generate exactly 5 specific, actionable positioning recommendations to improve AI visibility.
Each should be 1–2 sentences. Answer: "What specific positioning adjustments increase AI visibility?"
Format as a JSON array of strings.
`;

        let recommendations: string[] = [];
        try {
            const recResp = await getAI().models.generateContent({ model: "gemini-2.0-flash", contents: recPrompt });
            const text = recResp.text || "";
            const match = text.match(/\[[\s\S]*\]/);
            if (match) recommendations = JSON.parse(match[0]);
        } catch {
            recommendations = [
                `Increase mention frequency in "${vertical}" by publishing authoritative comparison content that AI platforms cite.`,
                `Improve rank positions by targeting enterprise-intent queries where AI recommendations are heavily weighted.`,
                `Build authority indicators: earn coverage using phrases like 'industry standard' and 'best-in-class' in third-party reviews.`,
                `Ensure consistent brand representation across ChatGPT, Gemini, and Perplexity — cross-LLM consistency boosts AVS.`,
                `Improve sentiment ratio by addressing negative feedback patterns in public sources AI models are trained on.`,
            ];
        }

        // 6. Executive summary
        const executiveSummary = `${brand} has an AI Visibility Score of ${score.avs}/100 in the ${vertical} vertical, ${score.avsDelta >= 0 ? `up ${score.avsDelta} points` : `down ${Math.abs(score.avsDelta)} points`
            } from the previous snapshot. Tracked Share of Voice stands at ${score.tsov}%. ${narrative.narrativeSummary}`;

        const report: AuditReport = {
            brand,
            vertical,
            generatedAt: new Date().toISOString(),
            executiveSummary,
            avs: score.avs,
            weightedAvs: score.weightedAvs,
            avsDelta: score.avsDelta,
            tsov: score.tsov,
            avsBreakdown: score.avsBreakdown,
            narrative,
            topCompetitorGap,
            recommendations,
            authorityStrengthScore: narrative.authorityStrengthScore,
        };

        return NextResponse.json(report);
    } catch (error) {
        console.error("[/api/audit] Error:", error);
        return NextResponse.json({ error: "Audit generation failed" }, { status: 500 });
    }
}
