import { eq } from 'drizzle-orm'
import { users } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, userLoginSchemaZ.parse)
  const db = useDb()

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, body.email))
    .then(r => r[0])

  await verifyPassword(user.passwordHash, body.password!)

  await setUserSession(event, {
    user,
    loggedInAt: new Date()
  })
  const path = user?.role === 'admin' ? '/' : user?.role === 'teacher' ? '/teacher' : '/student'

  return {
    success: true,
    message: '登录成功',
    data: {
      username: user.username,
      email: user.email,
      role: user.role,
      path
    }
  }
})
