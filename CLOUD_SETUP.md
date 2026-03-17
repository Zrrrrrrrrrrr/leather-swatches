# 云存储配置指南

## 第一步：创建 Supabase 数据库

### 1. 注册 Supabase
- 访问 https://supabase.com
- 用 GitHub 账号登录
- 点击 "Start your project"

### 2. 创建新项目
- Project name: `leather-swatches`
- Database Password: 生成一个强密码（保存好！）
- Region: 选择离你用户最近的区域（推荐 `Singapore` 或 `Tokyo`）

### 3. 执行数据库脚本
1. 进入项目 Dashboard
2. 点击左侧 **SQL Editor**
3. 点击 **New query**
4. 复制 `supabase-schema.sql` 文件内容并执行

### 4. 获取 API 密钥
1. 点击左侧 **Settings** → **API**
2. 复制以下两个值：
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 第二步：配置 Vercel Blob 存储

### 方案 A：通过 Vercel Dashboard 配置（推荐）

1. **部署项目到 Vercel**
   ```bash
   # 安装 Vercel CLI
   npm install -g vercel
   
   # 登录
   vercel login
   
   # 部署
   vercel
   ```

2. **启用 Blob 存储**
   - 进入 Vercel Dashboard → 你的项目
   - 点击 **Storage** 标签
   - 点击 **Create Database** → 选择 **Blob**
   - 选择区域（与 Supabase 相同）
   - 点击 Create

3. **自动配置环境变量**
   - Vercel 会自动添加 `BLOB_READ_WRITE_TOKEN`
   - 在 **Settings** → **Environment Variables** 查看

### 方案 B：手动配置

如果本地测试，需要手动创建 Vercel Blob：
1. 访问 https://vercel.com/docs/storage/vercel-blob/quickstart
2. 按照指南创建存储
3. 获取 `BLOB_READ_WRITE_TOKEN`

---

## 第三步：配置环境变量

### 本地开发
复制 `.env.example` 为 `.env.local`：
```bash
cp .env.example .env.local
```

编辑 `.env.local` 填入你的密钥：
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxx
```

### Vercel 部署
在 Vercel Dashboard → Settings → Environment Variables 添加：
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `BLOB_READ_WRITE_TOKEN`

---

## 第四步：测试连接

### 1. 本地测试
```bash
npm run dev
```

访问 http://localhost:3000

### 2. 检查数据库连接
- 打开浏览器控制台
- 查看是否有 Supabase 连接错误

### 3. 测试图片上传
- 进入商家后台 `/merchant`
- 尝试上传一张产品图片
- 检查 Vercel Blob 控制台是否看到上传的文件

---

## 第五步：数据迁移（可选）

如果你已有本地数据需要迁移到云端：

### 1. 导出本地数据
```bash
cat data/db.json
```

### 2. 手动插入 Supabase
在 Supabase Dashboard → Table Editor 中：
- 逐个表添加数据
- 或使用 SQL Editor 批量插入

### 3. 迁移图片
本地图片需要重新上传到 Vercel Blob（无法自动迁移）

---

## 故障排查

### 问题：Supabase 连接失败
- 检查 API 密钥是否正确
- 确认 RLS 策略已启用（参考 schema.sql）
- 检查网络是否可访问 Supabase

### 问题：Vercel Blob 上传失败
- 确认 `BLOB_READ_WRITE_TOKEN` 已配置
- 检查文件大小是否超过 5MB
- 查看 Vercel Function Logs

### 问题：CORS 错误
- Supabase 默认允许所有来源
- 如需限制，在 Supabase Dashboard → Settings → API 配置

---

## 费用说明

### Supabase 免费额度
- 500MB 数据库
- 50,000 月活用户
- 2GB 带宽/月
- 足够小型项目使用

### Vercel Blob 免费额度
- 1GB 存储
- 10GB 带宽/月
- 足够小型项目使用

---

## 下一步优化建议

1. **添加用户认证** - 使用 Supabase Auth 保护商家后台
2. **图片优化** - 使用 Vercel Image Optimization
3. **CDN 缓存** - 配置 Cache-Control 头
4. **监控告警** - 配置 Supabase 和 Vercel 告警
