import api from "./api"


interface LoginDataRes {
  email: string
  password: string
}

interface RegisterDataRes {
  username: string
  email: string
  ic: string
  password: string
}

export const login = async (loginData: LoginDataRes) => {
  const { email, password } = loginData
  const response = await api.post('/login/', {
    email, password
  })
  return response.data
}

export const logout = async () => {
  const response = await api.post('/logout/')
  return response.data
}

export const register = async (registerData: RegisterDataRes) => {
  const { username, email, ic, password } = registerData
  const response = await api.post('/register/', {
    username, email, ic, password
  })
  return response.data
}

export const get_user = async () => {
  const response = await api.get('/get_user/')
  return response.data
}