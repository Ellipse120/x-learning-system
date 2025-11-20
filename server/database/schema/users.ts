// server/database/schema/users.ts
import { pgTable, serial, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { roleEnum } from './roles';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull(),               // 登录名（学号/工号）
  passwordHash: text('password_hash').notNull(),       // bcrypt 哈希
  role: roleEnum('role').notNull().default('student'),
  avatar: text('avatar'),                              // 可选头像 URL
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  usernameIdx: uniqueIndex('users_username_idx').on(table.username),
}));
