import { or, eq, desc, like, and, sql } from 'drizzle-orm'
import { materials, users } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const db = useDb()
  const { user } = await requireUserSession(event)

  const filters = []

  if (query.search) {
    const s = `%${query.search}%`
    filters.push(
      or(
        like(materials.title, s),
        like(materials.word, s),
        like(materials.translation, s),
        like(materials.content, s)
      )
    )
  }

  // 类型过滤
  if (query.type && ['word', 'sentence', 'article', 'grammar', 'other'].includes(query.type as string)) {
    filters.push(eq(materials.type, query.type as never))
  }

  // 分类过滤
  if (query.category) {
    filters.push(eq(materials.category, query.category as string))
  }

  // 学生只能看公开的 + 自己老师上传的（可选严格模式）
  if (user?.role === 'student') {
    filters.push(
      or(
        eq(materials.isPublic, true),
        eq(materials.createdBy, sql`(SELECT id FROM users WHERE role = 'teacher' LIMIT 1)`)
      )
    )
  }

  const list = await db
    .select({
      id: materials.id,
      title: materials.title,
      type: materials.type,
      category: materials.category,
      word: materials.word,
      content: materials.content,
      difficulty: materials.difficulty,
      translation: materials.translation,
      isPublic: materials.isPublic,
      createdBy: materials.createdBy,
      authorName: users?.username,
      createdAt: materials.createdAt
    })
    .from(materials)
    .leftJoin(users, eq(materials.createdBy, Number(user?.id)))
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(desc(materials.createdAt))
    .limit(100)

  return {
    success: true,
    list
  }
})
