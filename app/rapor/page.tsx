'use client'
import React, {useEffect, useState} from 'react'
import { db } from '../../lib/storage'
import { calcMapelScore } from '../../lib/grade'
import { useRouter } from 'next/navigation'


export default function RaporPage(){
  const router = useRouter()
  const [rapor,setRapor]=useState<any[]>([])


  useEffect(()=>{
    db.initIfEmpty()
    const session = db.getSession()
    if(!session) return router.push('/login')
    const mapels = db.getMapels()
    const r = mapels.map((m:any)=>{
      const sc = calcMapelScore(m.id, db.getTugas(), db.getUjians(), db.getSubmissions(), session.userId)
      return { mapel: m.name, ...sc }
    })
    setRapor(r)
  },[])

  function exportPDF(){
    const html = `
      <html><head><title>Rapor</title>
      <style>body{font-family:Arial,Helvetica,sans-serif;padding:20px} table{width:100%;border-collapse:collapse} th,td{border:1px solid #ccc;padding:8px;text-align:left}</style>
      </head><body>
      <h2>Rapor Siswa</h2>
      <table>
        <thead><tr><th>Mapel</th><th>Nilai Tugas</th><th>Nilai Ujian</th><th>Total</th></tr></thead>
        <tbody>
          ${rapor.map(r => `<tr><td>${r.mapel}</td><td>${r.tugasScore}</td><td>${r.ujianScore}</td><td>${r.total}</td></tr>`).join('')}
        </tbody>
      </table>
      </body></html>
    `
    const w = window.open('', '_blank', 'noopener,noreferrer')
    if(!w) return alert('Pop-up blocked. Izinkan pop-up untuk mencetak PDF.')
    w.document.write(html)
    w.document.close()
    w.focus()
    setTimeout(()=>{ w.print(); }, 300)
  }

  return (
    <div>
      <h2 className='text-xl font-bold mb-4'>Rapor</h2>
      <div className='mb-3'>
        <button onClick={exportPDF} className='px-3 py-1 bg-blue-600 text-white rounded no-print'>Export Rapor (Print to PDF)</button>
      </div>
      <table className='w-full bg-white rounded'>
        <thead><tr><th className='p-2'>Mapel</th><th>Nilai Tugas</th><th>Nilai Ujian</th><th>Total</th></tr></thead>
        <tbody>
          {rapor.map(r=> <tr key={r.mapel}><td className='p-2'>{r.mapel}</td><td>{r.tugasScore}</td><td>{r.ujianScore}</td><td>{r.total}</td></tr>)}
        </tbody>
      </table>
    </div>
  )
}
