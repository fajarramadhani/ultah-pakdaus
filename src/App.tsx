import { useState } from 'react';
import PresentationShell from './components/layout/PresentationShell';
import LoadingScreen from './components/ui/LoadingScreen';
import { siteConfig } from './config/site.config';
import './styles/global.css';

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      
      {siteConfig.features.showFilmGrain && (
        <div className="film-grain" aria-hidden="true" />
      )}

      <PresentationShell />
    </>
  );
}
