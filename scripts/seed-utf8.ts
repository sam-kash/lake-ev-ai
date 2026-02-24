// ============================
// Project Ghost Recon ΓÇö Seed Data
// "The Infiltrator" ΓÇö Agent 1
// ============================

import { BrandMention, DailySnapshot } from "./types";

export const brandMentions: BrandMention[] = [
    // ΓöÇΓöÇ Project Management ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
    // ChatGPT responses
    { id: "pm-cg-1", brand: "Notion", vertical: "Project Management", llm: "ChatGPT", rank: 1, citedReason: "All-in-one workspace with powerful databases, AI assistance, and seamless collaboration features", date: "2026-02-22", sentiment: "Positive" },
    { id: "pm-cg-2", brand: "Linear", vertical: "Project Management", llm: "ChatGPT", rank: 2, citedReason: "Ultra-fast issue tracking with elegant UI and deep GitHub integration", date: "2026-02-22", sentiment: "Positive" },
    { id: "pm-cg-3", brand: "Asana", vertical: "Project Management", llm: "ChatGPT", rank: 3, citedReason: "Enterprise-grade project management with robust workflow automations", date: "2026-02-22", sentiment: "Positive" },
    { id: "pm-cg-4", brand: "Monday.com", vertical: "Project Management", llm: "ChatGPT", rank: 4, citedReason: "Highly visual and customizable project boards for teams of all sizes", date: "2026-02-22", sentiment: "Neutral" },
    { id: "pm-cg-5", brand: "ClickUp", vertical: "Project Management", llm: "ChatGPT", rank: 5, citedReason: "Feature-rich platform attempting to replace multiple tools", date: "2026-02-22", sentiment: "Neutral" },
    // Perplexity responses
    { id: "pm-px-1", brand: "Notion", vertical: "Project Management", llm: "Perplexity", rank: 1, citedReason: "Dominates the all-in-one workspace category with 35M+ users and AI-native features", date: "2026-02-22", sentiment: "Positive" },
    { id: "pm-px-2", brand: "Asana", vertical: "Project Management", llm: "Perplexity", rank: 2, citedReason: "Strong enterprise adoption with AI-powered project insights and resource planning", date: "2026-02-22", sentiment: "Positive" },
    { id: "pm-px-3", brand: "Linear", vertical: "Project Management", llm: "Perplexity", rank: 3, citedReason: "Preferred by engineering teams for its speed and opinionated workflow", date: "2026-02-22", sentiment: "Positive" },
    { id: "pm-px-4", brand: "Jira", vertical: "Project Management", llm: "Perplexity", rank: 4, citedReason: "Industry standard for large-scale software development projects", date: "2026-02-22", sentiment: "Neutral" },
    { id: "pm-px-5", brand: "Basecamp", vertical: "Project Management", llm: "Perplexity", rank: 5, citedReason: "Simplified approach appeals to small teams wanting less complexity", date: "2026-02-22", sentiment: "Neutral" },
    // Gemini responses
    { id: "pm-gm-1", brand: "Notion", vertical: "Project Management", llm: "Gemini", rank: 1, citedReason: "Best-in-class documentation and project management with integrated AI", date: "2026-02-22", sentiment: "Positive" },
    { id: "pm-gm-2", brand: "Monday.com", vertical: "Project Management", llm: "Gemini", rank: 2, citedReason: "Intuitive visual project management with excellent automation capabilities", date: "2026-02-22", sentiment: "Positive" },
    { id: "pm-gm-3", brand: "Asana", vertical: "Project Management", llm: "Gemini", rank: 3, citedReason: "Reliable project tracking with comprehensive reporting and portfolio views", date: "2026-02-22", sentiment: "Positive" },
    { id: "pm-gm-4", brand: "ClickUp", vertical: "Project Management", llm: "Gemini", rank: 4, citedReason: "Versatile platform with extensive customization options", date: "2026-02-22", sentiment: "Neutral" },
    { id: "pm-gm-5", brand: "Wrike", vertical: "Project Management", llm: "Gemini", rank: 5, citedReason: "Enterprise resource management with Gantt charts and workload balancing", date: "2026-02-22", sentiment: "Neutral" },

    // ΓöÇΓöÇ CRM ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
    // ChatGPT
    { id: "crm-cg-1", brand: "HubSpot", vertical: "CRM", llm: "ChatGPT", rank: 1, citedReason: "Best free CRM with powerful marketing, sales, and service hubs", date: "2026-02-22", sentiment: "Positive" },
    { id: "crm-cg-2", brand: "Salesforce", vertical: "CRM", llm: "ChatGPT", rank: 2, citedReason: "Industry-leading enterprise CRM with Einstein AI and extensive ecosystem", date: "2026-02-22", sentiment: "Positive" },
    { id: "crm-cg-3", brand: "Pipedrive", vertical: "CRM", llm: "ChatGPT", rank: 3, citedReason: "Sales-focused CRM with intuitive pipeline management", date: "2026-02-22", sentiment: "Positive" },
    { id: "crm-cg-4", brand: "Zoho CRM", vertical: "CRM", llm: "ChatGPT", rank: 4, citedReason: "Affordable full-featured CRM within a larger business suite", date: "2026-02-22", sentiment: "Neutral" },
    { id: "crm-cg-5", brand: "Freshsales", vertical: "CRM", llm: "ChatGPT", rank: 5, citedReason: "AI-powered CRM with built-in phone and email integration", date: "2026-02-22", sentiment: "Neutral" },
    // Perplexity
    { id: "crm-px-1", brand: "Salesforce", vertical: "CRM", llm: "Perplexity", rank: 1, citedReason: "Market leader with 23% market share and the most mature AI assistant (Einstein Copilot)", date: "2026-02-22", sentiment: "Positive" },
    { id: "crm-px-2", brand: "HubSpot", vertical: "CRM", llm: "Perplexity", rank: 2, citedReason: "Fastest-growing CRM platform with excellent inbound marketing integration", date: "2026-02-22", sentiment: "Positive" },
    { id: "crm-px-3", brand: "Attio", vertical: "CRM", llm: "Perplexity", rank: 3, citedReason: "Next-gen CRM built on a flexible data model, rising rapidly among startups", date: "2026-02-22", sentiment: "Positive" },
    { id: "crm-px-4", brand: "Pipedrive", vertical: "CRM", llm: "Perplexity", rank: 4, citedReason: "Simple and effective deal-focused CRM for SMBs", date: "2026-02-22", sentiment: "Neutral" },
    { id: "crm-px-5", brand: "Close", vertical: "CRM", llm: "Perplexity", rank: 5, citedReason: "Built for inside sales teams with calling and email sequences", date: "2026-02-22", sentiment: "Neutral" },
    // Gemini
    { id: "crm-gm-1", brand: "HubSpot", vertical: "CRM", llm: "Gemini", rank: 1, citedReason: "Comprehensive free tier and integrated marketing platform make it ideal for growing businesses", date: "2026-02-22", sentiment: "Positive" },
    { id: "crm-gm-2", brand: "Salesforce", vertical: "CRM", llm: "Gemini", rank: 2, citedReason: "Most customizable enterprise CRM with unmatched AppExchange ecosystem", date: "2026-02-22", sentiment: "Positive" },
    { id: "crm-gm-3", brand: "Zoho CRM", vertical: "CRM", llm: "Gemini", rank: 3, citedReason: "Best value CRM with deep integration into Zoho's 50+ business apps", date: "2026-02-22", sentiment: "Positive" },
    { id: "crm-gm-4", brand: "Freshsales", vertical: "CRM", llm: "Gemini", rank: 4, citedReason: "AI-powered lead scoring with built-in communication tools", date: "2026-02-22", sentiment: "Neutral" },
    { id: "crm-gm-5", brand: "Copper", vertical: "CRM", llm: "Gemini", rank: 5, citedReason: "Deep Google Workspace integration for Google-centric teams", date: "2026-02-22", sentiment: "Neutral" },

    // ΓöÇΓöÇ Cloud Storage ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
    // ChatGPT
    { id: "cs-cg-1", brand: "Google Drive", vertical: "Cloud Storage", llm: "ChatGPT", rank: 1, citedReason: "Seamless integration with Google Workspace and 15GB free storage", date: "2026-02-22", sentiment: "Positive" },
    { id: "cs-cg-2", brand: "Dropbox", vertical: "Cloud Storage", llm: "ChatGPT", rank: 2, citedReason: "Reliable file sync with smart workspace features and Dash AI search", date: "2026-02-22", sentiment: "Positive" },
    { id: "cs-cg-3", brand: "OneDrive", vertical: "Cloud Storage", llm: "ChatGPT", rank: 3, citedReason: "Deep Windows and Microsoft 365 integration with 1TB bundled storage", date: "2026-02-22", sentiment: "Positive" },
    { id: "cs-cg-4", brand: "Box", vertical: "Cloud Storage", llm: "ChatGPT", rank: 4, citedReason: "Enterprise-grade security and compliance features", date: "2026-02-22", sentiment: "Neutral" },
    { id: "cs-cg-5", brand: "pCloud", vertical: "Cloud Storage", llm: "ChatGPT", rank: 5, citedReason: "Lifetime plans and client-side encryption option", date: "2026-02-22", sentiment: "Neutral" },
    // Perplexity
    { id: "cs-px-1", brand: "Google Drive", vertical: "Cloud Storage", llm: "Perplexity", rank: 1, citedReason: "2 billion+ users, unmatched collaboration with Docs/Sheets/Slides ecosystem", date: "2026-02-22", sentiment: "Positive" },
    { id: "cs-px-2", brand: "OneDrive", vertical: "Cloud Storage", llm: "Perplexity", rank: 2, citedReason: "Best value when bundled with Microsoft 365 subscription", date: "2026-02-22", sentiment: "Positive" },
    { id: "cs-px-3", brand: "Dropbox", vertical: "Cloud Storage", llm: "Perplexity", rank: 3, citedReason: "Pioneer in cloud storage with excellent selective sync and paper docs", date: "2026-02-22", sentiment: "Positive" },
    { id: "cs-px-4", brand: "iCloud", vertical: "Cloud Storage", llm: "Perplexity", rank: 4, citedReason: "Seamless for Apple ecosystem users with tight device integration", date: "2026-02-22", sentiment: "Neutral" },
    { id: "cs-px-5", brand: "Tresorit", vertical: "Cloud Storage", llm: "Perplexity", rank: 5, citedReason: "Zero-knowledge encryption for privacy-conscious enterprises", date: "2026-02-22", sentiment: "Positive" },
    // Gemini
    { id: "cs-gm-1", brand: "Google Drive", vertical: "Cloud Storage", llm: "Gemini", rank: 1, citedReason: "Best-in-class real-time collaboration and AI-powered search with Gemini integration", date: "2026-02-22", sentiment: "Positive" },
    { id: "cs-gm-2", brand: "Dropbox", vertical: "Cloud Storage", llm: "Gemini", rank: 2, citedReason: "Strong cross-platform sync with creative tools integration", date: "2026-02-22", sentiment: "Positive" },
    { id: "cs-gm-3", brand: "OneDrive", vertical: "Cloud Storage", llm: "Gemini", rank: 3, citedReason: "Excellent enterprise option with SharePoint integration", date: "2026-02-22", sentiment: "Positive" },
    { id: "cs-gm-4", brand: "Box", vertical: "Cloud Storage", llm: "Gemini", rank: 4, citedReason: "Leading enterprise content management with advanced security controls", date: "2026-02-22", sentiment: "Neutral" },
    { id: "cs-gm-5", brand: "Sync.com", vertical: "Cloud Storage", llm: "Gemini", rank: 5, citedReason: "Privacy-focused Canadian provider with end-to-end encryption", date: "2026-02-22", sentiment: "Neutral" },

    // ΓöÇΓöÇ AI Writing ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
    // ChatGPT
    { id: "ai-cg-1", brand: "Jasper", vertical: "AI Writing", llm: "ChatGPT", rank: 1, citedReason: "Enterprise AI content platform with brand voice control and campaign management", date: "2026-02-22", sentiment: "Positive" },
    { id: "ai-cg-2", brand: "Copy.ai", vertical: "AI Writing", llm: "ChatGPT", rank: 2, citedReason: "GTM AI platform for go-to-market content creation workflows", date: "2026-02-22", sentiment: "Positive" },
    { id: "ai-cg-3", brand: "Grammarly", vertical: "AI Writing", llm: "ChatGPT", rank: 3, citedReason: "AI writing assistant that goes beyond grammar to enhance tone and clarity", date: "2026-02-22", sentiment: "Positive" },
    { id: "ai-cg-4", brand: "Writer", vertical: "AI Writing", llm: "ChatGPT", rank: 4, citedReason: "Enterprise AI writing with style guide enforcement and content governance", date: "2026-02-22", sentiment: "Neutral" },
    { id: "ai-cg-5", brand: "Writesonic", vertical: "AI Writing", llm: "ChatGPT", rank: 5, citedReason: "Affordable AI writing tool with SEO optimization features", date: "2026-02-22", sentiment: "Neutral" },
    // Perplexity
    { id: "ai-px-1", brand: "Jasper", vertical: "AI Writing", llm: "Perplexity", rank: 1, citedReason: "Leading AI marketing platform with $1.5B valuation and 100K+ business customers", date: "2026-02-22", sentiment: "Positive" },
    { id: "ai-px-2", brand: "Grammarly", vertical: "AI Writing", llm: "Perplexity", rank: 2, citedReason: "30M+ daily active users across browser, desktop, and mobile", date: "2026-02-22", sentiment: "Positive" },
    { id: "ai-px-3", brand: "Copy.ai", vertical: "AI Writing", llm: "Perplexity", rank: 3, citedReason: "Rapidly growing GTM AI platform with workflow automation capabilities", date: "2026-02-22", sentiment: "Positive" },
    { id: "ai-px-4", brand: "Notion AI", vertical: "AI Writing", llm: "Perplexity", rank: 4, citedReason: "Integrated AI writing within Notion's workspace, no separate tool needed", date: "2026-02-22", sentiment: "Positive" },
    { id: "ai-px-5", brand: "Rytr", vertical: "AI Writing", llm: "Perplexity", rank: 5, citedReason: "Budget-friendly AI writer for freelancers and small businesses", date: "2026-02-22", sentiment: "Neutral" },
    // Gemini
    { id: "ai-gm-1", brand: "Grammarly", vertical: "AI Writing", llm: "Gemini", rank: 1, citedReason: "Most widely adopted AI writing tool with comprehensive communication assistance", date: "2026-02-22", sentiment: "Positive" },
    { id: "ai-gm-2", brand: "Jasper", vertical: "AI Writing", llm: "Gemini", rank: 2, citedReason: "Best for marketing teams needing brand-consistent AI content at scale", date: "2026-02-22", sentiment: "Positive" },
    { id: "ai-gm-3", brand: "Copy.ai", vertical: "AI Writing", llm: "Gemini", rank: 3, citedReason: "Strong workflow automation for sales and marketing content", date: "2026-02-22", sentiment: "Positive" },
    { id: "ai-gm-4", brand: "Writer", vertical: "AI Writing", llm: "Gemini", rank: 4, citedReason: "Enterprise content governance platform ensuring brand consistency", date: "2026-02-22", sentiment: "Neutral" },
    { id: "ai-gm-5", brand: "Anyword", vertical: "AI Writing", llm: "Gemini", rank: 5, citedReason: "Performance-focused AI copywriting with predictive analytics", date: "2026-02-22", sentiment: "Neutral" },

    // ΓöÇΓöÇ Design Tools ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
    // ChatGPT
    { id: "dt-cg-1", brand: "Figma", vertical: "Design Tools", llm: "ChatGPT", rank: 1, citedReason: "Industry-standard collaborative design tool with Dev Mode and AI features", date: "2026-02-22", sentiment: "Positive" },
    { id: "dt-cg-2", brand: "Framer", vertical: "Design Tools", llm: "ChatGPT", rank: 2, citedReason: "No-code website builder with stunning animations and CMS capabilities", date: "2026-02-22", sentiment: "Positive" },
    { id: "dt-cg-3", brand: "Canva", vertical: "Design Tools", llm: "ChatGPT", rank: 3, citedReason: "Democratized design for non-designers with extensive template library", date: "2026-02-22", sentiment: "Positive" },
    { id: "dt-cg-4", brand: "Adobe XD", vertical: "Design Tools", llm: "ChatGPT", rank: 4, citedReason: "Professional prototyping tool within the Adobe Creative Cloud ecosystem", date: "2026-02-22", sentiment: "Neutral" },
    { id: "dt-cg-5", brand: "Sketch", vertical: "Design Tools", llm: "ChatGPT", rank: 5, citedReason: "Veteran macOS design tool with strong plugin ecosystem", date: "2026-02-22", sentiment: "Neutral" },
    // Perplexity
    { id: "dt-px-1", brand: "Figma", vertical: "Design Tools", llm: "Perplexity", rank: 1, citedReason: "4M+ users, dominant market position with real-time collaboration unmatched by competitors", date: "2026-02-22", sentiment: "Positive" },
    { id: "dt-px-2", brand: "Canva", vertical: "Design Tools", llm: "Perplexity", rank: 2, citedReason: "170M+ monthly active users, AI-powered Magic Studio revolutionizing accessible design", date: "2026-02-22", sentiment: "Positive" },
    { id: "dt-px-3", brand: "Framer", vertical: "Design Tools", llm: "Perplexity", rank: 3, citedReason: "Fastest-growing website builder among designers, blending design and code", date: "2026-02-22", sentiment: "Positive" },
    { id: "dt-px-4", brand: "Penpot", vertical: "Design Tools", llm: "Perplexity", rank: 4, citedReason: "Open-source Figma alternative gaining traction in design community", date: "2026-02-22", sentiment: "Positive" },
    { id: "dt-px-5", brand: "Spline", vertical: "Design Tools", llm: "Perplexity", rank: 5, citedReason: "Emerging 3D design tool making web-based 3D accessible", date: "2026-02-22", sentiment: "Positive" },
    // Gemini
    { id: "dt-gm-1", brand: "Figma", vertical: "Design Tools", llm: "Gemini", rank: 1, citedReason: "Best collaborative design platform with comprehensive prototyping and handoff tools", date: "2026-02-22", sentiment: "Positive" },
    { id: "dt-gm-2", brand: "Canva", vertical: "Design Tools", llm: "Gemini", rank: 2, citedReason: "Most versatile design tool for teams of all skill levels", date: "2026-02-22", sentiment: "Positive" },
    { id: "dt-gm-3", brand: "Framer", vertical: "Design Tools", llm: "Gemini", rank: 3, citedReason: "Leading design-to-production website builder with motion design capabilities", date: "2026-02-22", sentiment: "Positive" },
    { id: "dt-gm-4", brand: "Adobe XD", vertical: "Design Tools", llm: "Gemini", rank: 4, citedReason: "Professional-grade UI/UX design within the Adobe ecosystem", date: "2026-02-22", sentiment: "Neutral" },
    { id: "dt-gm-5", brand: "Sketch", vertical: "Design Tools", llm: "Gemini", rank: 5, citedReason: "Reliable Mac-native design tool with mature plugin ecosystem", date: "2026-02-22", sentiment: "Neutral" },

    // ΓöÇΓöÇ Historical data (previous days) for trends ΓöÇΓöÇ
    // Feb 21
    { id: "pm-cg-1-d21", brand: "Notion", vertical: "Project Management", llm: "ChatGPT", rank: 1, citedReason: "All-in-one workspace for teams", date: "2026-02-21", sentiment: "Positive" },
    { id: "pm-px-1-d21", brand: "Notion", vertical: "Project Management", llm: "Perplexity", rank: 1, citedReason: "Top workspace tool", date: "2026-02-21", sentiment: "Positive" },
    { id: "pm-gm-1-d21", brand: "Notion", vertical: "Project Management", llm: "Gemini", rank: 1, citedReason: "Leading project management platform", date: "2026-02-21", sentiment: "Positive" },
    { id: "crm-cg-1-d21", brand: "HubSpot", vertical: "CRM", llm: "ChatGPT", rank: 1, citedReason: "Best free CRM", date: "2026-02-21", sentiment: "Positive" },
    { id: "crm-px-1-d21", brand: "Salesforce", vertical: "CRM", llm: "Perplexity", rank: 1, citedReason: "Market leader in CRM", date: "2026-02-21", sentiment: "Positive" },
    { id: "dt-cg-1-d21", brand: "Figma", vertical: "Design Tools", llm: "ChatGPT", rank: 1, citedReason: "Best design tool", date: "2026-02-21", sentiment: "Positive" },
    { id: "dt-px-1-d21", brand: "Figma", vertical: "Design Tools", llm: "Perplexity", rank: 1, citedReason: "Industry standard", date: "2026-02-21", sentiment: "Positive" },
    { id: "dt-gm-1-d21", brand: "Figma", vertical: "Design Tools", llm: "Gemini", rank: 1, citedReason: "Best collaborative design", date: "2026-02-21", sentiment: "Positive" },
    { id: "ai-cg-1-d21", brand: "Jasper", vertical: "AI Writing", llm: "ChatGPT", rank: 1, citedReason: "Top AI content platform", date: "2026-02-21", sentiment: "Positive" },
    { id: "cs-cg-1-d21", brand: "Google Drive", vertical: "Cloud Storage", llm: "ChatGPT", rank: 1, citedReason: "Best integrated storage", date: "2026-02-21", sentiment: "Positive" },

    // Feb 20
    { id: "pm-cg-1-d20", brand: "Notion", vertical: "Project Management", llm: "ChatGPT", rank: 1, citedReason: "All-in-one workspace", date: "2026-02-20", sentiment: "Positive" },
    { id: "pm-cg-2-d20", brand: "Asana", vertical: "Project Management", llm: "ChatGPT", rank: 2, citedReason: "Great project tracking", date: "2026-02-20", sentiment: "Positive" },
    { id: "crm-cg-1-d20", brand: "Salesforce", vertical: "CRM", llm: "ChatGPT", rank: 1, citedReason: "Enterprise CRM leader", date: "2026-02-20", sentiment: "Positive" },
    { id: "dt-cg-1-d20", brand: "Figma", vertical: "Design Tools", llm: "ChatGPT", rank: 1, citedReason: "Industry-leading design collaboration", date: "2026-02-20", sentiment: "Positive" },
    { id: "ai-cg-1-d20", brand: "Jasper", vertical: "AI Writing", llm: "ChatGPT", rank: 1, citedReason: "AI content leader", date: "2026-02-20", sentiment: "Positive" },
    { id: "ai-cg-2-d20", brand: "Grammarly", vertical: "AI Writing", llm: "ChatGPT", rank: 2, citedReason: "Best grammar assistant", date: "2026-02-20", sentiment: "Positive" },
    { id: "cs-cg-1-d20", brand: "Google Drive", vertical: "Cloud Storage", llm: "ChatGPT", rank: 1, citedReason: "Best cloud storage", date: "2026-02-20", sentiment: "Positive" },
    { id: "cs-cg-2-d20", brand: "Dropbox", vertical: "Cloud Storage", llm: "ChatGPT", rank: 2, citedReason: "Reliable file sync", date: "2026-02-20", sentiment: "Positive" },

    // Feb 19
    { id: "pm-cg-1-d19", brand: "Notion", vertical: "Project Management", llm: "ChatGPT", rank: 2, citedReason: "Strong workspace tool", date: "2026-02-19", sentiment: "Positive" },
    { id: "pm-cg-2-d19", brand: "Linear", vertical: "Project Management", llm: "ChatGPT", rank: 1, citedReason: "Fastest issue tracker", date: "2026-02-19", sentiment: "Positive" },
    { id: "crm-cg-1-d19", brand: "HubSpot", vertical: "CRM", llm: "ChatGPT", rank: 1, citedReason: "Best free CRM for startups", date: "2026-02-19", sentiment: "Positive" },
    { id: "dt-cg-1-d19", brand: "Figma", vertical: "Design Tools", llm: "ChatGPT", rank: 1, citedReason: "Collaboration leader", date: "2026-02-19", sentiment: "Positive" },
    { id: "ai-cg-1-d19", brand: "Grammarly", vertical: "AI Writing", llm: "ChatGPT", rank: 1, citedReason: "Most used AI writer", date: "2026-02-19", sentiment: "Positive" },
    { id: "cs-cg-1-d19", brand: "Google Drive", vertical: "Cloud Storage", llm: "ChatGPT", rank: 1, citedReason: "Top cloud storage", date: "2026-02-19", sentiment: "Positive" },
];

export const dailySnapshots: DailySnapshot[] = [
    {
        date: "2026-02-16",
        brandScores: { "Notion": 88, "Figma": 92, "HubSpot": 78, "Jasper": 75, "Google Drive": 85, "Salesforce": 74, "Linear": 62, "Canva": 68, "Grammarly": 71, "Dropbox": 60 },
    },
    {
        date: "2026-02-17",
        brandScores: { "Notion": 90, "Figma": 91, "HubSpot": 80, "Jasper": 77, "Google Drive": 84, "Salesforce": 76, "Linear": 65, "Canva": 70, "Grammarly": 73, "Dropbox": 58 },
    },
    {
        date: "2026-02-18",
        brandScores: { "Notion": 89, "Figma": 93, "HubSpot": 79, "Jasper": 78, "Google Drive": 86, "Salesforce": 75, "Linear": 68, "Canva": 69, "Grammarly": 74, "Dropbox": 61 },
    },
    {
        date: "2026-02-19",
        brandScores: { "Notion": 91, "Figma": 94, "HubSpot": 81, "Jasper": 76, "Google Drive": 87, "Salesforce": 77, "Linear": 70, "Canva": 71, "Grammarly": 76, "Dropbox": 59 },
    },
    {
        date: "2026-02-20",
        brandScores: { "Notion": 92, "Figma": 93, "HubSpot": 82, "Jasper": 79, "Google Drive": 85, "Salesforce": 78, "Linear": 69, "Canva": 72, "Grammarly": 75, "Dropbox": 62 },
    },
    {
        date: "2026-02-21",
        brandScores: { "Notion": 93, "Figma": 95, "HubSpot": 80, "Jasper": 80, "Google Drive": 88, "Salesforce": 76, "Linear": 71, "Canva": 73, "Grammarly": 77, "Dropbox": 60 },
    },
    {
        date: "2026-02-22",
        brandScores: { "Notion": 94, "Figma": 96, "HubSpot": 83, "Jasper": 81, "Google Drive": 89, "Salesforce": 79, "Linear": 72, "Canva": 74, "Grammarly": 78, "Dropbox": 63 },
    },
];
