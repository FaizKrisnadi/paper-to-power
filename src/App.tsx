import React from 'react';
import { registryMapProjects } from './data/generated';
import { HeroSection } from './components/HeroSection';
import { StorySection } from './components/StorySection';
import { ExplorerSection } from './components/ExplorerSection';
import { CountrySection } from './components/CountrySection';
import { MethodologySection } from './components/MethodologySection';
import { DataSourcesPanel } from './components/DataSourcesPanel';
import { CaseStudySection } from './components/CaseStudySection';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="app-container">
      <HeroSection />
      <StorySection />
      <ExplorerSection allProjects={registryMapProjects} />
      <CountrySection allProjects={registryMapProjects} />
      <MethodologySection />
      
      {/* Container for the panels inside methodology zone */}
      <div style={{ padding: '0 24px 80px', background: 'var(--bg-surface)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <DataSourcesPanel />
        </div>
      </div>
      
      <CaseStudySection />
      <Footer />
    </div>
  );
}

export default App;
