import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
const App = lazy(() => import('./App.tsx'))
import Layout from './Layout.tsx'
import { Provider } from 'react-redux'
import store from './store/store.ts'
const AuthLayout = lazy(() => import('./components/AuthLayout.tsx'))
const Working = lazy(() => import('./pages/Working.tsx'))
const Gameplay = lazy(() => import('./pages/Gameplay.tsx'))
const Signup = lazy(() => import('./pages/Signup.tsx'))
const Login = lazy(() => import('./pages/Login.tsx'))
const Profile = lazy(() => import('./pages/Profile.tsx'))
import { ToastContainer, Slide } from 'react-toastify'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Suspense fallback={<div>Loading.....</div>}/>
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
