
import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { login } from "../../auth/endpoints"
import axios from "axios"

const Login = () => {

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const [errorMessage, setErrorMessage] = useState<string>('')

  const navigate = useNavigate()

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setErrorMessage('')
  }

  const toggleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await login({
        email, password
      })
      console.log(`Login successful, cookies should be set.`);
      resetForm()
      navigate('/') // Navigate to home page after successful login
    } catch (error: any) {
      console.error("Login failed :", error)
      if (axios.isAxiosError(error)) {
        console.error("Axios error data:", error.response?.data);
        console.error("Axios error status:", error.response?.status);
        setErrorMessage('Error logging in. Please contact administrator')
      }
      if (error.response && (error.response.status === 401 || error.response.status === 400)) {
          // This is likely an authentication failure (e.g., wrong credentials, bad request for auth)
          console.error("Authentication error response:", error.response.data);
          // Use the backend's detail message if available, otherwise the generic one
          setErrorMessage(error.response.data?.detail || 'Invalid email or password.');
        } else if (error.response) {
          // Other errors from the server (e.g., 500, 403, 404)
          console.error("Server error data:", error.response.data, "Status:", error.response.status);
          setErrorMessage('A server error occurred. Please try again later or contact an administrator.');
        } else {
          // Network errors or other Axios errors where no response was received
          setErrorMessage('Network error. Please check your connection or contact an administrator.');
        }
    } 
  }

  return (
    <div className="flex min-h-screen justify-center">

      <div className="flex flex-col items-center p-4 justify-center gap-5">
        <h1 className="font-bold text-xl">Login Page</h1>

        <form className="grid grid-row-3 gap-5 p-5 shadow-xl shadow-amber-600" onSubmit={toggleLogin}>
          <div className="grid grid-row-2 gap-2">
            <span>Email</span>
            <input type="email" placeholder="Enter email" 
              onChange={(e) => setEmail(e.target.value)}
              value={email}
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

          {errorMessage && <span className="text-red-500 text-md">{errorMessage}</span>}

          <button type="submit" className="bg-black text-white hover:bg-amber-300 hover:text-black hover:cursor-pointer py-2 px-3 rounded-lg font-bold">Login</button>

          <span>
            Don't have an account? <Link to={'/register'} className="text-blue-400 text-md">Click to Register</Link>
          </span>

        </form>


      </div>
    </div>

  )
}

export default Login
