// ============================
// Project Ghost Recon — Prompt Intelligence Engine
// Agent 3: Prompt Intelligence
// ============================

import { Vertical, PromptCatalogEntry, PromptIntentType } from "./types";

// ──────────────────────────────────────────────
// PROMPT CATALOG
// Intent-classified, buying-intent weighted
// ──────────────────────────────────────────────

export const PROMPT_CATALOG: PromptCatalogEntry[] = [
    // Project Management
    { id: "pm-best-01", vertical: "Project Management", prompt: "What is the best project management software in 2026?", intentType: "best", buyingIntentWeight: 0.7, difficultyScore: 85 },
    { id: "pm-ent-01", vertical: "Project Management", prompt: "Best enterprise project management tools for large teams?", intentType: "enterprise", buyingIntentWeight: 0.95, difficultyScore: 90 },
    { id: "pm-cmp-01", vertical: "Project Management", prompt: "Notion vs Asana vs Monday.com comparison 2026", intentType: "comparison", buyingIntentWeight: 0.85, difficultyScore: 88 },
    { id: "pm-bud-01", vertical: "Project Management", prompt: "Best free project management software for startups", intentType: "budget", buyingIntentWeight: 0.5, difficultyScore: 65 },
    { id: "pm-feat-01", vertical: "Project Management", prompt: "Which project management tool has the best Gantt chart?", intentType: "feature-specific", buyingIntentWeight: 0.8, difficultyScore: 70 },

    // CRM
    { id: "crm-best-01", vertical: "CRM", prompt: "What is the best CRM software for sales teams in 2026?", intentType: "best", buyingIntentWeight: 0.75, difficultyScore: 88 },
    { id: "crm-ent-01", vertical: "CRM", prompt: "Best enterprise CRM for Fortune 500 companies", intentType: "enterprise", buyingIntentWeight: 0.95, difficultyScore: 92 },
    { id: "crm-cmp-01", vertical: "CRM", prompt: "Salesforce vs HubSpot vs Pipedrive comparison", intentType: "comparison", buyingIntentWeight: 0.88, difficultyScore: 90 },
    { id: "crm-bud-01", vertical: "CRM", prompt: "Best affordable CRM for small business 2026", intentType: "budget", buyingIntentWeight: 0.55, difficultyScore: 60 },
    { id: "crm-feat-01", vertical: "CRM", prompt: "Which CRM has the best email automation features?", intentType: "feature-specific", buyingIntentWeight: 0.82, difficultyScore: 72 },

    // Cloud Storage
    { id: "cs-best-01", vertical: "Cloud Storage", prompt: "Best cloud storage for business in 2026?", intentType: "best", buyingIntentWeight: 0.65, difficultyScore: 80 },
    { id: "cs-ent-01", vertical: "Cloud Storage", prompt: "Best enterprise cloud storage with compliance features?", intentType: "enterprise", buyingIntentWeight: 0.92, difficultyScore: 88 },
    { id: "cs-cmp-01", vertical: "Cloud Storage", prompt: "Google Drive vs Dropbox vs Box for teams", intentType: "comparison", buyingIntentWeight: 0.78, difficultyScore: 82 },
    { id: "cs-bud-01", vertical: "Cloud Storage", prompt: "Best free cloud storage with large storage limits", intentType: "budget", buyingIntentWeight: 0.40, difficultyScore: 55 },
    { id: "cs-feat-01", vertical: "Cloud Storage", prompt: "Which cloud storage has the best collaboration features?", intentType: "feature-specific", buyingIntentWeight: 0.75, difficultyScore: 68 },

    // AI Writing
    { id: "aw-best-01", vertical: "AI Writing", prompt: "What is the best AI writing tool in 2026?", intentType: "best", buyingIntentWeight: 0.70, difficultyScore: 82 },
    { id: "aw-ent-01", vertical: "AI Writing", prompt: "Best AI writing software for enterprise content teams?", intentType: "enterprise", buyingIntentWeight: 0.90, difficultyScore: 85 },
    { id: "aw-cmp-01", vertical: "AI Writing", prompt: "Jasper vs Copy.ai vs Writesonic comparison", intentType: "comparison", buyingIntentWeight: 0.80, difficultyScore: 80 },
    { id: "aw-bud-01", vertical: "AI Writing", prompt: "Best free AI writing tools for bloggers", intentType: "budget", buyingIntentWeight: 0.45, difficultyScore: 58 },
    { id: "aw-feat-01", vertical: "AI Writing", prompt: "Which AI writing tool supports SEO optimization best?", intentType: "feature-specific", buyingIntentWeight: 0.77, difficultyScore: 66 },

    // Design Tools
    { id: "dt-best-01", vertical: "Design Tools", prompt: "Best AI-powered design tools for teams in 2026?", intentType: "best", buyingIntentWeight: 0.68, difficultyScore: 78 },
    { id: "dt-ent-01", vertical: "Design Tools", prompt: "Best enterprise design software for product teams?", intentType: "enterprise", buyingIntentWeight: 0.88, difficultyScore: 84 },
    { id: "dt-cmp-01", vertical: "Design Tools", prompt: "Figma vs Canva vs Adobe XD comparison 2026", intentType: "comparison", buyingIntentWeight: 0.82, difficultyScore: 86 },
    { id: "dt-bud-01", vertical: "Design Tools", prompt: "Best free design tools for startups and freelancers", intentType: "budget", buyingIntentWeight: 0.42, difficultyScore: 58 },
    { id: "dt-feat-01", vertical: "Design Tools", prompt: "Which design tool has the best prototyping features?", intentType: "feature-specific", buyingIntentWeight: 0.79, difficultyScore: 70 },
];

// ──────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────

/**
 * Get prompts filtered by vertical and/or intentType
 */
export function getPrompts(
    vertical?: Vertical,
    intentType?: PromptIntentType
): PromptCatalogEntry[] {
    return PROMPT_CATALOG.filter((p) => {
        if (vertical && p.vertical !== vertical) return false;
        if (intentType && p.intentType !== intentType) return false;
        return true;
    });
}

/**
 * Compute the average buying intent weight across prompts for a vertical
 */
export function getAverageIntentWeight(vertical: Vertical): number {
    const prompts = getPrompts(vertical);
    if (prompts.length === 0) return 1;
    return prompts.reduce((sum, p) => sum + p.buyingIntentWeight, 0) / prompts.length;
}

/**
 * WeightedAVS = AVS × averageIntentWeight for the vertical
 * Enterprise prompts inflate the score; budget prompts deflate it.
 * This ensures enterprise-heavy verticals carry heavier scoring weight.
 */
export function getWeightedAVS(avs: number, vertical: Vertical): number {
    const weight = getAverageIntentWeight(vertical);
    return Math.round(Math.min(100, avs * weight));
}

/**
 * Get all unique verticals from the catalog
 */
export function getCatalogVerticals(): Vertical[] {
    return [...new Set(PROMPT_CATALOG.map((p) => p.vertical))];
}
