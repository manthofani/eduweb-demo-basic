'use client'
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { db } from '../../../lib/storage'
import { gradeMCQ } from '../../../lib/grade'

interface Submission {
  id: string
  userId: string
  itemId: string
  type: 'tugas'
  answers: number[]
  score: number
  submittedAt: number
}

export default function TugasDetail() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const [tugas, setTugas] = useState<any | null>(null)
  const [answers, setAnswers] = useState<number[]>([])
  const [sudahSubmit, setSudahSubmit] = useState(false)

  useEffect(() => {
    db.initIfEmpty()

    // Ambil data tugas
    const allTugas = db.getTugas()
    const found = allTugas.find((t: any) => t.id === id)
    if (!found) return

    setTugas(found)
    setAnswers(new Array(found.questions.length).fill(-1))

    // Cek apakah user sudah submit
    const sess = db.getSession()
    if (sess) {
      const subs = db.getSubmissions()
      const exist = subs.find(
        (s: any) => s.userId === sess.userId && s.itemId === id && s.type === 'tugas'
      )
      if (exist) setSudahSubmit(true)
    }
  }, [id])

  function choose(idx: number, val: number) {
    const updated = [...answers]
    updated[idx] = val
    setAnswers(updated)
  }

  function submit() {
    const sess = db.getSession()
    if (!sess) return alert('Login terlebih dahulu')

    if (sudahSubmit) return alert('Anda sudah mengerjakan tugas ini.')

    // --- validasi semua soal sudah diisi ---
    if (answers.includes(-1)) {
      return alert('Masih ada soal yang belum dijawab.')
    }

    const res = gradeMCQ(tugas.questions, answers)

    const sub: Submission = {
      id: 'sub_' + Date.now(),
      userId: sess.userId,
      itemId: tugas.id,
      type: 'tugas',
      answers: [...answers],
      score: res.score,
      submittedAt: Date.now()
    }

    db.saveSubmission(sub)
    alert('Dikirim. Skor: ' + res.score)
    router.push('/tugas')
  }

  if (!tugas) return <div>Loading...</div>

  return (
    <div>
      <h2 className='text-xl font-bold mb-4'>Kerjakan: {tugas.title}</h2>

      <div className='card-school p-4 rounded bg-white shadow-md border'>
        
        {sudahSubmit && (
          <div className="p-3 mb-4 bg-green-100 border border-green-300 rounded text-green-800 font-semibold">
            Anda sudah mengerjakan tugas ini ✔
          </div>
        )}

        {tugas.questions.map((q: any, idx: number) => (
          <div key={q.id} className='mt-3'>
            <div className='font-semibold'>{idx + 1}. {q.text}</div>
            <div className='mt-1 space-y-1'>
              {q.options.map((opt: string, i: number) => (
                <label key={i} className='flex items-center'>
                  <input
                    type='radio'
                    disabled={sudahSubmit}
                    name={'q' + idx}
                    checked={answers[idx] === i}
                    onChange={() => choose(idx, i)}
                  />
                  <span className='ml-2'>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <div className='mt-4'>
          <button
            onClick={submit}
            disabled={sudahSubmit}
            className='px-3 py-1 bg-green-600 text-white rounded disabled:bg-gray-400'
          >
            {sudahSubmit ? 'Sudah Dikerjakan' : 'Submit Tugas'}
          </button>
        </div>
      </div>
    </div>
  )
}
