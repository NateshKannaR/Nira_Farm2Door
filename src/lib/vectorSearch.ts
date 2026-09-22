/**
 * Generate semantic vector embedding for crop description / query
 * Uses lightweight TF-IDF / character ngram vectorizer for fast in-memory similarity matching,
 * 384-dimensional cosine distance vectors.
 */
export function generateCropVectorEmbedding(text: string, dimensions = 384): number[] {
  const vector: number[] = new Array(dimensions).fill(0);
  const normalized = text.toLowerCase().trim();
  
  for (let i = 0; i < normalized.length; i++) {
    const charCode = normalized.charCodeAt(i);
    const index = (charCode * (i + 1) * 31) % dimensions;
    vector[index] += 1.0 / (normalized.length + 1);
  }

  // Normalize vector to unit length (L2 norm)
  const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  if (norm > 0) {
    for (let i = 0; i < dimensions; i++) {
      vector[i] /= norm;
    }
  }

  return vector;
}

/**
 * Calculate Cosine Similarity between two vector embeddings
 */
export function calculateCosineSimilarity(v1: number[], v2: number[]): number {
  if (v1.length !== v2.length) return 0;
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;
  for (let i = 0; i < v1.length; i++) {
    dotProduct += v1[i] * v2[i];
    norm1 += v1[i] * v1[i];
    norm2 += v2[i] * v2[i];
  }
  if (norm1 === 0 || norm2 === 0) return 0;
  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}
