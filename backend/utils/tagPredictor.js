/**
 * Tag Prediction Service
 * Automatically predicts relevant tags based on doubt content
 */

const { extractKeywords, tokenize } = require('./nlpUtils');

// Predefined tag categories with keywords
const TAG_CATEGORIES = {
  'dsa': ['algorithm', 'data', 'structure', 'array', 'linked', 'list', 'tree', 'graph', 
          'stack', 'queue', 'sorting', 'searching', 'binary', 'heap', 'hash', 'dp', 
          'dynamic', 'programming', 'recursion', 'greedy', 'backtracking', 'complexity'],
  
  'oop': ['object', 'oriented', 'class', 'inheritance', 'polymorphism', 'encapsulation',
          'abstraction', 'interface', 'constructor', 'destructor', 'method', 'attribute'],
  
  'dbms': ['database', 'sql', 'query', 'table', 'join', 'primary', 'key', 'foreign',
           'normalization', 'index', 'transaction', 'acid', 'relation', 'schema'],
  
  'web-development': ['html', 'css', 'javascript', 'react', 'angular', 'vue', 'node',
                      'express', 'frontend', 'backend', 'web', 'dom', 'api', 'rest'],
  
  'java': ['java', 'jvm', 'spring', 'hibernate', 'servlet', 'jsp', 'multithreading',
           'exception', 'collections', 'stream'],
  
  'python': ['python', 'django', 'flask', 'pandas', 'numpy', 'matplotlib', 'pip',
             'virtualenv', 'decorator', 'generator'],
  
  'sql': ['select', 'insert', 'update', 'delete', 'join', 'where', 'group', 'order',
          'having', 'aggregate', 'subquery'],
  
  'os': ['operating', 'system', 'process', 'thread', 'scheduling', 'memory', 'virtual',
         'paging', 'segmentation', 'deadlock', 'semaphore', 'mutex'],
  
  'networking': ['network', 'tcp', 'ip', 'http', 'https', 'dns', 'routing', 'protocol',
                 'socket', 'port', 'firewall', 'osi', 'layer'],
  
  'aptitude': ['aptitude', 'logical', 'reasoning', 'puzzle', 'probability', 'permutation',
               'combination', 'percentage', 'ratio', 'time', 'speed', 'distance'],
  
  'machine-learning': ['machine', 'learning', 'neural', 'network', 'deep', 'ai', 'model',
                       'training', 'classification', 'regression', 'clustering'],
  
  'git': ['git', 'github', 'version', 'control', 'commit', 'branch', 'merge', 'pull',
          'push', 'clone', 'repository']
};

/**
 * Predict tags based on doubt content
 */
function predictTags(title, description, maxTags = 5) {
  const text = `${title} ${description}`.toLowerCase();
  const tokens = tokenize(text);
  const keywords = extractKeywords(text, 20);
  
  const tagScores = {};
  
  // Score each tag based on keyword matches
  Object.entries(TAG_CATEGORIES).forEach(([tag, tagKeywords]) => {
    let score = 0;
    
    tagKeywords.forEach(keyword => {
      // Check if keyword appears in text
      if (tokens.includes(keyword)) {
        score += 2; // Direct match
      }
      
      // Check if keyword is in extracted keywords
      if (keywords.includes(keyword)) {
        score += 3; // Important keyword match
      }
      
      // Partial matches
      tokens.forEach(token => {
        if (token.includes(keyword) || keyword.includes(token)) {
          score += 0.5;
        }
      });
    });
    
    if (score > 0) {
      tagScores[tag] = score;
    }
  });
  
  // Sort by score and return top tags
  const predictedTags = Object.entries(tagScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxTags)
    .map(([tag]) => tag);
  
  return predictedTags;
}

/**
 * Get all available tags
 */
function getAllTags() {
  return Object.keys(TAG_CATEGORIES);
}

/**
 * Add custom tag logic (can be extended)
 */
function validateTag(tag) {
  const normalizedTag = tag.toLowerCase().trim();
  return normalizedTag.length >= 2 && normalizedTag.length <= 30;
}

module.exports = {
  predictTags,
  getAllTags,
  validateTag,
  TAG_CATEGORIES
};
