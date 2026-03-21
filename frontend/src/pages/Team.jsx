import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Team() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  // Placeholder for team/org management UI
  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', padding: '2rem', border: '1px solid #ddd', borderRadius: 8 }}>
      <h1>Team / Organization</h1>
      <div style={{ marginBottom: '1rem' }}>
        <strong>Feature coming soon:</strong> Multi-user team/org support.
      </div>
      {error && <div style={{ color: '#900', marginBottom: '1rem' }}>{error}</div>}
      <button onClick={() => navigate('/dashboard')}>Dashboard</button>
    </div>
  );
}

export default Team;
