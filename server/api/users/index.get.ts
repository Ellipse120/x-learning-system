import { or, sql, like, desc } from 'drizzle-orm'
import { users } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  // await requireUserSession(event)

  const query = getQuery(event)
  const db = useDb()
  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 20
  const offset = (page - 1) * limit
  const search = query.search?.toString().trim()

  const whereClause = search
    ? or(
        like(users.email, `%${search}%`),
        like(users.username, `%${search}%`)
      )
    : undefined

  const [list, total] = await Promise.all([
    db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt
      })
      .from(users)
      .where(whereClause)
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({
        count: sql<number>`count(*)`
      })
      .from(users)
      .where(whereClause)
      .then(r => r[0]?.count || 0)
  ])

  return {
    success: true,
    list,
    page,
    limit,
    total: Number(total),
    totalPages: Math.ceil(total / limit)

  }
})
