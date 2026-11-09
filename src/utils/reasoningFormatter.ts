/**
 * Parses raw text from the AI to extract structured reasoning steps
 */
export interface ParsedReasoning {
  rawReasoning: string;
  cleanedText: string;
  sections: Array<{ label: string; content: string }>;
}

export function parseReasoning(fullText: string): ParsedReasoning {
  let rawReasoning = '';
  let cleanedText = fullText;

  // 1. Check for <reasoning> tags
  const tagMatch = fullText.match(/<reasoning>([\s\S]*?)<\/reasoning>/i);
  if (tagMatch) {
    rawReasoning = tagMatch[1].trim();
    cleanedText = fullText.replace(/<reasoning>[\s\S]*?<\/reasoning>/i, '').trim();
  }

  // 2. Parse sections like [SITUATION ANALYSIS], [TACTICAL ASSESSMENT], etc.
  const sections: Array<{ label: string; content: string }> = [];
  const sectionRegex = /\[([A-Z\s&_-]+)\]([\s\S]*?)(?=\[[A-Z\s&_-]+\]|$)/g;

  if (rawReasoning) {
    let match;
    while ((match = sectionRegex.exec(rawReasoning)) !== null) {
      sections.push({
        label: match[1].trim(),
        content: match[2].trim(),
      });
    }

    if (sections.length === 0 && rawReasoning.length > 0) {
      sections.push({
        label: 'NEURAL CONTEXT SYNTHESIS',
        content: rawReasoning,
      });
    }
  }

  return {
    rawReasoning,
    cleanedText,
    sections,
  };
}
