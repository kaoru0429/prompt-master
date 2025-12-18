import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePromptFilters } from '../usePromptFilters';
import { usePromptStore } from '../../stores/promptStore';

// Mock the prompt store
vi.mock('../../stores/promptStore', () => ({
  usePromptStore: vi.fn(),
}));

describe('usePromptFilters', () => {
  const mockPrompts = [
    {
      id: '1',
      title: 'Prompt 1',
      description: 'Desc 1',
      content: 'Content 1',
      tags: ['tag1'],
      category: 'Coding',
      model: 'ChatGPT',
      isFavorite: true,
      isNSFW: false,
    },
    {
      id: '2',
      title: 'Prompt 2',
      description: 'Desc 2',
      content: 'Content 2',
      tags: ['tag2'],
      category: 'Writing',
      model: 'Claude',
      isFavorite: false,
      isNSFW: true,
    },
  ];

  const mockFilters = {
    search: '',
    category: '',
    model: '',
    showNSFW: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (usePromptStore as any).mockReturnValue({
      prompts: mockPrompts,
      filters: mockFilters,
    });
  });

  it('should return all non-NSFW prompts by default', () => {
    const { result } = renderHook(() => usePromptFilters());
    expect(result.current.filteredPrompts).toHaveLength(1);
    expect(result.current.filteredPrompts[0].id).toBe('1');
  });

  it('should filter by favorites when activeTab is favorites', () => {
    const { result } = renderHook(() => usePromptFilters());

    act(() => {
      result.current.setActiveTab('favorites');
    });

    expect(result.current.filteredPrompts).toHaveLength(1);
    expect(result.current.filteredPrompts[0].isFavorite).toBe(true);
  });

  it('should filter by search query', () => {
    (usePromptStore as any).mockReturnValue({
      prompts: mockPrompts,
      filters: { ...mockFilters, search: 'Prompt 2' },
    });

    const { result } = renderHook(() => usePromptFilters());

    // Note: Prompt 2 is NSFW and showNSFW is false, so it should be empty
    expect(result.current.filteredPrompts).toHaveLength(0);

    // If we enable showNSFW
    (usePromptStore as any).mockReturnValue({
      prompts: mockPrompts,
      filters: { ...mockFilters, search: 'Prompt 2', showNSFW: true },
    });

    const { result: result2 } = renderHook(() => usePromptFilters());
    expect(result2.current.filteredPrompts).toHaveLength(1);
    expect(result2.current.filteredPrompts[0].id).toBe('2');
  });

  it('should filter by category', () => {
    (usePromptStore as any).mockReturnValue({
      prompts: mockPrompts,
      filters: { ...mockFilters, category: 'Coding' },
    });

    const { result } = renderHook(() => usePromptFilters());
    expect(result.current.filteredPrompts).toHaveLength(1);
    expect(result.current.filteredPrompts[0].category).toBe('Coding');
  });
});
