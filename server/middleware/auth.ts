import { navigateTo } from 'nuxt/app'

export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event)

  if (!user) {
    // return navigateTo('/login')
  }
})
