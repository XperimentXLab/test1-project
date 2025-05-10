import React, { useEffect, useState } from "react"
import { get_user } from "../../auth/endpoints"
import Loading from "../layout/Loading"

interface SpannnProps {
  children: React.ReactNode
  label: string
}

export const Spannn: React.FC<SpannnProps> = ({ children, label }) => {
  return (
    <div className="flex gap-2 text-md">
      <span className="font-bold">{label}: </span>
      <span className="font-mono">{children}
      </span>
    </div>
  )
}


const Profile = () => {

  const [username, setUsername] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [ic, setIc] = useState<string>('')

  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await get_user()
        setUsername(response.username)
        setEmail(response.email)
        setIc(response.ic)
        setLoading(false)
      } catch (error: any) {
        console.error('Error fetching user data:', error)
        if (error.response) {
          console.error('Response data:', error.response.data)
          console.error('Response status:', error.response.status)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="flex flex-col gap-4 p-2 items-center">
      <h1 className="font-bold text-lg">User Profile</h1>

      <article className="grid grid-rows-3 gap-3 py-3 px-5 shadow-2xl shadow-amber-300 rounded-2xl border">

        <Spannn label="USERNAME">{username}</Spannn>

        <Spannn label="EMAIL">{email}</Spannn>

        <Spannn label="I/C">{ic}</Spannn>

      </article>

      { loading ? <Loading /> : <></> }

    </div>
  )
}

export default Profile
