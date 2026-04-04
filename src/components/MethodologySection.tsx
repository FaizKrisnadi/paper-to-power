import React from 'react';
import { SectionHeader } from './shared/SectionHeader';
import { Accordion } from './shared/Accordion';

export function MethodologySection() {
  return (
    <div style={{ padding: '80px 24px', background: 'var(--bg-surface)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <SectionHeader 
          title="How It Works" 
          subtitle="How public renewable project announcements are checked against observed sites and grid access."
          align="center"
          eyebrow="Methodology"
        />

        <div style={{ marginTop: '24px' }}>
          <Accordion title="1. Multimodal Evidence Gathering" defaultOpen={true}>
            The process starts with public announcements, developer releases, and national project lists. This sets the baseline for each project: how much capacity is being promised, where it is meant to be, and when it is expected to come online. The registry can include solar, wind, and hybrid utility-scale projects when the public record is strong enough to locate and review them.
          </Accordion>

          <Accordion title="2. Geospatial Matching">
            Those project locations are then checked against Global Renewables Watch (GRW) and Sentinel-2 imagery. The result is a site-level match between what is being claimed publicly and what can actually be seen on the ground.
          </Accordion>

          <Accordion title="3. Grid Context">
            Visible build-out is only part of the story. Each observed site is also checked against nearby substations, transmission lines, and related infrastructure to understand whether the project appears ready to deliver power at utility scale.
          </Accordion>
        </div>
      </div>
    </div>
  );
}
