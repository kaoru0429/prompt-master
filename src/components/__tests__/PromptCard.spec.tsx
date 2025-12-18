import { render, screen, fireEvent } from '@testing-library/react';
import PromptCard from '../PromptCard';
import { describe, it, expect, vi } from 'vitest';
import type { Prompt } from '../../types';

const mockPrompt: Prompt = {
  id: 'test-1',
  title: 'Test Prompt',
  description: 'Test Description',
  content: 'Test content',
  tags: ['tag1', 'tag2'],
  category: 'Coding',
  model: 'ChatGPT',
  mode: 'text',
  variables: [],
  isFavorite: false,
  isNSFW: false,
  source: 'local',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

console.log('Test file executing');
describe('PromptCard', () => {
  it('renders prompt details correctly', () => {
    render(
      <PromptCard
        prompt={mockPrompt}
        onView={() => { }}
        onUse={() => { }}
        onToggleFavorite={() => { }}
      />
    );

    expect(screen.getByText('Test Prompt')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('tag1')).toBeInTheDocument();
  });

  it('calls onView when clicked', () => {
    const handleView = vi.fn();
    render(
      <PromptCard
        prompt={mockPrompt}
        onView={handleView}
        onUse={() => { }}
        onToggleFavorite={() => { }}
      />
    );

    fireEvent.click(screen.getByText('Test Prompt'));
    expect(handleView).toHaveBeenCalled();
  });

  it('calls onToggleFavorite when favorite button is clicked', () => {
    const handleFavorite = vi.fn();
    render(
      <PromptCard
        prompt={mockPrompt}
        onView={() => { }}
        onUse={() => { }}
        onToggleFavorite={handleFavorite}
      />
    );

    // Find favorite button (it has specific attributes or icons, simplifying by title if possible, or using querySelector)
    // The component uses title="收藏"
    const favButton = screen.getByTitle('收藏');
    fireEvent.click(favButton);
    expect(handleFavorite).toHaveBeenCalled();
  });
});
