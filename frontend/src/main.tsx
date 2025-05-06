import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import App from './App.tsx'
import Layout from './Layout.tsx'
import { Provider } from 'react-redux'
import store from './store/store.ts'
import AuthLayout from './components/AuthLayout.tsx'
import Working from './pages/Working.tsx'
import Gameplay from './pages/Gameplay.tsx'
import Signup from './pages/Signup.tsx'
import Login from './pages/Login.tsx'
import Profile from './pages/Profile.tsx'
import { ToastContainer, Slide } from 'react-toastify'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>

      <Route path="/" element={<Layout />} >
        <Route index element={<App />} />
        <Route path='how-it-works' element={<Working />} />
        <Route path='profile/:id' element={<AuthLayout authentication={true}>
          {" "}
          <Profile />
        </AuthLayout>} />
        
        <Route path='/gameplay' element={<AuthLayout authentication={true}>
          {" "}
          <Gameplay />
        </AuthLayout>} />

        <Route path='sign-up' element={<AuthLayout authentication={false}>
          {" "}
          <Signup />
        </AuthLayout>} />

        <Route path='login' element={<AuthLayout authentication={false}>
          {" "}
          <Login />
        </AuthLayout>} />

      </Route>

    </Route>
  )
)


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      <ToastContainer
        hideProgressBar
        position='top-center'
        autoClose={3000}
        pauseOnHover={false}
        transition={Slide}
        theme='dark' />
    </Provider>
  </StrictMode>,
)
