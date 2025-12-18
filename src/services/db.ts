import Dexie, { type EntityTable } from 'dexie';
import type { Prompt, Collection, PromptSource } from '../types';
import { samplePrompts } from '../data/samplePrompts';

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

// 版本 2：補上新增的電商行銷 prompts
db.version(2).stores({
  prompts: 'id, title, category, *tags, isFavorite, isNSFW, source, createdAt',
  collections: 'id, name, createdAt',
  sources: 'id, name, enabled'
}).upgrade(async tx => {
  const existingPrompts = await tx.table('prompts').toArray();
  const existingIds = existingPrompts.map((p: Prompt) => p.id);
  const newPrompts = samplePrompts.filter(p => !existingIds.includes(p.id));

  if (newPrompts.length > 0) {
    console.log(`Adding ${newPrompts.length} new sample prompts...`);
    await tx.table('prompts').bulkAdd(newPrompts);
  }
});

export { db };
