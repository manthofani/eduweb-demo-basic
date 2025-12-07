'use client'
import React, { useEffect, useState } from 'react'
import { db } from '../../lib/storage'
import type { AbsenRecord } from '../../lib/types'
import { useRouter } from 'next/navigation'

const ABSEN_KODE = '12345' // kode dummy guru

export default function AbsenPage() {
  const router = useRouter()
  const today = new Date().toISOString().slice(0, 10)

  const [date, setDate] = useState(today)
  const [records, setRecords] = useState<AbsenRecord[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [kode, setKode] = useState('') // untuk murid
  const [selectedUser, setSelectedUser] = useState<string>('') // untuk admin
  const [status, setStatus] = useState<'Hadir'|'Izin'|'Sakit'|'Alpha'>('Hadir')
  const [selectedMonth, setSelectedMonth] = useState(today.slice(0,7))
  const [session, setSession] = useState<any>(null)

  useEffect(()=>{
    db.initIfEmpty()
    const sess = db.getSession()
    if(!sess) return router.push('/login')
    setSession(sess)
    if(sess.role !== 'admin') {
      // murid
      const exists = db.getAbsen().some(r=> r.userId===sess.userId && r.date===today)
      setSubmitted(Boolean(exists))
      setRecords(db.getAbsenByUser(sess.userId))
    } else {
      // admin
      setRecords(db.getAbsen())
    }
  },[])

  function save() {
    if(!session) return alert('Login dulu')

    if(session.role !== 'admin') {
      // murid
      if(!kode) return alert('Masukkan kode absen dari guru')
      if(kode !== ABSEN_KODE) return alert('Kode absen salah!')

      const exists = db.getAbsen().some(r=> r.userId===session.userId && r.date===today)
      if(exists) return alert('Anda sudah absen hari ini')

      db.saveAbsen({ userId: session.userId, date: today, status: 'Hadir' })
      setSubmitted(true)
      setRecords(db.getAbsenByUser(session.userId))
      alert('Absen berhasil')
    } else {
      // admin
      if(!selectedUser) return alert('Pilih user')
      const exists = db.getAbsen().some(r=> r.userId===selectedUser && r.date===date)
      if(exists) return alert('User ini sudah absen pada tanggal tersebut')

      db.saveAbsen({ userId: selectedUser, date, status })
      setRecords(db.getAbsen())
      alert('Absen berhasil')
    }
  }

  const filteredRecords = records.filter(r => r.date.startsWith(selectedMonth))

  return (
    <div className='justify-self-center'>
      <h2 className='text-xl font-bold mb-4'>Absen</h2>
      <div className='card-school p-4 rounded max-w-md'>

        {session?.role !== 'admin' ? (
          <>
            <div className='mb-3'>
              <label className='block text-sm'>Masukkan kode absen:</label>
              <input value={kode} onChange={e=>setKode(e.target.value)} className='border p-2 rounded w-full'/>
            </div>
            <button onClick={save} disabled={submitted} className={'px-3 py-1 border rounded ' + (submitted ? 'opacity-50 cursor-not-allowed' : '')}>
              Absen Hari Ini
            </button>
          </>
        ) : (
          <>
            <div className='mb-3'>
              <label className='block text-sm'>Pilih User</label>
              <select value={selectedUser} onChange={e=>setSelectedUser(e.target.value)} className='border p-2 rounded w-full'>
                {db.getUsers().map(u=> <option key={u.userId} value={u.userId}>{u.name}</option>)}
              </select>
            </div>
            <div className='mb-3'>
              <label className='block text-sm'>Tanggal</label>
              <input type='date' value={date} onChange={e=>setDate(e.target.value)} className='border p-2 rounded w-full'/>
            </div>
            <div className='mb-3'>
              <label className='block text-sm'>Status</label>
              <select value={status} onChange={e=>setStatus(e.target.value as any)} className='border p-2 rounded w-full'>
                <option>Hadir</option>
                <option>Izin</option>
                <option>Sakit</option>
                <option>Alpha</option>
              </select>
            </div>
            <button onClick={save} className='px-3 py-1 bg-green-600 text-white rounded'>Simpan Absen</button>
          </>
        )}

        <div className='mt-4'>
          <h3 className='font-semibold'>Riwayat</h3>
          <div className='mb-2'>
            <label className='text-sm'>Filter Bulan</label>
            <input type='month' value={selectedMonth} onChange={e=>setSelectedMonth(e.target.value)} className='border p-1 rounded'/>
          </div>
          <ul>
            {filteredRecords.map(r => <li key={r.userId + r.date}>{r.date} — {r.status}</li>)}
          </ul>
        </div>

      </div>
    </div>
  )
}
