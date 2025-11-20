import { z } from 'zod'
import { zhCN } from 'zod/locales'
import { CalendarDate } from '@internationalized/date'

z.config(zhCN())

enum roleEnum {
  teacher = 4,
  assistant = 2,
  student = 8,
  admin = 1
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
  password: z.string().trim().optional()
})

export const materialSchema = z.object({
  id: z.string().optional(),
  type: z.enum(meterialTypeEnum),
  content: z.string().min(1, '必填'),
  translation: z.string().min(1, '必填'),
  difficulty: z.enum(difficultyLevelEnum)
})

export const learningPlanSchema = z.object({
  id: z.string().optional(),
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
  username: z.string().trim(),
  email: z.string('无效的邮箱地址').trim().optional(), // !fix
  password: z.string().min(8, '密码至少8个字符').trim(),
  role: z.enum(roleEnum).optional()
})
