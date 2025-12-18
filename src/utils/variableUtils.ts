import type { Variable } from '../types';

export const parseVariables = (content: string): Variable[] => {
  const regex = /\{\{([^}]+)\}\}|\[([^\]]+)\]|\{([^}]+)\}/g;
  const variables: Variable[] = [];
  const seen = new Set<string>();

  let match;
  while ((match = regex.exec(content)) !== null) {
    const name = match[1] || match[2] || match[3];
    if (!seen.has(name)) {
      seen.add(name);
      variables.push({
        name,
        description: `請輸入 ${name}`,
        type: 'text',
        required: true
      });
    }
  }

  return variables;
};

export const replaceVariables = (content: string, values: Record<string, string>): string => {
  let result = content;
  for (const [key, value] of Object.entries(values)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}|\\[${key}\\]|\\{${key}\\}`, 'g'), value);
  }
  return result;
};
