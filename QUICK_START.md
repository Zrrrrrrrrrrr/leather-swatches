# 🚀 快速配置指南（10 分钟完成）

## 第一部分：创建 Supabase 数据库（5 分钟）

### 步骤 1：注册并创建项目

1. **访问** https://supabase.com
2. 点击 **"Start your project"** 或 **"Sign In"**（用 GitHub 账号登录最快）
3. 点击 **"New Project"**
4. 填写：
   - **Organization**: 选择你的组织（或创建新的）
   - **Project name**: `leather-swatches`
   - **Database password**: 点击 "Generate" 生成一个强密码（**复制保存！**）
   - **Region**: 选择 `Singapore (Singapore)` 或 `Tokyo (Japan)`（亚洲用户延迟最低）
5. 点击 **"Create new project"**
6. 等待 2-3 分钟项目创建完成

### 步骤 2：执行数据库脚本

1. 项目创建完成后，进入 Dashboard
2. 点击左侧 **"SQL Editor"**
3. 点击 **"New query"**
4. 打开项目中的 `supabase-schema.sql` 文件，**复制全部内容**
5. 粘贴到 SQL Editor
6. 点击 **"Run"** 或按 `Ctrl+Enter`
7. 看到 "Success" 提示即完成

### 步骤 3：获取 API 密钥

1. 点击左侧 **"Settings"**（齿轮图标）
2. 点击 **"API"**
3. 复制以下两个值（先保存，后面要用）：
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`（很长的那串）

---

## 第二部分：部署到 Vercel（5 分钟）

### 方式 A：通过 GitHub 部署（推荐）

#### 步骤 1：推送代码到 GitHub

1. 访问 https://github.com/new
2. 创建新仓库：
   - **Repository name**: `leather-swatches`
   - 选择 **Public** 或 **Private** 都可以
   - **不要** 勾选 "Add README" 等选项
3. 点击 **"Create repository"**
4. 复制页面显示的推送命令，类似：
   ```bash
   git remote add origin https://github.com/你的用户名/leather-swatches.git
   git branch -M main
   git push -u origin main
   ```
5. 在终端执行这些命令（替换成你的仓库地址）

#### 步骤 2：Vercel 部署

1. 访问 https://vercel.com
2. 点击 **"Sign In"**（用 GitHub 账号登录）
3. 点击 **"Add New Project"**
4. 在 "Import Git Repository" 列表中找到 `leather-swatches`
5. 点击 **"Import"**
6. 配置页面：
   - **Framework Preset**: Next.js（自动识别）
   - **Root Directory**: `./`（默认）
   - **Build Command**: `npm run build`（默认）
   - **Output Directory**: `.next`（默认）
7. 点击 **"Deploy"**
8. 等待 2-3 分钟，看到 "Congratulations" 即完成
9. 点击 **"Continue to Dashboard"**

### 方式 B：直接上传部署（无需 GitHub）

1. 访问 https://vercel.com
2. 用 GitHub 账号登录
3. 点击 **"Add New Project"**
4. 选择 **"Deploy a template"** 或直接拖拽项目文件夹
5. 后续步骤同上

---

## 第三部分：配置环境变量（3 分钟）

### 配置 Supabase

1. 在 Vercel Dashboard 进入你的项目
2. 点击 **"Settings"** 标签
3. 点击左侧 **"Environment Variables"**
4. 点击 **"Add New"**
5. 添加以下变量（用之前从 Supabase 复制的值）：

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://你的项目.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...`（完整的 anon key） |

6. 每个变量 **Environment** 选择 **Production, Preview, Development**
7. 点击 **"Save"**

### 配置 Vercel Blob

1. 在 Vercel Dashboard 进入你的项目
2. 点击 **"Storage"** 标签
3. 点击 **"Create Database"** 或 **"Add Storage"**
4. 选择 **"Blob"**
5. 选择区域（与 Supabase 相同，如 Singapore）
6. 点击 **"Create"**
7. Vercel 会自动添加 `BLOB_READ_WRITE_TOKEN` 环境变量

---

## 第四部分：重新部署（1 分钟）

配置完环境变量后需要重新部署：

1. 在 Vercel Dashboard 进入项目
2. 点击 **"Deployments"** 标签
3. 找到最新的部署，点击右侧 **"..."**
4. 点击 **"Redeploy"**
5. 等待 2-3 分钟完成

或推送新代码触发自动部署：
```bash
git add .
git commit -m "Update config"
git push
```

---

## ✅ 验证部署

### 1. 访问网站
- 在 Vercel Dashboard 点击 **"Visit"** 打开你的网站
- 域名格式：`https://leather-swatches-xxx.vercel.app`

### 2. 测试数据库连接
- 打开浏览器控制台（F12）
- 访问首页，查看 Network 标签
- `/api/materials` 应该返回 `[]`（空数组，不是 503 错误）

### 3. 测试图片上传
- 访问 `/merchant` 商家后台
- 添加一个材料
- 添加一个色卡
- 点击"管理产品图片"
- 尝试上传一张图片
- 成功后图片应该能正常显示

### 4. 检查 Vercel Blob
- 在 Vercel Dashboard → Storage → Blob
- 应该能看到上传的图片文件

---

## 🎁 自定义域名（可选）

1. 在 Vercel Dashboard → Settings → Domains
2. 输入你的域名（如 `leather-swatches.com`）
3. 点击 **"Add"**
4. 按提示配置 DNS：
   - **Type**: `A` 或 `CNAME`
   - **Value**: 复制 Vercel 提供的值
5. 等待 DNS 生效（通常几分钟到几小时）

---

## 🆘 遇到问题？

### 问题：Supabase 连接失败
- 检查 API 密钥是否正确复制（没有多余空格）
- 确认数据库表已创建（在 Supabase Table Editor 查看）
- 检查 RLS 策略是否启用

### 问题：图片上传失败
- 确认 Vercel Blob 已启用
- 检查 `BLOB_READ_WRITE_TOKEN` 是否存在
- 查看 Vercel Function Logs（Deployments → 点击部署 → Functions）

### 问题：503 错误
- 环境变量未配置或未生效
- 需要 Redeploy 触发重新加载

---

## 📊 完成后的效果

- ✅ 全球 CDN 加速访问
- ✅ 自动 HTTPS 加密
- ✅ 数据库云端存储
- ✅ 图片云端存储 + CDN
- ✅ 自动部署（每次 Git 推送）

---

**需要帮助？** 把遇到的问题告诉我，我会帮你解决！
