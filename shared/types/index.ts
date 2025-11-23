// 模拟数据类型定义
export interface User {
  id: string
  username: string
  role: number | 'teacher' | 'student'
  email: string
}

export interface LearningMaterial {
  id: string
  type: string
  content: string
  translation: string
  phoneticSymbol?: string
  wordType?: string
  difficulty: string
  createdBy: string
  createdAt: string
}

export interface LearningPlan {
  id: string
  title: string
  description: string
  materialIds: string[]
  studentId: string
  startDate: string
  endDate: string
}

export interface StudyRecord {
  id: string
  studentId: string
  materialId: string
  studiedAt: string
  correct: boolean
  timeSpent: number
}

export interface StudentProgress {
  studentId: string
  totalStudied: number
  correctAnswers: number
  currentStreak: number
  lastStudyDate: string
  level: string
}

export interface TeacherDashboardProps {
  currentUser: User
  learningMaterials: LearningMaterial[]
  studyRecords: StudyRecord[]
  studentProgress: StudentProgress[]
  students: User[]
}

export type ResponseUser = {
  expiresAt: string
  token: string
  user: {
    id: string
    userName: string
    email: string
    passwordHash?: string
    fullName: string
    role: number | string[]
    createdAt: string
    lastLogin?: string | null
    isActive: boolean | null
    studyRecords: []
    assignedPlans: []
    createdPlans: []
    wordMasteries: []
  }
}

export interface StatisticInfo {
  totalMaterials: number
  totalStudents: number
  activeStudents: number
  averageAccuracy: number
}
