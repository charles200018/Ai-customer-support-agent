import React from 'react';
import { useAuth } from '../hooks/useAuthHook';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', testId: 'sidebar-nav-dashboard' },
    { label: 'New Chat', path: '/chat', testId: 'sidebar-nav-new-chat' },
    { label: 'Chat History', path: '/chat-history', testId: 'sidebar-nav-chat-history' },
    { label: 'Documents', path: '/documents', testId: 'sidebar-nav-documents' },
    { label: 'Account', path: '/account', testId: 'sidebar-nav-account' },
    { label: 'About', path: '/about', testId: 'sidebar-nav-about' },
    { label: 'Settings', path: '/settings', testId: 'sidebar-nav-settings' },
  ];

  return (
    <>
      <aside
        data-testid="sidebar"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          height: '100vh',
          width: 'var(--sidebar-width)',
          background: 'var(--sidebar-bg)',
          borderRight: '1px solid var(--sidebar-border)',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: 32,
          zIndex: 100,
        }}
        aria-label="Sidebar navigation"
      >
        {/* Logo */}
        <div
          style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 28,
            color: 'var(--gold-pure)',
            letterSpacing: 6,
            fontWeight: 400,
            marginLeft: 32,
            marginBottom: 28,
            cursor: 'pointer',
            userSelect: 'none',
          }}
          onClick={() => navigate('/dashboard')}
          tabIndex={0}
          aria-label="Go to dashboard"
          data-testid="sidebar-logo"
        >
          AXIOM
        </div>
        <div style={{ height: 1, background: 'var(--border-subtle)', margin: '0 0 12px 0' }} />
        {/* Nav Items */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {navItems.map(item => (
          <button
            key={item.path}
            data-testid={item.testId}
            aria-label={item.label}
            onClick={() => navigate(item.path)}
            className={
              location.pathname === item.path ? 'nav-item active' : 'nav-item'
            }
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '11px 20px 11px 24px',
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              fontWeight: 400,
              letterSpacing: '0.02em',
              color:
                location.pathname === item.path
                  ? 'var(--text-primary)'
                  : 'var(--text-secondary)',
              textDecoration: 'none',
              borderLeft: location.pathname === item.path
                ? '2px solid var(--gold-pure)'
                : '2px solid transparent',
              background:
                location.pathname === item.path
                  ? 'var(--gold-whisper)'
                  : 'transparent',
              borderTop: 'none',
              borderRight: 'none',
              borderBottom: 'none',
              width: '100%',
              textAlign: 'left',
              transition:
                'color var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out), background var(--duration-fast) var(--ease-out)',
              cursor: 'pointer',
              outline: 'none',
            }}
            onMouseOver={e => {
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.background = 'var(--bg-hover)';
              e.currentTarget.style.borderLeftColor = 'var(--gold-muted)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.color =
                location.pathname === item.path
                  ? 'var(--gold-bright)'
                  : 'var(--text-secondary)';
              e.currentTarget.style.background =
                location.pathname === item.path
                  ? 'var(--gold-whisper)'
                  : 'transparent';
              e.currentTarget.style.borderLeftColor =
                location.pathname === item.path
                  ? 'var(--gold-pure)'
                  : 'transparent';
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <div style={{ height: 1, background: 'var(--border-subtle)', margin: '16px 0' }} />
      {/* User info and logout */}
      <div style={{ margin: '0 0 0 24px' }}>
        <div
          data-testid="sidebar-user-name"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            color: 'var(--text-secondary)',
            marginBottom: 2,
            wordBreak: 'break-all',
          }}
        >
          {user?.name}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            color: 'var(--text-tertiary)',
            marginBottom: 10,
            wordBreak: 'break-all',
          }}
        >
          {user?.email}
        </div>
      </div>
      <button
        data-testid="sidebar-logout"
        aria-label="Logout"
        onClick={logout}
        className="logout-btn"
        style={{
          display: 'block',
          width: 'calc(100% - 32px)',
          margin: '0 16px 24px',
          padding: '9px 16px',
          fontFamily: 'var(--font-body)',
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--text-tertiary)',
          background: 'transparent',
          border: '1px solid var(--border-subtle)',
          borderRadius: 4,
          cursor: 'pointer',
          transition: 'color var(--duration-fast), border-color var(--duration-fast)',
        }}
        onMouseOver={e => {
          e.currentTarget.style.color = 'var(--text-secondary)';
          e.currentTarget.style.borderColor = 'var(--border-gold)';
        }}
        onMouseOut={e => {
          e.currentTarget.style.color = 'var(--text-tertiary)';
          e.currentTarget.style.borderColor = 'var(--border-subtle)';
        }}
      >
        LOGOUT
      </button>
      </aside>
      <main
        style={{
          marginLeft: 'var(--sidebar-width)',
          minHeight: '100vh',
          background: 'var(--bg-base)',
          color: 'var(--text-primary)',
          transition: 'margin-left 0.2s',
        }}
        data-testid="main-content"
      >
        {children}
      </main>
    </>
  );
}
