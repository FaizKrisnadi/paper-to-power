import { countrySummaries, regionalLinks } from '../data/generated'

const positions = {
  IDN: { left: '20%', top: '64%' },
  PHL: { left: '64%', top: '36%' },
  SGP: { left: '46%', top: '66%' },
  VNM: { left: '50%', top: '28%' },
  MYS: { left: '36%', top: '50%' },
} as const

export function RegionalFrame() {
  return (
    <section className="regional-frame section-shell">
      <div className="section-heading">
        <span className="eyebrow">Regional Frame</span>
        <h2>Five-country comparison with Singapore as the anchor node.</h2>
        <p>
          The map layer will eventually hold observed assets and matched
          projects. The current shell already encodes the intended logic:
          source-side geographies feed a regional comparison view, while
          Singapore acts as the demand-side reference point.
        </p>
      </div>

      <div className="regional-canvas" aria-label="Regional comparison frame">
        <div className="regional-grid" />

        {regionalLinks.map((link) => (
          <div
            key={`${link.from}-${link.to}`}
            className={`regional-link regional-link--${link.kind} regional-link--${link.from.toLowerCase()}-${link.to.toLowerCase()}`}
          />
        ))}

        {countrySummaries.map((country) => (
          <article
            key={country.code}
            className={`country-node country-node--${country.role}`}
            style={positions[country.code]}
          >
            <span className="country-node__label">{country.shortLabel}</span>
            <strong>{country.name}</strong>
            <span>{country.role === 'anchor' ? 'Anchor node' : 'Source side'}</span>
          </article>
        ))}
      </div>
    </section>
  )
}
