import React, { useState, useEffect } from 'react';

export default function Settings() {
  const [theme, setTheme] = useState(() => localStorage.getItem('axiom-theme') || 'dark');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('axiom-theme', theme);
  }, [theme]);
  return (
    <div className="axiom-page" data-testid="settings-page" style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ maxWidth: 900, width: '100%', margin: '0 auto', padding: '2.5rem 1.5rem 0' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 52, color: 'var(--gold-pure)', fontWeight: 400, letterSpacing: 2, marginBottom: 18, marginTop: 0 }}>Settings</h1>
        <div style={{ height: 1, background: 'var(--border-subtle)', margin: '0 0 32px 0' }} />
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 12 }}>Appearance</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 32 }}>
          <button
            className={theme === 'dark' ? 'theme-option active' : 'theme-option'}
            data-testid="theme-toggle-dark"
            aria-label="Dark theme"
            style={{
              padding: '7px 20px',
              border: '1px solid var(--border-subtle)',
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              color: theme === 'dark' ? 'var(--gold-bright)' : 'var(--text-secondary)',
              background: theme === 'dark' ? 'var(--gold-whisper)' : 'transparent',
              cursor: 'pointer',
              borderRadius: '4px 0 0 4px',
              borderRight: 'none',
              transition: 'all var(--duration-fast)',
            }}
            onClick={() => setTheme('dark')}
          >Dark</button>
          <button
            className={theme === 'light' ? 'theme-option active' : 'theme-option'}
            data-testid="theme-toggle-light"
            aria-label="Light theme"
            style={{
              padding: '7px 20px',
              border: '1px solid var(--border-subtle)',
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              color: theme === 'light' ? 'var(--gold-bright)' : 'var(--text-secondary)',
              background: theme === 'light' ? 'var(--gold-whisper)' : 'transparent',
              cursor: 'pointer',
              borderRadius: '0 4px 4px 0',
              borderLeft: 'none',
              transition: 'all var(--duration-fast)',
            }}
            onClick={() => setTheme('light')}
          >Light</button>
        </div>
        {/* Add more settings rows here as needed */}
      </div>
    </div>
  );
}
