// ============================
// Project Ghost Recon — Snapshot Store
// Supabase read/write for AVS + Narrative snapshots
// ============================

import { supabase } from "./supabase";
import { AVSSnapshot, NarrativeResult, Vertical } from "./types";

// ──────────────────────────────────────────────
// AVS SNAPSHOTS
// ──────────────────────────────────────────────

export async function saveAVSSnapshot(snapshot: AVSSnapshot): Promise<void> {
    const { error } = await supabase.from("avs_snapshots").upsert({
        brand: snapshot.brand,
        vertical: snapshot.vertical,
        snapshot_date: snapshot.snapshotDate,
        avs: snapshot.avs,
        weighted_avs: snapshot.weightedAvs,
        tsov: snapshot.tsov,
        avs_chatgpt: snapshot.avsBreakdown.chatgpt,
        avs_gemini: snapshot.avsBreakdown.gemini,
        avs_perplexity: snapshot.avsBreakdown.perplexity,
        frequency: snapshot.frequency,
        avg_rank: snapshot.avgRank,
    }, {
        onConflict: "brand,vertical,snapshot_date"
    });

    if (error) console.error("[SnapshotStore] saveAVSSnapshot error:", error);
}

export async function loadPreviousSnapshot(
    brand: string,
    vertical: Vertical
): Promise<AVSSnapshot | null> {
    const { data, error } = await supabase
        .from("avs_snapshots")
        .select("*")
        .eq("brand", brand)
        .eq("vertical", vertical)
        .order("snapshot_date", { ascending: false })
        .limit(2); // Get last 2; use index 1 as "previous"

    if (error || !data || data.length < 2) return null;

    const row = data[1]; // second most recent = "previous"
    return {
        brand: row.brand,
        vertical: row.vertical as Vertical,
        snapshotDate: row.snapshot_date,
        avs: row.avs,
        weightedAvs: row.weighted_avs,
        tsov: row.tsov,
        avsBreakdown: {
            chatgpt: row.avs_chatgpt,
            gemini: row.avs_gemini,
            perplexity: row.avs_perplexity,
        },
        frequency: row.frequency,
        avgRank: row.avg_rank,
    };
}

export async function loadAllAVSSnapshots(brand: string): Promise<AVSSnapshot[]> {
    const { data, error } = await supabase
        .from("avs_snapshots")
        .select("*")
        .eq("brand", brand)
        .order("snapshot_date", { ascending: true });

    if (error || !data) return [];

    return data.map((row) => ({
        brand: row.brand,
        vertical: row.vertical as Vertical,
        snapshotDate: row.snapshot_date,
        avs: row.avs,
        weightedAvs: row.weighted_avs,
        tsov: row.tsov,
        avsBreakdown: {
            chatgpt: row.avs_chatgpt,
            gemini: row.avs_gemini,
            perplexity: row.avs_perplexity,
        },
        frequency: row.frequency,
        avgRank: row.avg_rank,
    }));
}

// ──────────────────────────────────────────────
// NARRATIVE SNAPSHOTS (cached to avoid redundant Gemini calls)
// ──────────────────────────────────────────────

export async function saveNarrativeSnapshot(narrative: NarrativeResult): Promise<void> {
    const { error } = await supabase.from("narrative_snapshots").upsert({
        brand: narrative.brand,
        vertical: narrative.vertical,
        snapshot_date: narrative.snapshotDate,
        narrative_summary: narrative.narrativeSummary,
        positioning_category: narrative.positioningCategory,
        signature_adjectives: narrative.signatureAdjectives,
        authority_strength_score: narrative.authorityStrengthScore,
        differentiation_signals: narrative.differentiationSignals,
        narrative_shift: narrative.narrativeShift || null,
        emerging_themes: narrative.emergingThemes || null,
        lost_themes: narrative.lostThemes || null,
    }, {
        onConflict: "brand,vertical,snapshot_date"
    });

    if (error) console.error("[SnapshotStore] saveNarrativeSnapshot error:", error);
}

export async function loadCachedNarrative(
    brand: string,
    vertical: Vertical,
    snapshotDate: string
): Promise<NarrativeResult | null> {
    const { data, error } = await supabase
        .from("narrative_snapshots")
        .select("*")
        .eq("brand", brand)
        .eq("vertical", vertical)
        .eq("snapshot_date", snapshotDate)
        .single();

    if (error || !data) return null;

    return {
        brand: data.brand,
        vertical: data.vertical as Vertical,
        snapshotDate: data.snapshot_date,
        narrativeSummary: data.narrative_summary,
        positioningCategory: data.positioning_category,
        signatureAdjectives: data.signature_adjectives || [],
        authorityStrengthScore: data.authority_strength_score,
        differentiationSignals: data.differentiation_signals || [],
        narrativeShift: data.narrative_shift || undefined,
        emergingThemes: data.emerging_themes || undefined,
        lostThemes: data.lost_themes || undefined,
    };
}

export async function loadPreviousNarrative(
    brand: string,
    vertical: Vertical
): Promise<NarrativeResult | null> {
    const { data, error } = await supabase
        .from("narrative_snapshots")
        .select("*")
        .eq("brand", brand)
        .eq("vertical", vertical)
        .order("snapshot_date", { ascending: false })
        .limit(2);

    if (error || !data || data.length < 2) return null;

    const row = data[1]; // second most recent = previous
    return {
        brand: row.brand,
        vertical: row.vertical as Vertical,
        snapshotDate: row.snapshot_date,
        narrativeSummary: row.narrative_summary,
        positioningCategory: row.positioning_category,
        signatureAdjectives: row.signature_adjectives || [],
        authorityStrengthScore: row.authority_strength_score,
        differentiationSignals: row.differentiation_signals || [],
    };
}
