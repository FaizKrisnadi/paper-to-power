import React, { useState } from 'react';
import { SiteNav } from './components/SiteNav';
import { registryMapProjects } from './data/generated';
import { PilotSection } from './components/PilotSection';
import { HeroSection } from './components/HeroSection';
import { StorySection } from './components/StorySection';
import { ExplorerSection, type ExplorerFilters } from './components/ExplorerSection';
import { CountrySection } from './components/CountrySection';
import { MethodologySection } from './components/MethodologySection';
import { DataSourcesPanel } from './components/DataSourcesPanel';
import { AppClosing } from './components/AppClosing';
import { Footer } from './components/Footer';

function App() {
  const [filters, setFilters] = useState<ExplorerFilters>({ country: 'all', tech: 'all', status: 'all', stage:'all', query:'' });
  return (
    <div className="app-container">
      <SiteNav />
      <HeroSection />
      <StorySection />
      <ExplorerSection allProjects={registryMapProjects} filters={filters} setFilters={setFilters} />
      <CountrySection allProjects={registryMapProjects} onSelectCountry={country => setFilters({ country, tech: 'all', status: 'all', stage:'all', query:'' })} />
      <PilotSection />
      <MethodologySection />
      
      {/* Container for the panels inside methodology zone */}
      <div style={{ padding: '0 24px 80px', background: 'var(--bg-surface)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <DataSourcesPanel />
        </div>
      </div>
      
      <AppClosing />
      <Footer />
    </div>
  );
}

export default App;
