import { eq } from 'drizzle-orm'
import { users } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  const { email, password, username } = await readValidatedBody(event, userRegisterSchemaZ.parse)
  const db = useDb()

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1)

  if (existingUser.length) {
    throw createError({ status: 409, message: '邮箱已被注册' })
  }

  const passwordHash = await hashPassword(password)

  const [newUser] = await db.insert(users).values({
    email: email.toLowerCase(),
    passwordHash,
    username: username?.trim() || null,
    role: 'student' as const
  }).returning()

  return {
    success: true,
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.username,
      role: newUser.role
    }
  }
})
