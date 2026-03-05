
export interface BusinessInfo {
  name: string;
  website: string;
  niche: string;
  region: string;
}

export interface Competitor {
  name: string;
  url: string;
  positioning: string;
  competitivePressure: string; // Decision-oriented context
  pricingIndicator: 'Low' | 'Mid' | 'Premium' | 'Luxury';
  sentiment: string;
  marketShare: string;
  growthRate: string;
  productMaturity: 'Early' | 'Growth' | 'Mature' | 'Decline';
  trafficTrend: 'Rising' | 'Stable' | 'Declining';
  keyAdvantage: string;
}

export interface MarketSignal {
  label: string;
  value: string;
  trend: 'positive' | 'negative' | 'neutral';
  insight: string; // The "So What?" of the data
  description: string;
}

export interface StrategicRecommendation {
  move: string;
  reasoning: string; // Why this move is recommended
  impact: string; // Detailed outcome, area, and duration
}

export interface AnalysisReport {
  executiveSummary: string;
  competitors: Competitor[];
  marketSignals: MarketSignal[];
  pricingInsights: string;
  sentimentInsights: string;
  momentumSynthesis: string;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  strategicMoves: StrategicRecommendation[];
  generatedAt: string;
  status: 'READY' | 'ERROR' | 'PENDING';
}

export type AppState = 'landing' | 'discovery' | 'input' | 'analyzing' | 'report' | 'login' | 'register' | 'features' | 'profile';

export interface User {
  name: string;
  email: string;
}


export interface HistoryItem {
  id: string;
  timestamp: string;
  businessName: string;
  niche: string;
  report: AnalysisReport;
  businessInfo: BusinessInfo;
  userId?: string;
}

export type ActionStatus = 'idle' | 'loading' | 'success' | 'error';
