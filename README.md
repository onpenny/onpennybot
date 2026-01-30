# OnHeritage - 遺產管理平台

一站式遺產管理平台，解決資產信息孤島、繼承主體不明、繼承流程繁瑣等核心痛點。

## 技術棧

- **前端**: Next.js 15 (React 19) + TypeScript
- **樣式**: Tailwind CSS
- **數據庫**: PostgreSQL + Prisma ORM
- **認證**: NextAuth.js (待集成)
- **加密**: AES-256-GCM
- **存儲**: S3 (可選)

## 項目結構

```
onheritage/
├── prisma/
│   └── schema.prisma          # 數據庫模型定義
├── src/
│   ├── app/                   # Next.js App Router 頁面
│   │   ├── (auth)/           # 認證相關頁面
│   │   ├── (dashboard)/      # 主儀表板
│   │   │   ├── assets/       # 資產管理
│   │   │   ├── family/       # 家族譜系
│   │   │   ├── wills/        # 遺囑管理
│   │   │   └── settings/     # 設置
│   │   ├── api/              # API 路由
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/               # UI 基礎組件
│   │   ├── dashboard/        # 儀表板組件
│   │   ├── assets/           # 資產管理組件
│   │   └── family/           # 家族譜系組件
│   ├── lib/
│   │   ├── env.ts            # 環境變量管理
│   │   ├── encryption.ts     # 加密工具
│   │   └── prisma.ts         # Prisma 客戶端
│   └── types/
│       └── index.ts          # TypeScript 類型定義
├── public/                   # 靜態資源
└── package.json
```

## 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 設置環境變量

複製 `.env.example` 到 `.env` 並填寫必要的配置：

```bash
cp .env.example .env
```

### 3. 設置數據庫

```bash
# 生成 Prisma 客戶端
npx prisma generate

# 運行遷移（創建數據庫表）
npx prisma migrate dev --name init

# 查看數據庫（可選）
npx prisma studio
```

### 4. 運行開發服務器

```bash
npm run dev
```

在瀏覽器中打開 [http://localhost:3000](http://localhost:3000)

## 核心功能

### 1. 用戶認證
- 註冊 / 登入
- 多因素認證（待實現）
- 會話管理

### 2. 資產管理
- 手動錄入各類資產
- 分類管理（銀行、保險、不動產等）
- 文檔上傳
- 敏感信息加密存儲

### 3. 家族譜系
- 可視化族譜
- 添加/編輯/刪除家族成員
- 關係標註（血緣、收養、婚姻等）

### 4. 繼承規則
- 為每個資產指定繼承人
- 設置分配比例
- 條件觸發規則

### 5. 遺囑管理
- 多法域模板
- 電子簽名
- 區塊鏈存證（可選）

### 6. 通知系統
- 自動觸發繼承通知
- 系統通知
- 郵件通知（待實現）

## 數據模型

### 主要實體

- **User** - 用戶
- **FamilyMember** - 家族成員
- **Asset** - 資產
- **Inheritance** - 繼承規則
- **Will** - 遺囑
- **Notification** - 通知
- **Donation** - 捐贈記錄

## 安全措施

1. **端到端加密** - 敏感信息使用 AES-256-GCM 加密
2. **密鑰管理** - 用戶私鑰本地存儲，平台無法解密
3. **哈希存證** - 重要文檔生成 SHA-256 哈希
4. **訪問控制** - 基於角色的權限管理
5. **審計日誌** - 所有操作記錄日誌

## 開發指南

### 類型定義

所有類型定義位於 `src/types/index.ts`，遵循 TypeScript 嚴格模式。

### API 路由

API 路由使用 Next.js App Router，位於 `src/app/api/`。

### 組件開發

- UI 組件使用 Tailwind CSS
- 遵循可復用原則
- 使用 TypeScript 嚴格類型檢查

### 數據庫操作

使用 Prisma Client：

```typescript
import { prisma } from '@/lib/prisma';

const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' },
});
```

## 部署

### Vercel

```bash
npm install -g vercel
vercel
```

### Docker

```bash
docker build -t onheritage .
docker run -p 3000:3000 onheritage
```

## 貢獻

歡迎提交 Issue 和 Pull Request！

## 許可證

MIT

## 聯繫方式

- GitHub: https://github.com/onpenny/onpennybot
- Email: [your-email@example.com]

---

**注意**: 本項目目前處於開發階段，請勿用於生產環境。
