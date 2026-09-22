/**
 * Smart Probabilistic & Phonetic Crop Fuzzy Matcher
 * 
 * Handles dialect variations, common typos, and phonetic misspellings for Indian Mandi products:
 * e.g., 'baigan', 'began', 'bagan', 'bengan' -> 'बैंगन' (Eggplant / Brinjal)
 *       'tmatar', 'tamater', 'tomatar' -> 'टमाटर' (Tomatoes)
 *       'pyaaz', 'pyaj', 'kanda' -> 'प्याज' (Onions)
 */

export interface ProbabilisticMatchResult {
  matchedKey: string;
  confidence: number;
  translation: { hi: string; en: string };
  isExact: boolean;
}

/**
 * Standard Levenshtein Distance algorithm
 */
export function levenshteinDistance(s1: string, s2: string): number {
  if (s1.length < s2.length) return levenshteinDistance(s2, s1);
  if (s2.length === 0) return s1.length;

  let prev = Array.from({ length: s2.length + 1 }, (_, i) => i);
  for (let i = 0; i < s1.length; i++) {
    const curr = [i + 1];
    for (let j = 0; j < s2.length; j++) {
      const ins = prev[j + 1] + 1;
      const del = curr[j] + 1;
      const sub = prev[j] + (s1[i] !== s2[j] ? 1 : 0);
      curr.push(Math.min(ins, del, sub));
    }
    prev = curr;
  }
  return prev[prev.length - 1];
}

/**
 * Normalizes Hinglish and Devanagari phonetics so that words that sound identical in Indian
 * accents map to canonical phonetic hashes (e.g. began = baigan = bengan = baingan).
 */
export function normalizePhonetic(s: string): string {
  const str = s.toLowerCase().trim();

  // 1. Devanagari normalization
  if (/[\u0900-\u097F]/.test(str)) {
    return str
      .replace(/[\u0901\u0902\u0903\u093C\u094D]/g, '') // remove bindu, anusvara, nukta, halant
      .replace(/\u0948/g, '\u0947') // ai matra -> e matra (ै -> े)
      .replace(/\u094C/g, '\u094B') // au matra -> o matra (ौ -> ो)
      .replace(/\u0940/g, '\u093F') // ee matra -> i matra (ी -> ि)
      .replace(/\u0942/g, '\u0941'); // oo matra -> u matra (ू -> ु)
  }

  // 2. Hinglish / Romanized normalization
  return str
    .replace(/[^a-z0-9]/g, '')
    .replace(/ai|ay|ei|ae/g, 'e')
    .replace(/oo|ou/g, 'u')
    .replace(/ee/g, 'i')
    .replace(/aa/g, 'a')
    .replace(/z/g, 'j')
    .replace(/sh/g, 's')
    .replace(/bh/g, 'b')
    .replace(/kh/g, 'k')
    .replace(/gh/g, 'g')
    .replace(/ph/g, 'f')
    .replace(/dh/g, 'd')
    .replace(/th/g, 't')
    .replace(/ch/g, 'c')
    .replace(/([a-z])\1+/g, '$1') // remove consecutive duplicate letters
    .replace(/n(?=[gdjbtkp])/g, ''); // drop nasal anusvara before stops (baingan -> began)
}

/**
 * Calculates probabilistic similarity score between two crop strings (0.0 to 1.0)
 * Uses both direct string distance and phonetic distance.
 */
export function calculateCropProbability(input: string, candidate: string): number {
  const iLow = input.toLowerCase().trim();
  const cLow = candidate.toLowerCase().trim();
  if (iLow === cLow) return 1.0;

  // Direct string Levenshtein similarity
  const distDirect = levenshteinDistance(iLow, cLow);
  const maxLenDirect = Math.max(iLow.length, cLow.length);
  const scoreDirect = maxLenDirect === 0 ? 1.0 : 1.0 - (distDirect / maxLenDirect);

  // Phonetic Levenshtein similarity
  const iPhon = normalizePhonetic(iLow);
  const cPhon = normalizePhonetic(cLow);
  if (iPhon === cPhon && iPhon.length >= 3) return 0.98;

  const distPhon = levenshteinDistance(iPhon, cPhon);
  const maxLenPhon = Math.max(iPhon.length, cPhon.length);
  const scorePhon = maxLenPhon === 0 ? 1.0 : 1.0 - (distPhon / maxLenPhon);

  return Math.max(scoreDirect, scorePhon);
}

/**
 * Searches a crop dictionary for the best probabilistic match.
 * Returns match result if highest probability confidence >= threshold (default 0.75 / 75%).
 */
export function findProbabilisticCropMatch(
  inputName: string,
  dictionary: Record<string, { hi: string; en: string }>,
  minThreshold: number = 0.75
): ProbabilisticMatchResult | null {
  if (!inputName || typeof inputName !== 'string') return null;

  const trimmed = inputName.trim();
  const lower = trimmed.toLowerCase();

  // 1. Direct hit
  if (dictionary[trimmed]) {
    return {
      matchedKey: trimmed,
      confidence: 1.0,
      translation: dictionary[trimmed],
      isExact: true,
    };
  }

  // 2. Case-insensitive exact hit
  for (const [key, trans] of Object.entries(dictionary)) {
    if (key.toLowerCase() === lower) {
      return {
        matchedKey: key,
        confidence: 1.0,
        translation: trans,
        isExact: true,
      };
    }
  }

  // 3. Probabilistic & Phonetic scan across dictionary
  let bestMatch: ProbabilisticMatchResult | null = null;
  let maxProbability = 0;

  for (const [key, trans] of Object.entries(dictionary)) {
    // Only compare single-word crop terms or base keys to avoid noisy long phrases
    if (key.includes('(') || key.length > 25) continue;

    const prob = calculateCropProbability(trimmed, key);
    if (prob > maxProbability) {
      maxProbability = prob;
      bestMatch = {
        matchedKey: key,
        confidence: Math.round(prob * 100) / 100,
        translation: trans,
        isExact: false,
      };
    }
  }

  // Also check individual words if user passed multiple words (e.g. "desi began")
  const tokens = trimmed.split(/\s+/);
  if (tokens.length > 1) {
    for (const token of tokens) {
      if (token.length < 3) continue;
      for (const [key, trans] of Object.entries(dictionary)) {
        if (key.includes('(') || key.length > 25) continue;
        const tokenProb = calculateCropProbability(token, key);
        if (tokenProb > maxProbability) {
          maxProbability = tokenProb;
          bestMatch = {
            matchedKey: key,
            confidence: Math.round(tokenProb * 100) / 100,
            translation: trans,
            isExact: false,
          };
        }
      }
    }
  }

  if (bestMatch && bestMatch.confidence >= minThreshold) {
    return bestMatch;
  }

  return null;
}
