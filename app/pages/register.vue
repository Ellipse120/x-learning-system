<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  layout: 'auth'
})

useSeoMeta({
  title: 'Sign up',
  description: 'Create an account to get started'
})

const toast = useToast()
const appConfig = useAppConfig()

const role = ref('teacher')
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

const fields = [{
  name: 'username',
  type: 'text' as const,
  label: '用户名',
  placeholder: '请输入用户名'
}, {
  name: 'email',
  type: 'text' as const,
  label: '邮箱',
  required: true,
  placeholder: '请输入邮箱'
}, {
  name: 'password',
  label: '密码',
  required: true,
  type: 'password' as const,
  placeholder: '最少8位，需要包含大写字母数字'
}]

// const providers = [{
//   label: 'Google',
//   icon: 'i-simple-icons-google',
//   onClick: () => {
//     toast.add({ title: 'Google', description: 'Login with Google' })
//   }
// }, {
//   label: 'GitHub',
//   icon: 'i-simple-icons-github',
//   onClick: () => {
//     toast.add({ title: 'GitHub', description: 'Login with GitHub' })
//   }
// }]
const { $api } = useNuxtApp()

async function onSubmit(payload: FormSubmitEvent<typeof userRegisterSchemaZ>) {
  const { data } = await $api('/auth/register', {
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

  if (data.success) {
    toast.add({
      title: '注册成功',
      description: '欢迎加入我们！',
      color: 'success'
    })

    await navigateTo('/login')
  }
}
</script>

<template>
  <UAuthForm
    :fields="fields"
    :schema="userRegisterSchemaZ"
    title="创建账号"
    :submit="{ label: '创建账号' }"
    @submit="onSubmit"
  >
    <template #description>
      已经有账号了? <ULink
        to="/login"
        class="text-primary font-medium"
      >登录</ULink>.

      <UFormField label="身份选择">
        <UTabs
          v-model="role"
          :items="roles"
        />
      </UFormField>
    </template>

    <template #footer>
      点击创建即表示同意我们的 <ULink
        to="/"
        class="text-primary font-medium"
      >服务条款</ULink>.
    </template>
  </UAuthForm>
</template>
