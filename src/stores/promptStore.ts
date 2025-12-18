import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Prompt, Collection, PromptSource } from '../types';
import { db } from '../services/db';

interface PromptStore {
  prompts: Prompt[];
  collections: Collection[];
  sources: PromptSource[];
  filters: {
    search: string;
    tags: string[];
    category: string;
    model: string;
    showNSFW: boolean;
    source: string;
  };

  // Actions
  loadPrompts: () => Promise<void>;
  addPrompt: (prompt: Prompt) => Promise<void>;
  updatePrompt: (id: string, updates: Partial<Prompt>) => Promise<void>;
  deletePrompt: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;

  setFilter: (key: keyof PromptStore['filters'], value: any) => void;
  clearFilters: () => void;

  // Collections
  addCollection: (collection: Collection) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;

  // Sources
  toggleSource: (id: string) => Promise<void>;
  syncSource: (id: string) => Promise<void>;
}

const defaultSources: PromptSource[] = [
  {
    id: 'prompthero',
    name: 'PromptHero',
    url: 'https://prompthero.com',
    enabled: true,
    isNSFW: false,
    promptCount: 500
  },
  {
    id: 'flowgpt',
    name: 'FlowGPT',
    url: 'https://flowgpt.com',
    enabled: true,
    isNSFW: false,
    promptCount: 300
  },
  {
    id: 'awesome-prompts',
    name: 'Awesome ChatGPT Prompts',
    url: 'https://github.com/f/awesome-chatgpt-prompts',
    enabled: true,
    isNSFW: false,
    promptCount: 150
  },
  {
    id: 'civitai',
    name: 'CivitAI',
    url: 'https://civitai.com',
    enabled: false,
    isNSFW: true,
    promptCount: 1000
  },
  {
    id: 'promptbase',
    name: 'PromptBase',
    url: 'https://promptbase.com',
    enabled: false,
    isNSFW: false,
    promptCount: 200
  }
];

export const usePromptStore = create<PromptStore>()(
  persist(
    (set, get) => ({
      prompts: [],
      collections: [],
      sources: defaultSources,
      filters: {
        search: '',
        tags: [],
        category: '',
        model: '',
        showNSFW: false,
        source: ''
      },

      loadPrompts: async () => {
        const prompts = await db.prompts.toArray();
        const collections = await db.collections.toArray();
        set({ prompts, collections });
      },

      addPrompt: async (prompt) => {
        await db.prompts.add(prompt);
        set((state) => ({ prompts: [...state.prompts, prompt] }));
      },

      updatePrompt: async (id, updates) => {
        await db.prompts.update(id, { ...updates, updatedAt: new Date().toISOString() });
        set((state) => ({
          prompts: state.prompts.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
          )
        }));
      },

      deletePrompt: async (id) => {
        await db.prompts.delete(id);
        set((state) => ({ prompts: state.prompts.filter((p) => p.id !== id) }));
      },

      toggleFavorite: async (id) => {
        const prompt = get().prompts.find((p) => p.id === id);
        if (prompt) {
          await db.prompts.update(id, { isFavorite: !prompt.isFavorite });
          set((state) => ({
            prompts: state.prompts.map((p) =>
              p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
            )
          }));
        }
      },

      setFilter: (key, value) => {
        set((state) => ({
          filters: { ...state.filters, [key]: value }
        }));
      },

      clearFilters: () => {
        set({
          filters: {
            search: '',
            tags: [],
            category: '',
            model: '',
            showNSFW: false,
            source: ''
          }
        });
      },

      addCollection: async (collection) => {
        await db.collections.add(collection);
        set((state) => ({ collections: [...state.collections, collection] }));
      },

      deleteCollection: async (id) => {
        await db.collections.delete(id);
        set((state) => ({ collections: state.collections.filter((c) => c.id !== id) }));
      },

      toggleSource: async (id) => {
        set((state) => ({
          sources: state.sources.map((s) =>
            s.id === id ? { ...s, enabled: !s.enabled } : s
          )
        }));
      },

      syncSource: async (id) => {
        try {
          const { syncPromptsFromSource } = await import('../services/sync');
          const newPrompts = await syncPromptsFromSource(id);

          if (newPrompts.length > 0) {
            await db.prompts.bulkPut(newPrompts);
            // Update local state to include new prompts
            const currentPrompts = await db.prompts.toArray();
            // Optimization: We could just append, but bulkPut updates existing, so reloading is safer to keep consistency
            set((state) => ({
              prompts: currentPrompts,
              sources: state.sources.map((s) =>
                s.id === id ? { ...s, lastSync: new Date().toISOString(), promptCount: (s.promptCount || 0) + newPrompts.length } : s
              )
            }));
          } else {
            // Just update the timestamp if no new prompts
            set((state) => ({
              sources: state.sources.map((s) =>
                s.id === id ? { ...s, lastSync: new Date().toISOString() } : s
              )
            }));
          }
        } catch (error) {
          console.error('Sync failed:', error);
        }
      }
    }),
    {
      name: 'prompt-master-storage',
      partialize: (state) => ({
        sources: state.sources,
        filters: { showNSFW: state.filters.showNSFW }
      })
    }
  )
);
