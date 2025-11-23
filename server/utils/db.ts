import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '~~/server/database/schema'

// 单一全局连接池
const globalForPostgres = globalThis as unknown as {
  postgresClient: postgres.Sql | undefined
}

const client
  = globalForPostgres.postgresClient
    ?? postgres(import.meta.env.DATABASE_URL!, {
      max: 20,
      idle_timeout: 20, // 空闲连接 20 秒后关闭
      connect_timeout: 10, // 连接超时 10 秒
      max_lifetime: 60 * 30, // 单个连接最大存活 30 分钟（防数据库重启连接僵尸）

      onnotice: () => {}, // 静默 PostgreSQL notice
      prepare: false

    // 如果用 Railway、Supabase、Neon 等 serverless PG，建议加这些
    // connection: {
    //   application_name: 'nuxt4-english-app',
    // },
    })

// 开发环境下不缓存连接池（热重载时能正确关闭）
if (import.meta.env.PROD) {
  globalForPostgres.postgresClient = client
}

export function useDb() {
  return drizzle(client, {
    schema
  })
}

// 可选：优雅关闭（在 Nitro shutdown 钩子里调用）
export const closePool = async () => {
  if (globalForPostgres.postgresClient) {
    await globalForPostgres.postgresClient.end()
    globalForPostgres.postgresClient = undefined
  }
}
