// ============================
// Project Ghost Recon — Types
// ============================

export type LLMSource = "ChatGPT" | "Perplexity" | "Gemini";
export type Sentiment = "Positive" | "Neutral" | "Negative";
export type Vertical =
  | "Project Management"
  | "CRM"
  | "Cloud Storage"
  | "AI Writing"
  | "Design Tools";

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

export interface BrandScore {
  brand: string;
  vertical: Vertical;
  preferenceScore: number; // 0–100
  frequency: number; // total mentions
  avgRank: number; // average rank position
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  llmCoverage: LLMSource[]; // which LLMs mention this brand
  trend: number[]; // score over last 7 data points
  isRecurringWinner: boolean;
  isEmergingBrand: boolean;
  topCitedReason: string;
}

export interface PromptEntry {
  id: string;
  vertical: Vertical;
  prompt: string;
  lastQueried: string;
}

export interface DailySnapshot {
  date: string;
  brandScores: Record<string, number>;
}

export interface PromptMatrixCell {
  prompt: string;
  vertical: Vertical;
  llm: LLMSource;
  topBrand: string;
  rank1Brand: string;
}
