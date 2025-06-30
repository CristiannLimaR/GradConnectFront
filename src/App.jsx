import './App.css'
import JobsPage from './pages/jobsPage'
import UserProfile from './pages/UserProfile'
import AppliedSavedJobs from './pages/AppliedSavedJobs'
import MensajesDirectos from './pages/MensajesDirectos'
import Login from './pages/Login'
import Register from './pages/Register'
import CandidatoPerfil from './pages/CandidatoPerfil'
import AdminDashboard from './pages/AdminDashboard'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import { Toaster } from "sonner";
import CompanyDashboard from './pages/CompanyDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import UserManagementPage from './pages/UserManagement';
import EditProfileForm from './components/UserProfile/EditProfileForm'; // importa tu formulario

function App() {

  return (
    <Router>
      <Header />
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<JobsPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Rutas protegidas para CANDIDATE */}
        <Route 
          path="/user-profile" 
          element={
            <ProtectedRoute allowedRoles={['CANDIDATE', 'RECRUITER', 'GRADCONNECT']}>
              <UserProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/applied-saved-jobs" 
          element={
            <ProtectedRoute allowedRoles={['CANDIDATE', 'RECRUITER', 'GRADCONNECT']}>
              <AppliedSavedJobs />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/mensajes" 
          element={
            <ProtectedRoute allowedRoles={['CANDIDATE', 'RECRUITER', 'GRADCONNECT']}>
              <MensajesDirectos />
            </ProtectedRoute>
          } 
        />
        
        {/* Rutas protegidas para RECRUITER */}
        <Route 
          path="/empresa-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['RECRUITER']}>
              <CompanyDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/candidato-perfil" 
          element={
            <ProtectedRoute allowedRoles={['RECRUITER']}>
              <CandidatoPerfil />
            </ProtectedRoute>
          } 
        />
        
        {/* Rutas protegidas para GRADCONNECT (Admin) */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['GRADCONNECT']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
        path="/admin/usuarios" 
        element={
          <ProtectedRoute allowedRoles={['GRADCONNECT']}>
            <UserManagementPage />
          </ProtectedRoute>
        } 
      />


      <Route 
        path="/user-profile/edit" 
        element={
          <ProtectedRoute allowedRoles={['CANDIDATE', 'RECRUITER', 'GRADCONNECT']}>
            <EditProfileForm />
          </ProtectedRoute>
        }
      />


      </Routes>
      <Footer />
      <Toaster />
    </Router>
  )
}

export default App
