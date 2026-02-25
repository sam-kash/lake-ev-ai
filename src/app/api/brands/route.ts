import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { analyzeBrands } from "@/lib/analysis";
import { BrandMention, DailySnapshot, AVSSnapshot } from "@/lib/types";

export async function GET() {
    try {
        const { data: mentions, error } = await supabase
            .from("brand_rankings")
            .select("*")
            .order("date", { ascending: false });

        if (error) console.error("[/api/brands] Supabase error:", error);

        const safeMentions: BrandMention[] = (mentions || []).map((m: Record<string, unknown>) => ({
            id: m.id as string,
            brand: m.brand as string,
            vertical: m.vertical as BrandMention["vertical"],
            llm: m.llm as BrandMention["llm"],
            rank: m.rank as number,
            citedReason: m.cited_reason as string,
            date: m.date as string,
            sentiment: m.sentiment as BrandMention["sentiment"],
        }));

        // Build daily snapshots for trend charts
        const snapshots: DailySnapshot[] = [];
        const dateMap = new Map<string, Record<string, number>>();
        safeMentions.forEach((m) => {
            const entry = dateMap.get(m.date) || {};
            entry[m.brand] = (entry[m.brand] || 0) + Math.max(0, 100 - m.rank * 10);
            dateMap.set(m.date, entry);
        });
        dateMap.forEach((brandScores, date) => snapshots.push({ date, brandScores }));
        snapshots.sort((a, b) => a.date.localeCompare(b.date));

        // Load AVS snapshots for delta computation
        const { data: avsRows } = await supabase
            .from("avs_snapshots")
            .select("*")
            .order("snapshot_date", { ascending: true });

        const avsSnapshots: AVSSnapshot[] = (avsRows || []).map((r: Record<string, unknown>) => ({
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

        const brandScores = analyzeBrands(safeMentions, snapshots, avsSnapshots);

        return NextResponse.json({
            mentions: safeMentions,
            brandScores,
            dailySnapshots: snapshots,
        });
    } catch (error) {
        console.error("[/api/brands] Error:", error);
        return NextResponse.json({ error: "Failed to fetch brand data" }, { status: 500 });
    }
}
