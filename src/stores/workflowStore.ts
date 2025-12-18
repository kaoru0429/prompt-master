import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '../utils/common';
import type { Workflow, WorkflowRun } from '../types';

// 預設示範工作流
const sampleWorkflows: Workflow[] = [
  {
    id: 'wf-demo-1',
    name: '📝 部落格文章產生器',
    description: '自動產生完整的部落格文章：從主題構思到完整內容',
    steps: [
      {
        id: 'step-1-1',
        name: '生成文章主題',
        content: '請根據「{{topic}}」這個關鍵字，產生 3 個有吸引力的部落格文章標題選項，用繁體中文回答。',
        inputs: {},
        outputVariable: 'titles'
      },
      {
        id: 'step-1-2',
        name: '撰寫文章大綱',
        content: '根據以下標題選項：\n{{titles}}\n\n請選擇最佳標題，並為該文章撰寫一個詳細的大綱，包含 5-7 個主要段落。',
        inputs: {},
        outputVariable: 'outline'
      },
      {
        id: 'step-1-3',
        name: '撰寫完整文章',
        content: '根據以下大綱：\n{{outline}}\n\n請撰寫一篇完整的部落格文章，字數約 800-1000 字，使用繁體中文，風格輕鬆專業。',
        inputs: {},
        outputVariable: 'article'
      }
    ],
    variables: [{ name: 'topic', description: '文章主題關鍵字', type: 'text', required: true }],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'wf-demo-2',
    name: '🎨 社群貼文製作機',
    description: '一鍵產生多平台社群貼文：Instagram、Facebook、Twitter',
    steps: [
      {
        id: 'step-2-1',
        name: '分析產品特色',
        content: '請分析以下產品或服務的核心賣點：\n「{{product}}」\n\n列出 3 個最吸引人的特色與價值主張。',
        inputs: {},
        outputVariable: 'features'
      },
      {
        id: 'step-2-2',
        name: 'Instagram 貼文',
        content: '根據以下產品特色：\n{{features}}\n\n撰寫一則 Instagram 貼文，包含：\n- 吸睛開頭\n- 3-5 個相關 Hashtag\n- 一個 Call-to-Action',
        inputs: {},
        outputVariable: 'instagram'
      },
      {
        id: 'step-2-3',
        name: 'Twitter/X 貼文',
        content: '根據以下產品特色：\n{{features}}\n\n撰寫 3 則 Twitter 貼文（每則 280 字以內），風格活潑，包含相關 hashtag。',
        inputs: {},
        outputVariable: 'twitter'
      },
      {
        id: 'step-2-4',
        name: 'Facebook 貼文',
        content: '根據以下產品特色：\n{{features}}\n\n撰寫一則 Facebook 長文貼文，包含故事性開頭和說服力強的內容。',
        inputs: {},
        outputVariable: 'facebook'
      }
    ],
    variables: [{ name: 'product', description: '產品或服務描述', type: 'textarea', required: true }],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'wf-demo-3',
    name: '💻 程式碼審查助手',
    description: '自動化程式碼審查：檢查問題、建議優化、產生文件',
    steps: [
      {
        id: 'step-3-1',
        name: '程式碼分析',
        content: '請分析以下程式碼，找出潛在的問題、Bug 或安全風險：\n\n```\n{{code}}\n```\n\n列出所有發現的問題與嚴重程度。',
        inputs: {},
        outputVariable: 'issues'
      },
      {
        id: 'step-3-2',
        name: '優化建議',
        content: '根據以下程式碼問題：\n{{issues}}\n\n針對原始程式碼：\n```\n{{code}}\n```\n\n請提供具體的優化建議與改進後的程式碼範例。',
        inputs: {},
        outputVariable: 'optimized'
      },
      {
        id: 'step-3-3',
        name: '產生文件',
        content: '根據以下程式碼：\n```\n{{code}}\n```\n\n請產生清楚的 JSDoc/Docstring 風格文件註解，說明函數用途、參數與回傳值。',
        inputs: {},
        outputVariable: 'documentation'
      }
    ],
    variables: [{ name: 'code', description: '要審查的程式碼', type: 'textarea', required: true }],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  // ========== 電商行銷 Workflow ==========
  {
    id: 'wf-ecom-1',
    name: '🚀 新品上市全案行銷',
    description: '從商品文案到全渠道行銷素材一站式產出',
    steps: [
      {
        id: 'step-e1-1',
        name: '分析商品賣點',
        content: '請分析以下新品的核心賣點與目標客群：\n\n商品名稱：{{product_name}}\n商品特色：{{product_features}}\n售價：{{price}}\n\n請提供：\n1. 3 個核心賣點\n2. 目標客群畫像\n3. 競品差異化優勢\n4. 情感訴求點',
        inputs: {},
        outputVariable: 'analysis'
      },
      {
        id: 'step-e1-2',
        name: '撰寫商品文案',
        content: '根據以下分析：\n{{analysis}}\n\n請為商品「{{product_name}}」撰寫：\n1. 電商商品標題 (3版)\n2. 商品詳情頁文案 (500字)\n3. 短描述 (50字)',
        inputs: {},
        outputVariable: 'product_copy'
      },
      {
        id: 'step-e1-3',
        name: '社群貼文素材',
        content: '根據商品文案：\n{{product_copy}}\n\n請產出：\n1. Instagram 貼文 (含 5 個 hashtag)\n2. Facebook 貼文 (含故事性開場)\n3. LINE 推播訊息 (50字內)',
        inputs: {},
        outputVariable: 'social_posts'
      },
      {
        id: 'step-e1-4',
        name: '廣告投放文案',
        content: '根據以上素材：\n{{product_copy}}\n{{social_posts}}\n\n請產出 Facebook/Instagram 廣告文案：\n1. 圖片廣告版 (50字)\n2. 影片廣告版 (100字)\n3. 輪播廣告版 (每張 30 字 x 5 張)\n\n每版都要有明確 CTA',
        inputs: {},
        outputVariable: 'ad_copy'
      }
    ],
    variables: [
      { name: 'product_name', description: '商品名稱', type: 'text', required: true },
      { name: 'product_features', description: '商品特色描述', type: 'textarea', required: true },
      { name: 'price', description: '商品售價', type: 'text', required: true }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'wf-ecom-2',
    name: '🎯 促銷活動完整企劃',
    description: '從活動規劃到執行素材全流程產出',
    steps: [
      {
        id: 'step-e2-1',
        name: '活動主題發想',
        content: '請為以下促銷活動發想主題：\n\n活動類型：{{campaign_type}}\n活動檔期：{{duration}}\n商品類別：{{category}}\n目標：{{goal}}\n\n請提供：\n1. 5 個活動主題與命名\n2. 主視覺概念建議\n3. Slogan 候選',
        inputs: {},
        outputVariable: 'theme'
      },
      {
        id: 'step-e2-2',
        name: '促銷機制設計',
        content: '根據活動主題：\n{{theme}}\n\n請設計促銷機制：\n1. 主力促銷方案 (折扣/贈品/組合)\n2. 會員限定優惠\n3. 社群分享獎勵\n4. 限時限量設計\n5. 利潤預估模型',
        inputs: {},
        outputVariable: 'promo_plan'
      },
      {
        id: 'step-e2-3',
        name: '行銷素材產出',
        content: '根據活動設計：\n{{theme}}\n{{promo_plan}}\n\n請產出：\n1. EDM 主旨 + 正文\n2. 官網 Banner 文案\n3. 社群貼文 x 3 則\n4. 簡訊推播 (70字)',
        inputs: {},
        outputVariable: 'materials'
      },
      {
        id: 'step-e2-4',
        name: '廣告投放策略',
        content: '根據以上素材：\n{{materials}}\n\n請擬定：\n1. 廣告投放時程\n2. 受眾分層建議\n3. 預算分配比例\n4. KPI 設定\n5. A/B 測試計畫',
        inputs: {},
        outputVariable: 'ad_strategy'
      }
    ],
    variables: [
      { name: 'campaign_type', description: '活動類型 (週年慶/雙11/清倉)', type: 'text', required: true },
      { name: 'duration', description: '活動檔期', type: 'text', required: true },
      { name: 'category', description: '商品類別', type: 'text', required: true },
      { name: 'goal', description: '活動目標 (業績/會員/曝光)', type: 'text', required: true }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'wf-ecom-3',
    name: '📈 客戶經營自動化',
    description: '從新客歡迎到再行銷的完整 CRM 內容',
    steps: [
      {
        id: 'step-e3-1',
        name: '新客歡迎序列',
        content: '請為「{{brand_name}}」品牌設計新客歡迎郵件序列：\n\n品牌調性：{{brand_tone}}\n首購優惠：{{first_order_offer}}\n\n請設計 3 封序列：\n1. 歡迎信 (訂閱後即刻)\n2. 品牌故事 (第 3 天)\n3. 首購提醒 (第 7 天)',
        inputs: {},
        outputVariable: 'welcome_series'
      },
      {
        id: 'step-e3-2',
        name: '購後關懷訊息',
        content: '根據品牌調性設計購後關懷序列：\n\n{{welcome_series}}\n\n請設計：\n1. 訂單確認信\n2. 出貨通知 (含品牌溫度)\n3. 到貨關懷 (邀請評價)\n4. 回購提醒 (7天後)',
        inputs: {},
        outputVariable: 'post_purchase'
      },
      {
        id: 'step-e3-3',
        name: '沉睡客喚醒',
        content: '設計沉睡客喚醒方案：\n\n品牌：{{brand_name}}\n\n請設計 30/60/90 天未回購客戶的喚醒訊息：\n1. 第一封：想念提醒\n2. 第二封：專屬優惠\n3. 第三封：最後機會',
        inputs: {},
        outputVariable: 'win_back'
      },
      {
        id: 'step-e3-4',
        name: 'VIP 經營計畫',
        content: '根據以上內容制定 VIP 經營計畫：\n\n{{welcome_series}}\n{{post_purchase}}\n{{win_back}}\n\n請設計：\n1. VIP 分級標準\n2. 各級專屬權益\n3. 升等激勵機制\n4. VIP 專屬活動方案',
        inputs: {},
        outputVariable: 'vip_plan'
      }
    ],
    variables: [
      { name: 'brand_name', description: '品牌名稱', type: 'text', required: true },
      { name: 'brand_tone', description: '品牌調性 (專業/親切/活潑)', type: 'text', required: true },
      { name: 'first_order_offer', description: '首購優惠內容', type: 'text', required: true }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

interface WorkflowStore {
  workflows: Workflow[];
  runs: WorkflowRun[];

  addWorkflow: (workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateWorkflow: (id: string, updates: Partial<Workflow>) => void;
  deleteWorkflow: (id: string) => void;

  addRun: (run: WorkflowRun) => void;
  updateRun: (id: string, updates: Partial<WorkflowRun>) => void;
}

export const useWorkflowStore = create<WorkflowStore>()(
  persist(
    (set) => ({
      workflows: sampleWorkflows,
      runs: [],

      addWorkflow: (workflow) =>
        set((state) => ({
          workflows: [
            {
              ...workflow,
              id: generateId(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            ...state.workflows,
          ],
        })),

      updateWorkflow: (id, updates) =>
        set((state) => ({
          workflows: state.workflows.map((w) =>
            w.id === id ? { ...w, ...updates, updatedAt: new Date().toISOString() } : w
          ),
        })),

      deleteWorkflow: (id) =>
        set((state) => ({
          workflows: state.workflows.filter((w) => w.id !== id),
        })),

      addRun: (run) =>
        set((state) => ({
          runs: [run, ...state.runs].slice(0, 50), // Keep last 50 runs
        })),

      updateRun: (id, updates) =>
        set((state) => ({
          runs: state.runs.map((r) =>
            r.id === id ? { ...r, ...updates, completedAt: updates.status === 'completed' || updates.status === 'failed' ? new Date().toISOString() : r.completedAt } : r
          ),
        })),
    }),
    {
      name: 'prompt-master-workflows',
      version: 2, // 版本 2：加入電商行銷工作流
      migrate: (persistedState: unknown, version: number) => {
        const state = persistedState as { workflows?: Workflow[]; runs?: WorkflowRun[] };

        // 任何舊版本 -> 最新版本：補上缺少的示範工作流
        if (version < 2) {
          const existingIds = (state.workflows || []).map(w => w.id);
          const newSamples = sampleWorkflows.filter(w => !existingIds.includes(w.id));
          return {
            ...state,
            workflows: [...(state.workflows || []), ...newSamples],
          };
        }

        return state;
      }
    }
  )
);
