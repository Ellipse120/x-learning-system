import { materials } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, materialSchemaZ.parse)

  const db = useDb()
  const { user } = await getUserSession(event)

  const newMaterial = await db
    .insert(materials)
    .values({
      ...body,
      createdBy: user?.id
    })
    .returning()
    .then(r => r[0])

  return {
    success: true,
    data: newMaterial
  }
})
