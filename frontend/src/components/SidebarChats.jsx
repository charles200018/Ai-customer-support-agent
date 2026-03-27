import React from 'react';

// TODO: Replace with real chat history API integration
const mockChats = [
  { id: '1', title: 'Order #1234', date: '2026-03-25' },
  { id: '2', title: 'Refund Inquiry', date: '2026-03-24' },
  { id: '3', title: 'Product Info', date: '2026-03-22' },
];

export default function SidebarChats({ expanded }) {
  if (!expanded) return null;
  return (
    <div data-testid="sidebar-chats" style={{ marginTop: 8, marginLeft: 12 }}>
      {mockChats.length === 0 ? (
        <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>No chats yet</div>
      ) : (
        mockChats.map(chat => (
          <div key={chat.id} style={{
            display: 'flex', flexDirection: 'column', gap: 2, padding: '6px 0', borderBottom: '1px solid var(--border-glass)', cursor: 'pointer',
          }} aria-label={`Chat: ${chat.title}`}
            tabIndex={0}
            onClick={() => window.location.href = `/chat?chatId=${chat.id}`}
            onKeyDown={e => { if (e.key === 'Enter') window.location.href = `/chat?chatId=${chat.id}`; }}
          >
            <span style={{ color: 'var(--text-primary)', fontSize: 14 }}>{chat.title}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{chat.date}</span>
          </div>
        ))
      )}
    </div>
  );
}