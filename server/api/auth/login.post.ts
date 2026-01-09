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

  if (await verifyPassword(user.passwordHash, body.password!)) {
    const { passwordHash, ...rest } = user

    await setUserSession(event,
      {
        user: rest,
        loggedInAt: new Date()
      },
      {
        maxAge: 60 * 60 * 1000
      }
    )

    const path = user?.role === 'admin' ? '/' : user?.role === 'teacher' ? '/teacher' : '/student'

    return {
      success: true,
      data: {
        path
      }
    }
  } else {
    throw createError({
      statusCode: 403,
      message: '验证失败，用户名或密码不匹配'
    })
  }
})
