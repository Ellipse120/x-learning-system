// server/utils/seedAdmin.ts
import { users } from '~~/server/database/schema'
import { eq } from 'drizzle-orm'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
const ADMIN_NAME = process.env.ADMIN_NAME

export async function ensureAdminUser() {
  const db = useDb()
  // 1. 先查是否已存在
  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, ADMIN_EMAIL!.toLowerCase()))
    .limit(1)

  if (existing.length > 0) {
    console.log('✅ 管理员已存在')
    return
  }

  // 2. 不存在则创建
  const passwordHash = await hashPassword(ADMIN_PASSWORD!)

  await db.insert(users).values({
    email: ADMIN_EMAIL!.toLowerCase(),
    passwordHash,
    username: ADMIN_NAME,
    role: 'admin'
  })

  console.log(`✅ 管理员已创建: ${ADMIN_EMAIL}`)
  console.log(`㊙️ 密码: ${ADMIN_PASSWORD}   (请立即修改！)`)
}
