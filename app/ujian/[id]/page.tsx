'use client'
import React, {useEffect, useState} from 'react'
import { useParams, useRouter } from 'next/navigation'
import { db } from '../../../lib/storage'
import { gradeMCQ } from '../../../lib/grade'

export default function UjianDetail(){
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const [ujian, setUjian] = useState<any|null>(null)
  const [answers, setAnswers] = useState<number[]>([])
  useEffect(()=>{
    db.initIfEmpty()
    const all = db.getUjians()
    const found = all.find((t:any)=>t.id===id)
    if(!found) return
    setUjian(found)
    setAnswers(new Array(found.questions.length).fill(-1))
  },[id])

  function choose(idx:number,val:number){ const a=[...answers]; a[idx]=val; setAnswers(a) }
  function submit(){
    const sess = db.getSession()
    if(!sess) return alert('Login terlebih dahulu')
    const res = gradeMCQ(ujian.questions, answers)
    const sub = {
      id: 'sub_' + Date.now(),
      userId: sess.userId,
      itemId: ujian.id,
      type: 'ujian',
      answers,
      score: res.score,
      submittedAt: Date.now()
    }
    db.saveSubmission(sub)
    alert('Ujian dikirim. Skor: ' + res.score)
    router.push('/ujian')
  }

  if(!ujian) return <div>Loading...</div>
  return (
    <div>
      <h2 className='text-xl font-bold mb-4'>Ujian: {ujian.title}</h2>
      <div className='card-school p-4 rounded'>
        {ujian.questions.map((q:any, idx:number)=>(
          <div key={q.id} className='mt-3'>
            <div className='font-semibold'>{idx+1}. {q.text}</div>
            <div className='mt-1 space-y-1'>
              {q.options.map((opt:string,i:number)=>(
                <div key={i}>
                  <label className='inline-flex items-center'>
                    <input type='radio' name={'q'+idx} checked={answers[idx]===i} onChange={()=>choose(idx,i)} /> <span className='ml-2'>{opt}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className='mt-4'><button onClick={submit} className='px-3 py-1 bg-green-600 text-white rounded'>Submit Ujian</button></div>
      </div>
    </div>
  )
}
