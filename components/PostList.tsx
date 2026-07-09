import React from 'react'
import Link from 'next/link'

export default function PostList({ posts }: { posts: any[] }) {
  if (!posts?.length) return <div className="text-center text-gray-500">还没有倾诉，成为第一个吧</div>
  return (
    <div className="space-y-4">
      {posts.map(p => (
        <div key={p.id} className="p-4 bg-white rounded shadow">
          <div className="text-sm text-gray-500">{p.is_anonymous ? '匿名' : p.display_name || '用户' } · {new Date(p.created_at).toLocaleString()}</div>
          <div className="mt-2 text-gray-800">{p.content}</div>
          <div className="mt-3 flex gap-3 text-sm">
            <Link href={`/post/${p.id}`}><a className="text-blue-600">查看 / 评论</a></Link>
            <div className="text-gray-500">赞 {p.likes_count || 0}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
