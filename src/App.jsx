import { Route, Routes } from 'react-router-dom'
import './App.css'
import CreatorSignup from './pages/SigninPage'
import MainLayout from './components/MainLayout'
import StatPage from './pages/StatPage'
import SettingsPage from './pages/SettingsPage'
import AdminSignIn from './pages/admin/SigninPage'
import MyContentsPage from './pages/ContentPage'
import AdminLayout from './components/admin/AdminLayout'

function App() {

  return (
    <Routes>
      <Route path='/'>

        <Route path='/home' element={<MainLayout />}>
          <Route element={<StatPage />} index />
          <Route path='settings' element={<SettingsPage />} />
          <Route path='contents' element={<MyContentsPage />} />
        </Route>
        <Route path='/register' element={<CreatorSignup />} />

        <Route path="admin" element={<AdminLayout />}>

        </Route>
        <Route path="admin/signin" element={<AdminSignIn />} />
      </Route>
    </Routes>
  )
}

export default App
