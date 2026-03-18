# 推送到 GitHub 的方法

## 方法 1：使用 GitHub Token（推荐）

### 步骤 1：创建 Personal Access Token

1. 访问 https://github.com/settings/tokens
2. 点击 **"Generate new token (classic)"**
3. 填写：
   - **Note**: `leather-swatches deploy`
   - **Expiration**: 选择 `No expiration` 或 `90 days`
   - **Select scopes**: 勾选 `repo` (Full control of private repositories)
4. 点击 **"Generate token"**
5. **复制 token**（只显示一次，格式类似 `ghp_xxxxxxxxxxxx`）

### 步骤 2：推送代码

在终端执行（替换 YOUR_TOKEN 为你的 token）：

```bash
cd /root/.openclaw/workspace/leather-swatches

# 使用 token 推送
git push https://YOUR_TOKEN@github.com/Zrrrrrrrrrrr/leather-swatches.git main
```

或者设置全局 token（更方便）：

```bash
# 设置全局 token（替换 YOUR_TOKEN）
git config --global credential.helper store
git push https://github.com/Zrrrrrrrrrrr/leather-swatches.git main
# 这时会提示输入用户名和密码
# 用户名：Zrrrrrrrrrrr
# 密码：粘贴你的 token（ghp_xxx）
```

---

## 方法 2：使用 SSH（如果你已配置 SSH）

### 步骤 1：切换为 SSH 远程地址

```bash
cd /root/.openclaw/workspace/leather-swatches

# 移除 HTTPS 远程
git remote remove origin

# 添加 SSH 远程
git remote add origin git@github.com:Zrrrrrrrrrrr/leather-swatches.git

# 推送
git push -u origin main
```

### 如果没有 SSH 密钥

```bash
# 生成 SSH 密钥
ssh-keygen -t ed25519 -C "your_email@example.com"

# 查看公钥
cat ~/.ssh/id_ed25519.pub

# 复制输出内容，然后访问：
# https://github.com/settings/keys
# 点击 "New SSH key" 粘贴保存
```

---

## 方法 3：GitHub CLI（最简单）

如果你安装了 GitHub CLI：

```bash
cd /root/.openclaw/workspace/leather-swatches

# 登录 GitHub
gh auth login

# 推送
git push -u origin main
```

安装 GitHub CLI：
```bash
# Ubuntu/Debian
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh -y

# 验证
gh --version
```

---

## 推送成功后

访问 https://github.com/Zrrrrrrrrrrr/leather-swatches 确认代码已上传。

然后继续部署到 Vercel：
1. 访问 https://vercel.com
2. 用 GitHub 登录
3. 点击 "Add New Project"
4. 导入 `leather-swatches` 仓库
5. 点击 Deploy
