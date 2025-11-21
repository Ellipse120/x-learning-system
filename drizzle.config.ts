// drizzle.config.ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './server/database/schema/**/*.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!
  },
  verbose: true,
  strict: true,

  migrations: {
    schema: 'public', // PostgreSQL schema 名，默认 public
    table: '__drizzle_migrations' // 迁移记录表名
  }

  // 如果用原生 ENUM 类型（PostgreSQL 原生 enum）
  // extensions: {
  // pg_enum: true,
  // },
})
