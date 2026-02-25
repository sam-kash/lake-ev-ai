import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { analyzeBrands, buildVerticalSOV, buildLLMSOV } from "@/lib/analysis";
import { BrandMention, AVSSnapshot, LLMSource, Vertical } from "@/lib/types";
import { loadAllAVSSnapshots, saveAVSSnapshot } from "@/lib/snapshot-store";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const brand = searchParams.get("brand");
    const vertical = searchParams.get("vertical") as Vertical | null;

    try {
        const { data: rows, error } = await supabase
            .from("brand_rankings")
            .select("*")
            .order("date", { ascending: false });

        if (error) throw error;

        const mentions: BrandMention[] = (rows || []).map((m: Record<string, unknown>) => ({
            id: m.id as string,
            brand: m.brand as string,
            vertical: m.vertical as BrandMention["vertical"],
            llm: m.llm as BrandMention["llm"],
            rank: m.rank as number,
            citedReason: m.cited_reason as string,
            date: m.date as string,
            sentiment: m.sentiment as BrandMention["sentiment"],
        }));

        // Load previous AVS snapshots for delta
        const avsSnapsRows = brand ? await loadAllAVSSnapshots(brand) : [];
        const brandScores = analyzeBrands(mentions, [], avsSnapsRows);

        // Filter to requested brand / vertical if specified
        let results = brandScores;
        if (brand) results = results.filter((s) => s.brand === brand);
        if (vertical) results = results.filter((s) => s.vertical === vertical);

        // Persist today's AVS snapshot for each brand (async, fire-and-forget style)
        for (const score of brandScores) {
            const today = new Date().toISOString().split("T")[0];
            const snap: AVSSnapshot = {
                brand: score.brand,
                vertical: score.vertical,
                snapshotDate: today,
                avs: score.avs,
                weightedAvs: score.weightedAvs,
                tsov: score.tsov,
                avsBreakdown: score.avsBreakdown,
                frequency: score.frequency,
                avgRank: score.avgRank,
            };
            saveAVSSnapshot(snap).catch(console.error);
        }

        // Build SOV data if vertical specified
        let sovData = null;
        let llmSovData: Record<string, { brand: string; tsov: number }[]> | null = null;
        if (vertical) {
            sovData = buildVerticalSOV(mentions, vertical);
            llmSovData = {};
            for (const llm of ["ChatGPT", "Gemini", "Perplexity"] as LLMSource[]) {
                llmSovData[llm] = buildLLMSOV(mentions, vertical, llm);
            }
        }

        return NextResponse.json({
            brandScores: results,
            tsov: sovData,
            tsovByLLM: llmSovData,
            meta: {
                totalBrands: brandScores.length,
                trackedSetNote: "Tracked SOV sums to 100 within the monitored brand set only — not total market share.",
                computedAt: new Date().toISOString(),
            },
        });
    } catch (error) {
        console.error("[/api/avs] Error:", error);
        return NextResponse.json({ error: "Failed to compute AVS" }, { status: 500 });
    }
}
