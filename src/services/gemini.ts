import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

// ============================================================================
// Configuration
// ============================================================================

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const MODEL_NAME = 'gemini-2.5-flash';
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;

if (!API_KEY) {
  console.warn('⚠️ 警告：未設定 VITE_GEMINI_API_KEY 環境變數，AI 功能將無法使用');
}

const genAI = new GoogleGenerativeAI(API_KEY);

// ============================================================================
// Types
// ============================================================================

export interface AnalysisResult {
  title: string;
  description: string;
  tags: string[];
  category: string;
  model: string;
  variables: { name: string; description: string }[];
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * 取得 Gemini 模型實例
 */
function getModel(): GenerativeModel {
  return genAI.getGenerativeModel({ model: MODEL_NAME });
}

/**
 * 從回應文字中解析 JSON
 */
function extractJson<T>(text: string, isArray = false): T | null {
  try {
    const pattern = isArray ? /\[[\s\S]*\]/ : /\{[\s\S]*\}/;
    const match = text.match(pattern);
    if (match) {
      return JSON.parse(match[0]) as T;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * 延遲函數
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 帶重試機制的 API 呼叫
 */
async function callWithRetry<T>(
  fn: () => Promise<T>,
  fallback: T,
  retries = MAX_RETRIES
): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const isLastAttempt = attempt === retries;

      if (isLastAttempt) {
        console.error('Gemini API Error (final attempt):', error);
        return fallback;
      }

      console.warn(`Gemini API Error (attempt ${attempt + 1}/${retries + 1}), retrying...`);
      await delay(RETRY_DELAY_MS * (attempt + 1));
    }
  }
  return fallback;
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * 使用 Gemini 分析 Prompt 內容，自動產生標題、描述、標籤
 */
export async function analyzePrompt(content: string): Promise<AnalysisResult> {
  const fallback: AnalysisResult = {
    title: '未命名 Prompt',
    description: '自動分析失敗，請手動填寫',
    tags: ['untagged'],
    category: 'Other',
    model: 'All',
    variables: []
  };

  if (!content.trim()) return fallback;

  const systemPrompt = `分析以下 AI Prompt，並以 JSON 格式回傳：
1. title: 簡短的中文標題 (10字以內)
2. description: 中文描述 (30字以內)
3. tags: 相關標籤陣列 (3-6個英文標籤)
4. category: 分類 (Coding/Writing/Marketing/Image/Research/Productivity/Creative/Other)
5. model: 適合的 AI 模型 (ChatGPT/Claude/Gemini/All)
6. variables: 變數陣列 [{name: "變數名", description: "描述"}]

變數格式：{{variable_name}} 或 [variable_name] 或 {variable_name}

Prompt 內容：
"""
${content}
"""

只回傳 JSON，不要其他文字。`;

  return callWithRetry(async () => {
    const result = await getModel().generateContent(systemPrompt);
    const text = result.response.text();
    const parsed = extractJson<AnalysisResult>(text);

    if (!parsed) throw new Error('Invalid JSON response');
    return parsed;
  }, fallback);
}

/**
 * 分析使用者輸入，智慧填入變數
 */
export async function analyzeUserInput(
  promptContent: string,
  userInput: string,
  variables: { name: string; description: string }[]
): Promise<Record<string, string>> {
  const fallback: Record<string, string> = {};

  if (!userInput.trim() || variables.length === 0) return fallback;

  const variableList = variables.map(v => `- ${v.name}: ${v.description}`).join('\n');

  const systemPrompt = `根據使用者輸入，分析並填入變數。

Prompt 模板：
"""
${promptContent}
"""

需要填入的變數：
${variableList}

使用者輸入：
"""
${userInput}
"""

回傳格式：{"變數名": "值"}
只回傳 JSON。`;

  return callWithRetry(async () => {
    const result = await getModel().generateContent(systemPrompt);
    const text = result.response.text();
    return extractJson<Record<string, string>>(text) || {};
  }, fallback);
}

/**
 * 根據內容建議標籤
 */
export async function suggestTags(content: string): Promise<string[]> {
  const fallback: string[] = [];

  if (!content.trim()) return fallback;

  const systemPrompt = `分析以下內容，建議 5-8 個相關的英文標籤。
回傳格式：["tag1", "tag2", ...]
只回傳 JSON 陣列。

內容：
"""
${content}
"""`;

  return callWithRetry(async () => {
    const result = await getModel().generateContent(systemPrompt);
    const text = result.response.text();
    return extractJson<string[]>(text, true) || [];
  }, fallback);
}

/**
 * 檢查 API 是否可用
 */
export function isApiConfigured(): boolean {
  return !!API_KEY;
}

/**
 * 批量分析多個 Prompts（用於庫更新後自動分類）
 */
export async function batchAnalyzePrompts(
  prompts: { id: string; content: string }[]
): Promise<Map<string, AnalysisResult>> {
  const results = new Map<string, AnalysisResult>();

  // 每次處理 5 個，避免 API 限制
  const batchSize = 5;
  for (let i = 0; i < prompts.length; i += batchSize) {
    const batch = prompts.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(async (p) => {
        const analysis = await analyzePrompt(p.content);
        return { id: p.id, analysis };
      })
    );
    batchResults.forEach(r => results.set(r.id, r.analysis));

    // 每批之間間隔 500ms
    if (i + batchSize < prompts.length) {
      await delay(500);
    }
  }

  return results;
}

export interface DuplicateCheckResult {
  id: string;
  title: string;
  reason: 'duplicate' | 'invalid' | 'low_quality';
  similarity?: number;
  similarTo?: string;
  suggestion: string;
}

/**
 * 檢測無效或重複的 Prompts
 */
export async function detectDuplicatesAndInvalid(
  prompts: { id: string; title: string; content: string }[]
): Promise<DuplicateCheckResult[]> {
  const results: DuplicateCheckResult[] = [];

  if (prompts.length === 0) return results;

  // 1. 檢測無效 prompts（內容過短或無意義）
  for (const p of prompts) {
    if (p.content.trim().length < 20) {
      results.push({
        id: p.id,
        title: p.title,
        reason: 'invalid',
        suggestion: '內容過短，建議刪除或補充內容'
      });
    }
  }

  // 2. 使用 AI 進行相似度比對
  if (prompts.length > 1) {
    const promptSummaries = prompts
      .slice(0, 20) // 限制數量避免 token 超限
      .map((p, i) => `[${i}] ${p.title}: ${p.content.slice(0, 100)}...`)
      .join('\n');

    const systemPrompt = `分析以下 Prompts 清單，找出可能重複或品質較低的項目。

Prompts 清單：
${promptSummaries}

回傳格式（JSON 陣列）：
[
  {
    "index": 0,
    "reason": "duplicate|low_quality",
    "similarToIndex": 1,
    "similarity": 85,
    "suggestion": "建議刪除原因"
  }
]

只找出真正需要刪除的項目，不要列出所有項目。只回傳 JSON。`;

    try {
      const result = await getModel().generateContent(systemPrompt);
      const text = result.response.text();
      const parsed = extractJson<Array<{
        index: number;
        reason: 'duplicate' | 'low_quality';
        similarToIndex?: number;
        similarity?: number;
        suggestion: string;
      }>>(text, true);

      if (parsed && Array.isArray(parsed)) {
        for (const item of parsed) {
          if (item.index >= 0 && item.index < prompts.length) {
            const p = prompts[item.index];
            results.push({
              id: p.id,
              title: p.title,
              reason: item.reason === 'duplicate' ? 'duplicate' : 'low_quality',
              similarity: item.similarity,
              similarTo: item.similarToIndex !== undefined ? prompts[item.similarToIndex]?.title : undefined,
              suggestion: item.suggestion
            });
          }
        }
      }
    } catch (error) {
      console.error('AI duplicate detection failed:', error);
    }
  }

  return results;
}

/**
 * 為單個 Prompt 生成更好的標題
 */
export async function generateBetterTitle(content: string): Promise<string> {
  if (!content.trim()) return '未命名 Prompt';

  const systemPrompt = `為以下 AI Prompt 生成一個簡短、吸引人的中文標題（8-15 個字）。

Prompt 內容：
"""
${content.slice(0, 500)}
"""

只回傳標題文字，不要其他內容。`;

  return callWithRetry(async () => {
    const result = await getModel().generateContent(systemPrompt);
    const text = result.response.text().trim();
    // 移除可能的引號
    return text.replace(/^["']|["']$/g, '');
  }, '未命名 Prompt');
}

/**
 * 編輯器即時建議 (Auto-complete)
 */
export async function getInlineSuggestion(
  contextBefore: string,
  contextAfter: string
): Promise<string> {
  if (!contextBefore.trim()) return '';

  const systemPrompt = `你是一個 AI 寫作助手。請根據游標前的內容，預測並生成接下來的文字。
只生成接下來的一小段文字（約 5-20 字），不要重複前後文。如果無法預測，回傳空字串。

游標前內容：
"""
${contextBefore.slice(-500)}
"""

游標後內容：
"""
${contextAfter.slice(0, 500)}
"""

只回傳建議的續寫文字。`;

  return callWithRetry(async () => {
    const result = await getModel().generateContent(systemPrompt);
    return result.response.text().trim();
  }, '', 1); // Only retry once for auto-complete for speed
}

/**
 * 執行編輯器指令 (/command)
 */
export async function executeAICommand(
  command: string,
  selectedText: string,
  fullContext: string
): Promise<string> {
  let prompt = '';

  switch (command) {
    case 'improve':
      prompt = `優化以下文字，使其更通順、專業：\n"${selectedText}"`;
      break;
    case 'expand':
      prompt = `擴充以下內容，增加細節與說明：\n"${selectedText}"`;
      break;
    case 'simplify':
      prompt = `簡化以下內容，使其更易懂：\n"${selectedText}"`;
      break;
    case 'translate':
      prompt = `將以下內容翻譯成繁體中文（如果是中文則翻成英文）：\n"${selectedText}"`;
      break;
    default:
      // Custom command
      prompt = `${command}：\n"${selectedText || fullContext}"`;
  }

  const systemPrompt = `${prompt}\n\n只回傳處理後的結果文字，不要加引號。`;

  return callWithRetry(async () => {
    const result = await getModel().generateContent(systemPrompt);
    return result.response.text().trim();
  }, selectedText);
}

/**
 * 通用：生成回應
 */
export async function generateResponse(prompt: string): Promise<string> {
  return callWithRetry(async () => {
    const result = await getModel().generateContent(prompt);
    return result.response.text().trim();
  }, '');
}
