declare module '#auth-utils' {
  interface User {
    id?: number
    username: string
    email: string
    role: 'student' | 'teacher' | 'admin'
  }

  interface UserSession {
  }

  interface SecureSessionData {
  }
}

export {}
