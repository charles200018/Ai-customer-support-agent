
function AdminPanel() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Role check: only allow Admins
  if (user && user.role !== 'Admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="axiom-page" data-testid="admin-panel-page" style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ maxWidth: 900, width: '100%', margin: '0 auto', padding: '2.5rem 1.5rem 0' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', color: 'var(--gold)', fontWeight: 400, letterSpacing: 2, marginBottom: 18, marginTop: 0 }}>Admin Panel</h1>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 18, color: 'var(--text-primary)', marginBottom: 32 }}>
          Welcome, <span style={{ color: 'var(--gold)', fontWeight: 500 }}>{user?.name || 'Admin'}</span> (<span style={{ color: 'var(--text-secondary)' }}>{user?.email}</span>)
        </div>
        <div style={{ display: 'flex', gap: 18 }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{ background: 'var(--gold)', color: '#1a1408', border: 'none', padding: '10px 28px', borderRadius: 8, fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '1rem', letterSpacing: 2, cursor: 'pointer', transition: 'background 0.2s', boxShadow: '0 2px 16px 0 rgba(201,168,76,0.08)' }}
            data-testid="admin-dashboard-link"
          >
            Go to Dashboard
          </button>
          <button
            onClick={handleLogout}
            style={{ background: 'transparent', border: '1.5px solid var(--gold)', color: 'var(--gold)', padding: '10px 28px', borderRadius: 8, fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '1rem', letterSpacing: 2, cursor: 'pointer', transition: 'background 0.2s', boxShadow: '0 2px 16px 0 rgba(201,168,76,0.08)' }}
            data-testid="admin-logout-btn"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
