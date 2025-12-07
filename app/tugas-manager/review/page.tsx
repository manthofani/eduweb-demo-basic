'use client'
import React from 'react'
import { useTugasManager, ImageItem } from '../../../components/TugasManager/TugasManagerContext'
import StepProgressBar from '../../../components/TugasManager/StepProgressBar'
import OptionCard from '../../../components/TugasManager/OptionCard'
import ImageCard from '../../../components/TugasManager/ImageCard'
import { useRouter } from 'next/navigation'

const categories = ['Misc','Geometri','Manusia','Teks','Diagram','Lainnya']

export default function ReviewPage(){
  const { questions, setQuestions, images } = useTugasManager()
  const router = useRouter()

  // Assign image ke opsi tertentu
  function handleAssign(qid:string, optionId:string, img:ImageItem){
    setQuestions(questions.map(q=>{
      if(q.id !== qid) return q
      return {
        ...q,
        options: q.options.map(o=>o.id === optionId ? {...o, assignedImage:img} : o)
      }
    }))
  }

  function handlePublish(){
    alert('Data tersimpan di frontend (dummy JSON)')
    console.log({questions, images})
  }

  return (
    <div className="flex flex-col gap-4">
      <StepProgressBar currentStep={2}/>
      <div className="flex gap-4">
        {/* KIRI: Soal & Opsi */}
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-4">Review Soal</h2>
          {questions.map((q,idx)=>(
            <div key={q.id} className="mb-4 p-2 border rounded bg-gray-50">
              <div className="font-semibold">{idx+1}. {q.text}</div>
              <div className="mt-2">
                {q.options.map(o=>(
                  <OptionCard
                    key={o.id}
                    option={o}
                    onDropImage={(img)=>handleAssign(q.id,o.id,img)}
                    onRemoveImage={()=>{
                        setQuestions(questions.map(q2=>{
                        if(q2.id !== q.id) return q2
                        return {
                            ...q2,
                            options: q2.options.map(o2 =>
                            o2.id === o.id ? { ...o2, assignedImage: null } : o2
                            )
                        }
                        }))
                    }}
                    />
                ))}
              </div>
            </div>
          ))}
          <div className="mt-2">
            <button onClick={()=>router.push('/tugas-manager/images')} className="px-3 py-1 bg-gray-400 text-white rounded mr-2">Kembali</button>
            <button onClick={handlePublish} className="px-3 py-1 bg-green-600 text-white rounded">Publish</button>
          </div>
        </div>

        {/* KANAN: Image Manager (drag source) */}
        <div className="w-80">
          <h3 className="font-semibold mb-2">Image Manager</h3>
          {categories.map(cat=>{
            const catImages = images.filter(i=>i.category===cat)
            return (
              <div key={cat} className="mb-2 p-2 border rounded bg-gray-50">
                <div className="font-semibold mb-1">{cat}</div>
                {catImages.map(img=>(
                  <div
                    key={img.id}
                    draggable
                    onDragStart={e=>e.dataTransfer.setData('application/json', JSON.stringify(img))}
                  >
                    <ImageCard image={img}/>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
