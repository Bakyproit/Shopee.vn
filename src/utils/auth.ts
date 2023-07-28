import { User } from 'src/types/user.type'

export const setAccessTokenToLS = (access_Token: string) => {
  localStorage.setItem('access_token', access_Token)
}

export const clearLS = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('profile')
}

export const getAccessTokenToLS = () => localStorage.getItem('access_token') || ''

export const getProfileFromLS = () => {
  const result = localStorage.getItem('profile')
  return result ? JSON.parse(result) : null
}

export const setProfileToLS = (profile: User) => {
  localStorage.setItem('profile', JSON.stringify(profile))
}
