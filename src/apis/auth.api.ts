import { AuthRespone } from 'src/types/auth.type'
import http from 'src/utils/http'

const authApi = {
  registerAccount: (body: { email: string; password: string }) => http.post<AuthRespone>('/register', body),
  login: (body: { email: string; password: string }) => http.post<AuthRespone>('/login', body),
  logout: () => http.post('/logout')
}

export default authApi
