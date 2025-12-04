<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  layout: 'auth'
})

useSeoMeta({
  title: 'Login',
  description: 'Login to your account to continue'
})

const toast = useToast()

const appConfig = useAppConfig()

const roles = ref([
  {
    label: '教师',
    icon: 'i-lucide-users',
    value: appConfig.appInfo.roleEnum.teacher
  },
  {
    label: '学生',
    icon: 'i-lucide-graduation-cap',
    value: appConfig.appInfo.roleEnum.student
  }
])

const fields = [
  {
    name: 'email',
    type: 'text' as const,
    label: '邮件',
    placeholder: '请输入邮件',
    required: true
  },
  {
    name: 'password',
    label: '密码',
    type: 'password' as const,
    placeholder: '请输入密码',
    required: true
  },
  {
    name: 'remember',
    label: '记住我',
    type: 'checkbox' as const
  }
]

const schema = z.object({
  email: z.email('无效电子邮箱'),
  password: z.string().min(8, '至少8位且包含大写字母数字')
})

type Schema = z.output<typeof schema>

const role = ref('teacher')
const { $api } = useNuxtApp()

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  const { data, success } = await $api('/auth/login', {
    method: 'POST',
    body: {
      ...payload.data,
      role: role.value
    }
  }).catch((err) => {
    toast.add({
      title: '登录失败',
      description: err?.data?.message || '请稍后再试',
      color: 'error'
    })
  })

  if (success) {
    await navigateTo(data.path)

    toast.add({
      title: '登录成功',
      description: `欢迎回来！${data.username}`,
      color: 'success'
    })
  }
}
</script>

<template>
  <UAuthForm
    :fields="fields"
    :schema="schema"
    :title="appConfig.appInfo.title"
    :submit="{
      label: '登录',
      block: true
    }"
    icon="i-lucide-book-open-text"
    @submit="onSubmit"
  >
    <template #header>
      <div class="flex items-center flex-col gap-4 justify-center">
        <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
          <UIcon
            name="i-lucide-book-open-text"
            class="w-8 h-8 text-white"
          />
        </div>
        <div class="text-2xl font-bold text-center">
          {{ appConfig.appInfo.title }}
        </div>
      </div>

      <div class="pt-2">
        还没有账号? <ULink
          to="/register"
          class="text-primary font-medium"
        >注册</ULink>.

        <UFormField label="身份选择">
          <UTabs
            v-model="role"
            :items="roles"
          />
        </UFormField>
      </div>
    </template>

    <template #password-hint>
      <ULink
        to="/"
        class="text-primary font-medium"
        tabindex="-1"
      >忘记密码?</ULink>
    </template>

    <template #footer>
      点击登录，即表示您同意我们的 <ULink
        to="/"
        class="text-primary font-medium"
      >服务条款</ULink>.
    </template>
  </UAuthForm>
</template>
