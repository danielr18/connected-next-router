export const PUSH = 'push'
export const REPLACE = 'replace'
export const PREFETCH = 'prefetch'
export const GO = 'go'

export type RouterMethod =
  | typeof PUSH
  | typeof REPLACE
  | typeof PREFETCH
  | typeof GO

export default {
  PUSH,
  REPLACE,
  GO,
  PREFETCH
}
