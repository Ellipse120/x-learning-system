export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randomFrom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]!
}

export function formatText<T extends Record<string, string>>(
  list: T[],
  value: string,
  keyAlias = 'value',
  valueAlias = 'label'
) {
  if (['', undefined, 'undefined', null, 'null'].includes(value)) {
    return ''
  }
  if (list === null || !Array.isArray(list)) {
    return ''
  }
  const target = list.find(item => item[keyAlias] === value)
  return target ? target[valueAlias] : value
}
