import { dailyRecords } from '~~/server/database/schema'
import { dailyRecordsZ } from '~~/shared/zschema'

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, dailyRecordsZ.parse)
  const { user } = await getUserSession(event)
  const db = useDb()

  const [newRecord] = await db
    .insert(dailyRecords)
    .values({
      ...body,
      createdBy: Number(user.id)
    })
    .returning()

  return {
    success: true,
    data: newRecord
  }
})
