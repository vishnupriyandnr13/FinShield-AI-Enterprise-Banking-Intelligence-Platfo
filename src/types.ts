export interface Transaction {
  id: string;
  time: string;
  merchant: string;
  amount: number;
  riskScore: number; // 0 to 100
  fraudProbability: number; // 0 to 1
  status: 'Approved' | 'Flagged' | 'Denied';
  explanation?: string;
  suggestedAction?: string;
  aiReasoning?: string;
  retrievedRule?: string;
  category: 'Retail' | 'Food & Beverage' | 'Electronics' | 'Travel' | 'Entertainment' | 'Utilities' | 'Financial Services' | 'Other';
}

export interface SimulationConfig {
  scenario: string;
  tps: number;
  fraudRate: number;
  active: boolean;
}

export interface SimulationStats {
  currentTps: number;
  fraudCount: number;
  successRate: number;
  processingLatency: number; // in ms
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface StatementAnalysis {
  summary: {
    totalDebit: number;
    totalCredit: number;
    highestExpense: number;
    highestMerchant: string;
  };
  categories: {
    name: string;
    value: number;
  }[];
  transactions: {
    date: string;
    description: string;
    amount: number;
    type: 'debit' | 'credit';
    category: string;
  }[];
}
