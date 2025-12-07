'use client'
import React from 'react'
import { TugasManagerProvider } from '../../components/TugasManager/TugasManagerContext'

export default function TugasManagerLayout({ children }: { children: React.ReactNode }) {
  return (
    <TugasManagerProvider>
      {children}
    </TugasManagerProvider>
  )
}
