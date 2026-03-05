import { GoogleGenAI, Type } from "@google/genai";
import { BusinessInfo, AnalysisReport } from "./types";

const REPORT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    executiveSummary: { type: Type.STRING },
    competitors: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          url: { type: Type.STRING },
          positioning: { type: Type.STRING },
          competitivePressure: { type: Type.STRING, description: "Detailed explanation of why this competitor matters and the specific pressure they exert." },
          marketShare: { type: Type.STRING },
          growthRate: { type: Type.STRING },
          productMaturity: { type: Type.STRING, enum: ["Early", "Growth", "Mature", "Decline"] },
          pricingIndicator: { type: Type.STRING },
          sentiment: { type: Type.STRING },
          trafficTrend: { type: Type.STRING },
          keyAdvantage: { type: Type.STRING },
        },
        required: ["name", "url", "positioning", "competitivePressure", "marketShare", "growthRate", "productMaturity", "pricingIndicator", "sentiment", "trafficTrend", "keyAdvantage"],
      },
    },
    marketSignals: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING },
          value: { type: Type.STRING },
          trend: { type: Type.STRING },
          insight: { type: Type.STRING, description: "The strategic implication: what advantage or disadvantage does this create?" },
          description: { type: Type.STRING },
        },
        required: ["label", "value", "trend", "insight", "description"],
      },
    },
    swot: {
      type: Type.OBJECT,
      properties: {
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
        opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
        threats: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["strengths", "weaknesses", "opportunities", "threats"],
    },
    strategicMoves: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          move: { type: Type.STRING, description: "The specific recommended action." },
          reasoning: { type: Type.STRING, description: "The logical justification for this move based on market data." },
          impact: { type: Type.STRING, description: "The specific outcome, business area affected, and expected duration." }
        },
        required: ["move", "reasoning", "impact"]
      },
    },
    momentumSynthesis: { type: Type.STRING, description: "A high-level synthesis of market momentum and strategic direction." },
  },
  required: ["executiveSummary", "competitors", "marketSignals", "swot", "strategicMoves", "momentumSynthesis"],
};

/**
 * FINAL AGGREGATION GATE
 * Normalizes and validates the raw AI output into a consistent application state.
 */
const validateAndNormalizeReport = (data: any): AnalysisReport => {
  if (!data.competitors || !Array.isArray(data.competitors) || data.competitors.length === 0) {
    throw new Error("Validation Failed: No competitors identified.");
  }
  if (!data.marketSignals || !Array.isArray(data.marketSignals)) {
    throw new Error("Validation Failed: Market signals are missing.");
  }

  const pricingSignal = data.marketSignals.find((s: any) => s.label?.toLowerCase().includes('pricing'))?.insight || "Market pricing appears competitive across the segment.";
  const sentimentSignal = data.marketSignals.find((s: any) => s.label?.toLowerCase().includes('sentiment'))?.insight || "Overall customer sentiment remains neutral in the current region.";
  const momentumSynthesis = data.momentumSynthesis || "Market momentum shows signs of consolidation with opportunities for differentiation in niche segments.";

  return {
    ...data,
    pricingInsights: pricingSignal,
    sentimentInsights: sentimentSignal,
    momentumSynthesis,
    generatedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    status: 'READY'
  };
};

export const generateCompetitorAnalysis = async (info: BusinessInfo): Promise<AnalysisReport> => {
  // Initialize right before call to ensure fresh environment state
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Act as a senior strategy consultant. Generate a decision-oriented competitor intelligence brief for:
    Business: ${info.name}
    Niche: ${info.niche}
    Region: ${info.region}

    CONTENT STRATEGY:
    1. COMPETITORS: Explain relevance. Detail the specific competitive pressure they create. 
    2. SIGNALS: Every signal must lead to a 'Strategic Insight'. State the exact advantage or disadvantage it creates.
    3. RECOMMENDATIONS: Every move MUST include: 
       - The 'move' (action)
       - The 'reasoning' (why this matters now)
       - The 'impact' (specific outcome, business area affected, and duration).
    4. MOMENTUM SYNTHESIS: Provide a high-level synthesis of market momentum and strategic direction.
    5. COMPETITOR DETAILS: For each competitor, estimate 'marketShare', 'growthRate', and 'productMaturity' (Early/Growth/Mature/Decline).
    6. STYLE: Use grounded, professional, and concise McKinsey-style language.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Switched to Flash for better availability in gated environments
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: REPORT_SCHEMA,
      },
    });

    if (!response.text) {
      throw new Error("Empty response received from the intelligence engine.");
    }

    const rawJson = JSON.parse(response.text);
    return validateAndNormalizeReport(rawJson);
  } catch (error) {
    console.error("AI Synchronization Error:", error);
    throw error;
  }
};
