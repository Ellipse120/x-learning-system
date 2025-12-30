import { eq } from 'drizzle-orm'
import { materials, users } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const { user } = await getUserSession(event)
  const db = useDb()

  const material = await db
    .select()
    .from(materials)
    .leftJoin(users, eq(materials.createdBy, Number(user?.id)))
    .where(eq(materials.id, id))
    .then(r => r[0])

  if (!material) {
    throw createError({ statusCode: 404, message: '学习资料不存在' })
  }

  if (user?.role === 'student' && !material.materials.isPublic) {
    throw createError({ statusCode: 403, message: '无权访问此学习资料' })
  }

  return {
    success: true,
    data: material.materials
  }
})
