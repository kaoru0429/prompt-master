# Prompt Master 開發工作流程

> 快速、輕量、自動化的個人 Prompt 管理工具開發指南

## 開發環境設定

### 必要工具
- Node.js 18+
- npm 或 pnpm
- Git
- VS Code (建議)

### 快速開始

```bash
# 1. Clone 專案
git clone https://github.com/kaoru0429/prompt-master.git
cd prompt-master

# 2. 安裝依賴
npm install

# 3. 設定環境變數
cp .env.example .env
# 編輯 .env，填入 VITE_GEMINI_API_KEY

# 4. 啟動開發伺服器
npm run dev
```

---

## Git 工作流程

### 分支策略

```
main        ← 生產環境，保護分支
  └── develop  ← 開發整合分支
        └── feature/xxx  ← 功能分支
        └── bugfix/xxx   ← 修復分支
```

### Commit 規範

使用 [Conventional Commits](https://www.conventionalcommits.org/)：

| 類型 | 說明 | 範例 |
|------|------|------|
| `feat` | 新功能 | `feat: add prompt export feature` |
| `fix` | 修復 | `fix: resolve variable parsing issue` |
| `docs` | 文件 | `docs: update README` |
| `refactor` | 重構 | `refactor: extract modal components` |
| `test` | 測試 | `test: add unit tests for promptStore` |

### Pull Request 流程

1. 從 `develop` 建立功能分支
2. 完成開發並提交
3. 建立 PR 至 `develop`
4. 通過 Code Review 後 merge
5. 定期將 `develop` 合併至 `main`

---

## 程式碼規範

### TypeScript

- 啟用嚴格模式
- 使用明確類型，避免 `any`
- 介面優先於類型別名

### React

- 使用 Functional Components
- 使用 Hooks 管理狀態
- 拆分大型元件 (< 300 行)

### 命名規範

| 類型 | 規範 | 範例 |
|------|------|------|
| 元件 | PascalCase | `PromptCard` |
| Hook | camelCase + use prefix | `usePromptStore` |
| 工具函數 | camelCase | `parseVariables` |
| 常數 | UPPER_SNAKE_CASE | `MAX_PROMPTS` |

---

## 部署流程

### 本地預覽

```bash
npm run build
npm run preview
```

### Docker 部署

```bash
docker build -t prompt-master .
docker run -p 80:80 prompt-master
```

### Cloud Run 部署

```bash
gcloud run deploy prompt-master \
  --source . \
  --region asia-east1 \
  --allow-unauthenticated
```

---

## 常見問題

### Q: AI 分析功能無法使用？
A: 確認已在 `.env` 設定 `VITE_GEMINI_API_KEY`

### Q: 本地儲存資料遺失？
A: 資料存於 IndexedDB，清除瀏覽器資料會導致遺失。使用匯出功能備份。
