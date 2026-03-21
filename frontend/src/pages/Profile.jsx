import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '2rem', border: '1px solid #ddd', borderRadius: 8 }}>
      <h1>User Profile</h1>
      <div style={{ marginBottom: '1rem' }}>
        <strong>Name:</strong> {user?.name || 'N/A'}
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <strong>Email:</strong> {user?.email || 'N/A'}
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <strong>User ID:</strong> {user?.userId || 'N/A'}
      </div>
      {error && <div style={{ color: '#900', marginBottom: '1rem' }}>{error}</div>}
      <button onClick={handleLogout}>Logout</button>
      <button style={{ marginLeft: 16 }} onClick={() => navigate('/dashboard')}>Dashboard</button>
    </div>
  );
}

export default Profile;
