import React, { useState } from 'react';
import { Download, Sparkles, Trash2, AlertTriangle, RefreshCw } from 'lucide-react';
import { usePromptStore } from '../stores/promptStore';
import ImportExportModal from '../components/modals/ImportExportModal';
import { batchAnalyzePrompts, detectDuplicatesAndInvalid, type DuplicateCheckResult } from '../services/gemini';
import type { Prompt } from '../types';
import { toast } from 'sonner';

const SettingsPage: React.FC = () => {
  const { prompts, sources, toggleSource, addPrompt, updatePrompt, deletePrompt } = usePromptStore();
  const [showImportExport, setShowImportExport] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [duplicates, setDuplicates] = useState<DuplicateCheckResult[]>([]);

  const handleBulkImport = (importedPrompts: Prompt[]) => {
    importedPrompts.forEach(p => addPrompt(p));
  };

  // AI 批量分析未分類的 Prompts
  const handleBatchAnalyze = async () => {
    const uncategorizedPrompts = prompts.filter(
      p => !p.title || p.title === '未命名 Prompt' || p.category === 'Other'
    );

    if (uncategorizedPrompts.length === 0) {
      toast.info('所有 Prompts 都已分類完成！');
      return;
    }

    setIsAnalyzing(true);
    toast.loading(`正在分析 ${uncategorizedPrompts.length} 個 Prompts...`, { id: 'batch-analyze' });

    try {
      const results = await batchAnalyzePrompts(
        uncategorizedPrompts.map(p => ({ id: p.id, content: p.content }))
      );

      let updated = 0;
      for (const [id, analysis] of results) {
        await updatePrompt(id, {
          title: analysis.title,
          description: analysis.description,
          tags: analysis.tags,
          category: analysis.category,
          model: analysis.model
        });
        updated++;
      }

      toast.success(`成功分析並更新了 ${updated} 個 Prompts！`, { id: 'batch-analyze' });
    } catch (error) {
      console.error('Batch analysis failed:', error);
      toast.error('批量分析失敗，請檢查 API Key 設定', { id: 'batch-analyze' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 檢測重複和無效的 Prompts
  const handleCheckDuplicates = async () => {
    if (prompts.length === 0) {
      toast.info('目前沒有任何 Prompts');
      return;
    }

    setIsChecking(true);
    toast.loading('正在檢測重複和無效的 Prompts...', { id: 'check-duplicates' });

    try {
      const results = await detectDuplicatesAndInvalid(
        prompts.map(p => ({ id: p.id, title: p.title, content: p.content }))
      );

      setDuplicates(results);

      if (results.length === 0) {
        toast.success('太棒了！沒有發現重複或無效的 Prompts', { id: 'check-duplicates' });
      } else {
        toast.warning(`發現 ${results.length} 個建議刪除的 Prompts`, { id: 'check-duplicates' });
      }
    } catch (error) {
      console.error('Duplicate check failed:', error);
      toast.error('檢測失敗，請稍後再試', { id: 'check-duplicates' });
    } finally {
      setIsChecking(false);
    }
  };

  // 刪除建議的 Prompt
  const handleDeleteSuggested = async (id: string) => {
    await deletePrompt(id);
    setDuplicates(prev => prev.filter(d => d.id !== id));
    toast.success('已刪除');
  };

  // 清除所有建議
  const handleClearSuggestions = () => {
    setDuplicates([]);
  };

  // 批量刪除「分析失敗」的 Prompts
  const failedPrompts = prompts.filter(
    p => p.title === '未命名 Prompt' && p.description?.includes('自動分析失敗')
  );

  const handleDeleteAllFailed = async () => {
    if (failedPrompts.length === 0) {
      toast.info('沒有找到分析失敗的 Prompts');
      return;
    }

    const confirmed = window.confirm(
      `確定要刪除 ${failedPrompts.length} 個分析失敗的 Prompts 嗎？此操作無法復原。`
    );

    if (!confirmed) return;

    toast.loading(`正在刪除 ${failedPrompts.length} 個 Prompts...`, { id: 'delete-failed' });

    try {
      for (const p of failedPrompts) {
        await deletePrompt(p.id);
      }
      toast.success(`已刪除 ${failedPrompts.length} 個分析失敗的 Prompts`, { id: 'delete-failed' });
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('刪除失敗', { id: 'delete-failed' });
    }
  };


  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>設定</h2>

      {/* AI 庫管理 */}
      <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '20px', marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} style={{ color: 'var(--accent)' }} /> AI 庫管理
        </h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '14px' }}>
          使用 AI 自動分析未分類的 Prompts，並檢測重複或無效項目
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary"
            onClick={handleBatchAnalyze}
            disabled={isAnalyzing}
          >
            <RefreshCw size={16} className={isAnalyzing ? 'spinning' : ''} />
            {isAnalyzing ? '分析中...' : 'AI 批量分類'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleCheckDuplicates}
            disabled={isChecking}
          >
            <AlertTriangle size={16} />
            {isChecking ? '檢測中...' : '檢測重複/無效'}
          </button>
          {failedPrompts.length > 0 && (
            <button
              className="btn btn-secondary"
              onClick={handleDeleteAllFailed}
              style={{ color: 'var(--danger)' }}
            >
              <Trash2 size={16} />
              刪除分析失敗 ({failedPrompts.length})
            </button>
          )}
        </div>

        {/* 重複檢測結果 */}
        {duplicates.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h4 style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                建議刪除的 Prompts ({duplicates.length})
              </h4>
              <button className="btn btn-secondary" onClick={handleClearSuggestions} style={{ padding: '4px 12px', fontSize: '12px' }}>
                清除建議
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflow: 'auto' }}>
              {duplicates.map(d => (
                <div
                  key={d.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    background: 'var(--bg-primary)',
                    borderRadius: 'var(--radius-sm)',
                    border: `1px solid ${d.reason === 'duplicate' ? 'rgba(251, 191, 36, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, marginBottom: '4px' }}>{d.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {d.reason === 'duplicate' && d.similarTo && (
                        <span>🔄 與「{d.similarTo}」相似度 {d.similarity}%</span>
                      )}
                      {d.reason === 'invalid' && <span>⚠️ {d.suggestion}</span>}
                      {d.reason === 'low_quality' && <span>📉 {d.suggestion}</span>}
                    </div>
                  </div>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleDeleteSuggested(d.id)}
                    style={{ padding: '6px 12px', color: '#ef4444' }}
                  >
                    <Trash2 size={14} /> 刪除
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '20px', marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>📦 備份與還原</h3>
        <button className="btn btn-secondary" onClick={() => setShowImportExport(true)}>
          <Download size={16} /> 匯入 / 匯出 Prompts
        </button>
      </div>

      <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '20px', marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>Prompt 來源管理</h3>
        {sources.map(source => (
          <div key={source.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
            <input
              type="checkbox"
              checked={source.enabled}
              onChange={() => toggleSource(source.id)}
              style={{ accentColor: '#6366f1' }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500 }}>{source.name}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{source.url}</div>
            </div>
            {source.isNSFW && <span className="tag nsfw">NSFW</span>}
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '20px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>關於</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          Prompt Master v1.2.0<br />
          使用 Gemini AI 進行智慧分析<br />
          資料儲存於本地 IndexedDB
        </p>
      </div>

      {showImportExport && (
        <ImportExportModal
          onClose={() => setShowImportExport(false)}
          prompts={prompts}
          onImport={handleBulkImport}
        />
      )}
    </div>
  );
};

export default SettingsPage;
