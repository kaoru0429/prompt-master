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
