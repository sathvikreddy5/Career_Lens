const STOP_WORDS = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "to",
  "of",
  "in",
  "for",
  "on",
  "with",
  "is",
  "are",
  "this",
  "that",
  "you",
  "your",
  "we",
  "our",
  "be",
  "will",
  "from",
  "as",
  "at",
  "by",
  "it",
  "have",
  "has",
  "about",
]);

const tokenize = (text = "") => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
};

const createFrequencyMap = (tokens) => {
  const map = new Map();

  for (const token of tokens) {
    map.set(token, (map.get(token) || 0) + 1);
  }

  return map;
};

export const cosineSimilarity = (textA = "", textB = "") => {
  const tokensA = tokenize(textA);
  const tokensB = tokenize(textB);

  if (!tokensA.length || !tokensB.length) {
    return 0;
  }

  const freqA = createFrequencyMap(tokensA);
  const freqB = createFrequencyMap(tokensB);

  const vocabulary = new Set([...freqA.keys(), ...freqB.keys()]);

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (const word of vocabulary) {
    const a = freqA.get(word) || 0;
    const b = freqB.get(word) || 0;

    dotProduct += a * b;

    magnitudeA += a * a;
    magnitudeB += b * b;
  }

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
};
