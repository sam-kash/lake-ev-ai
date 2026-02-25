"use client";

import { NarrativeResult } from "@/lib/types";
import { BookOpen, Star, Zap, ArrowUpDown } from "lucide-react";

interface Props {
    narrative: NarrativeResult;
}

export default function NarrativeCard({ narrative }: Props) {
    const authorityColor =
        narrative.authorityStrengthScore >= 70
            ? "#2a9d8f"
            : narrative.authorityStrengthScore >= 40
                ? "#e9c46a"
                : "#e63946";

    return (
        <section className="narrative-card">
            <div className="narrative-header">
                <BookOpen size={18} />
                <h2>AI Narrative Intelligence</h2>
                <span className="nc-category">{narrative.positioningCategory}</span>
            </div>

            <p className="nc-summary">{narrative.narrativeSummary}</p>

            <div className="nc-metrics">
                <div className="nc-authority">
                    <span className="nc-label">Authority Strength</span>
                    <div className="nc-authority-bar">
                        <div
                            className="nc-authority-fill"
                            style={{ width: `${narrative.authorityStrengthScore}%`, background: authorityColor }}
                        />
                    </div>
                    <span className="nc-authority-score" style={{ color: authorityColor }}>
                        {narrative.authorityStrengthScore}/100
                    </span>
                </div>
            </div>

            <div className="nc-adjectives">
                <div className="nc-sub-label">
                    <Star size={13} />
                    <span>Signature Adjectives</span>
                </div>
                <div className="nc-adj-chips">
                    {narrative.signatureAdjectives.length > 0
                        ? narrative.signatureAdjectives.map((adj) => (
                            <span key={adj} className="nc-chip">{adj}</span>
                        ))
                        : <span className="nc-empty">No adjectives extracted yet</span>}
                </div>
            </div>

            <div className="nc-signals">
                <div className="nc-sub-label">
                    <Zap size={13} />
                    <span>Differentiation Signals</span>
                </div>
                <ul className="nc-signal-list">
                    {narrative.differentiationSignals.map((sig, i) => (
                        <li key={i}>{sig}</li>
                    ))}
                </ul>
            </div>

            {narrative.narrativeShift && (
                <div className="nc-drift">
                    <div className="nc-sub-label">
                        <ArrowUpDown size={13} />
                        <span>Narrative Drift</span>
                    </div>
                    <p className="nc-shift">{narrative.narrativeShift}</p>
                    {narrative.emergingThemes && narrative.emergingThemes.length > 0 && (
                        <div className="nc-themes">
                            <span className="nc-themes-label emerging">Emerging:</span>
                            {narrative.emergingThemes.map((t) => (
                                <span key={t} className="nc-chip emerging">{t}</span>
                            ))}
                        </div>
                    )}
                    {narrative.lostThemes && narrative.lostThemes.length > 0 && (
                        <div className="nc-themes">
                            <span className="nc-themes-label lost">Lost:</span>
                            {narrative.lostThemes.map((t) => (
                                <span key={t} className="nc-chip lost">{t}</span>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
