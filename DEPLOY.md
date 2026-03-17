# 部署指南 - 让网站全球可访问

## 方案一：Vercel 部署（推荐 ⭐）

### 步骤：

1. **访问 Vercel**
   - 打开 https://vercel.com
   - 用 GitHub 账号登录

2. **导入项目**
   - 点击 "Add New Project"
   - 选择你的 GitHub 仓库 `leather-swatches`
   - 或者使用 Git 命令行推送

3. **部署配置**
   - Framework Preset: Next.js（自动识别）
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **点击 Deploy**
   - 等待构建完成（约 2-3 分钟）
   - 获得全球可访问的 URL：`https://your-project.vercel.app`

### 自定义域名（可选）
- 在 Vercel Dashboard → Settings → Domains
- 添加你的域名
- 按提示配置 DNS

### 优势
- ✅ 全球 30+ CDN 节点
- ✅ 自动 HTTPS
- ✅ 零配置部署 Next.js
- ✅ 免费额度：100GB 带宽/月
- ✅ 自动预览部署（每个 Git 分支）

---

## 方案二：Cloudflare Pages

### 步骤：

1. **访问 Cloudflare Pages**
   - https://pages.cloudflare.com

2. **连接 Git 仓库**
   - 选择 `leather-swatches` 项目

3. **构建设置**
   - Framework preset: Next.js
   - Build command: `npm run build`
   - Build output directory: `.next`

4. **启用 Cloudflare CDN**
   - 自动启用全球 275+ 节点

### 优势
- ✅ 无限带宽（免费）
- ✅ 全球最多 CDN 节点
- ✅ 集成 Cloudflare 安全功能

---

## ⚠️ 重要：数据持久化

当前项目使用本地文件存储（`data/db.json`），部署到云平台后需要改为云数据库：

### 推荐方案：

1. **图片存储** → Vercel Blob / Cloudflare R2
2. **数据存储** → 
   - Vercel KV (Redis)
   - Supabase (PostgreSQL)
   - PlanetScale (MySQL)
   - MongoDB Atlas

### 下一步改造
如需帮助迁移到云数据库，请告知！

---

## 快速测试

部署后可用以下工具测试全球访问速度：
- https://www.webpagetest.org/
- https://pagespeed.web.dev/
- https://www.catchpoint.com/
