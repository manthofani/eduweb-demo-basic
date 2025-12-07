'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface ImageItem {
  id: string
  src: string
  category: string
}

export interface OptionItem {
  id: string
  label: string
  assignedImage?: ImageItem
}

export interface QuestionItem {
  id: string
  text: string
  options: OptionItem[]
}

interface TugasManagerState {
  uploadedFile?: File
  images: ImageItem[]
  questions: QuestionItem[]
  setUploadedFile: (file: File) => void
  setImages: (imgs: ImageItem[]) => void
  setQuestions: (qs: QuestionItem[]) => void
}

const TugasManagerContext = createContext<TugasManagerState | undefined>(undefined)

export function TugasManagerProvider({ children }: { children: ReactNode }) {
  const [uploadedFile, setUploadedFile] = useState<File | undefined>()
  const [images, setImages] = useState<ImageItem[]>([
    { id: 'img1', src: '/dummy/img1.png', category: 'Misc' },
    { id: 'img2', src: '/dummy/img2.png', category: 'Misc' },
    { id: 'img3', src: '/dummy/img3.png', category: 'Misc' }
  ])

    // Ambil image yg mau dijadikan default assignment
  const img1 = images[0]
  const img2 = images[1]
  const [questions, setQuestions] = useState<QuestionItem[]>([
    { id: 'q1', text: '1+1 = ?', options: [{id:'A',label:'1'},{id:'B',label:'2'},{id:'C',label:'3', assignedImage: img2 },{id:'D',label:'4'}] },
    { id: 'q2', text: '2*3 = ?', options: [{id:'A',label:'4'},{id:'B',label:'5'},{id:'C',label:'6', assignedImage: img2},{id:'D',label:'7'}] }
  ])

  return (
    <TugasManagerContext.Provider value={{
      uploadedFile,
      images,
      questions,
      setUploadedFile,
      setImages,
      setQuestions
    }}>
      {children}
    </TugasManagerContext.Provider>
  )
}

export function useTugasManager() {
  const ctx = useContext(TugasManagerContext)
  if (!ctx) throw new Error('useTugasManager must be used inside TugasManagerProvider')
  return ctx
}
