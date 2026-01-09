import { parseCookies } from 'h3'

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig()
  const toast = useToast()

  const api: typeof $fetch = $fetch.create({
    baseURL: config.public.apiUrl as string ?? 'http://localhost:3000/api',
    async onRequest({ request, options }) {
      const event = useRequestEvent()
      if (event) {
        const cookies = parseCookies(event!)
        const cookieString = Object.entries(cookies).map(([key, value]) => `${key}=${value}`).join(';')
        options.headers.set('Cookie', cookieString)
      }
    },
    async onResponseError({ response }) {
      if (response._data.error) {
        let msgs

        try {
          msgs = JSON.parse(response._data?.message).map(msg => msg.message).join(', ')
        } catch {
          msgs = response._data?.message
        }

        toast.add({
          title: msgs || '未知错误!接口可能未返回信息',
          color: 'error'
        })
      }
      console.log(response)
      if (response.status === 401) {
        await nuxtApp.runWithContext(() => navigateTo('/login'))
      }
    }
  })

  return {
    provide: {
      api
    }
  }
})
