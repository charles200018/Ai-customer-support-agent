import React from 'react';

export default function About() {
  return (
    <div className="axiom-page" data-testid="about-page" style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ maxWidth: 900, width: '100%', margin: '0 auto', padding: '2.5rem 1.5rem 0' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 52, color: 'var(--gold-pure)', fontWeight: 400, letterSpacing: 2, marginBottom: 18, marginTop: 0 }}>About AXIOM</h1>
        <div style={{ height: 1, background: 'var(--border-subtle)', margin: '0 0 32px 0' }} />
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: 640, marginBottom: 40 }}>
          AXIOM is an AI-powered customer support platform that lets your team upload documents and instantly answer questions from a private knowledge base.
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 12 }}>How it works</div>
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 10 }}>
            <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 18, color: 'var(--gold-muted)', minWidth: 32 }}>01</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-secondary)' }}>Upload your documents — PDFs and text files become your knowledge base.</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 10 }}>
            <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 18, color: 'var(--gold-muted)', minWidth: 32 }}>02</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-secondary)' }}>Ask questions — The AI reads your documents and answers instantly.</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 10 }}>
            <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 18, color: 'var(--gold-muted)', minWidth: 32 }}>03</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-secondary)' }}>Manage and grow — Add, remove, and organise your document library.</span>
          </div>
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 8 }}>Version</div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: 'var(--text-secondary)' }}>{typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'unknown'}</div>
      </div>
    </div>
  );
}
