import { relations } from 'drizzle-orm'
import { materials, users, dailyRecords } from '../schema'

// export const materialsRelations = relations(materials, ({ one, many }) => ({
//   creator: one(users, {
//     fields: [materials.createdBy],
//     references: [users.id]
//   }),
//   dailyRecords: many(dailyRecords)
// }))
