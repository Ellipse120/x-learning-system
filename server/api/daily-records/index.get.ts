import { dailyRecords } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  const db = useDb()

  const list = await db
    .select()
    .from(dailyRecords)
    .limit(100)

  return {
    success: true,
    list
  }
})
