export type Role = 'admin' | 'student'
export type User = { id: string; username: string; password: string; name: string; role: Role }

export type Mapel = { id: string; name: string }

export type MCQ = {
  id: string
  text: string
  options: string[]
  answerIndex: number
  score: number
}

export type Tugas = {
  id: string
  mapelId: string
  title: string
  createdAt: number
  questions: MCQ[]
}

export type Ujian = {
  id: string
  mapelId: string
  title: string
  startAt: number
  questions: MCQ[]
}

export type Submission = {
  id: string
  userId: string
  itemId: string // tugas or ujian id
  type: string
  answers: number[] // chosen option indices per question
  score: number
  submittedAt: number
}

export type AbsenRecord = {
  userId: string
  date: string // ISO YYYY-MM-DD
  status: 'Hadir'|'Izin'|'Sakit'|'Alpha'
}
