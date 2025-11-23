import { eq, or, and } from 'drizzle-orm'
import { materials } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = await readValidatedBody(event, materialSchemaZ.parse)
  const { user } = await getUserSession(event)
  const db = useDb()

  const whereClause = user?.role === 'admin'
    ? eq(materials.id, id)
    : and(
        eq(materials.id, id),
        or(
          eq(materials.isPublic, true),
          eq(materials.createdBy, user.id)
        )
      )

  const updatedMaterial = await db
    .update(materials)
    .set({
      ...body,
      updatedAt: new Date()
    })
    .where(whereClause)
    .returning()
    .then(r => r[0])

  if (!updatedMaterial) {
    throw createError({ statusCode: 403, message: '学习资料不存在或无权修改' })
  }

  return {
    success: true,
    message: '学习资料已更新',
    data: updatedMaterial
  }
})
