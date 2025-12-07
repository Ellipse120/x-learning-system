import { dailyRecords } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  const { studentId, materialId, date, status } = getQuery(event) // 查询参数：支持过滤
  // const { user } = await requireUserSession(event)
  const db = useDb()

  const records = await db
    .select()
    .from(dailyRecords)
    .limit(100)

  console.log(records)
  return {
    success: true,
    list: records
  }
})
