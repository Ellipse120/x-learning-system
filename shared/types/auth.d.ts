declare module '#auth-utils' {
  interface User {
    id?: number
    username: string
    email: string
    role: 'student' | 'teacher' | 'admin'
  }

  interface UserSession {
    id: number
    username: string
    email: string
  }

  interface SecureSessionData {
  }
}

export {}
