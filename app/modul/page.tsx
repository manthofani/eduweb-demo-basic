'use client'
import React, {useEffect, useState} from 'react'
import { db } from '../../lib/storage'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ModulPage(){
  const router = useRouter()
  const [mods, setMods] = useState<any[]>([])
  
  useEffect(()=>{ 
    db.initIfEmpty(); 
    const session = db.getSession()
    if(!session) return router.push('/login')
        
    setMods(db.getModules()) 

  },[])

  return (
    <div>
      <h2 className='text-xl font-bold mb-4'>Modul Ajar</h2>
      <div className='grid md:grid-cols-2 gap-4'>
        {mods.map(m=>(
          <div key={m.id} className='card-school p-4 rounded'>
            <div className='font-semibold'>{m.title}</div>
            <div className='text-xs opacity-80 mb-2'>Mapel: {m.mapelId}</div>
            <div className='mb-2 text-sm' dangerouslySetInnerHTML={{__html: m.content.substring(0,200) + '...'}} />
            <Link href={'/modul/' + m.id} className='text-sm text-blue-600'>Buka modul</Link>
          </div>
        ))}
      </div>
    </div>
  )
}
