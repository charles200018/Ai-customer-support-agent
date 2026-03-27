import React, { useState, useEffect } from 'react';

export default function SidebarSettings({ expanded }) {
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('axiom-theme');
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('axiom-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('axiom-notifications', notifications ? '1' : '0');
  }, [notifications]);

  if (!expanded) return null;

  return (
    <div data-testid="sidebar-settings" style={{ marginTop: 8, color: 'var(--text-primary)' }}>
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="theme-toggle" style={{ fontWeight: 600, fontSize: 15 }}>Theme</label>
        <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
          <button
            id="theme-toggle"
            data-testid="theme-toggle"
            aria-label="Dark mode"
            style={{ background: theme === 'dark' ? 'var(--gold)' : 'var(--bg-glass)', color: theme === 'dark' ? '#1a1408' : 'var(--text-primary)', border: '1px solid var(--gold)', borderRadius: 8, padding: '6px 18px', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => setTheme('dark')}
          >Dark</button>
          <button
            aria-label="Light mode"
            style={{ background: theme === 'light' ? 'var(--gold)' : 'var(--bg-glass)', color: theme === 'light' ? '#1a1408' : 'var(--text-primary)', border: '1px solid var(--gold)', borderRadius: 8, padding: '6px 18px', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => setTheme('light')}
          >Light</button>
        </div>
      </div>
      <div>
        <label htmlFor="notif-toggle" style={{ fontWeight: 600, fontSize: 15 }}>Notifications</label>
        <div style={{ marginTop: 6 }}>
          <input
            id="notif-toggle"
            type="checkbox"
            checked={notifications}
            onChange={e => setNotifications(e.target.checked)}
            style={{ marginRight: 8 }}
            aria-label="Notification preferences"
          />
          <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>Enable notifications (UI only)</span>
        </div>
      </div>
    </div>
  );
}
