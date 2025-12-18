import { useMemo, useState } from 'react';
import { usePromptStore } from '../stores/promptStore';

export type TabType = 'all' | 'favorites' | 'nsfw';

export const usePromptFilters = () => {
  const { prompts, filters } = usePromptStore();
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const filteredPrompts = useMemo(() => {
    return prompts.filter((p) => {
      // 1. Tab filter
      if (activeTab === 'favorites' && !p.isFavorite) return false;
      if (activeTab === 'nsfw' && !p.isNSFW) return false;

      // 2. NSFW filter (global)
      if (!filters.showNSFW && p.isNSFW && activeTab !== 'nsfw') return false;

      // 3. Search filter
      if (filters.search) {
        const search = filters.search.toLowerCase();
        if (
          !p.title.toLowerCase().includes(search) &&
          !p.description.toLowerCase().includes(search) &&
          !p.content.toLowerCase().includes(search) &&
          !p.model.toLowerCase().includes(search) &&
          !p.tags.some((t) => t.toLowerCase().includes(search))
        ) {
          return false;
        }
      }

      // 4. Category filter
      if (filters.category && p.category !== filters.category) return false;

      // 5. Model filter
      if (filters.model && p.model !== filters.model) return false;

      // 6. Source filter (if applicable)
      if (filters.source && p.source !== filters.source) return false;

      return true;
    });
  }, [prompts, filters, activeTab]);

  return {
    activeTab,
    setActiveTab,
    filteredPrompts,
    filters,
  };
};
