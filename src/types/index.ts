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
  history?: PromptHistoryEntry[];
}

export interface PromptHistoryEntry {
  id: string;
  content: string;
  timestamp: string;
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

export type PageType = 'all' | 'favorites' | 'trending' | 'tags' | 'settings' | 'collections' | 'workflows';

// Workflow Types

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  variables: Variable[]; // Global workflow variables or input variables
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowStep {
  id: string;
  promptId?: string; // If null, it's a "custom" prompt step or logic
  name: string;
  content: string; // The prompt template for this step
  inputs: Record<string, string>; // Mapping of variable name to value (or reference to previous output)
  outputVariable?: string; // Name of the variable to store the output result
}

export interface WorkflowRun {
  id: string;
  workflowId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  results: Record<string, string>; // Variable name -> Result
  stepResults: Record<string, string>; // Step ID -> Result
  createdAt: string;
  completedAt?: string;
  error?: string;
}
