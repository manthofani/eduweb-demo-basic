'use client'
import React, {useEffect, useState} from 'react'
import { db } from '../../lib/storage'
import type { Mapel } from "../../lib/types"
import { calcMapelScore } from '../../lib/grade'
import { useRouter } from 'next/navigation'

export default function NilaiPage(){
  const [mapels,setMapels]=useState<Mapel[]>([])
  const [summary,setSummary]=useState<any[]>([])
  const router = useRouter()

  useEffect(()=>{
    db.initIfEmpty()
    const session = db.getSession()
    if(!session) return router.push('/login')

    const m = db.getMapels()
    setMapels(m)
    const s = m.map((mm:any)=>{
      const val = calcMapelScore(mm.id, db.getTugas(), db.getUjians(), db.getSubmissions(), session.userId)
      return { ...mm, ...val }
    })
    setSummary(s)
  },[])
  
  return (
    <div>
      <h2 className='text-xl font-bold mb-4'>Nilai</h2>
      <div className='space-y-3'>
        {summary.map(s=>
          <div key={s.id} className='p-3 bg-white rounded shadow'>
            <div className='font-semibold'>{s.name}</div>
            <div>Tugas: {s.tugasScore} — Ujian: {s.ujianScore} — Total: {s.total}</div>
          </div>
        )}
      </div>
    </div>
  )
}
