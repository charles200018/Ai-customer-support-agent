import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function AdminPanel() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Simulate fetching admin stats
    async function fetchStats() {
      try {
        // Replace with real API call in production
        setStats({
          users: 42,
          documents: 123,
          chats: 456,
        });
      } catch (err) {
        setError('Failed to load admin stats');
      }
    }
    fetchStats();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', padding: '2rem', border: '1px solid #ddd', borderRadius: 8 }}>
      <h1>Admin Panel</h1>
      {error && <div style={{ color: '#900', marginBottom: '1rem' }}>{error}</div>}
      {stats ? (
        <div>
          <div><strong>Total Users:</strong> {stats.users}</div>
          <div><strong>Total Documents:</strong> {stats.documents}</div>
          <div><strong>Total Chats:</strong> {stats.chats}</div>
        </div>
      ) : (
        <div>Loading stats...</div>
      )}
      <button style={{ marginTop: 24 }} onClick={handleLogout}>Logout</button>
      <button style={{ marginLeft: 16 }} onClick={() => navigate('/dashboard')}>Dashboard</button>
    </div>
  );
}

export default AdminPanel;
