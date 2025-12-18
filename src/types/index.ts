// Prompt 資料類型定義

export interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  category: string;
  model: string;
  mode: 'text' | 'image' | 'code' | 'agent';
  variables: Variable[];
  isFavorite: boolean;
  isNSFW: boolean;
  source: 'local' | 'community' | 'synced';
  sourceUrl?: string;
  author?: string;
  rating?: number;
  views?: number;
  copies?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Variable {
  name: string;
  description: string;
  defaultValue?: string;
  type: 'text' | 'textarea' | 'select' | 'number';
  options?: string[];
  required: boolean;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  promptIds: string[];
  isVirtual: boolean;
  createdAt: string;
}

export interface PromptSource {
  id: string;
  name: string;
  url: string;
  enabled: boolean;
  isNSFW: boolean;
  lastSync?: string;
  promptCount?: number;
}

export interface TagCategory {
  name: string;
  tags: Tag[];
}

export interface Tag {
  name: string;
  count: number;
  color?: string;
}
