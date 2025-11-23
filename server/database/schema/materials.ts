// server/database/schema/materials.ts
import { pgTable, serial, text, timestamp, integer, boolean, jsonb, pgEnum, varchar } from 'drizzle-orm/pg-core'
import { users } from './users'

export const materialTypeEnum = pgEnum('material_type', [
  'word', // 单词
  'phrase', // 短语
  'sentence', // 句子
  'article', // 文章/段落
  'other'
])

export const materials = pgTable('materials', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(), // 资料标题，如 "Unit 1 Words"
  type: materialTypeEnum('type').notNull().default('word'),
  category: varchar('category', { length: 100 }).default('uncategorized'), // 资料分类，如 "英语", "数学" 等

  // 单词/短语专属字段
  word: text('word'), // 单词本身
  phoneticUk: text('phonetic_uk'), // 英式音标
  phoneticUs: text('phonetic_us'), // 美式音标
  translation: text('translation'), // 中文翻译
  example: text('example'), // 示例句子

  // 通用内容（文章、长句等）
  content: text('content'), // 完整文本内容
  audioUrl: text('audio_url'), // 发音音频（可选）
  imageUrl: text('image_url'), // 配图（可选）

  createdBy: integer('created_by').notNull().references(() => users.id, { onDelete: 'cascade' }),
  isPublic: boolean('is_public').default(true), // 是否全班共享

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export type Material = typeof materials.$inferSelect
export type NewMaterial = typeof materials.$inferInsert
