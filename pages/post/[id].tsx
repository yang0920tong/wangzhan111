import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { getOrCreateAnonId } from '../../helpers/anon'

export default function PostPage() {
  const router = useRouter()
  const { id } = router.query
  const [post, setPost] = useState<any>(null)
  const [comments, setComments] = useState<any[]>([])
  const [commentText, setCommentText] = useState('')
  async function load() {
    if (!id) return
    const { data: [p] } = await supabase.from('posts').select('*').eq('id', id).limit(1)
    setPost(p)
    const { data: cs } = await supabase.from('comments').select('*').eq('post_id', id).order('created_at', { ascending: true })
    setComments(cs || [])
  }
  useEffect(() => { load() }, [id])

  async function addComment() {
    if (!commentText.trim()) return
    const anon_id = getOrCreateAnonId()
    const { error } = await supabase.from('comments').insert([{
      post_id: id,
      content: commentText,
      anon_id
    }])
    if (error) return alert('评论失败：' + error.message)
    setCommentText('')
    load()
  }

  if (!post) return <div className="p-8 text-center">加载中...</div>
  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="p-4 bg-white rounded shadow">
        <div className="text-sm text-gray-500">{post.is_anonymous ? '匿名' : '用户'} · {new Date(post.created_at).toLocaleString()}</div>
        <div className="mt-2">{post.content}</div>
      </div>

      <div className="mt-6">
        <h3 className="font-medium">评论</h3>
        <div className="mt-2 space-y-3">
          {comments.map(c => (
            <div key={c.id} className="p-3 bg-white rounded">
              <div className="text-sm text-gray-500">{c.anon_id ? '匿名' : '用户'} · {new Date(c.created_at).toLocaleString()}</div>
              <div className="mt-1">{c.content}</div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <textarea value={commentText} onChange={e => setCommentText(e.target.value)} className="w-full border p-2 rounded" rows={3} />
          <div className="mt-2 text-right">
            <button onClick={addComment} className="bg-blue-600 text-white px-4 py-2 rounded">发表评论</button>
          </div>
        </div>
      </div>
    </div>
  )
}
