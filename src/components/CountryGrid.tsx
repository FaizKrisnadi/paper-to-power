import { countrySummaries } from '../data/generated'
import { formatGw, formatPct } from '../lib/format'

export function CountryGrid() {
  return (
    <section className="section-shell">
      <div className="section-heading">
        <span className="eyebrow">Country Comparison</span>
        <h2>Country summaries should help you decide where to look next.</h2>
        <p>
          This is the fast scan layer for portfolio-level differences in claimed
          scale, observed scale, lag, and readiness.
        </p>
      </div>

      <div className="country-grid">
        {countrySummaries.map((country) => (
          <article key={country.code} className="country-card reveal">
            <div className="country-card__topline">
              <span>{country.name}</span>
              <span>{country.role === 'anchor' ? 'Anchor' : 'Source'}</span>
            </div>

            <p className="country-card__description">{country.description}</p>

            <dl className="country-card__stats">
              <div>
                <dt>Claimed</dt>
                <dd>{formatGw(country.claimedCapacityGw)}</dd>
              </div>
              <div>
                <dt>Observed</dt>
                <dd>{formatGw(country.observedCapacityGw)}</dd>
              </div>
              <div>
                <dt>Gap share</dt>
                <dd>{formatPct(country.gapShare)}</dd>
              </div>
              <div>
                <dt>Median lag</dt>
                <dd>{country.medianLagMonths} mo</dd>
              </div>
            </dl>

            <div className="readiness-meter" aria-hidden="true">
              <span style={{ width: `${country.readinessScore}%` }} />
            </div>

            <p className="country-card__signal">{country.keySignal}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
