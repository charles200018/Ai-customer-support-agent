import { useAuth } from '../hooks/useAuthHook';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import React from 'react';
import SidebarDocuments from './SidebarDocuments';
import SidebarSettings from './SidebarSettings';
import InlineUploadPanel from './InlineUploadPanel';
import SidebarChats from './SidebarChats';
import SidebarAccount from './SidebarAccount';
import SidebarAbout from './SidebarAbout';

export default function SidebarMenu({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showDocuments, setShowDocuments] = useState(false);
  const [showChats, setShowChats] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [refreshDocuments, setRefreshDocuments] = useState(0);

  // Responsive: collapse on mobile
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 700 && !collapsed) setCollapsed(true);
      if (window.innerWidth >= 700 && collapsed) setCollapsed(false);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [collapsed]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Sidebar */}
      <aside
        data-testid="sidebar-menu"
        style={{
          width: collapsed ? 64 : 260,
          background: 'var(--bg-glass)',
          borderRight: '1.5px solid var(--gold)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25), 0 1.5px 0 0 var(--gold)',
          backdropFilter: 'blur(18px) saturate(1.2)',
          WebkitBackdropFilter: 'blur(18px) saturate(1.2)',
          transition: 'box-shadow 0.25s, border 0.25s, background 0.25s, width 0.25s',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          alignItems: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? '1rem 0' : '2rem 1.5rem 2rem 2rem',
          minWidth: 0,
        }}
        aria-label="Sidebar navigation"
      >
        {/* Logo */}
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.7rem',
            color: 'var(--gold)',
            letterSpacing: 4,
            marginBottom: 32,
            cursor: 'pointer',
            userSelect: 'none',
            textShadow: '0 2px 12px rgba(255, 215, 0, 0.18)',
            filter: 'drop-shadow(0 0 6px var(--gold))',
            transition: 'filter 0.2s',
          }}
          onClick={() => navigate('/dashboard')}
          tabIndex={0}
          aria-label="Go to dashboard"
          onKeyDown={e => { if (e.key === 'Enter') navigate('/dashboard'); }}
          onFocus={e => e.currentTarget.style.filter = 'drop-shadow(0 0 12px var(--gold))'}
          onBlur={e => e.currentTarget.style.filter = 'drop-shadow(0 0 6px var(--gold))'}
        >
          AXIOM
        </div>
        {/* Menu Items */}
        <nav style={{ width: '100%' }}>
          <MenuItem label="Dashboard" active={location.pathname === '/dashboard'} onClick={() => navigate('/dashboard')} icon="🏠" />
          <MenuItem label="New Chat" dataTestId="sidebar-new-chat" onClick={() => navigate('/chat')} icon="💬" />
          <MenuItem label="Chat History" onClick={() => setShowChats(v => !v)} icon="🕑" expandable expanded={showChats}>
            <SidebarChats expanded={showChats} />
          </MenuItem>
          <MenuItem label="Documents" dataTestId="sidebar-documents" onClick={() => setShowDocuments(v => !v)} icon="📄" expandable expanded={showDocuments}>
            <SidebarDocuments
              expanded={showDocuments}
              onUploadClick={() => setShowUpload(true)}
              refresh={refreshDocuments}
            />
          </MenuItem>
          <MenuItem label="Account" onClick={() => setShowAccount(v => !v)} icon="👤" expandable expanded={showAccount}>
            <SidebarAccount expanded={showAccount} />
          </MenuItem>
          <MenuItem label="About" onClick={() => setShowAbout(v => !v)} icon="ℹ️" expandable expanded={showAbout}>
            <SidebarAbout expanded={showAbout} />
          </MenuItem>
          <MenuItem label="Settings" dataTestId="sidebar-settings" onClick={() => setShowSettings(v => !v)} icon="⚙️" >
            <SidebarSettings expanded={showSettings} />
          </MenuItem>
        </nav>
        {/* User info and logout */}
        <div style={{ marginTop: 'auto', width: '100%', paddingBottom: 16 }}>
          <div style={{ color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: 12 }}>{user?.name}</div>
          <button
            onClick={handleLogout}
            style={{ background: 'transparent', border: '1px solid var(--gold)', color: 'var(--gold)', padding: '8px 20px', cursor: 'pointer', fontSize: '11px', letterSpacing: 2, width: '100%', borderRadius: 8 }}
            aria-label="Logout"
          >LOGOUT</button>
        </div>
      </aside>
      {/* Inline Upload Panel */}
      <InlineUploadPanel
        open={showUpload}
        onClose={() => setShowUpload(false)}
        onUploaded={() => {
          setShowUpload(false);
          setRefreshDocuments(r => r + 1);
        }}
      />
      {/* Main content */}
      <main style={{ flex: 1, marginLeft: collapsed ? 64 : 260, transition: 'var(--transition)', width: '100%' }}>
        {children}
      </main>
    </div>
  );
}

function MenuItem({ label, onClick, active, icon, expandable, expanded, children, dataTestId }) {
  return (
    <div
      data-testid={dataTestId}
      onClick={onClick}
      aria-label={label}
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick?.(); }}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 0',
        cursor: 'pointer',
        fontSize: '1.13rem',
        color: active || expanded ? 'var(--gold)' : 'var(--text-primary)',
        borderLeft: active || expanded ? '3px solid var(--gold)' : '3px solid transparent',
        background: active || expanded ? 'rgba(255,255,255,0.08)' : 'none',
        borderRadius: 'var(--radius)',
        marginBottom: 2,
        fontWeight: active || expanded ? 600 : 400,
        transition: 'background 0.18s, color 0.18s, border 0.18s, box-shadow 0.18s',
        position: 'relative',
        outline: 'none',
        boxShadow: active || expanded ? '0 2px 12px 0 rgba(255,215,0,0.10)' : 'none',
      }}
      onMouseOver={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.13)';
        e.currentTarget.style.boxShadow = '0 2px 16px 0 rgba(255,215,0,0.13)';
      }}
      onMouseOut={e => {
        e.currentTarget.style.background = (active || expanded) ? 'rgba(255,255,255,0.08)' : 'none';
        e.currentTarget.style.boxShadow = (active || expanded) ? '0 2px 12px 0 rgba(255,215,0,0.10)' : 'none';
      }}
      onFocus={e => e.currentTarget.style.boxShadow = '0 0 0 2.5px var(--gold), 0 2px 16px 0 rgba(255,215,0,0.13)'}
      onBlur={e => e.currentTarget.style.boxShadow = (active || expanded) ? '0 2px 12px 0 rgba(255,215,0,0.10)' : 'none'}
    >
      <span style={{ marginRight: 16, fontSize: 20 }}>{icon}</span>
      <span>{label}</span>
      {expandable && (
        <span style={{ marginLeft: 'auto', fontSize: 16, color: expanded ? 'var(--gold)' : 'var(--text-primary)' }}>{expanded ? '▼' : '▶'}</span>
      )}
      {children}
    </div>
  );
}
