// server/database/schema/profiles.ts
import { pgTable, integer, text, timestamp, foreignKey } from 'drizzle-orm/pg-core';
import { users } from './users';

export const profiles = pgTable('profiles', {
  userId: integer('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  fullName: text('full_name'),              // 真实姓名
  email: text('email'),
  phone: text('phone'),
  grade: text('grade'),                     // 学生年级，如 "高一3班"
  teacherId: integer('teacher_id').references(() => users.id), // 学生所属老师（可为空）
  bio: text('bio'),                         // 个性签名
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
