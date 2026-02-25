import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { extractBrandNarrative } from "@/lib/narrative-engine";
import { BrandMention, Vertical } from "@/lib/types";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { brand, vertical, snapshotDate } = body as {
            brand: string;
            vertical: Vertical;
            snapshotDate?: string;
        };

        if (!brand || !vertical) {
            return NextResponse.json(
                { error: "brand and vertical are required" },
                { status: 400 }
            );
        }

        // Fetch mentions for this brand + vertical
        const { data: rows, error } = await supabase
            .from("brand_rankings")
            .select("*")
            .eq("brand", brand)
            .eq("vertical", vertical)
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

        if (mentions.length === 0) {
            return NextResponse.json(
                { error: `No mentions found for ${brand} in ${vertical}` },
                { status: 404 }
            );
        }

        const narrative = await extractBrandNarrative(
            brand,
            vertical,
            mentions,
            snapshotDate
        );

        return NextResponse.json(narrative);
    } catch (error) {
        console.error("[/api/narrative] Error:", error);
        return NextResponse.json({ error: "Narrative extraction failed" }, { status: 500 });
    }
}
