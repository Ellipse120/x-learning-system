export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event)

  if (!user) {
    throw createError({
      statusCode: 401,
      message: '未获取到用户信息'
    })
  }
})
