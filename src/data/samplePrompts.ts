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
  },
  // ========== 實用行銷 & 電商熱門 Prompts ==========
  {
    id: 'ecom-1',
    title: '🛒 電商商品標題優化器',
    description: '產生高點擊率的電商商品標題',
    content: `你是一位電商營銷專家，專精於提升商品點擊率。請為以下商品優化標題：

商品名稱：{{product_name}}
商品類別：{{category}}
主要特色：{{features}}
目標關鍵字：{{keywords}}

請提供：
1. 5 個優化後的標題 (含關鍵字、吸睛詞)
2. 標題撰寫原則說明
3. 建議的 A/B 測試方案`,
    tags: ['E-commerce', 'SEO', 'Copywriting', 'Marketing'],
    category: 'Marketing',
    model: 'ChatGPT',
    mode: 'text',
    variables: [
      { name: 'product_name', description: '商品名稱', type: 'text', required: true },
      { name: 'category', description: '商品類別', type: 'text', required: true },
      { name: 'features', description: '主要特色 (3-5 點)', type: 'textarea', required: true },
      { name: 'keywords', description: '目標關鍵字', type: 'text', required: false }
    ],
    isFavorite: false,
    isNSFW: false,
    source: 'community',
    author: 'ECom Master',
    rating: 4.9,
    views: 3421,
    copies: 287,
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  },
  {
    id: 'ecom-2',
    title: '📦 商品描述文案產生器',
    description: '撰寫具說服力的商品詳情頁文案',
    content: `請為以下商品撰寫完整的商品描述文案：

商品：{{product_name}}
價格區間：{{price_range}}
核心賣點：{{selling_points}}
目標客群：{{target_audience}}

請提供：
1. 開場標語 (Hook)
2. 痛點分析
3. 產品優勢 (6點)
4. 使用場景描述
5. 規格說明建議
6. 購買呼籲 (CTA)

要求：使用繁體中文，語氣專業但親切`,
    tags: ['E-commerce', 'Product Description', 'Copywriting'],
    category: 'Marketing',
    model: 'ChatGPT',
    mode: 'text',
    variables: [
      { name: 'product_name', description: '商品名稱', type: 'text', required: true },
      { name: 'price_range', description: '價格區間 (低/中/高)', type: 'text', required: false },
      { name: 'selling_points', description: '核心賣點', type: 'textarea', required: true },
      { name: 'target_audience', description: '目標客群', type: 'text', required: true }
    ],
    isFavorite: false,
    isNSFW: false,
    source: 'community',
    author: 'ProductCopy',
    rating: 4.8,
    views: 2156,
    copies: 198,
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  },
  {
    id: 'ecom-3',
    title: '⭐ 客戶評價回覆生成器',
    description: '專業回覆正面與負面評價',
    content: `你是一位客服經理，請幫我回覆以下客戶評價：

評價內容：{{review}}
評價星等：{{rating}}
商品名稱：{{product}}
品牌調性：{{brand_tone}}

請提供：
1. 感謝開場
2. 針對評價內容的具體回應
3. 解決方案（如為負評）
4. 邀請再次消費的結語

語氣要求：真誠、專業、不制式`,
    tags: ['Customer Service', 'E-commerce', 'Review Management'],
    category: 'Marketing',
    model: 'ChatGPT',
    mode: 'text',
    variables: [
      { name: 'review', description: '客戶評價內容', type: 'textarea', required: true },
      { name: 'rating', description: '評價星等 (1-5)', type: 'text', required: true },
      { name: 'product', description: '商品名稱', type: 'text', required: true },
      { name: 'brand_tone', description: '品牌調性 (親切/專業/活潑)', type: 'text', required: false }
    ],
    isFavorite: false,
    isNSFW: false,
    source: 'community',
    author: 'CSMaster',
    rating: 4.7,
    views: 1823,
    copies: 156,
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  },
  {
    id: 'ecom-4',
    title: '📧 EDM 電子報撰寫器',
    description: '高開信率的電商電子報文案',
    content: `請幫我撰寫一封電商促銷電子報：

活動主題：{{campaign_theme}}
促銷內容：{{promo_details}}
活動期間：{{duration}}
目標對象：{{audience_segment}}

請提供：
1. 3 個吸睛主旨 (Subject Line)
2. 預覽文字 (Preview Text)
3. 信件正文架構
4. CTA 按鈕文字
5. P.S. 提醒文字

要求：簡潔有力，適合手機閱讀`,
    tags: ['Email Marketing', 'EDM', 'Newsletter', 'E-commerce'],
    category: 'Marketing',
    model: 'ChatGPT',
    mode: 'text',
    variables: [
      { name: 'campaign_theme', description: '活動主題', type: 'text', required: true },
      { name: 'promo_details', description: '促銷內容 (折扣/贈品等)', type: 'textarea', required: true },
      { name: 'duration', description: '活動期間', type: 'text', required: true },
      { name: 'audience_segment', description: '目標對象 (新客/舊客/VIP)', type: 'text', required: false }
    ],
    isFavorite: false,
    isNSFW: false,
    source: 'community',
    author: 'EmailPro',
    rating: 4.6,
    views: 1456,
    copies: 123,
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  },
  {
    id: 'ecom-5',
    title: '🎯 Facebook 廣告文案生成器',
    description: '高轉換率的 FB/IG 廣告文案',
    content: `請為以下商品撰寫 Facebook/Instagram 廣告文案：

商品：{{product}}
售價：{{price}}
優惠：{{offer}}
痛點：{{pain_point}}

請提供 3 個版本：
1. 短文案 (50字以內) - 適合圖片廣告
2. 中文案 (100字) - 適合輪播廣告
3. 長文案 (200字) - 適合影片廣告

每個版本都要包含：
- 吸睛開頭
- 產品價值
- 緊迫感元素
- 明確 CTA`,
    tags: ['Facebook Ads', 'Instagram', 'Paid Advertising', 'Copywriting'],
    category: 'Marketing',
    model: 'ChatGPT',
    mode: 'text',
    variables: [
      { name: 'product', description: '商品名稱與簡述', type: 'text', required: true },
      { name: 'price', description: '售價', type: 'text', required: true },
      { name: 'offer', description: '優惠內容', type: 'text', required: true },
      { name: 'pain_point', description: '解決什麼痛點', type: 'textarea', required: true }
    ],
    isFavorite: false,
    isNSFW: false,
    source: 'community',
    author: 'AdsCopyPro',
    rating: 4.9,
    views: 4532,
    copies: 398,
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  },
  {
    id: 'ecom-6',
    title: '📱 短影音腳本生成器',
    description: 'TikTok/Reels/Shorts 帶貨影片腳本',
    content: `請為以下商品撰寫短影音帶貨腳本 (30-60秒)：

商品：{{product}}
目標平台：{{platform}}
影片風格：{{style}}
痛點/需求：{{need}}

腳本架構：
1. Hook (前3秒抓住注意力)
2. 問題呈現 (5秒)
3. 產品解決方案 (15秒)
4. 使用展示 (15秒)
5. 成效/社會證明 (10秒)
6. CTA + 優惠 (5秒)

請包含：
- 旁白文字
- 畫面建議
- 字卡文字
- 配樂建議`,
    tags: ['TikTok', 'Reels', 'Video Script', 'Short Video', 'E-commerce'],
    category: 'Marketing',
    model: 'ChatGPT',
    mode: 'text',
    variables: [
      { name: 'product', description: '商品名稱與特色', type: 'textarea', required: true },
      { name: 'platform', description: '平台 (TikTok/IG Reels/YouTube Shorts)', type: 'text', required: true },
      { name: 'style', description: '風格 (開箱/教學/日常/對比)', type: 'text', required: true },
      { name: 'need', description: '目標受眾的痛點或需求', type: 'textarea', required: true }
    ],
    isFavorite: false,
    isNSFW: false,
    source: 'community',
    author: 'VideoMarketer',
    rating: 4.8,
    views: 5678,
    copies: 456,
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  },
  {
    id: 'ecom-7',
    title: '🏷️ 促銷活動企劃生成器',
    description: '完整的電商促銷活動規劃',
    content: `請為我規劃一檔電商促銷活動：

活動目的：{{goal}}
預算範圍：{{budget}}
活動檔期：{{duration}}
商品類別：{{category}}
過往數據：{{past_data}}

請提供完整企劃：
1. 活動主題與命名
2. 促銷機制設計
3. 利潤試算建議
4. 行銷渠道配置
5. 時程甘特圖
6. KPI 設定
7. 風險評估與應對`,
    tags: ['Campaign Planning', 'Promotion', 'E-commerce', 'Strategy'],
    category: 'Marketing',
    model: 'Claude',
    mode: 'text',
    variables: [
      { name: 'goal', description: '活動目的 (拉新/衝業績/清庫存)', type: 'text', required: true },
      { name: 'budget', description: '行銷預算', type: 'text', required: true },
      { name: 'duration', description: '活動檔期', type: 'text', required: true },
      { name: 'category', description: '商品類別', type: 'text', required: true },
      { name: 'past_data', description: '過往活動數據（選填）', type: 'textarea', required: false }
    ],
    isFavorite: false,
    isNSFW: false,
    source: 'community',
    author: 'CampaignPro',
    rating: 4.7,
    views: 2134,
    copies: 187,
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  },
  {
    id: 'ecom-8',
    title: '🔍 SEO 商品頁優化建議',
    description: '電商 SEO 關鍵字與內容優化',
    content: `請分析並優化以下電商商品頁的 SEO：

商品名稱：{{product}}
目前標題：{{current_title}}
目前描述：{{current_desc}}
競爭對手：{{competitors}}
目標關鍵字：{{keywords}}

請提供：
1. 優化後的 Title Tag
2. 優化後的 Meta Description
3. H1-H3 標題結構建議
4. 長尾關鍵字建議
5. 內容優化方向
6. Schema Markup 建議`,
    tags: ['SEO', 'E-commerce', 'Keyword Research', 'Content Optimization'],
    category: 'Marketing',
    model: 'Claude',
    mode: 'text',
    variables: [
      { name: 'product', description: '商品名稱', type: 'text', required: true },
      { name: 'current_title', description: '目前頁面標題', type: 'text', required: true },
      { name: 'current_desc', description: '目前商品描述', type: 'textarea', required: true },
      { name: 'competitors', description: '競爭對手網站', type: 'text', required: false },
      { name: 'keywords', description: '目標關鍵字', type: 'text', required: true }
    ],
    isFavorite: false,
    isNSFW: false,
    source: 'community',
    author: 'SEOExpert',
    rating: 4.6,
    views: 1876,
    copies: 145,
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  },
  {
    id: 'ecom-9',
    title: '💬 客服對話腳本生成器',
    description: '電商客服即時回覆範本',
    content: `請為以下客服情境撰寫對話腳本：

情境類型：{{scenario}}
客戶問題：{{customer_issue}}
商品/訂單資訊：{{order_info}}
公司政策：{{policy}}

請提供：
1. 開場問候語
2. 同理心表達
3. 問題釐清話術
4. 解決方案說明
5. 替代方案（如適用）
6. 結尾與後續追蹤

語氣要求：{{tone}}`,
    tags: ['Customer Service', 'E-commerce', 'Chat Script', 'Support'],
    category: 'Marketing',
    model: 'ChatGPT',
    mode: 'text',
    variables: [
      { name: 'scenario', description: '情境類型 (退換貨/查物流/商品諮詢/投訴)', type: 'text', required: true },
      { name: 'customer_issue', description: '客戶問題內容', type: 'textarea', required: true },
      { name: 'order_info', description: '商品/訂單資訊', type: 'text', required: false },
      { name: 'policy', description: '相關公司政策', type: 'textarea', required: false },
      { name: 'tone', description: '語氣 (專業/親切/正式)', type: 'text', required: false }
    ],
    isFavorite: false,
    isNSFW: false,
    source: 'community',
    author: 'CSTeam',
    rating: 4.5,
    views: 1432,
    copies: 112,
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  },
  {
    id: 'ecom-10',
    title: '📊 競品分析報告生成器',
    description: '快速產出電商競品分析報告',
    content: `請幫我分析以下競爭對手：

我的品牌：{{my_brand}}
競爭對手：{{competitors}}
分析重點：{{focus_areas}}
我的優勢：{{my_strengths}}

請提供完整競品分析報告：
1. 競品基本資料
2. 產品線比較
3. 定價策略分析
4. 行銷渠道分析
5. SWOT 分析
6. 差異化建議
7. 行動方案`,
    tags: ['Competitor Analysis', 'Market Research', 'Strategy', 'E-commerce'],
    category: 'Research',
    model: 'Claude',
    mode: 'text',
    variables: [
      { name: 'my_brand', description: '我的品牌/商品', type: 'text', required: true },
      { name: 'competitors', description: '競爭對手 (可多個)', type: 'textarea', required: true },
      { name: 'focus_areas', description: '分析重點', type: 'text', required: false },
      { name: 'my_strengths', description: '我的已知優勢', type: 'textarea', required: false }
    ],
    isFavorite: false,
    isNSFW: false,
    source: 'community',
    author: 'MarketAnalyst',
    rating: 4.7,
    views: 1654,
    copies: 134,
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  },
  {
    id: 'ecom-11',
    title: '🎁 會員活動文案生成器',
    description: 'VIP 會員專屬活動與權益文案',
    content: `請為會員活動撰寫文案：

活動類型：{{activity_type}}
會員等級：{{member_tier}}
專屬優惠：{{benefits}}
活動期限：{{deadline}}

請提供：
1. 活動標題 (3版)
2. 專屬感開場
3. 權益說明
4. 限定感營造
5. 參與方式
6. 社群分享文案`,
    tags: ['Membership', 'VIP', 'Loyalty Program', 'E-commerce'],
    category: 'Marketing',
    model: 'ChatGPT',
    mode: 'text',
    variables: [
      { name: 'activity_type', description: '活動類型 (生日禮/升等禮/週年慶)', type: 'text', required: true },
      { name: 'member_tier', description: '會員等級', type: 'text', required: true },
      { name: 'benefits', description: '專屬優惠內容', type: 'textarea', required: true },
      { name: 'deadline', description: '活動期限', type: 'text', required: true }
    ],
    isFavorite: false,
    isNSFW: false,
    source: 'community',
    author: 'MembershipPro',
    rating: 4.5,
    views: 987,
    copies: 78,
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  },
  {
    id: 'ecom-12',
    title: '🚚 物流通知文案優化',
    description: '出貨/配送通知訊息模板',
    content: `請優化以下物流通知文案：

通知類型：{{notification_type}}
品牌調性：{{brand_voice}}
商品類別：{{product_type}}
附加行銷：{{cross_sell}}

請提供：
1. SMS 簡訊版 (70字)
2. Email 版
3. LINE 推播版
4. App Push 版

每個版本包含：
- 物流資訊
- 品牌溫度
- 追蹤連結位置
- 客服聯繫方式`,
    tags: ['Logistics', 'Notification', 'CRM', 'E-commerce'],
    category: 'Marketing',
    model: 'ChatGPT',
    mode: 'text',
    variables: [
      { name: 'notification_type', description: '通知類型 (已出貨/配送中/已送達)', type: 'text', required: true },
      { name: 'brand_voice', description: '品牌調性', type: 'text', required: false },
      { name: 'product_type', description: '商品類別', type: 'text', required: false },
      { name: 'cross_sell', description: '附加行銷訊息（選填）', type: 'text', required: false }
    ],
    isFavorite: false,
    isNSFW: false,
    source: 'community',
    author: 'LogisticsTeam',
    rating: 4.4,
    views: 876,
    copies: 67,
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  },
  {
    id: 'ecom-13',
    title: '💰 定價策略分析器',
    description: '電商商品定價策略建議',
    content: `請分析並建議商品定價策略：

商品：{{product}}
成本：{{cost}}
競品價格：{{competitor_prices}}
目標客群：{{target_market}}
品牌定位：{{positioning}}

請提供：
1. 建議售價區間
2. 定價策略說明
3. 促銷價格建議
4. 組合定價方案
5. 心理定價技巧
6. 利潤率分析`,
    tags: ['Pricing Strategy', 'E-commerce', 'Analysis', 'Business'],
    category: 'Research',
    model: 'Claude',
    mode: 'text',
    variables: [
      { name: 'product', description: '商品名稱與規格', type: 'text', required: true },
      { name: 'cost', description: '商品成本', type: 'text', required: true },
      { name: 'competitor_prices', description: '競品價格', type: 'text', required: true },
      { name: 'target_market', description: '目標客群', type: 'text', required: true },
      { name: 'positioning', description: '品牌定位 (平價/中價/高端)', type: 'text', required: true }
    ],
    isFavorite: false,
    isNSFW: false,
    source: 'community',
    author: 'PricingExpert',
    rating: 4.6,
    views: 1234,
    copies: 98,
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  },
  {
    id: 'ecom-14',
    title: '🛍️ 購物車提醒文案',
    description: '購物車未結帳提醒訊息',
    content: `請撰寫購物車遺棄提醒訊息：

商品類別：{{product_category}}
商品價值：{{cart_value}}
提醒階段：{{reminder_stage}}
品牌風格：{{brand_style}}

請提供 3 階段提醒：
1. 第一封 (離開後1小時)
2. 第二封 (離開後24小時)
3. 第三封 (離開後72小時)

每封包含：
- 主旨
- 正文
- 優惠策略建議
- CTA`,
    tags: ['Cart Abandonment', 'Email Marketing', 'CRM', 'E-commerce'],
    category: 'Marketing',
    model: 'ChatGPT',
    mode: 'text',
    variables: [
      { name: 'product_category', description: '商品類別', type: 'text', required: true },
      { name: 'cart_value', description: '購物車金額', type: 'text', required: true },
      { name: 'reminder_stage', description: '提醒階段', type: 'text', required: false },
      { name: 'brand_style', description: '品牌風格', type: 'text', required: false }
    ],
    isFavorite: false,
    isNSFW: false,
    source: 'community',
    author: 'RetentionPro',
    rating: 4.8,
    views: 2345,
    copies: 189,
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  },
  {
    id: 'ecom-15',
    title: '🌟 KOL 合作提案生成器',
    description: '網紅/KOL 合作邀約信函',
    content: `請撰寫 KOL 合作邀約提案：

品牌/商品：{{brand}}
KOL 資料：{{kol_info}}
合作形式：{{collaboration_type}}
預算範圍：{{budget}}
合作目標：{{goals}}

請提供：
1. 開場自我介紹
2. 為何選擇此 KOL
3. 合作方案說明
4. 權益與報酬
5. 合作流程
6. 結語與聯繫方式`,
    tags: ['KOL', 'Influencer Marketing', 'Collaboration', 'Outreach'],
    category: 'Marketing',
    model: 'ChatGPT',
    mode: 'text',
    variables: [
      { name: 'brand', description: '品牌/商品介紹', type: 'textarea', required: true },
      { name: 'kol_info', description: 'KOL 基本資料與風格', type: 'textarea', required: true },
      { name: 'collaboration_type', description: '合作形式 (業配/聯名/長期)', type: 'text', required: true },
      { name: 'budget', description: '預算範圍', type: 'text', required: true },
      { name: 'goals', description: '合作目標', type: 'text', required: true }
    ],
    isFavorite: false,
    isNSFW: false,
    source: 'community',
    author: 'InfluencerPR',
    rating: 4.7,
    views: 1567,
    copies: 123,
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z'
  }
];
