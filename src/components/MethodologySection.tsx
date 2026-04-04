import React from 'react';
import { SectionHeader } from './shared/SectionHeader';
import { Accordion } from './shared/Accordion';

export function MethodologySection() {
  return (
    <div style={{ padding: '80px 24px', background: 'var(--bg-surface)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <SectionHeader 
          title="How It Works" 
          subtitle="A transparent path from public project claims to observed sites and grid context."
          align="center"
          eyebrow="Methodology"
        />

        <div className="surface-panel" style={{ padding: '22px 24px', marginTop: '32px', marginBottom: '20px' }}>
          <p className="content-prose">
            The workflow is intentionally narrow: locate the claimed site, test whether build-out is visible, then check whether surrounding power infrastructure makes that build-out plausible at utility scale.
          </p>
        </div>

        <div style={{ marginTop: '24px' }}>
          <Accordion title="1. Multimodal Evidence Gathering" defaultOpen={true}>
            The workflow starts with public announcements, developer releases, and national project lists. This establishes the claimed baseline for a target project: how much capacity is being promised, where it is supposed to be, and when it is supposed to come online. That language is then standardized into a comparable project record.
          </Accordion>

          <Accordion title="2. Geospatial Matching">
            Project coordinates are matched against detections from Global Renewables Watch (GRW) and Sentinel-2 imagery. By comparing claimed MW capacity against the visible footprint, such as solar land cover or wind point clusters, the project estimates how closely the observed site aligns with the public target.
          </Accordion>

          <Accordion title="3. Grid Context">
            Build on the ground is only part of the picture. The observed asset location is cross-referenced against OpenStreetMap-derived roads, substations, and transmission proxies. Each site then receives a grid context read based on how close it sits to transmission-grade infrastructure versus weaker or more ambiguous networks.
          </Accordion>
        </div>
      </div>
    </div>
  );
}
