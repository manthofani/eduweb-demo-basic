'use client'
import React, {useEffect, useState} from 'react'
import { useParams, useRouter } from 'next/navigation'
import { db } from '../../../lib/storage'
import { gradeMCQ } from '../../../lib/grade'


export default function ModulesDetail(){
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const [modules, setModules] = useState<any|null>(null)
  useEffect(()=>{
    db.initIfEmpty()
    const all = db.getModules()
    const found = all.find((t:any)=>t.id===id)
    if(!found) return
    setModules(found)
  },[id])

  function back() {
    return router.push('/modul')    
  }

  if(!modules) return <div>Loading...</div>
  return (
    <div>
      <h2 className='text-xl font-bold mb-4'>Modul: {modules.title}</h2>
      <div className='card-school p-4 rounded'>
          <div key={modules.id} className='card-school p-4 rounded'>
            <div className='font-semibold'>{modules.title}</div>
            <div className='text-xs opacity-80 mb-2'>Mapel: {modules.mapelId}</div>
            <div className='mb-2 text-sm' dangerouslySetInnerHTML={{__html: modules.content}} />
        </div>
        <div className='mt-4'><button onClick={back} className='px-3 py-1 bg-green-600 text-white rounded'>Kembali</button></div>
      </div>
    </div>
  )
}
