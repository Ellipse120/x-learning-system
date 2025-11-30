import { pgTable, serial, text, timestamp, foreignKey, integer, date, boolean, varchar, bigint, pgEnum } from 'drizzle-orm/pg-core'

export const materialType = pgEnum('material_type', ['word', 'phrase', 'sentence', 'article', 'other'])
export const role = pgEnum('role', ['student', 'teacher', 'admin'])

export const users = pgTable('users', {
  id: serial().primaryKey().notNull(),
  username: text(),
  email: text().notNull(),
  passwordHash: text('password_hash').notNull(),
  role: role().default('student').notNull(),
  avatar: text(),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull()
})

export const dailyRecords = pgTable('daily_records', {
  id: serial().primaryKey().notNull(),
  userId: integer('user_id').notNull(),
  date: date().notNull(),
  learnedCount: integer('learned_count').default(0),
  reviewCount: integer('review_count').default(0),
  streak: integer().default(0),
  isChecked: boolean('is_checked').default(true),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull()
}, table => [
  foreignKey({
    columns: [table.userId],
    foreignColumns: [users.id],
    name: 'daily_records_user_id_users_id_fk'
  }).onDelete('cascade')
])

export const profiles = pgTable('profiles', {
  userId: integer('user_id').primaryKey().notNull(),
  fullName: text('full_name'),
  email: text(),
  phone: text(),
  grade: text(),
  teacherId: integer('teacher_id'),
  bio: text(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull()
}, table => [
  foreignKey({
    columns: [table.userId],
    foreignColumns: [users.id],
    name: 'profiles_user_id_users_id_fk'
  }).onDelete('cascade'),
  foreignKey({
    columns: [table.teacherId],
    foreignColumns: [users.id],
    name: 'profiles_teacher_id_users_id_fk'
  })
])

export const materials = pgTable('materials', {
  id: serial().primaryKey().notNull(),
  title: text().notNull(),
  type: materialType().default('word').notNull(),
  category: varchar({ length: 100 }).default('uncategorized'),
  word: text(),
  phoneticUk: text('phonetic_uk'),
  phoneticUs: text('phonetic_us'),
  translation: text(),
  example: text(),
  content: text(),
  audioUrl: text('audio_url'),
  imageUrl: text('image_url'),
  createdBy: integer('created_by').notNull(),
  isPublic: boolean('is_public').default(true),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull()
}, table => [
  foreignKey({
    columns: [table.createdBy],
    foreignColumns: [users.id],
    name: 'materials_created_by_users_id_fk'
  }).onDelete('cascade')
])

export const userProgress = pgTable('user_progress', {
  userId: integer('user_id').notNull(),
  materialId: integer('material_id').notNull(),
  learned: boolean().default(false),
  familiarity: integer().default(0),
  lastReviewedAt: timestamp('last_reviewed_at', { mode: 'string' }),
  nextReviewAt: timestamp('next_review_at', { mode: 'string' }),
  reviewCount: integer('review_count').default(0),
  notes: text(),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull()
}, table => [
  foreignKey({
    columns: [table.userId],
    foreignColumns: [users.id],
    name: 'user_progress_user_id_users_id_fk'
  }).onDelete('cascade'),
  foreignKey({
    columns: [table.materialId],
    foreignColumns: [materials.id],
    name: 'user_progress_material_id_materials_id_fk'
  }).onDelete('cascade')
])

export const drizzleMigrations = pgTable('__drizzle_migrations', {
  id: serial().primaryKey().notNull(),
  hash: text().notNull(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  createdAt: bigint('created_at', { mode: 'number' })
})
