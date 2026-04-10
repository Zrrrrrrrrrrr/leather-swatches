# leather-swatches 国内部署说明

## 🌐 访问地址

**国内用户访问**: `http://111.229.36.237:8081`

---

## 📦 部署信息

### 应用位置
- **代码目录**: `/root/.openclaw/workspace/leather-swatches`
- **运行端口**: `3000` (Next.js)
- **Nginx 代理端口**: `8081`

### 服务管理

```bash
# 查看状态
pm2 status leather-swatches-cn

# 查看日志
pm2 logs leather-swatches-cn

# 重启服务
pm2 restart leather-swatches-cn

# 停止服务
pm2 stop leather-swatches-cn

# 删除服务
pm2 delete leather-swatches-cn
```

### Nginx 配置
- **配置文件**: `/etc/nginx/sites-available/leather-swatches`
- **重启 Nginx**: `systemctl restart nginx`

---

## 🔧 环境变量

文件位置：`/root/.openclaw/workspace/leather-swatches/.env`

```env
NEXT_PUBLIC_SUPABASE_URL=https://mflnflnkcwbizllgoeid.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🔄 更新部署流程

```bash
# 1. 拉取最新代码
cd /root/.openclaw/workspace/leather-swatches
git pull

# 2. 重新构建
npm run build

# 3. 重启应用
pm2 restart leather-swatches-cn

# 4. 查看日志确认
pm2 logs leather-swatches-cn
```

---

## 📊 双节点架构

```
海外用户 → Vercel (vercel.leather-swatches.xxx)
         ↘
          DNS 智能解析（待配置）
         ↗
国内用户 → 111.229.36.237:8081 (当前服务器)
```

### 待办事项
1. 购买域名（推荐：`leather-swatches.cn` 或类似）
2. 配置 DNS 智能解析：
   - 中国大陆 → `111.229.36.237`
   - 海外 → Vercel CNAME
3. 配置 HTTPS（Let's Encrypt）

---

## 🗄️ 数据库

当前共用 Supabase 实例：
- **URL**: https://mflnflnkcwbizllgoeid.supabase.co
- **位置**: 海外（新加坡/日本）

**优化建议**：
- 如果国内用户访问数据库慢，可考虑：
  - 方案 A：使用 Supabase 国内 CDN（如果有）
  - 方案 B：迁移到国内 PostgreSQL（阿里云 RDS / 腾讯云 CDB）
  - 方案 C：使用数据库代理加速

---

**部署时间**: 2026-03-27
**部署人**: AI Assistant
