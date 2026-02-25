import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { gapAnalysis } from "@/lib/gap-engine";
import { BrandMention, AVSSnapshot } from "@/lib/types";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const brandA = searchParams.get("brandA");
    const brandB = searchParams.get("brandB");

    if (!brandA || !brandB) {
        return NextResponse.json(
            { error: "Both brandA and brandB query params are required" },
            { status: 400 }
        );
    }

    try {
        // Fetch raw mentions
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

        // Fetch AVS snapshots for delta context
        const { data: snapRows } = await supabase
            .from("avs_snapshots")
            .select("*")
            .in("brand", [brandA, brandB]);

        const avsSnapshots: AVSSnapshot[] = (snapRows || []).map((r: Record<string, unknown>) => ({
            brand: r.brand as string,
            vertical: r.vertical as AVSSnapshot["vertical"],
            snapshotDate: r.snapshot_date as string,
            avs: r.avs as number,
            weightedAvs: r.weighted_avs as number,
            tsov: r.tsov as number,
            avsBreakdown: {
                chatgpt: r.avs_chatgpt as number,
                gemini: r.avs_gemini as number,
                perplexity: r.avs_perplexity as number,
            },
            frequency: r.frequency as number,
            avgRank: r.avg_rank as number,
        }));

        const gap = await gapAnalysis(brandA, brandB, mentions, avsSnapshots);

        return NextResponse.json(gap);
    } catch (error) {
        console.error("[/api/gap] Error:", error);
        return NextResponse.json(
            { error: `Gap analysis failed: ${error instanceof Error ? error.message : "Unknown error"}` },
            { status: 500 }
        );
    }
}
