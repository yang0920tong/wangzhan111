# 快速上线：匿名/实名倾诉站 MVP（Next.js + Supabase）

要点
- 技术栈：Next.js (Pages) + TailwindCSS + Supabase (Postgres + Auth + Realtime)
- 匿名策略：允许未登录发帖，前端为设备生成 anon_id 存 localStorage；后端表保存 anon_id 和 IP 哈希（仅管理员可见）。
- 目标：首页、登录、发帖窗口、帖文详情（评论/点赞）、用户空间。

本地运行（快速）
1. 创建项目目录并初始化：
   git init && npm init -y
2. 复制代码文件（见仓库文件块）。
3. 安装依赖：
   npm install next react react-dom @supabase/supabase-js tailwindcss postcss autoprefixer
   npx tailwindcss init -p
4. 设置环境变量（.env.local）:
   NEXT_PUBLIC_SUPABASE_URL=你的_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_supabase_anon_key
5. 启动：
   npm run dev

Supabase 设置（一步步）
1. 注册并创建项目：https://app.supabase.com/
2. 在 SQL Editor 执行文件 supabase.sql（见下）。
3. 在 Project Settings -> API 复制 URL 与 anon key 填入 .env.local
4. 可选：在 Supabase Dashboard 设置 Row Level Security (RLS) 规则（初期可先关闭复杂 RLS，后期加上审核策略）

部署到 Vercel
1. 新建 GitHub 仓库并 push 代码
2. 在 Vercel 新建项目，连接仓库
3. 添 environment variables（NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY）
4. Deploy

管理与审核建议（MVP 后）
- 添加自动化 moderation（OpenAI moderation / Perspective）拦截高风险内容并自动 flag。
- 设置举报面板与管理员查看 IP 哈希 / anon_id 的能力（仅限管理员）。
- 添加速率限制（Cloudflare + 后端计数器）。

如果你准备好了，我可以：
- 1) 把这些文件生成到一个 GitHub 仓库（你给 repo 或授权），并帮你把项目 deploy 到 Vercel；
- 2) 或者继续把更多功能（私信、图片上传、分级审核）作为下个迭代加入。

现在把 supabase.sql、关键代码文件拷进本地即可运行。
