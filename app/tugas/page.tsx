'use client'
import React, {useEffect, useState} from 'react'
import Link from 'next/link'
import { db } from '../../lib/storage'
import { useRouter } from 'next/navigation'


export default function TugasPage(){
  const router = useRouter()
  const [tugas, setTugas] = useState<any[]>([])

  useEffect(()=>{ db.initIfEmpty(); setTugas(db.getTugas()); 
    const session = db.getSession()
    if(!session) return router.push('/login')
  },[])
  
  return (
    <div>
      <h2 className='text-xl font-bold mb-4'>Tugas</h2>
      <div className='grid md:grid-cols-2 gap-4'>
        <div>
          <h3 className='font-semibold'>Daftar Tugas</h3>
          <ul>
            {tugas.map(t=> <li key={t.id} className='p-2 border rounded mb-2 card-school'>
              <div className='flex justify-between items-center'>
                <div>
                  <div className='font-semibold'>{t.title}</div>
                  <div className='text-xs'>Mapel: {t.mapelId}</div>
                </div>
                <Link href={'/tugas/' + t.id} className='px-3 py-1 bg-amber-400 rounded'>Kerjakan</Link>
              </div>
            </li>)}
          </ul>
        </div>
        <div>
          <div className='text-sm opacity-80'>Pilih tugas dan klik "Kerjakan" untuk membuka halaman tugas pada halaman baru.</div>
        </div>
      </div>
    </div>
  )
}
