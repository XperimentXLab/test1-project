import React, { useEffect, useState } from "react"
import { get_user } from "../../auth/endpoints"
import Loading from "../props/Loading"
import Spannn from "../props/Textt"

const Profile = () => {

  const [username, setUsername] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [ic, setIc] = useState<string>('')
  const [referralCode, setReferralCode] = useState<string>('')
  const [walletAddress, setWalletAddress] = useState<string | undefined>(undefined)

  const [editWalletAddress, setEditWalletAddress] = useState<string>('')

  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await get_user()
        setUsername(response.username)
        setEmail(response.email)
        setIc(response.ic)
        setReferralCode(response.referral_code)
        setWalletAddress(response.wallet_address)
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

  const toggleWalletAddress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setLoading(true)
      console.log('Wallet Address: ', walletAddress)
    } catch (error: any) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 p-2 items-center">
      <h1 className="font-bold text-lg">User Profile</h1>

      <article className="grid grid-rows-3 gap-3 py-3 px-5 shadow-2xl shadow-amber-300 rounded-2xl border">

        <Spannn label="USERNAME">{username}</Spannn>

        <Spannn label="EMAIL">{email}</Spannn>

        <Spannn label="I/C">{ic}</Spannn>

        <Spannn label="REFERRAL CODE">{referralCode}</Spannn>"

        <Spannn label="WALLET ADDRESS">{walletAddress === undefined ? 'Not set' : walletAddress }</Spannn>
        <form onSubmit={toggleWalletAddress} className="flex gap-1.5">
          <input type="text" placeholder={walletAddress === undefined ? 'Set wallet address' : `Fill in new wallet address`}
          className="border py-1 px-2 rounded-md"
            onChange={e => setEditWalletAddress(e.target.value)}
            value={editWalletAddress}
          />
          <button type="submit" className="bg-black text-white active:bg-amber-300 active:text-black hover:bg-amber-300 hover:text-black hover:cursor-pointer py-1 px-2 rounded-md">Confirm</button>
        </form>

      </article>

      { loading && <Loading /> }

    </div>
  )
}

export default Profile
