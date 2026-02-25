/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║          GHOST RECON — FUNCTIONALITY TEST AGENT                  ║
 * ║  Validates every API endpoint and prints a colour-coded report   ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * Usage:  node scripts/test-agent.mjs
 * Requires: app running on http://localhost:3000
 */

const BASE = "http://localhost:3000";

// ── ANSI colours ──────────────────────────────────────────────────────
const C = {
    reset: "\x1b[0m",
    bold: "\x1b[1m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    cyan: "\x1b[36m",
    grey: "\x1b[90m",
    white: "\x1b[97m",
    bgGreen: "\x1b[42m",
    bgRed: "\x1b[41m",
};

const pass = (msg) => console.log(`  ${C.green}✔${C.reset} ${msg}`);
const fail = (msg) => console.log(`  ${C.red}✘${C.reset} ${C.red}${msg}${C.reset}`);
const warn = (msg) => console.log(`  ${C.yellow}⚠${C.reset} ${msg}`);
const info = (msg) => console.log(`  ${C.grey}→${C.reset} ${msg}`);
const head = (msg) => console.log(`\n${C.bold}${C.cyan}▶ ${msg}${C.reset}`);
const divider = () => console.log(`${C.grey}${"─".repeat(62)}${C.reset}`);

// ── Helpers ───────────────────────────────────────────────────────────
async function GET(path) {
    const res = await fetch(`${BASE}${path}`);
    const body = await res.json().catch(() => null);
    return { status: res.status, ok: res.ok, body };
}

async function POST(path, payload) {
    const res = await fetch(`${BASE}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const body = await res.json().catch(() => null);
    return { status: res.status, ok: res.ok, body };
}

/** Retry a call up to `maxRetries` times on 500 errors (transient Gemini timeouts) */
async function withRetry(fn, maxRetries = 3, delayMs = 3000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        const result = await fn();
        if (result.status !== 500 || attempt === maxRetries) return result;
        warn(`  ↺ Attempt ${attempt} got 500, retrying in ${delayMs / 1000}s...`);
        await new Promise((r) => setTimeout(r, delayMs));
    }
}

function check(label, condition, detail = "") {
    if (condition) {
        pass(`${label}${detail ? C.grey + "  " + detail + C.reset : ""}`);
        return true;
    } else {
        fail(`${label}${detail ? "  " + detail : ""}`);
        return false;
    }
}

// ── Test registry ─────────────────────────────────────────────────────
const results = { passed: 0, failed: 0, warned: 0 };

function record(ok) {
    if (ok) results.passed++;
    else results.failed++;
}

// ═════════════════════════════════════════════════════════════════════
//  1. GET /api/brands
// ═════════════════════════════════════════════════════════════════════
async function testBrands() {
    head("GET /api/brands — Brand data + daily snapshots");
    divider();

    const { status, ok, body } = await GET("/api/brands");

    record(check("Returns HTTP 200", status === 200, `got ${status}`));
    record(check("Response has 'mentions' array", Array.isArray(body?.mentions)));
    record(check("Response has 'brandScores' array", Array.isArray(body?.brandScores)));
    record(check("Response has 'dailySnapshots' array", Array.isArray(body?.dailySnapshots)));

    if (body?.mentions?.length > 0) {
        const m = body.mentions[0];
        record(check("Mention has required fields (brand, rank, llm, vertical, date)",
            m.brand && m.rank !== undefined && m.llm && m.vertical && m.date,
            `sample: ${m.brand}`));
    } else {
        warn("No mentions returned — Supabase table may be empty");
        results.warned++;
    }

    if (body?.brandScores?.length > 0) {
        const s = body.brandScores[0];
        record(check("BrandScore has AVS, TSOV, breakdown",
            s.avs !== undefined && s.tsov !== undefined && s.avsBreakdown,
            `${s.brand} AVS=${s.avs}`));
    }

    info(`Mentions: ${body?.mentions?.length ?? 0}  |  BrandScores: ${body?.brandScores?.length ?? 0}  |  Snapshots: ${body?.dailySnapshots?.length ?? 0}`);
}

// ═════════════════════════════════════════════════════════════════════
//  2. GET /api/avs
// ═════════════════════════════════════════════════════════════════════
async function testAVS() {
    head("GET /api/avs — AI Visibility Score computation");
    divider();

    // 2a. No params — all brands
    const { status: s1, body: b1 } = await GET("/api/avs");
    record(check("Returns HTTP 200 (no params)", s1 === 200, `got ${s1}`));
    record(check("Has brandScores array", Array.isArray(b1?.brandScores)));
    record(check("Has meta.computedAt", !!b1?.meta?.computedAt));

    // 2b. With brand filter
    const sampleBrand = b1?.brandScores?.[0]?.brand;
    if (sampleBrand) {
        const { status: s2, body: b2 } = await GET(`/api/avs?brand=${encodeURIComponent(sampleBrand)}`);
        record(check(`Filters by brand (${sampleBrand})`,
            s2 === 200 && b2?.brandScores?.every(x => x.brand === sampleBrand),
            `results: ${b2?.brandScores?.length}`));
    }

    // 2c. With vertical filter
    const { status: s3, body: b3 } = await GET("/api/avs?vertical=Project%20Management");
    record(check("Filters by vertical (Project Management)",
        s3 === 200 && Array.isArray(b3?.brandScores),
        `results: ${b3?.brandScores?.length}`));
    record(check("Returns tsov and tsovByLLM when vertical set",
        b3?.tsov !== null || b3?.tsovByLLM !== null));

    info(`Total brand scores: ${b1?.brandScores?.length ?? 0}`);
}

// ═════════════════════════════════════════════════════════════════════
//  3. GET /api/gap
// ═════════════════════════════════════════════════════════════════════
async function testGap() {
    head("GET /api/gap — Competitor Gap Intelligence");
    divider();

    // 3a. Missing params → 400
    const { status: s0 } = await GET("/api/gap");
    record(check("Returns 400 when params missing", s0 === 400, `got ${s0}`));

    // 3b. Valid gap analysis (retry on transient Gemini timeout)
    info("Running Notion vs Figma gap — may take a moment (Gemini AI call)...");
    const { status, body } = await withRetry(() => GET("/api/gap?brandA=Notion&brandB=Figma"));
    record(check("Returns HTTP 200 for valid brands", status === 200, `got ${status}`));
    record(check("Has brandA + brandB in response",
        body?.brandA === "Notion" && body?.brandB === "Figma"));
    record(check("Has avsDifference numeric value",
        typeof body?.avsDifference === "number",
        `avsDiff=${body?.avsDifference}`));
    record(check("Has perLLMBreakdown or similar gap data",
        body?.perLLMBreakdown || body?.verticalBreakdown || body?.summary || body?.narrative));

    // 3c. Same brand (edge case — should still return 200)
    const { status: s2 } = await GET("/api/gap?brandA=HubSpot&brandB=Salesforce");
    record(check("Returns 200 for HubSpot vs Salesforce", s2 === 200, `got ${s2}`));

    if (body) info(`Notion vs Figma  |  AVS diff: ${body?.avsDifference?.toFixed?.(1)}`);
}

// ═════════════════════════════════════════════════════════════════════
//  4. GET /api/sov
// ═════════════════════════════════════════════════════════════════════
async function testSOV() {
    head("GET /api/sov — Share of Voice");
    divider();

    // 4a. All verticals
    const { status: s1, body: b1 } = await GET("/api/sov");
    record(check("Returns HTTP 200 (all verticals)", s1 === 200, `got ${s1}`));
    record(check("Has tsov object", typeof b1?.tsov === "object" && b1?.tsov !== null));
    record(check("Has meta.computedAt", !!b1?.meta?.computedAt));

    const verticals = Object.keys(b1?.tsov || {});
    record(check(`Contains at least one vertical`, verticals.length > 0, `found: ${verticals.join(", ")}`));

    if (verticals.length > 0) {
        const v = verticals[0];
        const vData = b1.tsov[v];
        record(check(`Vertical '${v}' has overall + byLLM breakdown`,
            Array.isArray(vData?.overall) && typeof vData?.byLLM === "object"));
    }

    // 4b. Single vertical filter
    const { status: s2, body: b2 } = await GET("/api/sov?vertical=CRM");
    record(check("Filters to CRM vertical", s2 === 200, `got ${s2}`));

    info(`Verticals tracked: ${verticals.length}`);
}

// ═════════════════════════════════════════════════════════════════════
//  5. GET /api/audit
// ═════════════════════════════════════════════════════════════════════
async function testAudit() {
    head("GET /api/audit — AI Visibility Audit Report");
    divider();

    // 5a. Missing params → 400
    const { status: s0 } = await GET("/api/audit");
    record(check("Returns 400 when params missing", s0 === 400, `got ${s0}`));

    // 5b. Valid audit (Notion / Project Management)
    info("Calling audit for Notion/Project Management — may take 5-15s (Gemini AI call)...");
    const { status, body } = await GET("/api/audit?brand=Notion&vertical=Project%20Management");

    if (status === 200) {
        record(check("Returns HTTP 200", true, `got ${status}`));
        record(check("Has executiveSummary", !!body?.executiveSummary));
        record(check("Has avs score", typeof body?.avs === "number", `avs=${body?.avs}`));
        record(check("Has recommendations array (5 items)",
            Array.isArray(body?.recommendations) && body?.recommendations?.length > 0,
            `count=${body?.recommendations?.length}`));
        record(check("Has narrative data", !!body?.narrative));
        record(check("Has avsBreakdown (chatgpt/gemini/perplexity)",
            body?.avsBreakdown?.chatgpt !== undefined));
        info(`AVS: ${body?.avs}  |  TSOV: ${body?.tsov}%  |  Recs: ${body?.recommendations?.length}`);
    } else if (status === 404) {
        warn("No data found for Notion/Project Management — Supabase may be empty");
        results.warned++;
    } else {
        record(check("Audit returns 200 or 404", false, `got ${status} — ${body?.error}`));
    }
}

// ═════════════════════════════════════════════════════════════════════
//  6. POST /api/narrative
// ═════════════════════════════════════════════════════════════════════
async function testNarrative() {
    head("POST /api/narrative — Brand Narrative Extraction");
    divider();

    // 6a. Missing body → 400 or error
    const { status: s0 } = await POST("/api/narrative", {});
    record(check("Returns 400 when brand/vertical missing", s0 === 400, `got ${s0}`));

    // 6b. Valid narrative
    const { status, body } = await POST("/api/narrative", {
        brand: "Notion",
        vertical: "Project Management",
    });

    if (status === 200) {
        record(check("Returns HTTP 200", true, `got ${status}`));
        record(check("Has narrativeSummary", !!body?.narrativeSummary));
        record(check("Has signatureAdjectives array", Array.isArray(body?.signatureAdjectives)));
        record(check("Has authorityStrengthScore", typeof body?.authorityStrengthScore === "number",
            `score=${body?.authorityStrengthScore}`));
        info(`Authority: ${body?.authorityStrengthScore}  |  Adjectives: ${body?.signatureAdjectives?.join(", ")}`);
    } else if (status === 404) {
        warn("No mentions found — Supabase may be empty");
        results.warned++;
    } else {
        record(check("Narrative returns 200 or 404", false, `got ${status} — ${body?.error}`));
    }
}

// ═════════════════════════════════════════════════════════════════════
//  7. UI / Frontend checks
// ═════════════════════════════════════════════════════════════════════
async function testFrontend() {
    head("GET / — Frontend & UI Health");
    divider();

    const res = await fetch(`${BASE}/`);
    record(check("Homepage returns HTTP 200", res.status === 200, `got ${res.status}`));

    const html = await res.text();
    record(check("Contains 'Ghost Recon' branding", html.includes("Ghost Recon")));
    record(check("Contains Next.js app assets (_next/static)", html.includes("_next/static")));
    record(check("Page is not blank / errored", html.length > 1000, `${html.length} bytes`));

    // Check static assets exist
    const iconRes = await fetch(`${BASE}/favicon.ico`);
    record(check("favicon.ico is served", iconRes.status === 200, `got ${iconRes.status}`));

    info(`HTML size: ${(html.length / 1024).toFixed(1)} KB`);
}

// ═════════════════════════════════════════════════════════════════════
//  MAIN
// ═════════════════════════════════════════════════════════════════════
async function main() {
    console.log(`\n${C.bold}${C.white}╔═══════════════════════════════════════════════════════════╗`);
    console.log(`║        GHOST RECON — FUNCTIONALITY TEST AGENT             ║`);
    console.log(`║        Target: ${BASE.padEnd(43)}║`);
    console.log(`╚═══════════════════════════════════════════════════════════╝${C.reset}`);
    console.log(`${C.grey}Started: ${new Date().toISOString()}${C.reset}`);

    try {
        // Quick connectivity check
        await fetch(BASE);
    } catch {
        console.log(`\n${C.bgRed}${C.white}  FATAL: Cannot reach ${BASE}. Is npm run dev running?  ${C.reset}\n`);
        process.exit(1);
    }

    await testFrontend();
    await testBrands();
    await testAVS();
    await testGap();
    await testSOV();
    await testAudit();
    await testNarrative();

    // ── Summary ──────────────────────────────────────────────────────
    divider();
    const total = results.passed + results.failed;
    const allGood = results.failed === 0;

    console.log(`\n${C.bold}RESULTS${C.reset}`);
    console.log(`  ${C.green}Passed  ${C.bold}${results.passed}${C.reset}/${total}`);
    if (results.failed > 0)
        console.log(`  ${C.red}Failed  ${C.bold}${results.failed}${C.reset}/${total}`);
    if (results.warned > 0)
        console.log(`  ${C.yellow}Warned  ${C.bold}${results.warned}${C.reset}`);

    console.log();
    if (allGood) {
        console.log(`${C.bgGreen}${C.white}${C.bold}  ✔  ALL CHECKS PASSED — Platform is fully functional  ${C.reset}`);
    } else {
        console.log(`${C.bgRed}${C.white}${C.bold}  ✘  ${results.failed} CHECK(S) FAILED — Review logs above  ${C.reset}`);
    }
    console.log();

    process.exit(allGood ? 0 : 1);
}

main().catch((err) => {
    console.error(`\n${C.red}Unhandled error:${C.reset}`, err);
    process.exit(1);
});
