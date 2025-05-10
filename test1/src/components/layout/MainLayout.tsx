import React, { useState } from "react"
import { Link, Outlet, useNavigate } from "react-router"
import { GiHamburgerMenu } from "react-icons/gi";
import { logout } from "../../auth/endpoints";
import axios from "axios";

interface NavLinkssProps {
  children: React.ReactNode
  to: string
  className?: string
}

export const NavLinkss: React.FC<NavLinkssProps> = ({
  to, className, children
}) => {
  return (
    <Link to={to} className={`hover:bg-amber-600 py-1 px-3 rounded-lg ${className}`}>{children}</Link>
  )
}

const MainLayout = () => {

  const navigate = useNavigate()
  const [open, setOpen] = useState<boolean>(false)
  const toggleOpen = () => {
    return setOpen(!open)
  }

  const toggleLogout = async () => {
    try {
      await logout()
      alert('Logout successfully')
      navigate('/login')
    } catch (error: any) {
      console.error('Logout failed: ', error.message)
      if (axios.isAxiosError(error)) {
        console.error("Axios error data:", error.response?.data);
        console.error("Axios error status:", error.response?.status);
     }
    }
  }


  return (
    <div className="flex flex-col">

      <div>
        <header className="flex justify-between items-center py-2 px-3 bg-amber-300">
          <GiHamburgerMenu className="cursor-pointer" onClick={toggleOpen}/>
          <h1 className="cursor-default">Test1 - Project</h1>
          <button onClick={toggleLogout}
            className="cursor-pointer hover:bg-amber-600 py-1 px-3 rounded-lg"
          >Logout</button>      
        </header>
      </div>

      <div className="flex relative">
        {open && 
        <nav className="absolute flex flex-col w-fit h-fit gap-1 items-center bg-amber-500 px-1 py-3">
          <NavLinkss to={'/'} >Home</NavLinkss>
          <NavLinkss to={'/profile'} >Profile</NavLinkss>
          <NavLinkss to={'/wallet'}>Wallet</NavLinkss>
        </nav>
        }
      </div>

      <Outlet />

      <footer className="fixed flex bottom-0 p-1 bg-white">
        <h1>Footer copyright</h1>
      </footer>

    </div>
  )
}

export default MainLayout
