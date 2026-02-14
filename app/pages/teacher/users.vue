<script setup>
definePageMeta({
  // layout: 'teacher'
})

const toast = useToast()
const appConfig = useAppConfig()
const { $api } = useNuxtApp()

const UButton = resolveComponent('UButton')

const page = ref(1)
const limit = ref(10)
const total = ref(0)
const totalPages = ref(0)
const search = ref('')

const { data, refresh, pending } = await useAPI('/users', {
  query: {
    search: search,
    page: page,
    limit: limit
  }
})

page.value = data.value?.page
total.value = computed(() => data.value?.total || 0)
totalPages.value = computed(() => data.value?.totalPages || 0)

const roleItems = appConfig.appInfo.roleItems
const columns = [
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'username',
    header: '用户名'
  },
  {
    accessorKey: 'email',
    header: '电子邮箱'
  },
  {
    accessorKey: 'role',
    header: '角色',
    cell: ({ row }) => `${formatText(roleItems, row.getValue('role'))}`
  },
  {
    accessorKey: 'actions',
    header: '操作'
    // cell: ({ row }) => {
    //   const editBtn = h(UButton, {
    //     color: 'success',
    //     onClick: () => openModal(row.original)
    //   }, () => '编辑')
    //   const deleteBtn = h(UButton, {
    //     color: 'warning',
    //     onClick: () => openModal(row.original)
    //   }, () => '删除')

    //   return h('div', {
    //     class: 'flex gap-2'
    //   }, [editBtn, deleteBtn])
    // }
  }
]

const defaultUser = {
  id: null,
  username: null,
  role: 'student',
  email: null,
  password: null
}
const model = ref({ ...defaultUser })
const [modalOpen, toggleModalOpen] = useToggle()
const [deleteModalOpen, toggleDeleteModalOpen] = useToggle()
const showPassword = ref(false)

async function openModal(user = { ...defaultUser }) {
  model.value = { ...user }
  if (model.value.id) {
    const { data } = await $api(`/users/${model.value.id}`)
    model.value = data
  }

  toggleModalOpen(true)
}

function goBack() {
  navigateTo('/teacher?tab=student')
}

async function saveUser(user) {
  let response

  if (user.id) {
    response = await $api(`/users/${user.id}`, {
      method: 'put',
      body: user
    })
  } else {
    response = await $api('/users', {
      method: 'post',
      body: user
    })
  }
  toast.add({ title: response.message, color: 'success' })

  closeModal()
  await refresh()
}

function closeModal() {
  toggleModalOpen(false)
  model.value = { ...defaultUser }
}

const handleDelete = (row) => {
  model.value = { ...row }
  toggleDeleteModalOpen(true)
}

const closeDeleteModal = () => {
  toggleDeleteModalOpen(false)
}

const confirmDelete = async () => {
  await $api(`users/${model.value.id}`, {
    method: 'delete'
  })

  await refresh()
  toast.add({
    title: '删除成功',
    color: 'success'
  })
  toggleDeleteModalOpen(false)
}

const handleResetPassword = async (row) => {
  const res = await $api(`/users/${row.id}/reset-password`, {
    method: 'put'
  })

  toast.add({
    title: res.message,
    color: 'success'
  })
}

async function seedMockUsers() {
  const { data } = await $api('/seed/users', {
    method: 'post',
    body: {
      count: 10,
      role: 'student'
    }
  })

  page.value = 1
  await refresh()
  toast.add({ title: `添加${data.created}个模拟用户` })
}

const batchDeleteSeedUser = async () => {
  await $api('/users/batch-delete', {
    method: 'post',
    body: {
      emailPattern: `%@${appConfig.appInfo.seedUserEmailProvider}`
    }
  })

  page.value = 1
  await refresh()
  toast.add({ title: 'Seed数据删除成功', color: 'success' })
}
</script>

<template>
  <UDashboardPanel id="student" :ui="{ right: 'gap-3' }">
    <template #header>
      <UDashboardNavbar title="Student" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div>
        <div class="flex gap-4">
          <UInput
            v-model.lazy="search"
            placeholder="搜索邮箱或姓名..."
            :trailing="false"
            class="max-w-md"
          >
            <template v-if="search?.length" #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                icon="i-lucide-circle-x"
                aria-label="Clear input"
                @click="search = ''"
              />
            </template>
          </UInput>

          <UButton
            label="查询"
            color="secondary"
            @click="refresh()"
          />
          <UButton
            label="添加"
            @click="openModal()"
          />
          <UButton
            label="Seed模拟用户"
            variant="subtle"
            color="error"
            @click="seedMockUsers()"
          />
          <UButton
            label="删除Seed数据"
            variant="subtle"
            color="error"
            @click="batchDeleteSeedUser()"
          />
          <UButton
            label="返回"
            variant="subtle"
            @click="goBack()"
          />
        </div>

        <UTable
          :data="data?.list"
          :columns="columns"
          :loading="pending"
          empty="暂无数据"
        >
          <template #actions-cell="{ row }">
            <div class="space-x-2">
              <UButton
                icon="i-lucide-edit"
                variant="outline"
                color="info"
                size="sm"
                title="编辑"
                @click="openModal(row.original)"
              />

              <UButton
                icon="i-lucide-trash"
                variant="outline"
                color="error"
                size="sm"
                title="删除"
                @click="handleDelete(row.original)"
              />

              <UButton
                icon="i-lucide-candy"
                variant="outline"
                color="warning"
                size="sm"
                title="重置密码"
                @click="handleResetPassword(row.original)"
              />
            </div>
          </template>
        </UTable>

        <div class="flex justify-center border-t border-default pt-4">
          <UPagination
            v-model:page="page"
            :page-count="totalPages"
            :items-per-page="limit"
            :total="total"
            active-variant="subtle"
          />
        </div>

        <UModal v-model:open="modalOpen">
          <template #header>
            <h2>{{ model.id ? '编辑' : '添加' }}</h2>
          </template>
          <template #body>
            <UForm @submit="saveUser(model)">
              <UFormField
                label="用户名"
                name="username"
              >
                <UInput
                  v-model="model.username"
                  label="用户名"
                  required
                />
              </UFormField>
              <UFormField
                label="邮箱"
                name="email"
              >
                <UInput
                  v-model="model.email"
                  :disabled="!!model.id"
                  label="邮箱"
                  type="email"
                  required
                />
              </UFormField>

              <UFormField
                v-if="model.id"
                label="密码"
                description="至少8位且包含大写字母和数字。如不修改请留空"
                name="password"
              >
                <UInput
                  v-model="model.password"
                  placeholder="密码"
                  :type="showPassword ? 'text' : 'password'"
                  :ui="{ trailing: 'pe-1' }"
                >
                  <template #trailing>
                    <UButton
                      :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                      :aria-label="showPassword ? 'Hide password' : 'Show password'"
                      :aria-pressed="showPassword"
                      aria-controls="password"
                      @click="showPassword = !showPassword"
                    />
                  </template>
                </UInput>
              </UFormField>

              <UFormField
                label="角色"
                name="role"
              >
                <URadioGroup
                  v-model="model.role"
                  color="primary"
                  variant="table"
                  default-value="student"
                  :items="roleItems"
                />
              </UFormField>
            </UForm>
          </template>
          <template #footer>
            <UButton
              label="Cancel"
              variant="subtle"
              @click="closeModal"
            />
            <UButton
              label="Save"
              color="success"
              type="submit"
              @click="saveUser(model)"
            />
          </template>
        </UModal>

        <UModal
          v-model:open="deleteModalOpen"
          title="提醒"
        >
          <template #body>
            <div class="text-center text-xl">
              确定删除： {{ model.username }} 吗？
            </div>
          </template>

          <template #footer>
            <UButton
              label="取消"
              variant="subtle"
              @click="closeDeleteModal"
            />
            <UButton
              label="确定"
              color="success"
              type="submit"
              @click="confirmDelete()"
            />
          </template>
        </UModal>
      </div>
    </template>
  </UDashboardPanel>
</template>
