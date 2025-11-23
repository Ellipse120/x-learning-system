<script setup lang="ts">
import type { User } from '~~/shared/types'

const appConfig = useAppConfig()
const { $api } = useNuxtApp()
const { user, clear } = useUserSession()

const onLogout = async () => {
  await $api('/auth/logout', {
    method: 'POST'
  })
  await clear()
  await navigateTo('/login')
}
</script>

<template>
  <div>
    <UHeader to="/teacher">
      <template #title>
        <UIcon
          name="i-lucide-book-open-text"
          class="w-8 h-8 text-primary"
        />
        {{ appConfig.appInfo.adminTitle }}
      </template>

      <template #right>
        <AuthState v-slot="{ loggedIn }">
          <div class="flex items-center space-x-4">
            <span class="text-gray-700 dark:text-white">欢迎回来，{{ (user as User)?.username }}</span>
          </div>

          <UColorModeButton />

          <UButton
            v-if="loggedIn"
            label="退出"
            icon="i-lucide-log-in"
            color="neutral"
            variant="outline"
            @click="onLogout"
          />

          <UButton
            v-if="!loggedIn"
            label="登录"
            color="neutral"
            variant="outline"
            to="/login"
            class="hidden lg:inline-flex"
          />

          <UButton
            v-if="!loggedIn"
            label="注册"
            color="neutral"
            trailing-icon="i-lucide-arrow-right"
            class="hidden lg:inline-flex"
            to="/register"
          />
        </AuthState>
      </template>
    </UHeader>

    <UMain class="w-full max-w-(--ui-container) mx-auto px-4 dark:bg-gray-800">
      <slot />
    </UMain>
  </div>
</template>
