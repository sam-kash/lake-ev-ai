import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
    try {
        // 1. Fetch brand rankings from Supabase
        const { data: mentions, error: dbError } = await supabase
            .from('brand_rankings')
            .select('*')
            .order('date', { ascending: false });

        if (dbError) {
            console.error("Supabase Error:", dbError);
        }

        // For local dev without initialized Supabase, fallback to empty array if no data
        const safeMentions = mentions || [];

        // Grouping mentions by date for historical snapshots if needed
        // In a real scenario, you'd aggregate this or create a view in Supabase.
        // For this rewrite, we will return mentions and dynamically generate the daily snapshots on the frontend or backend.

        const snapshots: any[] = [];

        // Simplistic snapshot builder from recent 7 days (mock logic for missing data)
        if (safeMentions.length > 0) {
            const dates = [...new Set(safeMentions.map(m => m.date))];
            dates.forEach(date => {
                const brandsForDate = safeMentions.filter(m => m.date === date);
                const scores: Record<string, number> = {};
                brandsForDate.forEach(m => {
                    // mock score logic, in reality we map to actual scores
                    scores[m.brand] = (scores[m.brand] || 0) + (100 - (m.rank * 10));
                });
                snapshots.push({
                    date,
                    brandScores: scores
                });
            });
        }

        return NextResponse.json({
            mentions: safeMentions,
            dailySnapshots: snapshots.reverse()
        });

    } catch (error) {
        console.error("API Route Error:", error);
        return NextResponse.json({ error: "Failed to fetch brand data from Supabase DB" }, { status: 500 });
    }
}
