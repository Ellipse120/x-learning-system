export default defineNitroPlugin(async () => {
  try {
    await ensureAdminUser()
  } catch {
    console.error('管理员创建失败')
  }
})
