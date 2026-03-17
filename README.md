# 🎨 皮革色卡推荐系统

基于 Next.js 16 + Supabase + Vercel Blob 的现代化皮革材料展示平台。

## 🌍 全球部署特性

- ✅ **Supabase** - 全球分布式数据库（自动 CDN）
- ✅ **Vercel Blob** - 图片存储（全球 30+ 节点）
- ✅ **Vercel** - 自动部署 + 边缘网络加速

## 🚀 快速开始

### 1. 配置云存储

按照 [`CLOUD_SETUP.md`](./CLOUD_SETUP.md) 配置：
- Supabase 数据库
- Vercel Blob 存储

### 2. 设置环境变量

创建 `.env.local`：
```bash
cp .env.example .env.local
```

填入你的密钥：
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxx
```

### 3. 本地开发

```bash
npm install
npm run dev
```

访问 http://localhost:3000

### 4. 部署到 Vercel

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署
vercel
```

或在 https://vercel.com 网页导入项目。

## 📁 项目结构

```
leather-swatches/
├── app/
│   ├── api/              # API 路由
│   │   ├── materials/    # 材料管理
│   │   ├── swatches/     # 色卡管理
│   │   └── upload/       # 图片上传
│   ├── materials/        # 材料详情页
│   ├── merchant/         # 商家后台
│   └── page.tsx          # 首页
├── lib/
│   ├── supabase.ts       # Supabase 客户端
│   └── db.ts             # 本地数据库（已废弃）
├── CLOUD_SETUP.md        # 云存储配置指南
├── DEPLOY.md             # 部署指南
├── supabase-schema.sql   # 数据库表结构
└── vercel.json           # Vercel 配置
```

## 🗄️ 数据库表

### materials（材料）
- id, name, description, category, created_at

### swatches（色卡）
- id, material_id, color_name, color_code, description, price, stock, created_at

### product_images（产品图片）
- id, swatch_id, product_type, image_url, description, created_at

详细表结构见 [`supabase-schema.sql`](./supabase-schema.sql)

## 📤 图片上传

- 支持格式：JPG, PNG, GIF, WebP
- 最大大小：5MB
- 存储：Vercel Blob（自动 CDN 加速）
- 访问：公开读取（生产环境建议添加认证）

## 🔒 安全说明

当前配置为**公开读写**（适合演示/内部使用）。

生产环境建议：
1. 启用 Supabase Auth
2. 限制 RLS 策略
3. 添加商家认证
4. 配置 CORS

## 📊 费用

### 免费额度（足够小型项目）
- **Supabase**: 500MB 数据库 + 2GB 带宽/月
- **Vercel Blob**: 1GB 存储 + 10GB 带宽/月
- **Vercel**: 100GB 带宽/月

## 🛠️ 技术栈

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Storage**: Vercel Blob
- **Deployment**: Vercel

## 📝 待办事项

- [ ] 添加 Supabase Auth 用户认证
- [ ] 商家后台权限控制
- [ ] 图片压缩优化
- [ ] 搜索引擎优化 (SEO)
- [ ] 多语言支持

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT
