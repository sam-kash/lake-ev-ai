import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { buildVerticalSOV, buildLLMSOV } from "@/lib/analysis";
import { BrandMention, LLMSource, Vertical } from "@/lib/types";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
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

        const verticals: Vertical[] = vertical
            ? [vertical]
            : ([...new Set(mentions.map((m) => m.vertical))] as Vertical[]);

        const result: Record<string, {
            overall: { brand: string; tsov: number; mentions: number }[];
            byLLM: Record<string, { brand: string; tsov: number }[]>;
        }> = {};

        for (const v of verticals) {
            const overall = buildVerticalSOV(mentions, v);
            const byLLM: Record<string, { brand: string; tsov: number }[]> = {};
            for (const llm of ["ChatGPT", "Gemini", "Perplexity"] as LLMSource[]) {
                byLLM[llm] = buildLLMSOV(mentions, v, llm);
            }
            result[v] = { overall, byLLM };
        }

        return NextResponse.json({
            tsov: result,
            meta: {
                scope: "Tracked Share of Voice within monitored brand set",
                note: "Values sum to 100 per vertical within tracked brands only — not total market.",
                computedAt: new Date().toISOString(),
            },
        });
    } catch (error) {
        console.error("[/api/sov] Error:", error);
        return NextResponse.json({ error: "Failed to compute SOV" }, { status: 500 });
    }
}
