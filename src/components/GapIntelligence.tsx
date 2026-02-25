"use client";

import { useState } from "react";
import { GapAnalysis, LLMSource, Vertical } from "@/lib/types";
import { AlertTriangle, TrendingUp, TrendingDown, Minus } from "lucide-react";

const VERTICALS: Vertical[] = [
    "Project Management", "CRM", "Cloud Storage", "AI Writing", "Design Tools",
];

const BRANDS_BY_VERTICAL: Record<Vertical, string[]> = {
    "Project Management": ["Notion", "Asana", "Monday.com", "ClickUp", "Jira"],
    "CRM": ["Salesforce", "HubSpot", "Pipedrive", "Zoho CRM", "Freshsales"],
    "Cloud Storage": ["Google Drive", "Dropbox", "Box", "OneDrive", "pCloud"],
    "AI Writing": ["Jasper", "Copy.ai", "Writesonic", "Rytr", "Anyword"],
    "Design Tools": ["Figma", "Canva", "Adobe XD", "Sketch", "Framer"],
};

export default function GapIntelligence() {
    const [vertical, setVertical] = useState<Vertical>("Project Management");
    const [brandA, setBrandA] = useState("Notion");
    const [brandB, setBrandB] = useState("Asana");
    const [loading, setLoading] = useState(false);
    const [gap, setGap] = useState<GapAnalysis | null>(null);
    const [error, setError] = useState<string | null>(null);

    const brands = BRANDS_BY_VERTICAL[vertical];

    async function runGapAnalysis() {
        if (brandA === brandB) {
            setError("Select two different brands to compare.");
            return;
        }
        setLoading(true);
        setGap(null);
        setError(null);
        try {
            const res = await fetch(
                `/api/gap?brandA=${encodeURIComponent(brandA)}&brandB=${encodeURIComponent(brandB)}`
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Gap analysis failed");
            setGap(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="gap-intelligence">
            <div className="gap-header">
                <AlertTriangle size={18} className="gap-icon" />
                <h2>Competitor Gap Intelligence</h2>
                <span className="gap-tag">Revenue Critical</span>
            </div>

            <div className="gap-controls">
                <div className="gap-field">
                    <label>Vertical</label>
                    <select value={vertical} onChange={(e) => { setVertical(e.target.value as Vertical); setBrandA(BRANDS_BY_VERTICAL[e.target.value as Vertical][0]); setBrandB(BRANDS_BY_VERTICAL[e.target.value as Vertical][1]); }}>
                        {VERTICALS.map((v) => <option key={v}>{v}</option>)}
                    </select>
                </div>
                <div className="gap-field">
                    <label>Your Brand</label>
                    <select value={brandA} onChange={(e) => setBrandA(e.target.value)}>
                        {brands.map((b) => <option key={b}>{b}</option>)}
                    </select>
                </div>
                <div className="gap-vs">vs</div>
                <div className="gap-field">
                    <label>Competitor</label>
                    <select value={brandB} onChange={(e) => setBrandB(e.target.value)}>
                        {brands.map((b) => <option key={b}>{b}</option>)}
                    </select>
                </div>
                <button className="gap-run-btn" onClick={runGapAnalysis} disabled={loading}>
                    {loading ? "Analyzing..." : "Run Gap Analysis"}
                </button>
            </div>

            {error && <div className="gap-error">{error}</div>}

            {gap && (
                <div className="gap-results">
                    <div className="gap-metrics">
                        <GapMetric
                            label="AVS Gap"
                            value={gap.avsDifference}
                            isDelta
                            suffix=" pts"
                            positive="you lead"
                            negative="you're behind"
                        />
                        <GapMetric
                            label="Share of Voice Gap"
                            value={gap.sovDifference}
                            isDelta
                            suffix="%"
                            positive="you lead"
                            negative="you're behind"
                        />
                        <GapMetric
                            label="Sentiment Gap"
                            value={gap.sentimentGap}
                            isDelta
                            suffix="%"
                            positive="better sentiment"
                            negative="worse sentiment"
                        />
                    </div>

                    {gap.llmsCompetitorLeads.length > 0 && (
                        <div className="gap-losing-llms">
                            <span className="gap-label">LLMs where {gap.brandB} leads:</span>
                            {gap.llmsCompetitorLeads.map((llm) => (
                                <span key={llm} className="llm-badge losing">{llm}</span>
                            ))}
                        </div>
                    )}

                    {gap.narrativeAdjectiveComparison && (
                        <div className="gap-adj-comparison">
                            <div className="adj-col">
                                <span className="adj-brand-label">{gap.brandA}</span>
                                <div className="adj-chips">
                                    {gap.narrativeAdjectiveComparison.brandA.map((a) => (
                                        <span key={a} className="adj-chip you">{a}</span>
                                    ))}
                                    {gap.narrativeAdjectiveComparison.brandA.length === 0 && <span className="adj-empty">No signals</span>}
                                </div>
                            </div>
                            <div className="adj-col">
                                <span className="adj-brand-label">{gap.brandB}</span>
                                <div className="adj-chips">
                                    {gap.narrativeAdjectiveComparison.brandB.map((a) => (
                                        <span key={a} className="adj-chip competitor">{a}</span>
                                    ))}
                                    {gap.narrativeAdjectiveComparison.brandB.length === 0 && <span className="adj-empty">No signals</span>}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="gap-summary">
                        <h4>Analysis</h4>
                        <p>{gap.summary}</p>
                    </div>
                </div>
            )}
        </section>
    );
}

function GapMetric({
    label, value, isDelta, suffix, positive, negative,
}: {
    label: string;
    value: number;
    isDelta?: boolean;
    suffix?: string;
    positive?: string;
    negative?: string;
}) {
    const isUp = value >= 0;
    const Icon = isDelta ? (value === 0 ? Minus : isUp ? TrendingUp : TrendingDown) : Minus;
    return (
        <div className={`gap-metric ${isDelta ? (isUp ? "positive" : "negative") : ""}`}>
            <span className="gm-label">{label}</span>
            <div className="gm-value">
                <Icon size={16} />
                <span>{isUp && isDelta ? "+" : ""}{Math.round(value * 10) / 10}{suffix}</span>
            </div>
            <span className="gm-sub">{isDelta ? (isUp ? positive : negative) : ""}</span>
        </div>
    );
}
