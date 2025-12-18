import Dexie, { type EntityTable } from 'dexie';
import type { Prompt, Collection, PromptSource } from '../types';

// IndexedDB 資料庫定義
const db = new Dexie('PromptMasterDB') as Dexie & {
  prompts: EntityTable<Prompt, 'id'>;
  collections: EntityTable<Collection, 'id'>;
  sources: EntityTable<PromptSource, 'id'>;
};

db.version(1).stores({
  prompts: 'id, title, category, *tags, isFavorite, isNSFW, source, createdAt',
  collections: 'id, name, createdAt',
  sources: 'id, name, enabled'
});

export { db };
