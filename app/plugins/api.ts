export default defineNuxtPlugin((nuxtApp) => {
  const userInfo = useCookie('userInfo')
  const userAuth = userInfo.value?.token

  const config = useRuntimeConfig()
  const toast = useToast()

  const api: typeof $fetch = $fetch.create({
    baseURL: config.public.apiUrl2 as string ?? 'http://localhost:3000/api',
    onRequest({ options }) {
      if (userAuth) {
        options.headers.set('Authorization', `Bearer ${userAuth}`)
      }
    },
    async onResponseError({ response }) {
      // if (!response._data?.success) {
      //   toast.add({
      //     title: response._data?.message || '未知错误!接口可能未返回信息',
      //     color: 'error'
      //   })
      // }

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

      if (response.status === 401) {
        console.log(response)

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
