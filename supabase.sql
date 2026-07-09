-- Supabase/Postgres schema for MVP

-- 用户表（可选：Supabase 自带 auth 表, 这里放扩展信息）
create table if not exists profiles (
  id uuid primary key references auth.users(id),
  display_name text,
  avatar_url text,
  created_at timestamptz default now()
);

-- 帖子
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id), -- 登陆用户
  anon_id text,                             -- 本地匿名 id，nullable
  ip_hash text,                             -- 管理员可见，用于追溯，存 hash
  content text not null,
  is_anonymous boolean default true,
  likes_count int default 0,
  comments_count int default 0,
  created_at timestamptz default now()
);

-- 评论
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade,
  user_id uuid references auth.users(id),
  anon_id text,
  ip_hash text,
  content text not null,
  created_at timestamptz default now()
);

-- 点赞（去重）
create table if not exists likes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade,
  user_id uuid references auth.users(id),
  anon_id text,
  created_at timestamptz default now(),
  unique (post_id, coalesce(user_id::text, anon_id))
);

-- 举报
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  target_type text, -- 'post' or 'comment'
  target_id uuid,
  reporter_user_id uuid references auth.users(id),
  reporter_anon_id text,
  reason text,
  handled_by uuid references auth.users(id),
  status text default 'open',
  created_at timestamptz default now(),
  handled_at timestamptz
);

-- 索引
create index if not exists idx_posts_created_at on posts(created_at desc);
create index if not exists idx_comments_post on comments(post_id);
