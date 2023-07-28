export interface ErrorRespone<Data> {
  message: string
  data?: Data
}

export interface SuccessResponse<Data> {
  message: string
  data: Data
}

// loai bo underfine
export type NoUnderfineField<T> = {
  [P in keyof T]-?: NoUnderfineField<NonNullable<T[P]>>
}

export type Require<T, K extends keyof T> = T & {
  [P in K]-?: T[P]
}
