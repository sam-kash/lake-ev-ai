// ============================
// Project Ghost Recon — Types
// AI Recommendation Intelligence Platform
// ============================

export type LLMSource = "ChatGPT" | "Perplexity" | "Gemini";
export type Sentiment = "Positive" | "Neutral" | "Negative";
export type Vertical =
  | "Project Management"
  | "CRM"
  | "Cloud Storage"
  | "AI Writing"
  | "Design Tools";

export type PromptIntentType =
  | "best"
  | "comparison"
  | "enterprise"
  | "budget"
  | "feature-specific";

// ──────────────────────────────────────────────
// RAW DATA
// ──────────────────────────────────────────────

export interface BrandMention {
  id: string;
  brand: string;
  vertical: Vertical;
  llm: LLMSource;
  rank: number; // 1-based position
  citedReason: string;
  date: string; // ISO date
  sentiment: Sentiment;
}

// ──────────────────────────────────────────────
// AVS BREAKDOWN per LLM
// ──────────────────────────────────────────────

export interface LLMAVSBreakdown {
  chatgpt: number;
  gemini: number;
  perplexity: number;
}

// ──────────────────────────────────────────────
// BRAND SCORE (replaces old BrandScore)
// ──────────────────────────────────────────────

export interface BrandScore {
  brand: string;
  vertical: Vertical;

  // Core AVS metric (replaces preferenceScore)
  avs: number; // 0–100, flat AVS
  weightedAvs: number; // 0–100, intent-weighted AVS

  // Trend
  avsDelta: number; // change vs. previous snapshot (positive = improving)

  // Decomposed AVS components (for ScoreBreakdown UI)
  avsComponents: {
    frequencyScore: number;   // 0–100
    positionScore: number;    // 0–100
    sentimentScore: number;   // 0–100
    crossLLMScore: number;    // 0–100
  };

  // LLM-specific AVS
  avsBreakdown: LLMAVSBreakdown;

  // Tracked Share of Voice (within tracked brand set for the vertical)
  tsov: number; // 0–100 (sums to 100 across all tracked brands in vertical)

  // Raw metrics
  frequency: number;
  avgRank: number;
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  llmCoverage: LLMSource[];

  // Historical trend (AVS over last N snapshots)
  trend: number[];

  // Legacy flags
  isRecurringWinner: boolean;
  isEmergingBrand: boolean;
  topCitedReason: string;

  // Narrative (populated after narrative engine runs)
  narrativeSummary?: string;
  authorityStrengthScore?: number; // 0–100
  signatureAdjectives?: string[];
  differentiationSignals?: string[];
}

// ──────────────────────────────────────────────
// PROMPT CATALOG
// ──────────────────────────────────────────────

export interface PromptCatalogEntry {
  id: string;
  vertical: Vertical;
  prompt: string;
  intentType: PromptIntentType;
  buyingIntentWeight: number; // 0–1 (1 = highest purchase intent)
  difficultyScore: number;    // 0–100 (how competitive this prompt is)
  lastQueried?: string;       // ISO date
}

// ──────────────────────────────────────────────
// AVS SNAPSHOT (persisted per brand/vertical/date)
// ──────────────────────────────────────────────

export interface AVSSnapshot {
  brand: string;
  vertical: Vertical;
  snapshotDate: string; // ISO date
  avs: number;
  weightedAvs: number;
  tsov: number;
  avsBreakdown: LLMAVSBreakdown;
  frequency: number;
  avgRank: number;
}

// ──────────────────────────────────────────────
// DAILY SNAPSHOT (legacy, retained for trend charts)
// ──────────────────────────────────────────────

export interface DailySnapshot {
  date: string;
  brandScores: Record<string, number>;
}

// ──────────────────────────────────────────────
// NARRATIVE
// ──────────────────────────────────────────────

export interface NarrativeResult {
  brand: string;
  vertical: Vertical;
  snapshotDate: string;
  narrativeSummary: string;
  positioningCategory: string;
  signatureAdjectives: string[];
  authorityStrengthScore: number; // 0–100
  differentiationSignals: string[];
  // Drift (populated when previous narrative exists)
  narrativeShift?: string;
  emergingThemes?: string[];
  lostThemes?: string[];
}

// ──────────────────────────────────────────────
// GAP ANALYSIS
// ──────────────────────────────────────────────

export interface GapAnalysis {
  brandA: string;
  brandB: string;
  vertical: Vertical;
  computedAt: string; // ISO timestamp
  avsDifference: number;       // brandA.avs - brandB.avs (negative = losing)
  sovDifference: number;       // brandA.tsov - brandB.tsov
  sentimentGap: number;        // % positive (brandA) - % positive (brandB)
  promptClustersCompetitorDominates: string[]; // intent types where brandB leads
  llmsCompetitorLeads: LLMSource[];            // LLMs where brandB avs > brandA avs
  narrativeAdjectiveComparison: {
    brandA: string[];
    brandB: string[];
  };
  summary: string; // "Why Competitor X Is Beating You" — Gemini generated
}

// ──────────────────────────────────────────────
// AUDIT REPORT
// ──────────────────────────────────────────────

export interface AuditReport {
  brand: string;
  vertical: Vertical;
  generatedAt: string; // ISO timestamp
  executiveSummary: string;
  avs: number;
  weightedAvs: number;
  avsDelta: number;
  tsov: number;
  avsBreakdown: LLMAVSBreakdown;
  narrative: NarrativeResult;
  topCompetitorGap: GapAnalysis | null;
  recommendations: string[]; // Gemini-generated strategic recommendations
  authorityStrengthScore: number;
}

// ──────────────────────────────────────────────
// PROMPT MATRIX (unchanged from V1)
// ──────────────────────────────────────────────

export interface PromptMatrixCell {
  prompt: string;
  vertical: Vertical;
  llm: LLMSource;
  topBrand: string;
  rank1Brand: string;
}
