import type { MCQ, Submission, Tugas, Ujian } from './types'

export function gradeMCQ(questions: MCQ[], answers: number[]): { score:number; perQuestion:boolean[] } {
  let total = 0
  const perQuestion = questions.map((q, idx) => {
    const ok = answers[idx] === q.answerIndex
    if (ok) total += q.score
    return ok
  })
  return { score: total, perQuestion }
}

export function calcMapelScore(mapelId: string, tugas: Tugas[], ujians: Ujian[], subs: Submission[], userId?: string) {
  // Sum scores from submissions that belong to this mapel
  const tugasIds = tugas.filter(t=>t.mapelId===mapelId).map(t=>t.id)
  const ujianIds = ujians.filter(u=>u.mapelId===mapelId).map(u=>u.id)
  const filtered = userId ? subs.filter(s => s.userId === userId) : subs
  const tugasScore = filtered.filter(s=>s.type==='tugas' && tugasIds.includes(s.itemId)).reduce((a,b)=>a+b.score,0)
  const ujianScore = filtered.filter(s=>s.type==='ujian' && ujianIds.includes(s.itemId)).reduce((a,b)=>a+b.score,0)
  return { tugasScore, ujianScore, total: tugasScore + ujianScore }
}
