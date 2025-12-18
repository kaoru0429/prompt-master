import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { db } from '../services/db';

const ResetDataButton: React.FC = () => {
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    const confirmed = window.confirm(
      '確定要重置所有資料嗎？\n\n此操作將會：\n1. 刪除所有自定義的 Prompt\n2. 清除所有收藏與標籤\n3. 恢復預設的來源設定\n\n⚠️ 此操作無法復原！'
    );

    if (!confirmed) return;

    setIsResetting(true);
    toast.loading('正在重置資料...', { id: 'reset-data' });

    try {
      // 1. 清除 IndexedDB
      await db.delete();
      await db.open();

      // 2. 清除 localStorage (Zustand persist)
      localStorage.removeItem('prompt-master-storage');

      // 3. 顯示成功訊息並重新載入
      toast.success('資料已重置，正在重新載入...', { id: 'reset-data' });

      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error) {
      console.error('Reset failed:', error);
      toast.error('重置失敗，請手動清除瀏覽器資料', { id: 'reset-data' });
      setIsResetting(false);
    }
  };

  return (
    <button
      className="btn"
      onClick={handleReset}
      disabled={isResetting}
      style={{
        color: 'var(--text-muted)',
        border: '1px solid var(--border)',
        marginTop: '12px'
      }}
    >
      <RotateCcw size={16} className={isResetting ? 'spinning' : ''} />
      {isResetting ? '重置中...' : '重置為預設資料'}
    </button>
  );
};

export default ResetDataButton;
