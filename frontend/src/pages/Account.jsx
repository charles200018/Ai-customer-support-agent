import React from 'react';
import { useAuth } from '../hooks/useAuthHook';

export default function Account() {
  const { user } = useAuth();
  const joinDate = user?.created_at ? new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '';
  return (
    <div className="axiom-page" data-testid="account-page" style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ maxWidth: 900, width: '100%', margin: '0 auto', padding: '2.5rem 1.5rem 0' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 52, color: 'var(--gold-pure)', fontWeight: 400, letterSpacing: 2, marginBottom: 18, marginTop: 0 }}>Account</h1>
        <div style={{ height: 1, background: 'var(--border-subtle)', margin: '0 0 32px 0' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginBottom: 32 }}>
          {/* Left column — Profile */}
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--text-tertiary)', marginBottom: 6, textTransform: 'uppercase' }}>Name</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--text-primary)', marginBottom: 18 }}>{user?.name || ''}</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--text-tertiary)', marginBottom: 6, textTransform: 'uppercase' }}>Email</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--text-primary)', marginBottom: 18 }}>{user?.email || ''}</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--text-tertiary)', marginBottom: 6, textTransform: 'uppercase' }}>User ID</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 15, color: 'var(--text-primary)', marginBottom: 18 }}>{user?.id || ''}</div>
          </div>
          {/* Right column — Membership */}
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--text-tertiary)', marginBottom: 6, textTransform: 'uppercase' }}>Member Since</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--text-primary)', marginBottom: 18 }}>{joinDate}</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--text-tertiary)', marginBottom: 6, textTransform: 'uppercase' }}>Plan</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--text-primary)', marginBottom: 18 }}>{user?.plan || 'Standard'}</div>
          </div>
        </div>
        <div style={{ height: 1, background: 'var(--border-subtle)', margin: '0 0 24px 0' }} />
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, letterSpacing: '0.12em', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 8 }}>Danger Zone</div>
        {/* Delete Account only if feature exists in backend */}
        {/* <button style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} onClick={handleDelete}>Delete Account</button> */}
      </div>
    </div>
  );
}
