export function MethodStack() {
  return (
    <section className="method-stack section-shell">
      <div className="section-heading">
        <span className="eyebrow">Method</span>
        <h2>GIS, multimodal, and SAM should be readable in one pass.</h2>
        <p>
          This product is not doing magic. It is combining georeferenced project
          records, observed asset footprints, and explicit matching rules.
        </p>
      </div>

      <div className="method-grid">
        <article className="method-card">
          <span className="method-card__label">GIS</span>
          <h3>Geographic information system layer</h3>
          <p>
            Every promoted project is stored as a real georeferenced site. The
            map is the inspection surface for those coordinates and localities.
          </p>
        </article>
        <article className="method-card">
          <span className="method-card__label">Multimodal evidence</span>
          <h3>Documents plus observed geospatial data</h3>
          <p>
            Registry claims are checked against public filings, developer
            sources, and GRW observed assets. The evidence table shows where
            those modes agree or diverge.
          </p>
        </article>
        <article className="method-card">
          <span className="method-card__label">SAM</span>
          <h3>Spatial asset matching</h3>
          <p>
            SAM is the first-pass logic that links a claimed project to an
            observed asset using distance, timing, and size signals. It is a
            matching layer, not a final truth layer.
          </p>
        </article>
      </div>
    </section>
  )
}
