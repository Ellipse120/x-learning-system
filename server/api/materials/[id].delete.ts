import { eq, and } from 'drizzle-orm'
import { materials } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const { user } = await getUserSession(event)
  const db = useDb()

  const whereClause = user.role === 'admin'
    ? eq(materials.id, id)
    : and(eq(materials.id, id), eq(materials.createdBy, user.id))

  const deletedMaterial = await db
    .delete(materials)
    .where(whereClause)
    .returning()
    .then(r => r[0])

  if (!deletedMaterial) {
    throw createError({ statusCode: 403, message: '学习资料不存在或无权删除' })
  }

  return {
    success: true,
    message: '学习资料已删除',
    data: deletedMaterial
  }
})
