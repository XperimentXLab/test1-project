import { useEffect, useState } from "react"
import Loading from "../props/Loading"
import { get_user } from "../../auth/endpoints"
import Buttons from "../props/Buttons"
import Spannn from "../props/Textt"


const Wallet = () => {

  const [loading, setLoading] = useState<boolean>(true)

  const [registerAmount, setRegisterAmount] = useState<number>(0)
  const [profitAmount, setProfitAmount] = useState<number>(0)
  const [comissionAmount, setComissionAmount] = useState<number>(0)
  const [usernameTo, setUsernameTo] = useState<string>('')

  const [walletAddress, setWalletAddress] = useState<string | undefined>(undefined)
  const [registerPoint, setRegisterPoint] = useState<number>(0)
  const [profitPoint, setProfitPoint] = useState<number>(0)
  const [comissionPoint, setComissionPoint] = useState<number>(0)


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await get_user()
        setWalletAddress(response.wallet_address)
        setRegisterPoint(0)
        setProfitPoint(0)
        setComissionPoint(0)
        setLoading(true)
      } catch (error: any) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
}, [])

  return (
    <div className="flex flex-col gap-4 items-center mt-4">
      <h1 className="font-bold text-lg">Wallet</h1>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col border-gray-500 border py-4 px-6 rounded-xl">
          <Spannn label="Register Point">{registerPoint}</Spannn>
          <form className="grid grid-cols-1 gap-1.5">
            <input placeholder="Enter register point amount" 
              className="border py-1 px-2 rounded-md"
              onChange={e => setRegisterAmount(Number(e.target.value))}
              value={registerAmount}
            />
            <input type="text" placeholder="Enter username" 
              className="border py-1 px-2 rounded-md"
              onChange={e => setUsernameTo(e.target.value)}
              value={usernameTo}
            />
            <Buttons type="submit">Transfer</Buttons>
          </form>

        </div>

        <div className="flex flex-col border-gray-500 border py-4 px-6 rounded-xl">
          <Spannn label="Profit Point">{profitPoint}</Spannn>
          <Spannn label="Wallet Address">{walletAddress === undefined ? 'Not set' : walletAddress}</Spannn>
          <form className="flex gap-1.5">
            <input placeholder="Enter profit point amount" 
              className="border py-1 px-2 rounded-md"
              onChange={e => setProfitAmount(Number(e.target.value))}
              value={profitAmount}
            />
            <Buttons type="submit">Withdraw</Buttons>
          </form>
        </div>

        <div className="flex flex-col border-gray-500 border py-4 px-6 rounded-xl">
          <Spannn label="COMISSION POINT">{comissionPoint}</Spannn>
          <Spannn label="Wallet Address">{walletAddress === undefined ? 'Not set' : walletAddress}</Spannn>
          <form className="flex gap-1.5">
            <input placeholder="Enter comission point amount" 
              className="border py-1 px-2 rounded-md"
              onChange={e => setComissionAmount(Number(e.target.value))}
              value={comissionAmount}
            />
            <Buttons type="submit">Withdraw</Buttons>
          </form>
        </div>
      </div>
      
      {loading && <Loading />}

    </div>
  )
}

export default Wallet
