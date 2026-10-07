import type { CountryCode } from '../types/domain';
import type { Technology } from '../types/domain';

export const COUNTRY_LABELS: Record<CountryCode, string> = {
  BRN: 'Brunei',
  KHM: 'Cambodia',
  IDN: 'Indonesia',
  LAO: 'Laos',
  MYS: 'Malaysia',
  MMR: 'Myanmar',
  PHL: 'Philippines',
  SGP: 'Singapore',
  THA: 'Thailand',
  VNM: 'Vietnam',
  TLS: 'Timor-Leste',
};

export const COUNTRY_FLAGS: Record<CountryCode, string> = {
  BRN: '🇧🇳',
  KHM: '🇰🇭',
  IDN: '🇮🇩',
  LAO: '🇱🇦',
  MYS: '🇲🇾',
  MMR: '🇲🇲',
  PHL: '🇵🇭',
  SGP: '🇸🇬',
  THA: '🇹🇭',
  VNM: '🇻🇳',
  TLS: '🇹🇱',
};

export const COUNTRY_OPTIONS = Object.entries(COUNTRY_LABELS).map(([code, label]) => ({
  code: code as CountryCode,
  label,
}));

export const TECHNOLOGY_LABELS: Record<Technology, string> = {
  solar: 'Solar',
  wind: 'Wind',
  mixed: 'Solar + storage / Hybrid',
  hydro: 'Hydropower',
  geothermal: 'Geothermal',
  bioenergy: 'Bioenergy',
  pumped_storage: 'Pumped storage',
};

export const COUNTRY_COMPARISON_INFO: Partial<
  Record<CountryCode, { role: 'Source' | 'Anchor' | 'Both'; keySignal: string }>
> = {
  IDN: { role: 'Source', keySignal: 'Significant delays in grid connectivity for constructed projects.' },
  SGP: { role: 'Anchor', keySignal: 'High demand driving regional export ambitions, zero domestic utility scale.' },
  MYS: { role: 'Both', keySignal: 'Strong solar buildout but facing land constraint challenges.' },
  VNM: { role: 'Source', keySignal: 'Massive wind capacity announced, waiting on transmission upgrades.' },
  PHL: { role: 'Source', keySignal: 'Projects often clear land but stall before panel installation.' },
  LAO: { role: 'Source', keySignal: 'Cross-border export ambitions are becoming central to utility-scale wind development.' },
  THA: { role: 'Both', keySignal: 'Floating solar and grid modernization shape the current expansion path.' },
  KHM: { role: 'Source', keySignal: 'Pipeline depth is thinner, but structured procurement has already proven viable.' },
  MMR: { role: 'Source', keySignal: 'Operational context is constrained by instability and weak grid reliability.' },
  BRN: { role: 'Source', keySignal: 'The utility-scale market is nascent and still defined by first-project execution.' },
};
