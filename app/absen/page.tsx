'use client'
import React, {useEffect, useState} from 'react'
import { db } from '../../lib/storage'
import type { AbsenRecord } from '../../lib/types'
import { useRouter } from 'next/navigation'

const statuses = ['Hadir','Izin','Sakit','Alpha'] as const

export default function AbsenPage(){
  const router = useRouter()
  const [date, setDate] = useState(new Date().toISOString().slice(0,10))
  const today = new Date().toISOString().slice(0,10)
  const [records, setRecords] = useState<AbsenRecord[]>([])
  const [submitted, setSubmitted] = useState(false)
  
  useEffect(()=>{ db.initIfEmpty(); checkSubmitted(); 
    const session = db.getSession()
    if(!session) return router.push('/login');
    setRecords(db.getAbsenByUser(session.userId));
  },[])

  function checkSubmitted(d?:string){
    const sess = db.getSession()
    const checkDate = d ?? date
    if(!sess) { setSubmitted(false); return }
    const exists = db.getAbsen().some(r=> r.userId===sess.userId && r.date===checkDate)
    setSubmitted(Boolean(exists))
  }

  function onDateChange(v:string){
    setDate(v)
    checkSubmitted(v)
  }

  function save(status:string){
    const sess = db.getSession()
    if(!sess) return alert('Login dulu')
    if(sess.role !== 'admin' && date !== today) return alert('Hanya boleh absen untuk tanggal hari ini')
    const exists = db.getAbsen().some(r=> r.userId===sess.userId && r.date===date)
    if(exists) { setSubmitted(true); return alert('Sudah absen untuk tanggal ini') }
    const rec: AbsenRecord = { userId: sess.userId, date, status: status as any }
    db.saveAbsen(rec)
    setRecords(db.getAbsen())
    setSubmitted(true)
  }

  return (
    <div className='justify-self-center'>
      <h2 className='text-xl font-bold mb-4'>Absen</h2>
      <div className='card-school p-4 rounded max-w-md'>
        <div className='mb-3'>
          <label className='block text-sm'>Pilih Tanggal</label>
          <input type='date' value={date} onChange={e=>onDateChange(e.target.value)} className='border p-2 rounded w-full' />
        </div>
        <div className='flex gap-2'>
          {statuses.map(s=> <button key={s} onClick={()=>save(s)} disabled={submitted} className={'px-3 py-1 border rounded ' + (submitted? 'opacity-50 cursor-not-allowed':'' )}>{s}</button>)}
        </div>
        <div className='mt-4'>
          <h3 className='font-semibold'>Riwayat</h3>
          <ul>
            {records.map(r=> <li key={r.userId + r.date}>{r.date} — {r.status}</li>)}
          </ul>
        </div>
      </div>
    </div>
  )
}
