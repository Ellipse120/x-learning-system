// server/plugins/graceful-shutdown.ts
import { closePool } from '~~/server/utils/db'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('close', async () => {
    console.log('🗑️  Closing PostgreSQL connection pool...')
    await closePool()
  })
})
