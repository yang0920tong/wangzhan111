import React, { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { getOrCreateAnonId } from '../helpers/anon'

export default function PostEditor({ onPosted }: { onPosted?: () => void }) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  async function submitPost() {
    if (!content.trim()) return alert('请输入内容')
    setLoading(true)
    const anon_id = getOrCreateAnonId()
    // call Supabase insert
    const { error } = await supabase.from('posts').insert([{
      content,
      anon_id,
      is_anonymous: true
    }])
    setLoading(false)
    if (error) return alert('发布失败：' + error.message)
    setContent('')
    onPosted?.()
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      <textarea
        rows={4}
        value={content}
        onChange={e => setContent(e.target.value)}
        className="w-full border p-2 rounded"
        placeholder="有什么想说的？（可匿名）"
      />
      <div className="mt-2 flex justify-end">
        <button onClick={submitPost} className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}>
          {loading ? '发布中...' : '发布'}
        </button>
      </div>
    </div>
  )
}
