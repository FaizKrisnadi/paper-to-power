import { caseStudies } from '../data/generated'

export function CaseStudyRail() {
  return (
    <section className="section-shell">
      <div className="section-heading">
        <span className="eyebrow">Case Studies</span>
        <h2>Use a few deep examples to validate the broader pattern.</h2>
        <p>
          The regional layer is useful, but a small set of manual cases makes
          the audit legible and defensible.
        </p>
      </div>

      <div className="case-study-rail">
        {caseStudies.map((study) => (
          <article key={study.id} className="case-study reveal">
            <div className="case-study__meta">
              <span>{study.countryCode}</span>
              <span>{study.label.replaceAll('_', ' ')}</span>
            </div>
            <h3>{study.title}</h3>
            <p>{study.summary}</p>
            <p className="case-study__why">{study.whyItMatters}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
