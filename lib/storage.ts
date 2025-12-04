// lib/storage.ts
import { users as mockUsers, mapels as mockMapels, tugas as mockTugas, ujians as mockUjians, modules as mockModules, students as mockStudents } from '../data/mock'
import type { User, Mapel, Tugas, Ujian, Submission, AbsenRecord } from './types'

const LS_PREFIX = 'eduweb_v1:'

function isClient() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function safeRead<T>(key: string, fallback: T): T {
  if (!isClient()) return fallback
  try {
    const raw = localStorage.getItem(LS_PREFIX + key)
    if (raw === null) return fallback
    // allow stored "null" (JSON null)
    return JSON.parse(raw) as T
  } catch (err) {
    console.error('safeRead error', key, err)
    return fallback
  }
}

function safeWrite<T>(key: string, data: T) {
  if (!isClient()) return
  try {
    localStorage.setItem(LS_PREFIX + key, JSON.stringify(data))
  } catch (err) {
    console.error('safeWrite error', key, err)
  }
}

export const db = {
  initIfEmpty() {
    if (!isClient()) return
    try {
      if (!localStorage.getItem(LS_PREFIX + 'initialized')) {
        safeWrite('users', mockUsers)
        safeWrite('mapels', mockMapels)
        safeWrite('tugas', mockTugas)
        safeWrite('ujians', mockUjians)
        safeWrite('modules', mockModules)
        safeWrite('students', mockStudents)
        safeWrite('submissions', [])
        safeWrite('absen', [])
        safeWrite('session', null)
        safeWrite('initialized', true)
      }
    } catch (err) {
      console.error('db.initIfEmpty error', err)
    }
  },

  // getters
  getUsers(): User[] { return safeRead('users', []) },
  getStudents(){ return safeRead('students', []) },
  getMapels(): Mapel[] { return safeRead('mapels', []) },
  getTugas(): Tugas[] { return safeRead('tugas', []) },
  getUjians(): Ujian[] { return safeRead('ujians', []) },
  getModules(){ return safeRead('modules', []) },

  getSubmissions(): Submission[] { return safeRead('submissions', []) },

  // submissions
  saveSubmission(sub: Submission) {
    const arr = safeRead<Submission[]>('submissions', [])
    const exists = arr.find(s => s.id === sub.id)
    if (exists) {
      const idx = arr.findIndex(s => s.id === sub.id)
      arr[idx] = sub
    } else arr.push(sub)
    safeWrite('submissions', arr)
  },

  // absen
  getAbsenByUser(userId: string): AbsenRecord[] {
  const all = safeRead<AbsenRecord[]>('absen', [])
  return all.filter(a => a.userId === userId) },
  getAbsen(): AbsenRecord[] { return safeRead('absen', []) },
  saveAbsen(rec: AbsenRecord) {
    const arr = safeRead<AbsenRecord[]>('absen', [])
    const idx = arr.findIndex(r => r.userId === rec.userId && r.date === rec.date)
    if (idx >= 0) arr[idx] = rec
    else arr.push(rec)
    safeWrite('absen', arr)
  },

  // session helpers (explicit)
  getSession() {
    return safeRead<any>('session', null)
  },
  saveSession(obj: any) {
    safeWrite('session', obj)
  },
  clearSession() {
    safeWrite('session', null)
  },
  clearAll() {
    // Hapus semua key yang terkait aplikasi
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(LS_PREFIX)) {
        localStorage.removeItem(key)
      }
    })
    // Setelah clearAll, initIfEmpty bisa dipanggil lagi jika ingin reset default
  }
}
