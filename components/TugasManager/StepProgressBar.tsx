'use client'
import React from 'react'

interface Props {
  currentStep: number
}

const steps = ['Upload','Images','Review']

export default function StepProgressBar({ currentStep }: Props) {
  return (
    <div className="mb-4 flex gap-2">
      {steps.map((s,i)=>(
        <div key={i} className={`flex-1 py-1 text-center rounded font-semibold ${i===currentStep?'bg-green-600 text-white':'bg-gray-200'}`}>
          {s}
        </div>
      ))}
    </div>
  )
}
