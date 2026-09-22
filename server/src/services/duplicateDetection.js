import { cosineSimilarity } from "./textSimilarity.js";

const SIMILARITY_THRESHOLD = 0.75;

export const detectDuplicates = (description, existingPostings = []) => {
  const matches = [];

  for (const posting of existingPostings) {
    const similarity = cosineSimilarity(description, posting.description);

    if (similarity >= SIMILARITY_THRESHOLD) {
      matches.push({
        postingId: posting.id,
        companyName: posting.companyName,
        similarity: Number(similarity.toFixed(2)),
      });
    }
  }

  return {
    isDuplicate: matches.length > 0,
    clusterSize: matches.length + 1,
    matches,
  };
};
