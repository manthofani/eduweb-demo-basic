'use client'
import React from 'react'

interface ImageCardProps {
  image: { id: string; src: string; category: string }
}

export default function ImageCard({ image }: ImageCardProps) {
  return (
    <div className="border rounded p-1 bg-white shadow-sm">
      <img
        src={image.src}
        alt={image.id}
        className="w-full object-cover rounded"
      />
    </div>
  )
}
