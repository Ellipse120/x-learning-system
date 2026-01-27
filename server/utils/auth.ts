export const defineAuthEventHandler = handler => defineEventHandler(async (event) => {
  const { user } = await getUserSession(event)
  const isLoggedIn = user?.id ?? null

  if (!isLoggedIn) {
    return createError({
      status: 401,
      statusText: 'Unauthorized'
    })
  }

  const response = await handler(event)

  return {
    response
  }
})
