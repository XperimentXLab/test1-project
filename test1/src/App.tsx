import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom"
import MainLayout from "./components/layout/MainLayout"
import Home from "./components/pages/Home"
import Login from "./components/pages/Login"
import Register from "./components/pages/Register"
import Profile from "./components/pages/Profile"
import NotFound from "./components/pages/NotFound"
import Wallet from "./components/pages/Wallet"
import ProtectedRoute from "./auth/ProtectedRoute"
import Others from "./components/pages/Others"

function App() {

  const router = createBrowserRouter(createRoutesFromElements(
    <Route>
      <Route path="/" element={<MainLayout />} >
        <Route index element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute>
          <Profile />
        </ProtectedRoute>} />
        <Route path='wallet' element={<ProtectedRoute>
          <Wallet />
        </ProtectedRoute>} />
        <Route path="others" element={<ProtectedRoute>
          <Others />
        </ProtectedRoute>} />
      </Route>

      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  ))

  return (
    <RouterProvider router={router} />
  )
}

export default App
