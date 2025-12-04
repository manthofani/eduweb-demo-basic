'use client'
import React, {useEffect, useState} from 'react'
import { db } from '../../lib/storage'
import { useRouter } from 'next/navigation'

export default function MuridPage(){
  const router = useRouter()
  const [students,setStudents]=useState<any[]>([])
  const [attendance,setAttendance]=useState<any[]>([])
  useEffect(()=>{ db.initIfEmpty(); 
    const sess = db.getSession(); 
    if(!sess) return router.push('/login'); 
    if(sess.role!=='admin') {
      alert('Menu ini hanya untuk Admin') 
      return router.push('/dashboard');
    }
    setStudents(db.getStudents()); setAttendance(db.getAbsen()) },[])
  const today = new Date().toISOString().slice(0,10)
  return (
    <div>
      <h2 className='text-xl font-bold mb-4'>Data Murid</h2>
      <div className='card-school p-4 rounded'>
        <table className='w-full'>
          <thead><tr><th>Nama</th><th>Username</th><th>Absen Hari Ini</th></tr></thead>
          <tbody>
            {students.map(s=>{
              const rec = attendance.find((a:any)=> a.userId===s.id && a.date===today)
              return <tr key={s.id}><td className='p-2'>{s.name}</td><td>{s.username}</td><td>{rec?rec.status:'-'} </td></tr>
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
