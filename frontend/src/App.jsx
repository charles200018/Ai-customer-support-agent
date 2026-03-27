import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './components/Login';
import { ErrorBoundary } from './components/ErrorBoundary';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Chat from './pages/Chat';
import Home from './pages/Home';
import AdminPanel from './pages/AdminPanel';
import SidebarMenu from './components/SidebarMenu';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><SidebarMenu><Dashboard /></SidebarMenu></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute><SidebarMenu><Upload /></SidebarMenu></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><SidebarMenu><Chat /></SidebarMenu></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><SidebarMenu><AdminPanel /></SidebarMenu></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default App;

