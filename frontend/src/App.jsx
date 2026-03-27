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
import Account from './pages/Account';
import About from './pages/About';
import Settings from './pages/Settings';
import Documents from './pages/Documents';
import ChatHistory from './pages/ChatHistory';
import Sidebar from './components/Sidebar';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Sidebar><Dashboard /></Sidebar></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute><Sidebar><Upload /></Sidebar></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Sidebar><Chat /></Sidebar></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><Sidebar><AdminPanel /></Sidebar></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute><Sidebar><Account /></Sidebar></ProtectedRoute>} />
          <Route path="/about" element={<ProtectedRoute><Sidebar><About /></Sidebar></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Sidebar><Settings /></Sidebar></ProtectedRoute>} />
          <Route path="/documents" element={<ProtectedRoute><Sidebar><Documents /></Sidebar></ProtectedRoute>} />
          <Route path="/chat-history" element={<ProtectedRoute><Sidebar><ChatHistory /></Sidebar></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default App;

