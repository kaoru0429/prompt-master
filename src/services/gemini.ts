import { GoogleGenerativeAI } from '@google/generative-ai';

// 從環境變數讀取 API Key，避免敏感資訊暴露
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

if (!API_KEY) {
  console.warn('警告：未設定 VITE_GEMINI_API_KEY 環境變數，AI 功能將無法使用');
}

const genAI = new GoogleGenerativeAI(API_KEY);

export interface AnalysisResult {
  title: string;
  description: string;
  tags: string[];
  category: string;
  model: string;
  variables: { name: string; description: string }[];
}

/**
 * 使用 Gemini 分析 Prompt 內容，自動產生標題、描述、標籤
 */
export async function analyzePrompt(content: string): Promise<AnalysisResult> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-05-20' });

  const prompt = `
分析以下 AI Prompt，並以 JSON 格式回傳：
1. title: 簡短的中文標題 (10字以內)
2. description: 中文描述 (30字以內)
3. tags: 相關標籤陣列 (3-6個英文標籤)
4. category: 分類 (從以下選擇：Coding, Writing, Marketing, Image, Research, Productivity, Creative, Other)
5. model: 適合的 AI 模型 (ChatGPT, Claude, Gemini, All)
6. variables: 偵測到的變數陣列，格式 [{name: "變數名", description: "描述"}]

變數格式範例：{{variable_name}} 或 [variable_name] 或 {variable_name}

Prompt 內容：
"""
${content}
"""

只回傳 JSON，不要其他文字。
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 清理 JSON 格式
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Invalid JSON response');
  } catch (error) {
    console.error('Gemini API Error:', error);
    return {
      title: '未命名 Prompt',
      description: '自動分析失敗，請手動填寫',
      tags: ['untagged'],
      category: 'Other',
      model: 'All',
      variables: []
    };
  }
}

/**
 * 分析使用者輸入，智慧填入變數
 */
export async function analyzeUserInput(
  promptContent: string,
  userInput: string,
  variables: { name: string; description: string }[]
): Promise<Record<string, string>> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-05-20' });

  const variableList = variables.map(v => `- ${v.name}: ${v.description}`).join('\n');

  const prompt = `
根據使用者的輸入，分析並填入以下變數。

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

請以 JSON 格式回傳變數值，格式：{"變數名": "值"}
只回傳 JSON，不要其他文字。
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return {};
  } catch (error) {
    console.error('Gemini API Error:', error);
    return {};
  }
}

/**
 * 根據標籤建議分類
 */
export async function suggestTags(content: string): Promise<string[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-05-20' });

  const prompt = `
分析以下內容，建議 5-8 個相關的英文標籤。
回傳格式：["tag1", "tag2", ...]
只回傳 JSON 陣列。

內容：
"""
${content}
"""
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return [];
  } catch (error) {
    console.error('Gemini API Error:', error);
    return [];
  }
}
