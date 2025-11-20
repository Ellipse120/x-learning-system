import { pgTable, integer, date, timestamp, boolean, serial, uniqueIndex } from 'drizzle-orm/pg-core';
import { users } from './users';

export const dailyRecords = pgTable('daily_records', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  date: date('date').notNull(),                    // 打卡日期（yyyy-mm-dd）
  learnedCount: integer('learned_count').default(0),   // 当天学习单词/句子数
  reviewCount: integer('review_count').default(0),     // 当天复习数
  streak: integer('streak').default(0),                // 当前连续打卡天数
  isChecked: boolean('is_checked').default(true),     // 是否已打卡

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  uniqueUserDate: uniqueIndex('daily_records_user_date_idx').on(table.userId, table.date),
}));
