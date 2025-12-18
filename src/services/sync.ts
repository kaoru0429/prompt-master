import type { Prompt } from '../types';
import { generateId } from '../utils/common';

// Mock sync implementation
export async function syncPromptsFromSource(sourceId: string): Promise<Prompt[]> {
  console.log(`Starting sync for ${sourceId}...`);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  if (sourceId === 'awesome-prompts') {
    return fetchAwesomePrompts();
  }

  // Fallback / Mock for others
  return generateMockPrompts(sourceId);
}

async function fetchAwesomePrompts(): Promise<Prompt[]> {
  try {
    const response = await fetch('https://raw.githubusercontent.com/f/awesome-chatgpt-prompts/main/prompts.csv');
    const text = await response.text();
    // Simple CSV parser (assuming no commas in quotes for MVP, though actual CSV is complex)
    // Actually, the repo uses "act", "prompt" columns.
    // Let's doing a manual parse splitting by `","` if possible or just line by line.

    // A robust CSV parser is better, but here's a lightweight one for this specific file structure
    const lines = text.split('\n');
    // const headers = lines[0].split(','); // "act","prompt" - unused

    const prompts: Prompt[] = [];

    // Skip header, limit to 20 for safety
    for (let i = 1; i < Math.min(lines.length, 21); i++) {
      const line = lines[i];
      if (!line) continue;

      // This is a naive split, real CSVs have quoted fields with commas. 
      // But for "Awesome Prompts", many are simple. 
      // Let's use a regex to capture quoted strings.
      const matches = line.match(/"([^"]*)"/g);

      if (matches && matches.length >= 2) {
        const act = matches[0].replace(/^"|"$/g, '').replace(/""/g, '"');
        const content = matches[1].replace(/^"|"$/g, '').replace(/""/g, '"');

        prompts.push({
          id: generateId(),
          title: act,
          description: `From Awesome ChatGPT Prompts: ${act}`,
          content: content,
          tags: ['synced', 'community', 'awesome-prompts'],
          category: 'Other',
          model: 'ChatGPT',
          mode: 'text',
          variables: [],
          isFavorite: false,
          isNSFW: false,
          source: 'synced',
          sourceUrl: 'https://github.com/f/awesome-chatgpt-prompts',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    }
    return prompts;
  } catch (error) {
    console.error('Failed to fetch Awesome Prompts:', error);
    return [];
  }
}

function generateMockPrompts(sourceId: string): Prompt[] {
  return [
    {
      id: `${sourceId}-${Date.now()}`,
      title: `New Trend from ${sourceId}`,
      description: 'A trending prompt synced from external source',
      content: 'You are an AI assistant...',
      tags: ['synced', sourceId],
      category: 'Other',
      model: 'All',
      mode: 'text',
      variables: [],
      isFavorite: false,
      isNSFW: false,
      source: 'synced',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
}
