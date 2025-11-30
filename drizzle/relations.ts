import { relations } from 'drizzle-orm/relations'
import { users, dailyRecords, profiles, materials, userProgress } from './schema'

export const dailyRecordsRelations = relations(dailyRecords, ({ one }) => ({
  user: one(users, {
    fields: [dailyRecords.userId],
    references: [users.id]
  })
}))

export const usersRelations = relations(users, ({ many }) => ({
  dailyRecords: many(dailyRecords),
  profiles_userId: many(profiles, {
    relationName: 'profiles_userId_users_id'
  }),
  profiles_teacherId: many(profiles, {
    relationName: 'profiles_teacherId_users_id'
  }),
  materials: many(materials),
  userProgresses: many(userProgress)
}))

export const profilesRelations = relations(profiles, ({ one }) => ({
  user_userId: one(users, {
    fields: [profiles.userId],
    references: [users.id],
    relationName: 'profiles_userId_users_id'
  }),
  user_teacherId: one(users, {
    fields: [profiles.teacherId],
    references: [users.id],
    relationName: 'profiles_teacherId_users_id'
  })
}))

export const materialsRelations = relations(materials, ({ one, many }) => ({
  user: one(users, {
    fields: [materials.createdBy],
    references: [users.id]
  }),
  userProgresses: many(userProgress)
}))

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id]
  }),
  material: one(materials, {
    fields: [userProgress.materialId],
    references: [materials.id]
  })
}))
