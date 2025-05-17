import React from "react"

type ButtonType = 'submit' | 'reset' | 'button'

interface ButtonProps {
  type: ButtonType
  className?: string
  children: React.ReactNode
  onClick?: () => void
}

const Buttons: React.FC<ButtonProps> = ({
  type, className, children, onClick
}) => {
  return (
    <button type={type} onClick={onClick} className={`bg-black text-white active:bg-amber-300 active:text-black hover:bg-amber-300 hover:text-black hover:cursor-pointer py-1 px-2 rounded-md ${className}`}>{children}</button>
  )
}

export default Buttons
