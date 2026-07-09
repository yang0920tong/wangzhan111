// 生成或读取本地 anon_id，用于未登录时标识设备
export function getOrCreateAnonId() {
  if (typeof window === 'undefined') return null
  let id = localStorage.getItem('confide_anon_id')
  if (!id) {
    id = 'anon_' + Math.random().toString(36).slice(2, 10)
    localStorage.setItem('confide_anon_id', id)
  }
  return id
}
