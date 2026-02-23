import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Load environment variables
config();

// Note: Ensure you set SUPABASE_URL and SUPABASE_ANON_KEY in your .env
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseKey);

import promptsData from "../data/prompts.json" assert { type: "json" };

/**
 * Task for the Antigravity Browser Agent:
 * 1. Navigate to https://chatgpt.com, https://perplexity.ai, and https://gemini.google.com
 * 2. For each vertical, submit the corresponding prompt from data/prompts.json.
 * 3. Extract the text of the AI response for each.
 * 4. Record a 10s Screen Capture WebP video per LLM for the 'Agentic Health' dashboard.
 * 5. Save the raw text to Supabase.
 */

async function main() {
    console.log("Starting Scraping Agent Pipeline...");

    if (!supabaseUrl || !supabaseKey) {
        console.warn("Supabase credentials not found. Ensure SUPABASE_URL and SUPABASE_ANON_KEY are set.");
    }

    for (const item of promptsData) {
        const { vertical, prompt } = item;
        console.log(`\nVertical: ${vertical}`);
        console.log(`Prompt: ${prompt}\n`);

        // =========================================================================
        // 🧠 INSTRUCTION FOR ANTIGRAVITY BROWSER SUB-AGENT
        // =========================================================================
        // The browser sub-agent needs to perform the following for each LLM:
        // 
        // const llms = ["ChatGPT", "Perplexity", "Gemini"];
        // 
        // for (const llm of llms) {
        //   1. Open browser to the LLM URL.
        //   2. Type `prompt` into the chat input.
        //   3. Submit and wait for generating to finish.
        //   4. Scrape the full text of the response.
        //   5. (Important) Generate a WebP Browser Recording named `${llm}_${vertical}_recording`.
        //   
        //   // Store output:
        //   /*
        //   await supabase.from("raw_logs").insert({
        //     vertical,
        //     llm,
        //     raw_response: simulatedResponseText
        //   });
        //   */
        // }
        // =========================================================================

        console.log(`[Agent task queued] Prompt ready for ${vertical}.`);

        /**
         * Note: In a live execution, this script calls the Antigravity Browser Sub-agent
         * using the `browser_subagent` tool to run the above steps headlessly.
         */
    }

    console.log("\nScraping pipeline configured. Ready to dispatch browser sub-agent.");
}

main().catch(console.error);
