'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { db } from '../lib/storage'

export default function LoginForm(){
  const [user,setUser]=useState('siswa1')
  const [pass,setPass]=useState('siswa1')
  const [err,setErr]=useState('')
  const router = useRouter()

  function handleSubmit(e:React.FormEvent){
    e.preventDefault()
    db.initIfEmpty()
    const users = db.getUsers()
    const u = users.find(it=>it.username===user && it.password===pass)
    if(!u){ setErr('Invalid credentials'); return }
    const sessionObj = { userId: u.id, username: u.username, name: u.name, role: u.role, loggedAt: Date.now() }
    db.saveSession(sessionObj)
    // verify immediately in console
    console.log('session saved ->', db.getSession())
    router.push('/dashboard')
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-3 max-w-md'>
      <div>
        <label className='block text-sm'>Username</label>
        <input value={user} onChange={e=>setUser(e.target.value)} className='w-full border p-2 rounded' />
      </div>
      <div>
        <label className='block text-sm'>Password</label>
        <input type='password' value={pass} onChange={e=>setPass(e.target.value)} className='w-full border p-2 rounded' />
      </div>
      {err && <div className='text-red-600'>{err}</div>}
      <div>
        <button className='px-4 py-2 bg-blue-600 text-white rounded'>Login</button>
      </div>
    </form>
  )
}
