import { useEffect, useState } from "react"
import Loading from "../layout/Loading"


const Wallet = () => {

  
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    try {
      setLoading(true)
    } catch (error: any) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <div className="flex flex-col gap-4 items-center mt-4">
      <h1 className="font-bold text-lg">Wallet</h1>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col border-gray-500 border py-4 px-6 rounded-xl">
          <span className="font-bold">Register Point</span>
          <span>0</span>
        </div>

        <div className="flex flex-col border-gray-500 border py-4 px-6 rounded-xl">
          <span className="font-bold">Profit Point</span>
          <span>0</span>
        </div>

        <div className="flex flex-col border-gray-500 border py-4 px-6 rounded-xl">
          <span className="font-bold">Comission Point</span>
          <span>0</span>
        </div>
      </div>
      
      {loading && <Loading />}

    </div>
  )
}

export default Wallet
