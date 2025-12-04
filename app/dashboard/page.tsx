'use client'
import React, {useEffect, useState} from 'react'
import { db } from '../../lib/storage'
import { calcMapelScore } from '../../lib/grade'
import { useRouter } from 'next/navigation'

export default function Dashboard(){
  const router = useRouter()
  const [summary,setSummary] = useState<any>(null)
  useEffect(()=>{
    db.initIfEmpty()
    const session = db.getSession()
    if(!session) return router.push('/login');
    const mapels = db.getMapels()
    const tugas = db.getTugas()
    const ujians = db.getUjians()
    const subs = db.getSubmissions()
    const mapelSumm = mapels.map(m=>{
      const s = calcMapelScore(m.id, tugas, ujians, subs, session.userId)
      return { ...m, ...s }
    })
    setSummary({ session, mapelSumm })
  },[])

  
  if(!summary) return <div>Loading...</div>
  return (
    <div>
      <h2 className='text-xl font-bold mb-4'>Dashboard</h2>
      <div className='grid grid-cols-2 gap-4'>
        {summary.mapelSumm.map((m:any)=>(
          <div key={m.id} className='bg-white p-4 rounded shadow'>
            <h3 className='font-semibold'>{m.name}</h3>
            <p>Tugas: {m.tugasScore}</p>
            <p>Ujian: {m.ujianScore}</p>
            <p>Total: {m.total}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
