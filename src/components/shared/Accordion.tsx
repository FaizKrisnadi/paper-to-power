import React, { useState } from 'react';

interface AccordionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function Accordion({ title, icon, children, defaultOpen = false }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div style={{
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      marginBottom: '12px',
      overflow: 'hidden',
      background: 'var(--bg-surface)'
    }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          background: isOpen ? 'var(--bg-surface-muted)' : 'var(--bg-surface)',
          transition: 'background-color 0.2s',
          textAlign: 'left'
        }}
        aria-expanded={isOpen}
      >
        <span style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          fontWeight: 600,
          color: 'var(--text-primary)'
        }}>
          {icon && <span style={{ color: 'var(--accent)' }}>{icon}</span>}
          {title}
        </span>
        <span style={{
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s',
          color: 'var(--text-tertiary)'
        }}>
          ▼
        </span>
      </button>
      
      {isOpen && (
        <div style={{
          padding: '20px',
          borderTop: '1px solid var(--border)',
          color: 'var(--text-secondary)',
          lineHeight: 1.6
        }}>
          {children}
        </div>
      )}
    </div>
  );
}
