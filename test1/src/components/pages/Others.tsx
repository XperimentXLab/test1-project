import React, { useState } from "react"
import Loading from "../props/Loading"
import Buttons from "../props/Buttons"


interface CalculatorProps {
  label: string
  placeholder?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  value: number
}

const ValueCalculator: React.FC<CalculatorProps> = ({
  label, onChange, value, placeholder
}) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <label className="font-bold">{label}</label>
      <input type="number" placeholder={placeholder}
        onChange={onChange} 
        value={value} 
        className="border p-2 rounded-md"
      />
    </div>
  )
}

const Others = () => {

  const [investAmount, setInvestAmount] = useState(0)
  const [profitRate, setProfitRate] = useState(0)
  const [totalProfit, setTotalProfit] = useState(0)

  const [loading, setLoading] = useState<boolean>(false)

  const resetForm = () => {
    setInvestAmount(0)
    setProfitRate(0)
    setTotalProfit(0)
  }

  const toggleCalculate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (investAmount && profitRate) {
      setLoading(true)
      const total = investAmount*profitRate*0.5
      setTotalProfit(total)
    } else if (investAmount || profitRate) {
      alert('Please fill in all fields.')
      resetForm()
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col justify-center gap-3 p-3 items-center">

      <h1 className="font-bold text-xl">Others</h1>

      <div className="flex flex-col gap-3 justify-center items-center p-3 border rounded-xl">
        <span className="font-bold text-md items-start">Calculator</span>

        <form className="grid grid-rows-1 gap-2" onSubmit={toggleCalculate}>
          <ValueCalculator label="Invest Amount" 
            placeholder="Enter amount"
            onChange={(e) => {
              setInvestAmount(Number(e.target.value))
            }}
            value={investAmount}
          />
          <ValueCalculator label="Profit Rate" 
            placeholder="Enter rate"
            onChange={(e) => {
              setProfitRate(Number(e.target.value))
            }}
            value={profitRate}
          />
          <Buttons type="submit">Calculate</Buttons>
          <Buttons type="reset" onClick={resetForm}>Reset</Buttons>

          <h1 className="border p-2 rounded-md">Profit Sharing: 0.5</h1>
          <h1 className="border p-2 rounded-md">Total Profit: {totalProfit}</h1>

        </form>
      </div>

      <div className="grid grid-rows-2 gap-1 rounded-xl p-3">
        <span className="font-bold text-md">Inbox</span>
      </div>

      {loading && <Loading />}

    </div>
  )
}

export default Others
