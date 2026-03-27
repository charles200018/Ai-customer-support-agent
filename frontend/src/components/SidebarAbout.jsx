import React from 'react';

export default function SidebarAbout({ expanded }) {
  if (!expanded) return null;
  return (
    <div data-testid="sidebar-about" style={{ marginTop: 8, marginLeft: 12, maxWidth: 220 }}>
      <div style={{ color: 'var(--gold)', fontSize: 16, fontWeight: 700, marginBottom: 6 }}>AXIOM AI Agent</div>
      <div style={{ color: 'var(--text-primary)', fontSize: 13, marginBottom: 8 }}>
        A luxury customer support AI agent platform. Powered by Vercel, Firestore, and OpenAI/Google LLMs.
      </div>
      <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>
        &copy; 2026 AXIOM. All rights reserved.<br />
        Version 1.0.0
      </div>
    </div>
  );
}