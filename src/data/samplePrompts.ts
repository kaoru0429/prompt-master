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
  },
  // NSFW Prompts
  {
    id: 'nsfw-1',
    title: '浪漫小說場景生成器',
    description: '生成成人浪漫小說中的親密場景描寫',
    content: `你是一位專業的成人浪漫小說作家。請根據以下設定創作一段親密場景：

角色A：{{character_a}}
角色B：{{character_b}}
場景設定：{{setting}}
氛圍：{{mood}}
描寫程度：{{intensity}}

要求：
- 使用優美的文學語言
- 著重情感交流與氛圍營造
- 符合角色性格特徵
- 控制在 500-800 字`,
    tags: ['Creative', 'Romance', 'Fiction', 'Adult'],
    category: 'Creative',
    model: 'Claude',
    mode: 'text',
    variables: [
      { name: 'character_a', description: '角色A的描述', type: 'textarea', required: true },
      { name: 'character_b', description: '角色B的描述', type: 'textarea', required: true },
      { name: 'setting', description: '場景設定（地點、時間）', type: 'text', required: true },
      { name: 'mood', description: '氛圍（浪漫/激情/溫柔）', type: 'text', required: false },
      { name: 'intensity', description: '描寫程度（含蓄/中等/詳細）', type: 'select', options: ['含蓄', '中等', '詳細'], required: true }
    ],
    isFavorite: false,
    isNSFW: true,
    source: 'community',
    author: 'RomanceWriter',
    rating: 4.5,
    views: 1823,
    copies: 145,
    createdAt: '2024-11-20T00:00:00Z',
    updatedAt: '2024-11-20T00:00:00Z'
  },
  {
    id: 'nsfw-2',
    title: 'AI 伴侶角色扮演',
    description: '創建個性化的 AI 伴侶角色進行互動對話',
    content: `你將扮演一個名為 {{companion_name}} 的 AI 伴侶角色。

基本設定：
- 外貌：{{appearance}}
- 性格：{{personality}}
- 說話方式：{{speaking_style}}
- 興趣愛好：{{hobbies}}

關係設定：{{relationship}}

互動規則：
1. 始終保持角色一致性
2. 根據對話發展自然回應
3. 表達適當的情感與關心
4. 記住之前的對話內容

開始對話後請以角色身份打招呼。`,
    tags: ['Roleplay', 'Companion', 'Interactive', 'Adult'],
    category: 'Creative',
    model: 'ChatGPT',
    mode: 'text',
    variables: [
      { name: 'companion_name', description: '伴侶名字', type: 'text', required: true },
      { name: 'appearance', description: '外貌描述', type: 'textarea', required: true },
      { name: 'personality', description: '性格特徵', type: 'textarea', required: true },
      { name: 'speaking_style', description: '說話風格', type: 'text', required: false },
      { name: 'hobbies', description: '興趣愛好', type: 'text', required: false },
      { name: 'relationship', description: '關係設定', type: 'text', required: true }
    ],
    isFavorite: false,
    isNSFW: true,
    source: 'community',
    author: 'CompanionAI',
    rating: 4.7,
    views: 5672,
    copies: 423,
    createdAt: '2024-10-05T00:00:00Z',
    updatedAt: '2024-10-05T00:00:00Z'
  },
  {
    id: 'nsfw-3',
    title: 'NSFW AI 繪圖提示詞生成器',
    description: '生成適用於 Stable Diffusion 的成人繪圖提示詞',
    content: `Generate a detailed NSFW prompt for Stable Diffusion:

Subject: {{subject}}
Style: {{art_style}}
Body Type: {{body_type}}
Pose: {{pose}}
Setting: {{setting}}
Lighting: {{lighting}}

Output format:
- Positive prompt (detailed, with quality tags)
- Negative prompt
- Recommended settings (CFG, Steps, Sampler)

Note: Focus on artistic quality and aesthetic composition.`,
    tags: ['Image', 'Stable Diffusion', 'AI Art', 'NSFW'],
    category: 'Image',
    model: 'Gemini',
    mode: 'image',
    variables: [
      { name: 'subject', description: '主題描述', type: 'textarea', required: true },
      { name: 'art_style', description: '藝術風格', type: 'text', required: true },
      { name: 'body_type', description: '體型設定', type: 'text', required: false },
      { name: 'pose', description: '姿勢描述', type: 'text', required: false },
      { name: 'setting', description: '場景設定', type: 'text', required: false },
      { name: 'lighting', description: '光線設定', type: 'text', required: false }
    ],
    isFavorite: false,
    isNSFW: true,
    source: 'community',
    author: 'SDPromptMaster',
    rating: 4.8,
    views: 8934,
    copies: 712,
    createdAt: '2024-09-28T00:00:00Z',
    updatedAt: '2024-09-28T00:00:00Z'
  }
];
