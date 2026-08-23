import { Mistake, SimilarityResult } from '../types';

// Helper to safely extract lowercase keywords from any string or undefined
const getWords = (text?: string): string[] => {
  if (!text || typeof text !== 'string') return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);
};

export const matchSimilarityLocally = (
  query: string,
  mistakes: Mistake[]
): SimilarityResult | null => {
  if (!query || !mistakes || mistakes.length === 0) return null;

  const queryWords = new Set(getWords(query));
  if (queryWords.size === 0) return null;

  let bestMatch: Mistake | null = null;
  let highestScore = 0;
  let matchedTerms: string[] = [];

  for (const m of mistakes) {
    const mistakeText = [
      m.title || '',
      m.description || '',
      (m as any).problem || '',
      m.context || '',
      m.cause || '',
      m.solution || '',
      m.lesson || '',
      m.category || '',
      Array.isArray(m.tags) ? m.tags.join(' ') : ''
    ].join(' ');

    const itemWords = getWords(mistakeText);
    const itemWordSet = new Set(itemWords);

    const overlapping: string[] = [];
    queryWords.forEach((qw) => {
      if (itemWordSet.has(qw) || itemWords.some((iw) => iw.includes(qw) || qw.includes(iw))) {
        overlapping.push(qw);
      }
    });

    if (Array.isArray(m.tags)) {
      m.tags.forEach((tag) => {
        const cleanTag = tag.toLowerCase().trim();
        if (queryWords.has(cleanTag) || query.toLowerCase().includes(cleanTag)) {
          if (!overlapping.includes(cleanTag)) overlapping.push(cleanTag);
        }
      });
    }

    if (m.title && query.toLowerCase().includes(m.title.toLowerCase())) {
      overlapping.push('title-match');
    }

    const overlapCount = overlapping.length;
    const score = Math.min(
      98,
      Math.round((overlapCount / Math.max(queryWords.size, 1)) * 75 + (overlapCount > 1 ? 20 : 10))
    );

    if (score > highestScore && score >= 25) {
      highestScore = score;
      bestMatch = m;
      matchedTerms = overlapping;
    }
  }

  if (!bestMatch) return null;

  const matchDetails = matchedTerms.length > 0 ? matchedTerms.join(', ') : bestMatch.category || 'Technical overlap';

  return {
    score: highestScore,
    matchedMistake: bestMatch,
    matchExplanation: `Found high semantic overlap with past incident regarding: ${matchDetails}`,
    contextComparison: bestMatch.context || bestMatch.description || 'Matching technical scope',
    causeComparison: bestMatch.cause || 'Underlying configuration/logic error previously documented',
    solutionComparison: bestMatch.solution || 'Follow documented fix from previous resolution',
    lessonLearned: bestMatch.lesson || 'Review architectural patterns before repeating'
  };
};

export const searchMemory = async (
  query: string,
  mistakes: Mistake[]
): Promise<SimilarityResult | null> => {
  return matchSimilarityLocally(query, mistakes);
};