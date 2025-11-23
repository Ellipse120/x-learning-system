import { users } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  const db = useDb()

  const user = await db
    .select()
    .from(users)
    .limit(1)

  return user
})
