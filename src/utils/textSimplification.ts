// Text Simplification Utility for Deaf-Friendly Captions

interface SimplificationRules {
  [key: string]: string;
}

// Common complex phrases and their simplified versions
const SIMPLIFICATION_RULES: SimplificationRules = {
  // English simplifications
  'in order to': 'to',
  'at this point in time': 'now',
  'due to the fact that': 'because',
  'in the event that': 'if',
  'prior to': 'before',
  'subsequent to': 'after',
  'in spite of': 'despite',
  'with regard to': 'about',
  'in the near future': 'soon',
  'at the present time': 'now',
  'make a decision': 'decide',
  'come to a conclusion': 'conclude',
  'give consideration to': 'consider',
  'make an attempt': 'try',
  'have a discussion': 'discuss',
  'conduct an investigation': 'investigate',
  'provide assistance': 'help',
  'in accordance with': 'by',
  'for the purpose of': 'for',
  'in the amount of': 'for',
};

/**
 * Simplifies text for better comprehension by Deaf and hard-of-hearing users
 * @param text - Original text to simplify
 * @returns Simplified version of the text
 */
export function simplifyText(text: string): string {
  if (!text) return text;

  let simplified = text.toLowerCase();

  // Apply simplification rules
  for (const [complex, simple] of Object.entries(SIMPLIFICATION_RULES)) {
    const regex = new RegExp(complex, 'gi');
    simplified = simplified.replace(regex, simple);
  }

  // Remove unnecessary filler words
  const fillerWords = ['actually', 'basically', 'literally', 'obviously', 'essentially'];
  fillerWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    simplified = simplified.replace(regex, '');
  });

  // Clean up multiple spaces
  simplified = simplified.replace(/\s+/g, ' ').trim();

  // Capitalize first letter of sentences
  simplified = simplified.replace(/(^\w|\.\s+\w)/g, (letter) => letter.toUpperCase());

  // Break long sentences into shorter ones
  simplified = breakLongSentences(simplified);

  // Remove redundant punctuation
  simplified = simplified.replace(/[,;]+\s*([.,;])/g, '$1');

  return simplified;
}

/**
 * Breaks long sentences into shorter, more digestible segments
 */
function breakLongSentences(text: string): string {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim());
  
  const processedSentences = sentences.map(sentence => {
    sentence = sentence.trim();
    const words = sentence.split(/\s+/);
    
    // If sentence is very long (>15 words), try to break it
    if (words.length > 15) {
      // Look for conjunctions to split on
      const conjunctions = ['and', 'but', 'or', 'because', 'so', 'while'];
      for (let i = 0; i < words.length; i++) {
        if (conjunctions.includes(words[i].toLowerCase()) && i > 5) {
          const first = words.slice(0, i).join(' ');
          const second = words.slice(i + 1).join(' ');
          return `${first}. ${second.charAt(0).toUpperCase()}${second.slice(1)}`;
        }
      }
    }
    
    return sentence;
  });

  return processedSentences.join('. ') + '.';
}

/**
 * Removes technical jargon and replaces with simpler terms
 */
export function removeJargon(text: string): string {
  const jargonMap: SimplificationRules = {
    'utilize': 'use',
    'implement': 'use',
    'facilitate': 'help',
    'commence': 'start',
    'terminate': 'end',
    'acquire': 'get',
    'endeavor': 'try',
    'obtain': 'get',
    'purchase': 'buy',
    'require': 'need',
    'assist': 'help',
    'locate': 'find',
    'modify': 'change',
    'demonstrate': 'show',
    'indicate': 'show',
  };

  let result = text;
  for (const [jargon, simple] of Object.entries(jargonMap)) {
    const regex = new RegExp(`\\b${jargon}\\b`, 'gi');
    result = result.replace(regex, simple);
  }

  return result;
}

/**
 * Formats numbers for better readability
 */
export function formatNumbers(text: string): string {
  // Convert large numbers to words (for better comprehension)
  return text.replace(/\b(\d{4,})\b/g, (match) => {
    const num = parseInt(match);
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)} million`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)} thousand`;
    }
    return match;
  });
}

/**
 * Main simplification function that applies all rules
 */
export function simplifyCaption(text: string): string {
  let result = text;
  result = removeJargon(result);
  result = simplifyText(result);
  result = formatNumbers(result);
  return result;
}
