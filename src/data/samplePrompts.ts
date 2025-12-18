import type { Prompt } from '../types';

// 預設熱門 Prompts 範例資料
export const samplePrompts: Prompt[] = [
  {
    id: 'sample-1',
    title: 'AI 專案藍圖產生器',
    description: '將您的 App 想法轉換成完整的技術規格',
    content: `# AI Project Blueprint & Implementation Plan

**YOUR ROLE:** You are a Senior AI Solutions Architect. Your mission is to act as a thought partner and transform the following project description into a comprehensive, implementation-ready technical specification.

## 1. Project Description
{{project_description}}

## 2. Target Users
{{target_users}}

## 3. Core Features (Priority Order)
{{core_features}}

---

Please provide:
1. System Architecture Diagram
2. Technology Stack Recommendations
3. Database Schema
4. API Endpoints
5. Implementation Timeline
6. Risk Assessment`,
    tags: ['Coding', 'Architecture', 'Planning', 'Development'],
    category: 'Coding',
    model: 'Claude',
    mode: 'text',
    variables: [
      { name: 'project_description', description: '描述您的專案想法 (1-3段)', type: 'textarea', required: true },
      { name: 'target_users', description: '目標使用者群體', type: 'text', required: true },
      { name: 'core_features', description: '核心功能列表', type: 'textarea', required: true }
    ],
    isFavorite: false,
    isNSFW: false,
    source: 'community',
    author: 'Eric Eden',
    rating: 5.0,
    views: 478,
    copies: 52,
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  },
  {
    id: 'sample-2',
    title: '行銷文案大師',
    description: '產生吸引人的行銷文案和廣告標語',
    content: `你是一位頂尖的行銷文案專家。請為以下產品/服務創作文案：

產品/服務名稱：{{product_name}}
產品描述：{{product_description}}
目標受眾：{{target_audience}}
文案風格：{{tone}}

請提供：
1. 主標題 (5個版本)
2. 副標題說明
3. 3個核心賣點
4. 行動呼籲 (CTA)
5. 社群媒體貼文版本 (FB/IG)`,
    tags: ['Marketing', 'Copywriting', 'Social Media', 'Advertising'],
    category: 'Marketing',
    model: 'ChatGPT',
    mode: 'text',
    variables: [
      { name: 'product_name', description: '產品或服務名稱', type: 'text', required: true },
      { name: 'product_description', description: '簡短描述產品特色', type: 'textarea', required: true },
      { name: 'target_audience', description: '目標客群 (年齡、興趣等)', type: 'text', required: true },
      { name: 'tone', description: '文案風格 (專業/幽默/溫馨/激勵)', type: 'text', required: false }
    ],
    isFavorite: false,
    isNSFW: false,
    source: 'community',
    author: 'Marketing Pro',
    rating: 4.8,
    views: 1205,
    copies: 89,
    createdAt: '2024-11-15T00:00:00Z',
    updatedAt: '2024-11-15T00:00:00Z'
  },
  {
    id: 'sample-3',
    title: 'Midjourney 風格生成器',
    description: '生成高品質的 Midjourney AI 繪圖提示詞',
    content: `Create a Midjourney prompt for: {{subject}}

Style: {{style}}
Mood: {{mood}}
Color palette: {{colors}}

Generate a detailed prompt with:
- Main subject description
- Environment/background
- Lighting conditions
- Camera angle
- Art style references
- Quality modifiers (--ar, --v, --q)`,
    tags: ['Image', 'Midjourney', 'AI Art', 'Stable Diffusion'],
    category: 'Image',
    model: 'Gemini',
    mode: 'image',
    variables: [
      { name: 'subject', description: '主題 (人物/場景/物品)', type: 'text', required: true },
      { name: 'style', description: '藝術風格 (寫實/動漫/賽博龐克)', type: 'text', required: true },
      { name: 'mood', description: '氛圍 (神秘/明亮/復古)', type: 'text', required: false },
      { name: 'colors', description: '色彩偏好', type: 'text', required: false }
    ],
    isFavorite: true,
    isNSFW: false,
    source: 'community',
    author: 'ArtPrompt',
    rating: 4.9,
    views: 2341,
    copies: 156,
    createdAt: '2024-10-20T00:00:00Z',
    updatedAt: '2024-10-20T00:00:00Z'
  },
  {
    id: 'sample-4',
    title: '程式碼審查專家',
    description: '專業的程式碼審查與改進建議',
    content: `Act as a Senior Software Engineer performing a code review.

Programming Language: {{language}}
Code Purpose: {{purpose}}

Code to review:
\`\`\`
{{code}}
\`\`\`

Please analyze and provide:
1. 🐛 Bugs and potential issues
2. ⚡ Performance optimizations
3. 🔒 Security vulnerabilities
4. 📝 Code style improvements
5. 🏗️ Architecture suggestions
6. ✅ Refactored code example`,
    tags: ['Coding', 'Code Review', 'Best Practices', 'Refactoring'],
    category: 'Coding',
    model: 'Claude',
    mode: 'code',
    variables: [
      { name: 'language', description: '程式語言', type: 'text', required: true },
      { name: 'purpose', description: '這段程式碼的用途', type: 'text', required: true },
      { name: 'code', description: '要審查的程式碼', type: 'textarea', required: true }
    ],
    isFavorite: false,
    isNSFW: false,
    source: 'community',
    author: 'DevMaster',
    rating: 4.7,
    views: 892,
    copies: 67,
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2024-11-01T00:00:00Z'
  },
  {
    id: 'sample-5',
    title: '角色扮演對話腳本',
    description: '創意角色扮演對話與劇情生成',
    content: `I want you to act as {{character_name}}, a {{character_description}}.

Setting: {{setting}}
Scenario: {{scenario}}

Character traits:
- Personality: {{personality}}
- Speaking style: {{speaking_style}}
- Goals: {{goals}}

Stay in character throughout our conversation. Respond as this character would, maintaining their unique voice and perspective.

Begin the roleplay when I send my first message.`,
    tags: ['Creative', 'Roleplay', 'Writing', 'Storytelling'],
    category: 'Creative',
    model: 'ChatGPT',
    mode: 'text',
    variables: [
      { name: 'character_name', description: '角色名稱', type: 'text', required: true },
      { name: 'character_description', description: '角色簡介', type: 'textarea', required: true },
      { name: 'setting', description: '故事背景設定', type: 'text', required: true },
      { name: 'scenario', description: '當前情境', type: 'text', required: false },
      { name: 'personality', description: '性格特徵', type: 'text', required: false },
      { name: 'speaking_style', description: '說話風格', type: 'text', required: false },
      { name: 'goals', description: '角色目標', type: 'text', required: false }
    ],
    isFavorite: false,
    isNSFW: true,
    source: 'community',
    author: 'StoryWeaver',
    rating: 4.6,
    views: 3456,
    copies: 234,
    createdAt: '2024-09-15T00:00:00Z',
    updatedAt: '2024-09-15T00:00:00Z'
  }
];
