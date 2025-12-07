'use client'
import React, {useEffect, useState} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { db } from '../lib/storage'

export default function Layout({children}:{children:React.ReactNode}) {
  const [session,setSession] = useState<any>(null)
  useEffect(()=>{ db.initIfEmpty();
    const sess = db.getSession()
    setSession(sess) 

  },[])
  function logout(){
    db.clearSession()
    setSession(null)
    window.location.href = '/login'
  }
  return (
    <div className='"@container" min-h-screen text-gray-900'>
      <header className='header-school text-white'>
        <div className='max-w-6xl mx-auto p-4  justify-between items-center flex  @min-[875px]:block'>
          <div className='flex items-center gap-3'>
            <Image src='/logo.png' alt='Logo Sekolah' width={48} height={48} className='logo-img' />
            <div>
              <h1 className='text-lg font-semibold'>EduWeb Sekolah</h1>
              <div className='text-xs opacity-80'>Learning Management System — Frontend Demo</div>
            </div>
          </div>
          <nav className='space-x-4 text-sm'>
            <Link href='/dashboard' className='hover:underline'>Dashboard</Link>
            <Link href='/absen' className='hover:underline'>Absen</Link>
            <Link href='/tugas' className='hover:underline'>Tugas</Link>
            <Link href='/ujian' className='hover:underline'>Ujian</Link>
            <Link href='/nilai' className='hover:underline'>Nilai</Link>
            <Link href='/rapor' className='hover:underline'>Rapor</Link>
            <Link href='/modul' className='hover:underline'>Modul</Link>
            <Link href='/murid' className='hover:underline'>Data Murid</Link>
            <Link href='/tugas-manager/upload' className='hover:underline'>Tugas Manager</Link>
            <Link href='/profile' className='hover:underline'>Profil</Link>
            
          </nav>
        </div>
      </header>
      <main className='max-w-6xl mx-auto p-6'>{children}</main>
      {/* <footer className='absolute bottom-0 left-0 right-0 max-w-6xl mx-auto p-4 text-xs text-center no-print'>
        © {new Date().getFullYear()} EduWeb — Demo Sekolah
      </footer> */}
    </div>
  )
}
