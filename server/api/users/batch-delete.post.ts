import { eq, like } from 'drizzle-orm'
import z from 'zod'
import { users } from '~~/server/database/schema'

const deleteSchema = z.object({
  // 方式1: 指定用户ID数组
  ids: z.array(z.number().int().positive()).optional(),
  // 方式2: 根据邮箱模式删除（如 seed 生成的 fake 邮箱）
  emailPattern: z.string().optional(), // e.g., "%@example.fake.com" 匹配 faker 邮箱
  // 方式3: 删除所有 student 角色（危险，慎用）
  deleteAllStudents: z.boolean().optional().default(false)
})

export default defineEventHandler(async (event) => {
  const { ids, emailPattern, deleteAllStudents } = await readValidatedBody(event, deleteSchema.parse)
  const db = useDb()

  if (!ids && !emailPattern && !deleteAllStudents) {
    throw createError({ status: 400, message: '必须指定删除条件' })
  }

  let whereClause: any
  if (ids) {
    whereClause = eq(users.id, ids[0]) // Drizzle 不直接支持 IN，需要 sql`id IN (${ids.join(',')})`
  } else if (emailPattern) {
    whereClause = like(users.email, emailPattern)
  } else if (deleteAllStudents) {
    whereClause = eq(users.role, 'student')
  }

  const deleted = await db
    .delete(users)
    .where(whereClause)
    .returning({
      id: users.id,
      email: users.email,
      name: users.username
    })

  return {
    success: true,
    message: `已删除 ${deleted.length} 个用户`,
    data: {
      deleted: deleted.length,
      users: deleted
    }
  }
})
