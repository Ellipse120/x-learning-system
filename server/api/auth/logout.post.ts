export default eventHandler(async (event) => {
  await clearUserSession(event)

  return {
    success: true,
    message: '已退出登录'
  }
})
