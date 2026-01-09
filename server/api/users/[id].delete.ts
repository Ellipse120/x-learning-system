import { eq } from 'drizzle-orm'
import { users } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const db = useDb()
  const { user } = await requireUserSession(event)

  if (!['admin'].includes(user.role)) {
    throw createError({ statusCode: 403, message: '无权删除用户' })
  }

  if (id === user.id) {
    throw createError({ statusCode: 403, message: '无法删除自己' })
  }

  const deletedUser = await db
    .delete(users)
    .where(eq(users.id, id))
    .returning({
      id: users.id,
      email: users.email,
      username: users.username
    })

  return {
    success: true,
    message: '用户已删除',
    data: deletedUser
  }
})
