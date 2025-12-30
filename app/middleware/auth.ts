export default defineNuxtRouteMiddleware(async () => {
  const { loggedIn, fetch } = useUserSession()
  await fetch()
  console.log(loggedIn.value)
  if (!loggedIn.value) {
    return navigateTo('/login')
  }
})
