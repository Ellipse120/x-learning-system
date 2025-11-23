import { eq } from 'drizzle-orm'
import z from 'zod'
import { users } from '~~/server/database/schema'

const updateSchema = z.object({
  username: z.string().min(1).max(100).optional(),
  role: z.enum(['student', 'teacher', 'admin']).optional(),
  password: z.string().min(8).optional()
})

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = await readValidatedBody(event, updateSchema.parse)
  const db = useDb()

  const updates = {}
  if (body.username) {
    updates['username'] = body.username.trim()
  }
  if (body.role) {
    updates['role'] = body.role
  }
  if (body.hashPassword) {
    updates['passwordHash'] = await hashPassword(body.password)
  }

  const [updatedUser] = await db
    .update(users)
    .set(updates)
    .where(eq(users.id, id))
    .returning({
      id: users.id,
      email: users.email,
      username: users.username,
      role: users.role,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt
    })

  if (!updatedUser) {
    throw createError({ statusCode: 404, message: '用户不存在' })
  }

  return {
    success: true,
    data: updatedUser,
    message: '用户更新成功'
  }
})
