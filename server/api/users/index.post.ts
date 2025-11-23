import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { users } from '~~/server/database/schema'

const createSchema = z.object({
  email: z.email(),
  username: z.string().min(1).max(100),
  role: z.enum(['student', 'teacher', 'admin'])
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, createSchema.parse)
  const db = useDb()
  const defaultPassword = useRuntimeConfig().defaultPassword

  const existingUser = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, body.email.toLocaleLowerCase()))
    .then(r => r[0])

  if (existingUser) {
    throw createError({ statusCode: 400, message: '邮箱已存在' })
  }

  const passwordHash = await hashPassword(defaultPassword)

  const [newUser] = await db.insert(users)
    .values({
      email: body.email.toLocaleLowerCase().trim(),
      username: body.username.trim(),
      passwordHash,
      role: body.role
    })
    .returning({
      id: users.id,
      email: users.email,
      username: users.username,
      role: users.role,
      createdAt: users.createdAt
    })

  return {
    success: true,
    data: newUser,
    message: `用户创建成功，默认密码为：${defaultPassword}，请尽快修改密码`
  }
})
