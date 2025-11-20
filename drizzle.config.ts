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

  // 如果你的 schema 拆成多个文件，可以这样写（替代上面 schema 单文件）
  // schema: './server/database/schema/**/*.ts',

  // 迁移命名规则（默认就是时间戳，可自定义）
  migrations: {
    schema: 'public', // PostgreSQL schema 名，默认 public
    table: '__drizzle_migrations' // 迁移记录表名
  }

  // 如果你想用原生 ENUM 类型（PostgreSQL 原生 enum）
  // extensions: {
  // pg_enum: true,
  // },
})
