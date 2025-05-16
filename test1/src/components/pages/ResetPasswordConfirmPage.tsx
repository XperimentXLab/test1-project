import { useState } from "react"
import { reset_password_confirm } from "../../auth/endpoints"
import { useNavigate } from "react-router"

const ResetPasswordConfirmPage = () => {

  const navigate = useNavigate()

  const [password, setPassword] = useState<string>('')
  const [password2, setPassword2] = useState<string>('')

  const toggleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await reset_password_confirm ({
        password, password2
      })
      alert('Password reset successfully')
      setPassword('')
      setPassword2('')
      navigate('/login')
    } catch (error: any) {
      console.error(error)
    }
  }

  return (
    <div>
      <span>Reset Passsword Page</span>
      <form onSubmit={toggleSubmit}>
        <label>Please fill in</label>
        <input type="password" placeholder="Enter password"
          onChange={e => setPassword(e.target.value)}
          value={password}
        />
        <input type="password" placeholder="Confirm password" 
          onChange={e => setPassword2(e.target.value)}
          value={password2}
        />
        <button type="submit" className="bg-black text-white active:bg-black active:text-white hover:bg-black hover:text-white
         hover:cursor-pointer">Submit</button>
        <br />
        navigate to login
      </form>
    </div>
  )
}

export default ResetPasswordConfirmPage
