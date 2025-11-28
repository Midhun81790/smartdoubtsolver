/**
 * NLP Utilities for Smart Doubt Solver
 * Handles text preprocessing, keyword extraction, and similarity calculation
 */

// Common stopwords to remove
const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but',
  'by', 'can', 'cannot', 'could', 'did', 'do', 'does', 'doing', 'down', 'during', 'each',
  'few', 'for', 'from', 'further', 'had', 'has', 'have', 'having', 'he', 'her', 'here',
  'hers', 'herself', 'him', 'himself', 'his', 'how', 'i', 'if', 'in', 'into', 'is', 'it',
  'its', 'itself', 'just', 'me', 'might', 'more', 'most', 'must', 'my', 'myself', 'no',
  'nor', 'not', 'now', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'our', 'ours',
  'ourselves', 'out', 'over', 'own', 'same', 'she', 'should', 'so', 'some', 'such', 'than',
  'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they',
  'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'we',
  'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'will', 'with',
  'would', 'you', 'your', 'yours', 'yourself', 'yourselves'
]);

/**
 * Tokenize text into words
 */
function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Remove punctuation
    .split(/\s+/)
    .filter(word => word.length > 0);
}

/**
 * Remove stopwords from token array
 */
function removeStopwords(tokens) {
  return tokens.filter(token => !STOPWORDS.has(token) && token.length > 2);
}

/**
 * Extract keywords from text
 */
function extractKeywords(text, maxKeywords = 10) {
  const tokens = tokenize(text);
  const filtered = removeStopwords(tokens);
  
  // Calculate frequency
  const frequency = {};
  filtered.forEach(token => {
    frequency[token] = (frequency[token] || 0) + 1;
  });
  
  // Sort by frequency and return top keywords
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([word]) => word);
}

/**
 * Calculate cosine similarity between two texts
 */
function cosineSimilarity(text1, text2) {
  const tokens1 = removeStopwords(tokenize(text1));
  const tokens2 = removeStopwords(tokenize(text2));
  
  if (tokens1.length === 0 || tokens2.length === 0) {
    return 0;
  }
  
  // Create frequency vectors
  const allTokens = new Set([...tokens1, ...tokens2]);
  const vector1 = {};
  const vector2 = {};
  
  allTokens.forEach(token => {
    vector1[token] = 0;
    vector2[token] = 0;
  });
  
  tokens1.forEach(token => vector1[token]++);
  tokens2.forEach(token => vector2[token]++);
  
  // Calculate dot product and magnitudes
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;
  
  allTokens.forEach(token => {
    dotProduct += vector1[token] * vector2[token];
    magnitude1 += vector1[token] ** 2;
    magnitude2 += vector2[token] ** 2;
  });
  
  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);
  
  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }
  
  return dotProduct / (magnitude1 * magnitude2);
}

/**
 * Calculate TF-IDF score for keywords
 */
function calculateTFIDF(text, corpus = []) {
  const tokens = removeStopwords(tokenize(text));
  const tokenCount = tokens.length;
  
  // Calculate term frequency
  const tf = {};
  tokens.forEach(token => {
    tf[token] = (tf[token] || 0) + 1 / tokenCount;
  });
  
  // Calculate IDF if corpus is provided
  if (corpus.length > 0) {
    const idf = {};
    const docCount = corpus.length + 1;
    
    Object.keys(tf).forEach(term => {
      const docsWithTerm = corpus.filter(doc => 
        tokenize(doc).includes(term)
      ).length + 1;
      
      idf[term] = Math.log(docCount / docsWithTerm);
    });
    
    // Calculate TF-IDF
    const tfidf = {};
    Object.keys(tf).forEach(term => {
      tfidf[term] = tf[term] * (idf[term] || 1);
    });
    
    return Object.entries(tfidf)
      .sort((a, b) => b[1] - a[1])
      .map(([word]) => word);
  }
  
  return Object.keys(tf);
}

/**
 * Preprocess text for analysis
 */
function preprocessText(text) {
  return {
    original: text,
    tokens: tokenize(text),
    filtered: removeStopwords(tokenize(text)),
    keywords: extractKeywords(text)
  };
}

module.exports = {
  tokenize,
  removeStopwords,
  extractKeywords,
  cosineSimilarity,
  calculateTFIDF,
  preprocessText,
  STOPWORDS
};
