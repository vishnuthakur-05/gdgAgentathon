// --- FILE: sampleData.ts ---
import { AnalysisReport, BusinessInfo } from './types';

export const SAMPLE_BUSINESS: BusinessInfo = {
    name: "Perplexity",
    website: "https://perplexity.ai",
    niche: "AI Search Engine",
    region: "Global"
};

export const SAMPLE_REPORT: AnalysisReport = {
    generatedAt: "December 20, 2025",
    status: 'READY',
    executiveSummary: "Perplexity occupies a high-growth niche by abstracting LLM complexity into a reliable citation-based search engine. While it leads in UX for power users, it faces structural threats from Google's distribution and OpenAI's feature replication. Success depends on evolving from a research utility to a B2B platform.",
    pricingInsights: "Freemium model with $20/mo Pro tier; Enterprise seat pricing is the next major frontier.",
    sentimentInsights: "High user trust due to citation transparency, though litigation concerns are rising.",
    momentumSynthesis: "Market momentum indicates a rapid shift towards reliable, cited search results, driven by dissatisfaction with SEO-spam in traditional search. Perplexity is well-positioned but faces imminent platform-level competition.",
    competitors: [
        {
            name: "Google (SGE)",
            url: "https://google.com",
            positioning: "Dominant Incumbent",
            competitivePressure: "Controls the browser/OS layer, creating massive friction for user switching.",
            marketShare: "90%+",
            growthRate: "Stable",
            productMaturity: "Mature",
            pricingIndicator: "Mid",
            sentiment: "Neutral",
            trafficTrend: "Stable",
            keyAdvantage: "Ecosystem Lock-in"
        }
    ],
    marketSignals: [
        {
            label: "B2B Demand",
            value: "$15B Market",
            trend: "positive",
            description: "Enterprises seeking secure, internal search tools for proprietary data.",
            insight: "Enterprise search offers a higher-margin revenue stream than consumer ads."
        }
    ],
    swot: {
        strengths: ["Superior UI/UX", "Citation Accuracy"],
        weaknesses: ["Lack of distribution", "Legal vulnerability"],
        opportunities: ["B2B Enterprise Search"],
        threats: ["Google/Apple OS integration"]
    },
    strategicMoves: [
        {
            move: "Launch Enterprise Knowledge API",
            reasoning: "Enterprise internal search is high-LTV and sticky compared to consumer search.",
            impact: "Increases recurring B2B revenue by 30% within 18 months."
        }
    ]
};
