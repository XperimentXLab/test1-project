import React, { useState } from "react"
import { reset_password_request } from "../../auth/endpoints"

const ForgotPassword = () => {

  const [email, setEmail] = useState<string>('')

  const toggleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await reset_password_request(email)
      alert('Password reset request has been sent. Please check your email.')
      setEmail('')
    } catch (error: any) {
      console.error(error)
    }
  }

  return (
    <div className="flex justify-center">
      <span className="font-bold text-xl">Forgot Password</span>
      <form onSubmit={toggleSubmit} className="grid grid-rows-1 items-center gap-2 p-5 shadow-amber-200 rounded-xl">
        <label htmlFor="email">Please fill in.</label>
        <input type="email" placeholder="Enter email" 
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          className="border py-1 px-2 rounded-md" 
        />
        <button type="submit" 
          className="bg-black text-white active:bg-amber-300 active:text-black hover:bg-amber-300 hover:text-black hover:cursor-pointer"
        >Submit</button>
      </form>
    </div>
  )
}

export default ForgotPassword
