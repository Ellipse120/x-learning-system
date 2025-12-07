import { z } from 'zod'
import { zhCN } from 'zod/locales'
import { CalendarDate } from '@internationalized/date'

z.config(zhCN())

enum roleEnum {
  teacher = 'teacher',
  assistant = 'assistant',
  student = 'student',
  admin = 'admin'
}

enum meterialTypeEnum {
  word = 0,
  phrase = 1,
  sentense = 2
}

enum difficultyLevelEnum {
  easy = 0,
  medium = 1,
  hard = 2
}

export const userLoginSchema = z.object({
  email: z.email().trim(),
  role: z.enum(roleEnum),
  password: z.string().trim().nullish()
})

export const materialSchema = z.object({
  id: z.string().nullish(),
  type: z.enum(meterialTypeEnum),
  content: z.string().min(1, '必填'),
  translation: z.string().min(1, '必填'),
  difficulty: z.enum(difficultyLevelEnum)
})

export const learningPlanSchema = z.object({
  id: z.string().nullish(),
  title: z.string().min(1, '必填'),
  description: z.string().min(1, '必填'),
  materialIds: z.object({
    materialIds: z.record(z.string(), z.boolean())
  }),
  studentId: z.string().min(1, '必填'),
  startDate: z.string().min(1, '必填'),
  endDate: z.string().min(1, '必填'),
  dateRange: z.object({
    start: z.custom(val => val instanceof CalendarDate),
    end: z.custom(val => val instanceof CalendarDate)
  }).refine(data => data.start && data.end, {
    message: '请选择开始和结束日期'
  })
})

export const userLoginSchemaZ = z.object({
  username: z.string().trim().nullish(),
  email: z.email('无效的邮箱地址'),
  password: z.string().min(8).regex(/[A-Z]/, '必须包含大写字母').regex(/[0-9]/, '必须包含数字'),
  role: z.enum(roleEnum)
})

export const userRegisterSchemaZ = z.object({
  username: z.string().trim().nullish(),
  email: z.email('无效的邮箱地址'),
  password: z.string().min(8).regex(/[A-Z]/, '必须包含大写字母').regex(/[0-9]/, '必须包含数字'),
  role: z.enum(roleEnum)
})

export const materialSchemaZ = z.object({
  id: z.number().optional(),
  title: z.string().nullish(),
  type: z.enum(['word', 'phrase', 'sentence', 'article', 'other']).default('word'),
  category: z.string().max(100).nullish(),

  word: z.string().nullish(),
  phoneticUk: z.string().nullish(),
  phoneticUs: z.string().nullish(),
  translation: z.string().nullish(),
  example: z.string().nullish(),

  content: z.string().nullish(),
  difficulty: z.string().nullish(),
  audioUrl: z.url().nullish(),
  imageUrl: z.url().nullish(),

  createdBy: z.number().nullish(),
  isPublic: z.boolean().nullish()
})

export const dailyRecordsZ = z.object({
  id: z.number().optional(),
  userId: z.number(),
  materialId: z.number(),
  date: z.string(),
  learnedCound: z.number().default(0),
  status: z.string(),
  notes: z.string().optional(),
  reviewCount: z.number().default(0),
  streak: z.number().default(0),
  isChecked: z.boolean().default(true),
  createBy: z.number(),
  createAt: z.string(),
  updateAt: z.string().optional()
})

export type UserLogin = z.infer<typeof userLoginSchema>
export type Material = z.infer<typeof materialSchema>
export type UserRegisterZ = z.infer<typeof userRegisterSchemaZ>
export type UserLoginZ = z.infer<typeof userLoginSchemaZ>
export type MaterialZ = z.infer<typeof materialSchemaZ>
