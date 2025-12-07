'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTugasManager } from '../../../components/TugasManager/TugasManagerContext'
import StepProgressBar from '../../../components/TugasManager/StepProgressBar'

export default function UploadPage() {
  const { setUploadedFile } = useTugasManager()
  const [loading,setLoading] = useState(false)
  const router = useRouter()

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return
    setUploadedFile(e.target.files[0])
  }

  function handleUpload() {
    if (!setUploadedFile) return
    setLoading(true)
    setTimeout(()=>{
      setLoading(false)
      router.push('/tugas-manager/images')
    },1000)
  }

  return (
    <div>
      <StepProgressBar currentStep={0}/>
      <h2 className="text-xl font-bold mb-4">Upload Soal Word (Dummy)</h2>
      <input type="file" accept=".doc,.docx" onChange={handleFile} className="border p-1 rounded"/>
      <div className="mt-4">
        <button onClick={handleUpload} className="px-3 py-1 bg-green-600 text-white rounded mr-2" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload & Lanjut'}
        </button>
        <button onClick={()=>window.history.back()} className="px-3 py-1 bg-gray-400 text-white rounded">Kembali</button>
      </div>
    </div>
  )
}
