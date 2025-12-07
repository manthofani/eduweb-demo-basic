'use client'
import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { useRouter } from 'next/navigation'
import { useTugasManager } from '../../../components/TugasManager/TugasManagerContext'
import StepProgressBar from '../../../components/TugasManager/StepProgressBar'
import ImageCard from '../../../components/TugasManager/ImageCard'

const categories = ['Misc','Geometri','Manusia','Teks','Diagram','Lainnya']

export default function ImagesPage() {
  const { images, setImages } = useTugasManager()
  const router = useRouter()
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [targetCategory, setTargetCategory] = useState('Misc')

  function handleDragEnd(result: DropResult) {
    const { destination, draggableId } = result
    if (!destination) return

    const imgIndex = images.findIndex(img => img.id === draggableId)
    if (imgIndex === -1) return

    const newImages = Array.from(images)
    newImages[imgIndex] = { ...newImages[imgIndex], category: destination.droppableId }
    setImages(newImages)
  }

  // toggle select gambar
  function toggleSelect(id: string) {
    if (selectedImages.includes(id)) {
      setSelectedImages(selectedImages.filter(i => i !== id))
    } else {
      setSelectedImages([...selectedImages, id])
    }
  }

  // pindahkan semua gambar yang dipilih
  function moveSelectedImages() {
    const newImages = images.map(img =>
      selectedImages.includes(img.id) ? { ...img, category: targetCategory } : img
    )
    setImages(newImages)
    setSelectedImages([])
  }

  return (
    <div>
      <StepProgressBar currentStep={1} />
      <h2 className="text-xl font-bold mb-4">Image Manager</h2>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto">
          {categories.map(cat => {
            const catImages = images.filter(img => img.category === cat)
            return (
              <Droppable droppableId={cat} key={cat}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="min-w-[150px] p-2 border rounded bg-gray-50"
                  >
                    <h3 className="font-semibold mb-2">{cat}</h3>

                    {catImages.map((img, index) => (
                      <Draggable key={img.id} draggableId={img.id} index={index}>
                            {(provided) => (
                                <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="mb-2 relative cursor-pointer"
                                onClick={() => toggleSelect(img.id)} // klik di container gambar
                                >
                                <ImageCard image={img} />
                                <input
                                    type="checkbox"
                                    className="absolute top-1 right-1 w-4 h-4"
                                    checked={selectedImages.includes(img.id)}
                                    onChange={(e) => { 
                                    e.stopPropagation() // supaya klik checkbox tidak trigger onClick container
                                    toggleSelect(img.id) 
                                    }}
                                />
                                </div>
                            )}
                            </Draggable>

                    ))}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            )
          })}
        </div>
      </DragDropContext>

      {/* Multi-select move */}
      <div className="mt-4 p-2 border rounded bg-gray-100">
        <div className="flex gap-2 items-center mb-2">
          <label>Pindahkan gambar yang dipilih ke kategori:</label>
          <select
            value={targetCategory}
            onChange={e => setTargetCategory(e.target.value)}
            className="border p-1 rounded"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button
            onClick={moveSelectedImages}
            disabled={selectedImages.length === 0}
            className="px-2 py-1 bg-green-600 text-white rounded"
          >
            Pindahkan
          </button>
        </div>
        <div>{selectedImages.length} gambar dipilih</div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => router.push('/tugas-manager/upload')}
          className="px-3 py-1 bg-gray-400 text-white rounded"
        >
          Kembali
        </button>
        <button
          onClick={() => router.push('/tugas-manager/review')}
          className="px-3 py-1 bg-green-600 text-white rounded"
        >
          Lanjut ke Review
        </button>
      </div>
    </div>
  )
}
