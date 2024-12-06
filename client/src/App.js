import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' // For React Query
import Home from './Pages/Home'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navigate } from 'react-router-dom'
import Login from './Auth/Login'
import Register from './Auth/Register'
import { check_token } from './Auth/authslice';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react'
import Dashboard from './Pages/Dashboard';
import Product from './Pages/Product';
import Forgetpassword from './Pages/Forgetpassword';
import Updatepassword from './Pages/Updatepassword';
import Addproduct from './Pages/Addproduct';
import Editproduct from './Pages/Editproduct';
import Verifyotp from './Pages/Verifyotp';
import Emailverify from './Pages/Emailverify';


const App = () => {

  const dispatch = useDispatch();
  // Create Query Client For React Query
  const queryClient = new QueryClient()


  //check token avable or not
  function PrivateRoute({ children }) {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    return token !== null && token !== undefined ? (
      children
    ) : (
      <Navigate to="/login" />
    );
  }

  const private_routing = [
    {
      path: '/',
      component: <Home />
    },
    {
      path: '/addproduct',
      component: <Addproduct />
    },
    {
      path: '/dashboard',
      component: <Dashboard />
    },
    {
      path: '/product',
      component: <Product />
    },
    {
      path: '/editproduct/:id',
      component: <Editproduct/>
    },
    {
      path: '/updatepassword',
      component: <Updatepassword />
    }
  ]

  const public_routing = [

    {
      path: '/login',
      component: <Login />
    },
    {
      path: '/register',
      component: <Register />
    },
    {
      path: '/forgetpassword/:id/:token',
      component: <Forgetpassword />
    },
    {
      path: '/verifyotp',
      component: <Verifyotp/>
    },
    {
      path: '/emailverify',
      component: <Emailverify/>
    }

  ]

  // This step is required for to stop page refreshing problem in logout button
  useEffect(() => {
    dispatch(check_token())
  }, [])

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/*Cover with QueryClientProvider*/}
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>

            {/*Area of private routing*/}
            {public_routing?.map((routing) => {
              return (
                <>
                  <Route path={routing?.path} element={routing?.component} />
                </>
              )
            })}


            {/*Area of public routing*/}
            {private_routing?.map((routing) => {
              return (
                <>
                  <Route path={routing?.path} element={<PrivateRoute>{routing?.component}</PrivateRoute>} />
                </>
              )
            })}

          </Routes>
        </Router>
      </QueryClientProvider>
    </>
  )
}

export default App