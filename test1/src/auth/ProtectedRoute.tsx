import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { get_user } from './endpoints';
import axios from 'axios';
import Loading from '../components/props/Loading';


interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null = checking, false = not auth, true = auth

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await get_user()
        if (res) {
          setIsAuthenticated(true);
        }
      } catch (error: any) {
        // If get_user fails (likely 401), cookies are invalid or missing.
        console.error('Authentication check failed:', error.response?.data || error.message);
        if (axios.isAxiosError(error)) {
          console.error("Axios error data:", error.response?.data);
          console.error("Axios error status:", error.response?.status);
        }
        setIsAuthenticated(false);
        navigate('/login', { replace: true }); // Redirect to login
      }
    };
    checkAuth();
    //setIsAuthenticated(true)
  }, []);

  // Render loading state while checking, null if not authenticated (will redirect), or children if authenticated
  if (isAuthenticated === null) {
    return <Loading />
  }

  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;