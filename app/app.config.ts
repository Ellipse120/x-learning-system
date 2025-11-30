const roleEnum = {
  teacher: 'teacher',
  student: 'student',
  admin: 'admin'
}

const meterialTypeEnum = {
  word: 0,
  phrase: 1,
  sentense: 2
}

const wordTypeEnum = {
  verb: 0,
  noun: 1,
  adjective: 2,
  adverb: 3,
  pronoun: 4,
  preposition: 5,
  conjunction: 6,
  article: 7,
  interjection: 8
}

const difficultyLevelEnum = {
  beginner: 'beginner',
  intermediate: 'intermediate',
  advanced: 'advanced'
}

export default defineAppConfig({
  appInfo: {
    adminTitle: '英语学习系统管理后台',
    title: '英语学习系统',
    roleEnum,
    roleEnums: [
      {
        label: '教师',
        value: roleEnum.teacher
      },
      {
        label: '管理员',
        value: roleEnum.admin
      },
      {
        label: '学生',
        value: roleEnum.student
      }
    ],
    roleItems: [
      {
        label: '教师',
        value: 'teacher'
      },
      {
        label: '管理员',
        value: 'admin'
      },
      {
        label: '学生',
        value: 'student'
      }
    ],
    meterialTypeEnum,
    materialTypes: [
      { label: '单词', value: meterialTypeEnum.word, engLabel: 'word' },
      { label: '短语', value: meterialTypeEnum.phrase, engLabel: 'phrase' },
      { label: '句子', value: meterialTypeEnum.sentense, engLabel: 'sentence' }
    ],
    wordTypeEnum,
    wordTypes: [
      { label: '动词', value: wordTypeEnum.verb, engLabel: 'verb' },
      { label: '名词', value: wordTypeEnum.noun, engLabel: 'noun' },
      { label: '形容词', value: wordTypeEnum.adjective, engLabel: 'adjective' },
      { label: '副词', value: wordTypeEnum.adverb, engLabel: 'adverb' },
      { label: '代词', value: wordTypeEnum.pronoun, engLabel: 'pronoun' },
      { label: '介词', value: wordTypeEnum.preposition, engLabel: 'preposition' },
      { label: '连词', value: wordTypeEnum.conjunction, engLabel: 'conjunction' },
      { label: '冠词', value: wordTypeEnum.article, engLabel: 'article' },
      { label: '感叹词', value: wordTypeEnum.interjection, engLabel: 'interjection' }
    ],
    difficultyLevelEnum,
    difficultyLevels: [
      { label: '初级', value: difficultyLevelEnum.easy, engLabel: 'beginner' },
      { label: '中级', value: difficultyLevelEnum.medium, engLabel: 'intermediate' },
      { label: '高级', value: difficultyLevelEnum.hard, engLabel: 'advanced' }
    ],
    booleanOptions: [
      { label: '是', value: true },
      { label: '否', value: false }
    ],
    seedUserEmailProvider: 'example.fake.com'
  },
  mockData: {
    // 模拟用户数据
    mockUsers: [
      { id: '1', name: '张老师', role: 'teacher', email: 'teacher@example.com' },
      { id: '2', name: '李小明', role: 'student', email: 'student1@example.com' },
      { id: '3', name: '王小红', role: 'student', email: 'student2@example.com' },
      { id: '4', name: '刘小华', role: 'student', email: 'student3@example.com' }
    ],
    // 模拟学习资料
    mockLearningMaterials: [
      {
        id: '1',
        type: 'word',
        content: 'apple',
        translation: '苹果',
        difficulty: 'beginner',
        createdBy: '1',
        createdAt: '2024-01-15'
      },
      {
        id: '2',
        type: 'word',
        content: 'beautiful',
        translation: '美丽的',
        difficulty: 'intermediate',
        createdBy: '1',
        createdAt: '2024-01-15'
      },
      {
        id: '3',
        type: 'sentence',
        content: 'How are you today?',
        translation: '你今天怎么样？',
        difficulty: 'beginner',
        createdBy: '1',
        createdAt: '2024-01-16'
      },
      {
        id: '4',
        type: 'word',
        content: 'challenge',
        translation: '挑战',
        difficulty: 'advanced',
        createdBy: '1',
        createdAt: '2024-01-16'
      }
    ],
    // 模拟学习记录
    mockStudyRecords: [
      {
        id: '1',
        studentId: '2',
        materialId: '1',
        studiedAt: '2024-01-17T10:30:00Z',
        correct: true,
        timeSpent: 45
      },
      {
        id: '2',
        studentId: '2',
        materialId: '2',
        studiedAt: '2024-01-17T10:35:00Z',
        correct: false,
        timeSpent: 60
      },
      {
        id: '3',
        studentId: '3',
        materialId: '1',
        studiedAt: '2024-01-17T14:20:00Z',
        correct: true,
        timeSpent: 30
      }
    ],
    // 模拟学生进度
    mockStudentProgress: [
      {
        studentId: '2',
        totalStudied: 25,
        correctAnswers: 18,
        currentStreak: 3,
        lastStudyDate: '2024-01-17',
        level: 'intermediate'
      },
      {
        studentId: '3',
        totalStudied: 15,
        correctAnswers: 12,
        currentStreak: 1,
        lastStudyDate: '2024-01-17',
        level: 'beginner'
      },
      {
        studentId: '4',
        totalStudied: 8,
        correctAnswers: 6,
        currentStreak: 0,
        lastStudyDate: '2024-01-16',
        level: 'beginner'
      }
    ]
  },
  ui: {
    colors: {
      primary: 'red',
      neutral: 'slate'
    },
    main: {
      base: 'min-h-[calc(100vh-var(--ui-header-height))] p-8 bg-slate-50'
    },
    modal: {
      slots: {
        overlay: 'bg-black/20',
        footer: 'justify-center'
      }
    },
    input: {
      slots: {
        root: 'w-full'
      }
    },
    select: {
      slots: {
        base: 'w-full'
      }
    },
    card: {
      slots: {
        header: 'border-b-0'
      }
    },
    button: {
      variants: {
        color: {
          ghost: 'bg-transparent border border-gray-200 hover:bg-slate-100 text-slate-700'
        }
      }
    },
    badge: {
      variants: {
        color: {
          ghost: 'bg-transparent text-gray-800 border border-gray-200'
        }
      }
    }
  }
})
