<script setup lang="ts">
definePageMeta({
  layout: 'student'
  // middleware: ['auth']
})

const { user }: { user: User } = useUserSession()
const appConfig = useAppConfig()
const learningMaterials = ref(appConfig.mockData.mockLearningMaterials)
const studyRecords = ref(appConfig.mockData.mockStudyRecords.filter(r => r.studentId === user.value.id) || [])
const studyProgress = ref(appConfig.mockData.mockStudentProgress)
const totalMaterials = ref(appConfig.mockData.mockLearningMaterials)
const studentProgress = ref(appConfig.mockData.mockStudentProgress.find(p => p.studentId === user.value.id) || {
  studentId: user.value!.id,
  totalStudied: 0,
  correctAnswers: 0,
  currentStreak: 0,
  lastStudyDate: '2024-01-17',
  level: 'beginner'
})
const studyMode = ref<'study' | 'review' | 'quiz'>('study')
const currentMaterial = ref<LearningMaterial>(null)
// const showAnswer = ref(false)
const studyStartTime = ref()
// const dailyCheckedIn = ref(false)
const [showAnswer, toggleShowAnswer] = useToggle(false)
const [dailyCheckedIn] = useToggle(false)

const checkLearningDone = () => {
  const today = new Date().toISOString().split('T')[0]
  const todayRecords = studyRecords.value.filter(record => record.studiedAt.split('T')[0] === today)
  dailyCheckedIn.value = todayRecords.length > 0
}

onMounted(() => {
  checkLearningDone()
})

// 获取学习材料，根据学生进度推荐
const getRecommendedMaterial = () => {
  if (!studentProgress.value) {
    return learningMaterials.value.filter(m => m.difficulty === 'beginner').slice(0, 5)
  }

  const studiedMaterialIds = studyRecords.value.map(p => p.materialId)
  const unstudiedMaterials = learningMaterials.value.filter(m => !studiedMaterialIds.includes(m.id))

  if (unstudiedMaterials.length === 0) {
    return unstudiedMaterials.slice(0, 5)
  }

  return unstudiedMaterials.slice(0, 5)
}

const startStudy = () => {
  const materials = getRecommendedMaterial()

  if (materials.length > 0) {
    const randomIndex = Math.floor(Math.random() * materials.length)
    currentMaterial.value = materials[randomIndex]
    studyMode.value = 'study'
    toggleShowAnswer(false)
    studyStartTime.value = Date.now()
  }
}

const showTranslation = () => {
  toggleShowAnswer(true)
}

const handleAnswer = (isCorrent: boolean) => {
  if (currentMaterial.value && studyStartTime.value) {
    const endTime = Date.now()
    const timeSpent = Math.floor((endTime - studyStartTime.value) / 1000)

    studyRecords.value.push({
      id: (studyRecords.value.length + 1).toString(),
      materialId: currentMaterial.value.id,
      studentId: user.value!.id,
      studiedAt: new Date().toISOString(),
      timeSpent,
      isCorrect: isCorrent
    })

    const existingProgress = studyProgress.value.find(p => p.materialId === currentMaterial.value.id)

    if (existingProgress) {
      existingProgress.attempts += 1
      if (isCorrent) {
        existingProgress.correctAttempts += 1
      }
    } else {
      studyProgress.value.push({
        materialId: currentMaterial.value.id,
        studentId: user.id,
        attempts: 1,
        correctAttempts: isCorrent ? 1 : 0
      })
    }

    currentMaterial.value = null
    studyMode.value = 'study'
    toggleShowAnswer(false)
    studyStartTime.value = null
    checkLearningDone()
  }
}

const resetStudy = () => {
  currentMaterial.value = null
  studyMode.value = 'study'
  toggleShowAnswer(false)
  studyStartTime.value = null
}

const accuracy = computed(() => studentProgress.value
  ? Math.round((studentProgress.value.correctAnswers / studentProgress.value.totalStudied) * 100)
  : 0)

const todayStudyCount = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return studyRecords.value.filter(record => record.studiedAt.split('T')[0] === today).length
})
const weeklyGoal = ref(50)
const weeklyProgress = computed(() => studentProgress.value ? studentProgress.value.totalStudied % weeklyGoal.value : 0)

const totalStudyTime = computed(() => {
  return studyRecords.value.reduce((sum, record) => sum + record.timeSpent, 0)
})
const averageStudyTime = computed(() => {
  if (studyRecords.value.length === 0) return 0
  return Math.round(totalStudyTime.value / studyRecords.value.length)
})

const activeTab = ref('learningProgress')
const items = [
  {
    label: '开始学习',
    icon: 'i-lucide-play',
    value: 'startLearning',
    slot: 'startLearning'
  },
  {
    label: '学习进度',
    icon: 'i-lucide-percent',
    value: 'learningProgress',
    slot: 'learningProgress'
  },
  {
    label: '学习记录',
    icon: 'i-lucide-dock',
    value: 'learningRecords',
    slot: 'learningRecords'
  }
]

const setStudyMode = (mode: 'study' | 'review' | 'quiz') => {
  studyMode.value = mode
  currentMaterial.value = null
  toggleShowAnswer(false)
}

const findMaterial = (record) => {
  return learningMaterials.value.find(material => material.id === record.materialId)
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-2">
    <UBanner
      v-if="!dailyCheckedIn"
      color="info"
      class="mb-6 rounded-lg"
    >
      <template #title>
        <div class="flex items-center gap-4">
          <UIcon
            name="i-lucide-calendar-check"
            class="w-6 h-6"
          />

          <div>
            今日还未开始学习，点击开始学习按钮进行打卡！
          </div>
        </div>
      </template>
    </UBanner>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-4">
      <UCard class="flex items-center justify-center">
        <div>
          <div class="p-4 bg-blue-100 rounded-full flex items-center justify-center">
            <UIcon
              name="i-lucide-target"
              class="w-6 h-6 text-blue-600"
            />
          </div>
          <div class="flex flex-col items-center justify-center">
            <p class="text-2xl font-bold">
              {{ studentProgress.totalStudied || 0 }}
            </p>
            <p class="text-sm text-gray-600">
              总学习量
            </p>
          </div>
        </div>
      </UCard>

      <UCard class="flex items-center justify-center">
        <div>
          <div class="p-4 bg-green-100 rounded-full flex items-center justify-center">
            <UIcon
              name="i-lucide-trophy"
              class="w-6 h-6 text-green-600"
            />
          </div>
          <div class="flex flex-col items-center justify-center">
            <p class="text-2xl font-bold">
              {{ accuracy }}%
            </p>
            <p class="text-sm text-gray-600">
              正确率
            </p>
          </div>
        </div>
      </UCard>

      <UCard class="flex items-center justify-center">
        <div>
          <div class="p-4 bg-orange-100 rounded-full flex items-center justify-center">
            <UIcon
              name="i-lucide-flame"
              class="w-6 h-6 text-orange-600"
            />
          </div>
          <div class="flex flex-col items-center justify-center">
            <p class="text-2xl font-bold">
              {{ studentProgress?.currentStreak || 0 }}
            </p>
            <p class="text-sm text-gray-600">
              连续天数
            </p>
          </div>
        </div>
      </UCard>

      <UCard class="flex items-center justify-center">
        <div>
          <div class="p-4 bg-purple-100 rounded-full flex items-center justify-center">
            <UIcon
              name="i-lucide-clock"
              class="w-6 h-6 text-purple-600"
            />
          </div>
          <div class="flex flex-col items-center justify-center">
            <p class="text-2xl font-bold">
              {{ todayStudyCount }}
            </p>
            <p class="text-sm text-gray-600">
              今日学习
            </p>
          </div>
        </div>
      </UCard>
    </div>

    <div class="my-6">
      <UTabs
        v-model="activeTab"
        color="info"
        :items="items"
      >
        <template #startLearning>
          <div class="my-6">
            <UCard>
              <template #header>
                <div class="text-center">
                  <h3 class="text-base font-semibold leading-6">
                    今日学习
                  </h3>
                  <p class="text-gray-600">
                    选择学习模式开始今日的英语学习
                  </p>
                </div>
              </template>

              <template #default>
                <div class="p-4">
                  <div
                    v-if="!currentMaterial"
                    class="text-center space-y-4"
                  >
                    <div class="grid grid-cols-3 gap-12">
                      <UButton
                        :color="studyMode === 'study' ? 'info' : 'ghost'"
                        class="px-8 py-6 flex items-center justify-center"
                        @click="setStudyMode('study')"
                      >
                        <div>
                          <UIcon
                            name="i-lucide-book-open"
                            class="w-5 h-5 mr-2"
                          />
                          <div>学习新内容</div>
                        </div>
                      </UButton>

                      <UButton
                        :color="studyMode === 'review' ? 'info' : 'ghost'"
                        class="px-8 py-6 flex items-center justify-center"
                        @click="setStudyMode('review')"
                      >
                        <div>
                          <UIcon
                            name="i-lucide-rotate-cw"
                            class="w-5 h-5 mr-2"
                          />
                          <div>复习练习</div>
                        </div>
                      </UButton>

                      <UButton
                        :color="studyMode === 'quiz' ? 'info' : 'ghost'"
                        class="px-8 py-6 flex items-center justify-center"
                        @click="setStudyMode('quiz')"
                      >
                        <div>
                          <UIcon
                            name="i-lucide-award"
                            class="w-5 h-5 mr-2"
                          />
                          <div>测试模式</div>
                        </div>
                      </UButton>
                    </div>

                    <UButton
                      color="info"
                      class="w-60 justify-center py-4 px-8"
                      icon="i-lucide-play"
                      @click="startStudy"
                    >
                      开始学习
                    </UButton>
                  </div>

                  <div
                    v-else
                    class="space-y-6"
                  >
                    <div class="text-center">
                      <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-xl">
                        <UBadge class="bg-white/20">
                          {{ currentMaterial.type === 'word' ? '单词' : currentMaterial.type === 'sentence' ? '句子' : '短语' }}
                        </UBadge>
                        <h2 class="text-2xl font-bold mb-2">
                          {{ currentMaterial.title }}
                        </h2>
                        <p class="text-3xl mb-4">
                          {{ currentMaterial.content }}
                        </p>
                        <p
                          v-if="showAnswer"
                          class="p-4 bg-white/10 rounded-lg backdrop-blur-sm"
                        >
                          {{ currentMaterial.translation }}
                        </p>
                      </div>

                      <div v-if="studyMode === 'study'">
                        <div
                          v-if="showAnswer"
                          class="flex space-x-4 my-4"
                        >
                          <UButton
                            icon="i-lucide-circle-x"
                            class="justify-center flex-1 border border-red-200 bg-white text-red-600 hover:bg-red-50"
                            @click="handleAnswer(false)"
                          >
                            不认识
                          </UButton>

                          <UButton
                            icon="i-lucide-circle-check-big"
                            class="justify-center flex-1 bg-green-600 hover:bg-green-700"
                            @click="handleAnswer(true)"
                          >
                            认识
                          </UButton>
                        </div>

                        <UButton
                          v-if="!showAnswer"
                          color="neutral"
                          class="w-full justify-center p-4 mt-4"
                          @click="showTranslation"
                        >
                          显示翻译
                        </UButton>
                      </div>

                      <div
                        v-else-if="studyMode === 'quiz'"
                        class="space-y-4"
                      >
                        <p class="text-gray-600">
                          你认为这个句子的意思是正确的吗？
                        </p>
                        <div class="flex justify-center gap-4">
                          <UButton
                            color="success"
                            @click="handleAnswer(true)"
                          >
                            正确
                          </UButton>
                          <UButton
                            color="danger"
                            @click="handleAnswer(false)"
                          >
                            错误
                          </UButton>
                        </div>
                      </div>
                    </div>

                    <div class="text-center">
                      <UButton
                        color="ghost"
                        @click="resetStudy"
                      >
                        返回学习模式选择
                      </UButton>
                    </div>
                  </div>

                  <div class="mt-6">
                    <h4 class="text-sm text-gray-600 mb-3">
                      今日推荐学习内容：
                    </h4>
                    <div class="space-y-2 dark:bg-gray-800 dark:text-black">
                      <div
                        v-for="material in getRecommendedMaterial().slice(0, 3)"
                        :key="material.id"
                        class="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-info-500/50"
                      >
                        <div>
                          <p class="font-medium">
                            {{ material.content }}
                          </p>
                          <p class="text-sm text-gray-600 dark:text-white">
                            {{ material.translation }}
                          </p>
                        </div>
                        <UBadge
                          variant="outline"
                          color="ghost"
                        >
                          {{ material.difficulty === 'beginner' ? '初级'
                            : material.difficulty === 'intermediate' ? '中级' : '高级' }}
                        </UBadge>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </UCard>
          </div>
        </template>

        <template #learningProgress>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
            <UCard>
              <template #header>
                <div class="flex items-center">
                  <UIcon
                    class="w-6 h-6 mr-2"
                    name="i-lucide-trending-up"
                  />学习统计
                </div>
              </template>

              <div class="p-4 space-y-4">
                <div class="space-y-2">
                  <div class="flex justify-between items-center">
                    <span>当前等级</span>
                    <UBadge>
                      {{ studentProgress?.level === 'beginner' ? '初级'
                        : studentProgress?.level === 'intermediate' ? '中级' : '高级' }}
                    </UBadge>
                  </div>

                  <div class="space-y-2">
                    <div class="flex justify-between">
                      <span>周学习进度</span>
                      <span>{{ weeklyProgress }}/{{ weeklyGoal }}</span>
                    </div>
                    <UProgress
                      :model-value="(weeklyProgress / weeklyGoal) * 100"
                      class="h-3"
                    />

                    <div class="flex justify-between items-center">
                      <span>平均学习时间</span>
                      <span>{{ averageStudyTime }}秒/题</span>
                    </div>

                    <div class="flex justify-between items-center">
                      <span>累计学习时间</span>
                      <span>{{ Math.round(totalStudyTime / 60) }}分钟</span>
                    </div>
                  </div>
                </div>
              </div>
            </UCard>

            <UCard>
              <template #header>
                <div class="flex items-center">
                  <UIcon
                    class="w-6 h-6 mr-2"
                    name="i-lucide-medal"
                  />成绩勋章
                </div>
              </template>

              <div class="grid grid-cols-2 gap-4">
                <div class="text-center p-4 bg-yellow-50 rounded-lg">
                  <div class="text-2xl mb-2">
                    🎯
                  </div>
                  <p class="text-sm">
                    初学者
                  </p>
                  <p class="text-xs text-gray-600">
                    完成首次学习
                  </p>
                </div>

                <div
                  class="text-center p-4 rounded-lg"
                  :class="(studentProgress?.currentStreak || 0) >= 3
                    ? 'bg-orange-50'
                    : 'bg-gray-50'"
                >
                  <div class="text-2xl mb-2">
                    🔥
                  </div>
                  <p class="text-sm">
                    连续学习
                  </p>
                  <p class="text-xs text-gray-600">
                    连续3天学习
                  </p>
                </div>

                <div
                  class="text-center p-4 rounded-lg"
                  :class="accuracy >= 80
                    ? 'bg-green-50'
                    : 'bg-gray-50'"
                >
                  <div class="text-2xl mb-2">
                    ⭐
                  </div>
                  <p class="text-sm">
                    高准确率
                  </p>
                  <p class="text-xs text-gray-600">
                    正确率达80%
                  </p>
                </div>

                <div
                  class="text-center p-4 rounded-lg"
                  :class="(studentProgress?.totalStudied) >= 100
                    ? 'bg-purple-50'
                    : 'bg-gray-50'"
                >
                  <div class="text-2xl mb-2">
                    🏆
                  </div>
                  <p class="text-sm">
                    学习达人
                  </p>
                  <p class="text-xs text-gray-600">
                    学习100个内容
                  </p>
                </div>
              </div>
            </ucard>
          </div>
        </template>

        <template #learningRecords>
          <div class="space-y-4">
            <div
              v-for="record in studyRecords"
              :key="record.id"
              class="flex items-center justify-between p-4 border rounded-lg"
            >
              <div class="flex items-center space-x-4">
                <div class="w-10 h-10 rounded-full flex items-center justify-center">
                  <UIcon
                    v-if="record.correct"
                    class="w-6 h-6 text-green-600"
                    name="i-lucide-circle-check-big"
                  />
                  <UIcon
                    v-else
                    class="w-6 h-6 text-red-600"
                    name="i-lucide-circle-x"
                  />
                </div>

                <div>
                  <p className="font-medium dark:text-white">
                    {{ findMaterial(record)?.content }}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-white">
                    {{ findMaterial(record)?.translation }}
                  </p>
                </div>
              </div>

              <div class="text-right text-sm text-gray-500">
                <p>{{ new Date(record.studiedAt).toLocaleDateString() }}</p>
                <p>{{ record.timeSpent }}秒</p>
              </div>
            </div>
          </div>
        </template>
      </UTabs>
    </div>
  </div>
</template>
