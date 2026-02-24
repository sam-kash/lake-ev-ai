import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseKey);

const today = new Date().toISOString().split('T')[0];

const liveData = [
    // ChatGPT Real Data
    { id: `live-pm-cg-1`, vertical: "Project Management", llm: "ChatGPT", brand: "Monday.com", rank: 1, cited_reason: "Highly customizable with strong integration support and multiple views", date: today, sentiment: "Positive" },
    { id: `live-pm-cg-2`, vertical: "Project Management", llm: "ChatGPT", brand: "Asana", rank: 2, cited_reason: "User-friendly interface and robust task tracking", date: today, sentiment: "Positive" },
    { id: `live-pm-cg-3`, vertical: "Project Management", llm: "ChatGPT", brand: "ClickUp", rank: 3, cited_reason: "Wide array of built-in tools for document management and goals", date: today, sentiment: "Positive" },
    { id: `live-pm-cg-4`, vertical: "Project Management", llm: "ChatGPT", brand: "Notion", rank: 4, cited_reason: "Flexible workspace combining notes, databases, and project tracking", date: today, sentiment: "Positive" },
    { id: `live-pm-cg-5`, vertical: "Project Management", llm: "ChatGPT", brand: "Trello", rank: 5, cited_reason: "Go-to for visual Kanban boards, ideal for small teams", date: today, sentiment: "Positive" },

    // Perplexity Real Data
    { id: `live-pm-px-1`, vertical: "Project Management", llm: "Perplexity", brand: "ClickUp", rank: 1, cited_reason: "Ranked Best Overall due to highly customizable views and all-in-one design", date: today, sentiment: "Positive" },
    { id: `live-pm-px-2`, vertical: "Project Management", llm: "Perplexity", brand: "monday.com", rank: 2, cited_reason: "Visual boards, quick setup, and strong adoption among SMBs", date: today, sentiment: "Positive" },
    { id: `live-pm-px-3`, vertical: "Project Management", llm: "Perplexity", brand: "Jira", rank: 3, cited_reason: "Favorite for software developers, specializing in Agile issue tracking", date: today, sentiment: "Positive" },
    { id: `live-pm-px-4`, vertical: "Project Management", llm: "Perplexity", brand: "Asana", rank: 4, cited_reason: "Strengths in managing timelines and task dependencies for IT teams", date: today, sentiment: "Positive" },
    { id: `live-pm-px-5`, vertical: "Project Management", llm: "Perplexity", brand: "Zoho Projects", rank: 5, cited_reason: "Budget-friendly option with strong automation capabilities", date: today, sentiment: "Positive" }
];

async function main() {
    console.log("Inserting REAL live intel data to Supabase...");

    const { error } = await supabase.from('brand_rankings').insert(liveData);

    if (error) {
        console.error("Error inserting live data:", error);
    } else {
        console.log("Successfully inserted live intel from ChatGPT and Perplexity!");
    }
}

main().catch(console.error);
