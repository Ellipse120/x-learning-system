// server/database/schema/userProgress.ts
import { pgTable, integer, timestamp, boolean, jsonb, primaryKey, text } from 'drizzle-orm/pg-core'
import { users } from './users'
import { materials } from './materials'

export const userProgress = pgTable('user_progress', {
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  materialId: integer('material_id').notNull().references(() => materials.id, { onDelete: 'cascade' }),

  learned: boolean('learned').default(false), // 是否已掌握
  familiarity: integer('familiarity').default(0), // 熟悉度 0-5（艾宾浩斯）
  lastReviewedAt: timestamp('last_reviewed_at'), // 上次复习时间
  nextReviewAt: timestamp('next_review_at'), // 下次建议复习时间
  reviewCount: integer('review_count').default(0), // 已复习次数

  notes: text('notes'), // 学生个人笔记

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, table => [
  ({
    pk: primaryKey({ columns: [table.userId, table.materialId] })
  })
])
