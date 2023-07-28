import { User } from './user.type'
import { SuccessResponse } from './utils.type'

export type AuthRespone = SuccessResponse<{
  access_token: string
  expires: string
  user: User
}>
