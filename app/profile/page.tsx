'use client'
import React, {useEffect, useState} from 'react'
import { db } from '../../lib/storage'
import { useRouter } from 'next/navigation'

export default function ProfilePage(){
  const [sess, setSess] = useState<any>(null)
  const router = useRouter()
  useEffect(()=> { db.initIfEmpty(); setSess(db.getSession()) }, [])
  function logout(){
    db.clearSession()
    router.push('/login')
  }
  if(!sess) return <div>Login terlebih dahulu</div>
  return (
    <div>
      <h2 className='text-xl font-bold mb-4'>Profil</h2>
      <div className='card-school p-4 rounded max-w-md'>
        <div className='mb-2'><strong>Nama:</strong> {sess.name}</div>
        <div className='mb-2'><strong>Username:</strong> {sess.username}</div>
        <div className='mb-2'><strong>Role:</strong> {sess.role}</div>
        <div className='mt-4'>
          <button onClick={logout} className='px-3 py-1 bg-red-500 text-white rounded'>Logout</button>
        </div>
      </div>
    </div>
  )
}
