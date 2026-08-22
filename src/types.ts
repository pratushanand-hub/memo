export interface Mistake {
  id: string;
  title: string;
  category: string;
  description: string;
  context: string;
  cause: string;
  solution: string;
  lesson: string;
  tags: string[];
  createdAt: string;
  status: 'solved' | 'investigating' | 'open';
}

export interface SimilarityResult {
  score: number; // percentage, e.g. 92
  matchedMistake: Mistake;
  matchExplanation: string;
  contextComparison: string;
  causeComparison: string;
  solutionComparison: string;
  lessonLearned: string;
}

export interface CategorySummary {
  name: string;
  count: number;
  solved: number;
}

export interface InsightData {
  totalCount: number;
  solvedCount: number;
  categorySummary: CategorySummary[];
  mostCommonCategory: string;
  repeatedMistakesCount: number;
  improvementTrend: string;
  aiInsightText: string;
}
