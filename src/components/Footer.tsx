import React from 'react';

export function Footer() {
  return (
    <footer style={{
      background: 'var(--text-primary)',
      color: 'var(--bg-surface-muted)',
      padding: '56px 24px',
      textAlign: 'center',
      fontSize: '0.875rem'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', lineHeight: 1.7 }}>
          © 2026 Faiz Krisnadi. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
