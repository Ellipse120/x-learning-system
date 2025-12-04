import { pgTable, integer, text, date, timestamp, boolean, serial, uniqueIndex } from 'drizzle-orm/pg-core'
import { users } from './users'
import { materials } from './materials'

// 学生学习记录表：记录每天打卡和进度，支持继续学习和老师查看
export const dailyRecords = pgTable('daily_records', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }).notNull(),
  materialId: integer('material_id').references(() => materials.id, { onDelete: 'cascade' }).notNull(),
  date: date('date').notNull(), // 打卡日期（yyyy-mm-dd）
  learnedCount: integer('learned_count').default(0), // 当天学习单词/句子数
  status: text('status').notNull().default('learning'),
  notes: text('notes'),
  reviewCount: integer('review_count').default(0), // 当天复习数
  streak: integer('streak').default(0), // 当前连续打卡天数
  isChecked: boolean('is_checked').default(true), // 是否已打卡

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()

  // uniqueIndex([userId, materialId, date], 'unique_user_material_date'),
}, table => [
  ({
    uniqueUserDate: uniqueIndex('daily_records_user_date_idx').on(table.userId, table.date)
  })
])
