import type { PaperToPowerLabel } from '../../types/domain';
import { OBSERVATION_LABELS } from '../../lib/evidence';
interface StatusBadgeProps { status: PaperToPowerLabel | 'all'; className?: string; dotOnly?: boolean }
export function StatusBadge({ status, className = '', dotOnly = false }: StatusBadgeProps) {
 const label = status === 'all' ? 'All evidence statuses' : OBSERVATION_LABELS[status];
 const color = status === 'observed_footprint' ? 'var(--status-on-schedule)' : status === 'not_detected_by_cutoff' ? 'var(--status-smaller)' : 'var(--text-secondary)';
 return <span className={`status-badge ${className}`} title={label} aria-label={dotOnly ? label : undefined} style={{ display: 'inline-flex', alignItems: 'center', padding: dotOnly ? 0 : '4px 8px', borderRadius: '12px', fontSize: '.75rem', fontWeight: 600, color, backgroundColor: dotOnly ? 'transparent' : 'var(--bg-surface-muted)', whiteSpace: 'nowrap' }}>
  <span aria-hidden="true" style={{ display:'inline-block', width:6,height:6,borderRadius:'50%',backgroundColor:color,marginRight:dotOnly ? 0 : 6 }} />{!dotOnly && label}
 </span>;
}
