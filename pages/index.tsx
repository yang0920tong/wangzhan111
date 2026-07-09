import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import PostEditor from '../components/PostEditor'
import PostList from '../components/PostList'

export default function Home() {
  const [posts, setPosts] = useState<any[]>([])

  async function fetchPosts() {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)
    if (!error) setPosts(data || [])
  }

  useEffect(() => {
    fetchPosts()
    // 简单 realtime 订阅新帖子
    const sub = supabase
      .channel('public:posts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, payload => {
        setPosts(prev => [payload.new, ...prev])
      })
      .subscribe()
    return () => { supabase.removeChannel(sub) }
  }, [])

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">倾诉角 — 匿名或实名都可</h1>
      <PostEditor onPosted={fetchPosts} />
      <div className="mt-6">
        <PostList posts={posts} />
      </div>
    </div>
  )
}
