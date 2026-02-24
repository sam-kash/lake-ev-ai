import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { brandMentions } from "./seed-utf8";

config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log("Seeding database with live intel...");
    const { error } = await supabase.from('brand_rankings').insert(
        brandMentions.map(m => ({
            id: m.id,
            vertical: m.vertical,
            llm: m.llm,
            brand: m.brand,
            rank: m.rank,
            cited_reason: m.citedReason,
            date: m.date,
            sentiment: m.sentiment
        }))
    );

    if (error) {
        console.error("Error inserting data:", error);
    } else {
        console.log("Successfully seeded brand_rankings.");
    }
}

main().catch(console.error);
