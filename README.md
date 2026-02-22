# LAKE-ev-ai

## Mission Accomplished

Built a fully functional **AI Recommendation Pattern Tracker** dashboard that monitors and visualizes how ChatGPT, Perplexity, and Gemini recommend brands across 5 industry verticals.

---

## What Was Built

### Architecture
| Layer | Files | Description |
|---|---|---|
| **Types** | [src/lib/types.ts](file:///e:/Projects/ai-add-researcher/src/lib/types.ts) | TypeScript interfaces for all data models |
| **Data** | [src/lib/data.ts](file:///e:/Projects/ai-add-researcher/src/lib/data.ts) | 75+ brand mentions across 5 verticals × 3 LLMs + 7-day historical trends |
| **Analysis** | [src/lib/analysis.ts](file:///e:/Projects/ai-add-researcher/src/lib/analysis.ts) | Preference Score algorithm, recurring winners, emerging brands, prompt matrix |
| **API** | [src/app/api/brands/route.ts](file:///e:/Projects/ai-add-researcher/src/app/api/brands/route.ts) | REST endpoint returning all analyzed data |
| **Components** | 8 components | Dashboard, BrandOfTheDay, Leaderboard, TrendChart, PromptMatrix, ScoreBreakdown, StatsBar, GlassCard, AnimatedCounter |
| **Prompt Bank** | [data/prompts.json](file:///e:/Projects/ai-add-researcher/data/prompts.json) | 10 prompts across 5 verticals |

### Preference Score Formula
```
Score = (frequency × 0.6) + (rankScore × 0.25) + (sentimentBonus × 0.15)
```

---

## Dashboard Screenshots

### Top Fold — Header, Stats & Brand of the Day
![Ghost Recon Dashboard - Top Fold](C:/Users/kashy/.gemini/antigravity/brain/6c584698-2294-4faf-b6ad-accf2831b645/dashboard_top_fold_1771789273460.png)

### Mid Section — Leaderboard & Prompt Matrix
![Ghost Recon Dashboard - Leaderboard](C:/Users/kashy/.gemini/antigravity/brain/6c584698-2294-4faf-b6ad-accf2831b645/dashboard_bottom_fold_1771789275356.png)

### Bottom — Score Breakdown & Emerging Brands
![Ghost Recon Dashboard - Score Breakdown](C:/Users/kashy/.gemini/antigravity/brain/6c584698-2294-4faf-b6ad-accf2831b645/dashboard_bottom_sections_1771789389898.png)

---

## Live Recording

![Dashboard walkthrough recording](C:/Users/kashy/.gemini/antigravity/brain/6c584698-2294-4faf-b6ad-accf2831b645/dashboard_full_scroll_1771789308577.webp)

---

## Key Features

- **Brand of the Day**: Figma leads with a perfect 100 Preference Score — unanimously ranked #1 across all 3 LLMs in Design Tools
- **Sortable Leaderboard** with vertical filtering (Project, CRM, Cloud, AI, Design)
- **Interactive Trend Chart** with hover-to-highlight for 6 top brands over 7 days
- **Prompt Matrix** showing which brand each LLM ranks #1 per vertical — 👑 emoji for unanimous picks
- **Score Breakdown** with sentiment bars (Positive / Neutral / Negative)
- **Emerging Brands** section surfacing niche players (Linear, Attio, Penpot, Tresorit, Spline)

## Verification Results

| Check | Result |
|---|---|
| Dev server startup | ✅ Ready in 1411ms |
| No compilation errors | ✅ Clean build |
| All 8 dashboard sections render | ✅ Verified in browser |
| Animations working | ✅ Counters, hover effects, pulse glow |
| Dark glassmorphism theme | ✅ Fully styled |
| API route `/api/brands` | ✅ Returns full JSON payload |

## Running Locally

```bash
cd e:\Projects\ai-add-researcher
npm run dev
# Open http://localhost:3000
```
