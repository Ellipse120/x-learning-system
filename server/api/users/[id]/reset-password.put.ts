import { eq } from 'drizzle-orm'
import { users } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const db = useDb()

  const [updated] = await db
    .update(users)
    .set({
      passwordHash: await hashPassword(useRuntimeConfig().defaultPassword)
    })
    .where(eq(users.id, id))
    .returning({
      id: users.id
    })

  return {
    success: true,
    message: '用户密码已重置',
    data: updated
  }
})
