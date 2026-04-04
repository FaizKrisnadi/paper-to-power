import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeader({ 
  title, 
  subtitle, 
  eyebrow, 
  align = 'left',
  className = '' 
}: SectionHeaderProps) {
  return (
    <div 
      className={`section-header ${className}`} 
      style={{ 
        textAlign: align,
        marginBottom: '48px',
        maxWidth: align === 'center' ? '820px' : '720px',
        marginInline: align === 'center' ? 'auto' : '0'
      }}
    >
      {eyebrow && (
        <div className="section-label" style={{ marginBottom: '14px', justifyContent: align === 'center' ? 'center' : 'flex-start' }}>
          {eyebrow}
        </div>
      )}
      
      <h2 className="section-title" style={{ marginBottom: subtitle ? '18px' : '0' }}>
        {title}
      </h2>
      
      {subtitle && (
        <p className="section-subtitle" style={{ margin: 0 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
