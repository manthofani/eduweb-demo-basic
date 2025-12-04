'use client'
import React, {useEffect, useState} from 'react'
import Link from 'next/link'
import { db } from '../../lib/storage'
import { useRouter } from 'next/navigation'


export default function UjianPage(){
  const router = useRouter()
  const [ujians, setUjians] = useState<any[]>([])

  useEffect(()=>{ db.initIfEmpty(); setUjians(db.getUjians()); 
    const session = db.getSession()
    if(!session) return router.push('/login')
  },[])

  return (
    <div>
      <h2 className='text-xl font-bold mb-4'>Ujian</h2>
      <div className='grid md:grid-cols-2 gap-4'>
        <div>
          <h3 className='font-semibold'>Daftar Ujian</h3>
          <ul>
            {ujians.map(u=> <li key={u.id} className='p-2 border rounded mb-2 card-school'>
              <div className='flex justify-between items-center'>
                <div>
                  <div className='font-semibold'>{u.title}</div>
                  <div className='text-xs'>Mapel: {u.mapelId}</div>
                </div>
                <Link href={'/ujian/' + u.id} className='px-3 py-1 bg-amber-400 rounded'>Mulai</Link>
              </div>
            </li>)}
          </ul>
        </div>
        <div>
          <div className='text-sm opacity-80'>Pilih ujian dan klik "Mulai" untuk membuka halaman ujian.</div>
        </div>
      </div>
    </div>
  )
}
