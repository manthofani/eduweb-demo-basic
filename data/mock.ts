import { User, Mapel, Tugas, Ujian } from '../lib/types'

export const users: User[] = [
  { id: 'u_admin', username: 'admin', password: 'admin123', name: 'Administrator', role: 'admin' },
  { id: 'u_siswa_1', username: 'siswa1', password: 'siswa1', name: 'Siswa Satu', role: 'student' },
  { id: 'u_siswa_2', username: 'siswa2', password: 'siswa2', name: 'Siswa Dua', role: 'student' }
]

export const mapels: Mapel[] = [
  { id: 'm1', name: 'Matematika' },
  { id: 'm2', name: 'Bahasa Indonesia' }
]

export const tugas: Tugas[] = [
  {
    id: 't1', mapelId: 'm1', title: 'Tugas Pertambahan',
    createdAt: Date.now(), questions: [
      { id: 'q1', text: '1+1 = ?', options: ['1','2','3','4'], answerIndex: 1, score: 10 },
      { id: 'q2', text: '2*3 = ?', options: ['4','5','6','7'], answerIndex: 2, score: 10 }
    ]
  },
  {
    id: 't2', mapelId: 'm1', title: 'Tugas Perkalian',
    createdAt: Date.now(), questions: [
      { id: 'q1', text: '1+1 = ?', options: ['1','2','3','4'], answerIndex: 1, score: 10 },
      { id: 'q2', text: '2*3 = ?', options: ['4','5','6','7'], answerIndex: 2, score: 10 }
    ]
  },
  {
    id: 't3', mapelId: 'm1', title: 'Tugas Pengurangan',
    createdAt: Date.now(), questions: [
      { id: 'q1', text: '1+1 = ?', options: ['1','2','3','4'], answerIndex: 1, score: 10 },
      { id: 'q2', text: '2*3 = ?', options: ['4','5','6','7'], answerIndex: 2, score: 10 }
    ]
  },
  {
  id: 't4', mapelId: 'm2', title: 'Tugas Bahasa Indonesia',
  createdAt: Date.now(),  questions: [
    { 
      id: 'q1', text: 'Manakah kata yang merupakan kata benda?', options: ['lari', 'meja', 'cantik', 'berlari'], answerIndex: 1, score: 10 },
    { id: 'q2', text: 'Manakah kalimat yang benar secara tata bahasa?', options: [
        'Besok dia sekolah pergi',
        'Dia pergi ke sekolah pada pagi hari.',
        'Sekolah pergi dia besok.',
        'Dia besok pergi sekolah ke.'
      ], 
      answerIndex: 1, 
      score: 10 
    }
    ]
  }
]

export const ujians: Ujian[] = [
  {
    id: 'u1', mapelId: 'm1', title: 'Ujian Tengah Semester',
    startAt: Date.now(), questions: [
      { id: 'qu1', text: '5-2 = ?', options: ['2','3','4','1'], answerIndex: 1, score: 20 }
    ]
  }
]

// mock modules (modul ajar)
export const modules = [
  {
    id: 'mod1',
    mapelId: 'm2',
    title: 'Bahasa Indonesia - Teks Deskripsi',
    content: `<h3>Materi: Teks Deskripsi</h3><p>Teks deskripsi adalah teks yang menggambarkan suatu benda, tempat, hewan, atau orang dengan jelas, seolah-olah pembaca bisa melihat, mendengar, atau membayangkannya secara langsung.
    Tujuan teks deskripsi adalah memberikan gambaran yang detail agar pembaca merasa seperti berada di tempat tersebut atau melihat objek yang sedang dijelaskan.</p><ol><li>Pendahuluan</li><li>Contoh Teks</li></ol>`
  },
  {
    id: 'mod2',
    mapelId: 'm2',
    title: 'Bahasa Indonesia - Pidato',
    content: `<h3>Materi: Pidato</h3><p>Cara membuat pidato singkat ...</p>`
  }
]

// mock students data
export const students = [
  { id: 'u_siswa_1', name: 'Siswa Satu', username: 'siswa1', password: 'siswa1' },
  { id: 'u_siswa_2', name: 'Siswa Dua', username: 'siswa2', password: 'siswa2' }
]
