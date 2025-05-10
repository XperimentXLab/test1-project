import React, { useState } from "react"
import { Link, useNavigate } from "react-router"
import { register } from "../../auth/endpoints"


const Register = () => {

  const [username, setUsername] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [ic, setIc] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')

  const [errorMessage, setErrorMessage] = useState<string>('')

  const navigate = useNavigate()
  
  const resetForm = () => {
    setUsername('')
    setEmail('')
    setIc('')
    setPassword('')
    setConfirmPassword('')
    setErrorMessage('')
  }

  const toggleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const validatePassword = (pass: string) => {
      if (pass.length < 8) {
        return setErrorMessage('Password must be at least 8 characters')
      } else if (!/[A-Z]/.test(pass)) {
        return setErrorMessage('Password must contain at least 1 uppercase letter')
      } else if (!/[a-z]/.test(pass)) {
        return setErrorMessage('Password must contain at least 1 lowercase letter')
      } else if (!/[0-9]/.test(pass)) {
        return setErrorMessage('Password must contain at least 1 number')
      } else if (pass !== confirmPassword) {
        return setErrorMessage('Password does not match')
      }
      return null
    }

    const passwordError = validatePassword(password)
    if (passwordError) {
      return passwordError
    }
    try {
      await register({
        username, 
        email, 
        ic, 
        password
      })
      alert('User successfully register')
      resetForm()
      navigate('/login')
    } catch (error: any) {
      console.error(error.message)
      //setErrorMessage('Error registering. Please contact administrator')
      if (error.response && error.response.status === 400) {
        console.error(error.response.data)
        setErrorMessage('User already exist')
      } if (error.request) {
        console.error('No response from server')
      }
    }
  }

  return (
    <div className="flex min-h-screen justify-center">
      <div className="flex flex-col items-center justify-center">
        <h1 className="font-bold text-xl">Register</h1>
        <form className="grid grid-row-3 gap-5 p-5 shadow-xl shadow-amber-600" onSubmit={toggleRegister}>
          <div className="grid grid-row-2 gap-2">
            <span>Username</span>
            <input type="text" placeholder="Enter username"            
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              className="border py-1 px-2 rounded-md" 
            />
          </div>
          <div className="grid grid-row-2 gap-2">
            <span>Email</span>
            <input type="email" placeholder="Enter email" 
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="border py-1 px-2 rounded-md" 
            />
          </div>
          <div className="grid grid-row-2 gap-2">
            <span>I/C</span>
            <input type="text" placeholder="Enter IC" 
              onChange={(e) => setIc(e.target.value)}
              value={ic}
              className="border py-1 px-2 rounded-md" 
            />
          </div>
          <div className="grid grid-row-2 gap-2">            
            <span>Password</span>
            <input type="password" placeholder="Enter password" 
              onChange={(e) => setPassword(e.target.value)}
              value={password}            
              className="border py-1 px-2 rounded-md" 
            />
          </div>
          <div className="grid grid-row-2 gap-2">
            <span>Confirm Password</span>
            <input type="password" placeholder="Confirm password" 
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              className="border py-1 px-2 rounded-md" 
            />
          </div>

          {errorMessage && <span className="text-red-500 text-md">{errorMessage}</span>}

          <button type="submit" className="bg-black text-white hover:bg-amber-300 hover:text-black hover:cursor-pointer py-1 px-2 rounded-lg font-bold">Register</button>      
          
          <span>
            Already have an account? <Link to={'/login'} className="text-blue-400 text-md">Go to Login</Link>
          </span>
        </form>
      </div>
    </div>
  )
}

export default Register
