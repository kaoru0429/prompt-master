import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { usePromptStore } from '../stores/promptStore';
import { samplePrompts } from '../data/samplePrompts';
import { usePromptFilters } from '../hooks/usePromptFilters';
import type { Prompt } from '../types';

import PromptLibrary from '../components/PromptLibrary';
import AddPromptModal from '../components/modals/AddPromptModal';
import ViewEditPromptModal from '../components/modals/ViewEditPromptModal';
import ImportExportModal from '../components/modals/ImportExportModal';
import CollectionModal from '../components/modals/CollectionModal';
import UsePromptModal from '../components/modals/UsePromptModal';

interface HomePageProps {
  view?: 'all' | 'favorites';
}

const HomePage: React.FC<HomePageProps> = ({ view = 'all' }) => {
  const { prompts, addPrompt, updatePrompt, deletePrompt, toggleFavorite, loadPrompts, addCollection } = usePromptStore();
  const { setActiveTab } = usePromptFilters();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportExportModal, setShowImportExportModal] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [usePrompt, setUsePrompt] = useState<Prompt | null>(null);
  const [viewPrompt, setViewPrompt] = useState<Prompt | null>(null);

  useEffect(() => {
    loadPrompts().then(() => {
      const state = usePromptStore.getState();
      if (state.prompts.length === 0) {
        samplePrompts.forEach(p => state.addPrompt(p));
      }
    }).catch(err => {
      console.error('loadPrompts failed:', err);
    });
  }, []);

  useEffect(() => {
    if (view === 'favorites') {
      setActiveTab('favorites');
    } else {
      setActiveTab('all');
    }
  }, [view, setActiveTab]);

  const handleBulkImport = (importedPrompts: Prompt[]) => {
    importedPrompts.forEach(p => addPrompt(p));
  };

  return (
    <>
      <div className="header">
        <h1>{view === 'favorites' ? '我的收藏' : 'Prompt Master'}</h1>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={18} /> 新增 Prompt
        </button>
      </div>

      <PromptLibrary
        onViewPrompt={setViewPrompt}
        onUsePrompt={setUsePrompt}
        onToggleFavorite={toggleFavorite}
      />

      {showAddModal && (
        <AddPromptModal
          onClose={() => setShowAddModal(false)}
          onSave={addPrompt}
        />
      )}

      {showImportExportModal && (
        <ImportExportModal
          onClose={() => setShowImportExportModal(false)}
          prompts={prompts}
          onImport={handleBulkImport}
        />
      )}

      {showCollectionModal && (
        <CollectionModal
          onClose={() => setShowCollectionModal(false)}
          onSave={addCollection}
        />
      )}

      {viewPrompt && (
        <ViewEditPromptModal
          prompt={viewPrompt}
          onClose={() => setViewPrompt(null)}
          onSave={(updatedPrompt: Prompt) => {
            updatePrompt(updatedPrompt.id, updatedPrompt);
            setViewPrompt(null);
          }}
          onDelete={deletePrompt}
          onUse={() => {
            setUsePrompt(viewPrompt);
            setViewPrompt(null);
          }}
        />
      )}

      {usePrompt && (
        <UsePromptModal
          prompt={usePrompt}
          onClose={() => setUsePrompt(null)}
        />
      )}
    </>
  );
};

export default HomePage;
