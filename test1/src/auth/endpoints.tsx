import api from "./api"


interface LoginDataRes {
  username: string
  password: string
}

interface RegisterDataRes {
  username: string
  email: string
  ic: string
  password: string
}

interface PasswordResetConfirmDataRes {
  uidb64?: string
  token?: string
  password: string;
  password2: string;
}


export const reset_password_request = async (email: string) => {
  const response = await api.post('/password_reset/', email)
  return response.data
}

export const reset_password_confirm = async (DataConfirm: PasswordResetConfirmDataRes) => {
  const { uidb64, token, password, password2 } = DataConfirm
  const response = await api.post(`/password_reset_confirm/${uidb64}/${token}/`, {
    password, password2
  })
  return response.data
}

export const login = async (loginData: LoginDataRes) => {
  const { username, password } = loginData
  const response = await api.post('/login/', {
    username, password
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