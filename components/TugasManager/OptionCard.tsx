'use client'
import React from 'react'
import { ImageItem } from './TugasManagerContext'

export default function OptionCard({
  option,
  onDropImage,
  onRemoveImage
}: {
  option: any
  onDropImage: (img: ImageItem) => void
  onRemoveImage: () => void
}) {

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const data = e.dataTransfer.getData('application/json')
    if (!data) return
    const img: ImageItem = JSON.parse(data)
    onDropImage(img)
  }

  return (
    <div
      className="p-2 border rounded bg-white mb-2"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="flex items-center">
        <span>
          <b>{option.label}.</b> {option.text}
        </span>

        {/* Thumbnail + tombol silang */}
        {option.assignedImage && (
          <div className="relative ml-3">
            <img
              src={option.assignedImage.src}
              className="h-60 object-cover rounded border"
            />
            <button
              onClick={(e) => {
                e.stopPropagation()
                onRemoveImage()
              }}
              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow"
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
