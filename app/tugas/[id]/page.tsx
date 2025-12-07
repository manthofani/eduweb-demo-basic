'use client'
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { db } from '../../../lib/storage'
import { gradeMCQ } from '../../../lib/grade'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

export default function TugasDetail() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const [tugas, setTugas] = useState<any | null>(null)
  const [answers, setAnswers] = useState<number[]>([])
  const [sudahSubmit, setSudahSubmit] = useState(false)

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  const [slideKey, setSlideKey] = useState(0) // untuk animasi

  useEffect(() => {
    db.initIfEmpty()

    const data = db.getTugas().find((t: any) => t.id === id)
    if (!data) return

    setTugas(data)

    const saved = localStorage.getItem(`answers_${id}`)
    if (saved) {
      setAnswers(JSON.parse(saved))
    } else {
      setAnswers(new Array(data.questions.length).fill(-1))
    }

    const sess = db.getSession()
    if (sess) {
      const exist = db.getSubmissions().find(
        (s: any) => s.userId === sess.userId && s.itemId === id && s.type === 'tugas'
      )
      if (exist) setSudahSubmit(true)
    }
  }, [id])

  // AUTO SAVE ketika answers berubah
  useEffect(() => {
    if (answers.length > 0) {
      localStorage.setItem(`answers_${id}`, JSON.stringify(answers))
    }
  }, [answers, id])

  if (!tugas) return <div>Loading...</div>

  const totalPages = Math.ceil(tugas.questions.length / pageSize)

  const start = (currentPage - 1) * pageSize
  const end = currentPage * pageSize
  const paginatedQuestions = tugas.questions.slice(start, end)

  const totalQuestions = tugas.questions.length
  const answeredCount = answers.filter(a => a !== -1).length

  function choose(realIndex: number, val: number) {
    const updated = [...answers]
    updated[realIndex] = val
    setAnswers(updated)
  }

  function gotoPage(p: number) {
    if (p < 1 || p > totalPages) return
    setSlideKey(slideKey + 1)
    setCurrentPage(p)
  }

  function submit() {
    const sess = db.getSession()
    if (!sess) return alert('Login dulu')

    if (answers.includes(-1)) return alert('Masih ada yang belum dijawab.')

    const res = gradeMCQ(tugas.questions, answers)

    db.saveSubmission({
      id: 'sub_' + Date.now(),
      userId: sess.userId,
      itemId: tugas.id,
      type: 'tugas',
      answers,
      score: res.score,
      submittedAt: Date.now()
    })

    localStorage.removeItem(`answers_${id}`)

    alert('Berhasil submit. Skor: ' + res.score)
    router.push('/tugas')
  }

  return (
    <div>
      <h2 className='text-xl font-bold mb-4'>{tugas.title}</h2>

      {/* PROGRESS BAR */}
      <div className='mb-4'>
        <div className='font-semibold mb-1'>
          Progress: {answeredCount}/{totalQuestions}
        </div>
        <div className='w-full h-2 bg-gray-200 rounded'>
          <div
            className='h-2 bg-green-500 rounded'
            style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* ANIMASI SLIDE */}
      <SwitchTransition>
        <CSSTransition
          key={slideKey}
          timeout={300}
          classNames="slide"
        >
          <div>
            {paginatedQuestions.map((q: any, idx: number) => {
              const realIndex = start + idx

              return (
                <div key={q.id} className='mb-4'>
                  <div className='font-semibold'>
                    {realIndex + 1}. {q.text}
                  </div>

                  {q.options.map((opt: string, i: number) => (
                    <label key={i} className='flex items-center mt-1'>
                      <input
                        type='radio'
                        disabled={sudahSubmit}
                        name={'q' + realIndex}
                        checked={answers[realIndex] === i}
                        onChange={() => choose(realIndex, i)}
                      />
                      <span className='ml-2'>{opt}</span>
                    </label>
                  ))}
                </div>
              )
            })}
          </div>
        </CSSTransition>
      </SwitchTransition>

      {/* PAGINATION NUMBER STYLE */}
      <div className='flex justify-center gap-2 mt-6'>
        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1
          return (
            <button
              key={page}
              onClick={() => gotoPage(page)}
              className={
                'w-8 h-8 flex items-center justify-center rounded border ' +
                (currentPage === page
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700')
              }
            >
              {page}
            </button>
          )
        })}
      </div>

      {/* NAVIGATION BUTTONS */}
      <div className='flex justify-between mt-6'>
        <button
          onClick={() => gotoPage(currentPage - 1)}
          disabled={currentPage === 1}
          className='px-3 py-1 bg-gray-300 rounded disabled:bg-gray-200'
        >
          Prev
        </button>

        <button
          onClick={() => gotoPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className='px-3 py-1 bg-gray-300 rounded disabled:bg-gray-200'
        >
          Next
        </button>
      </div>

      {/* SUBMIT */}
      {currentPage === totalPages && (
        <button
          onClick={submit}
          className='mt-4 px-4 py-2 bg-green-600 text-white rounded'
        >
          Submit Tugas
        </button>
      )}

      <button
        onClick={() => router.push('/tugas')}
        className='block mt-4 px-4 py-2 bg-green-700 text-white rounded'
      >
        Kembali
      </button>
    </div>
  )
}
