import React from 'react';

// TODO: Replace with real user data integration
const mockUser = {
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  role: 'Admin',
  joined: '2025-11-10',
};

export default function SidebarAccount({ expanded }) {
  if (!expanded) return null;
  return (
    <div data-testid="sidebar-account" style={{ marginTop: 8, marginLeft: 12 }}>
      <div style={{ color: 'var(--text-primary)', fontSize: 15, fontWeight: 600 }}>{mockUser.name}</div>
      <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>{mockUser.email}</div>
      <div style={{ color: 'var(--text-primary)', fontSize: 13, marginTop: 8 }}>Role: <span style={{ color: 'var(--gold)' }}>{mockUser.role}</span></div>
      <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>Joined: {mockUser.joined}</div>
    </div>
  );
}