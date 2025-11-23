import { z } from 'zod'
import { fakerZH_CN as faker } from '@faker-js/faker'
import { inArray } from 'drizzle-orm'
import { users } from '~~/server/database/schema'

const seedSchema = z.object({
  count: z.number().int().min(1).max(100).default(10), // 最大 100 防滥用
  role: z.enum(['student', 'teacher']).optional().default('student') // 可指定角色
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, seedSchema.parse)
  const db = useDb()
  const { count = 10, role = 'student' } = body

  const fakeUsers = Array.from({ length: count }).map(() => {
    const username = faker.person.fullName()
    const email = faker.internet.email({ provider: 'example.fake.com' }).toLowerCase()
    return {
      username,
      email,
      role,
      password: faker.internet.password({ length: 12, memorable: true })
    }
  })

  const emails = fakeUsers.map(u => u.email)
  const existingEmails = await db
    .select({ email: users.email })
    .from(users)
    .where(inArray(users.email, emails))
    .then(res => res.map(r => r.email))

  const newFakeUsers = fakeUsers.filter(u => !existingEmails.includes(u.email))

  if (newFakeUsers.length === 0) {
    return {
      success: true,
      summary: {
        totalRequested: count,
        created: 0,
        skipped: count,
        message: '所有生成的邮箱已存在'
      }
    }
  }

  const hashedPasswords = await Promise.all(
    newFakeUsers.map(u => hashPassword(u.password))
  )

  const toInsert = newFakeUsers.map((u, index) => ({
    email: u.email,
    username: u.username,
    passwordHash: hashedPasswords[index],
    role
  }))

  const createdUsers = await db
    .insert(users)
    .values(toInsert)
    .returning({
      id: users.id,
      email: users.email,
      username: users.username,
      role: users.role
    })
    .then(results => results.map((res, index) => ({ ...res, password: newFakeUsers[index].password })))

  console.log(`✅ 生成完成: ${createdUsers.length} 个新用户`)

  return {
    success: true,
    summary: {
      totalRequested: count,
      existing: count - newFakeUsers.length,
      created: createdUsers.length
    },
    users: createdUsers // 测试用，生产可移除密码
  }
})
