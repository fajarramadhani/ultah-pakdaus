import { useState, useEffect } from 'react';
import PresentationShell from './components/layout/PresentationShell';
import PublicWishesPage from './pages/PublicWishesPage';
import LoadingScreen from './components/ui/LoadingScreen';
import { siteConfig } from './config/site.config';
import './styles/global.css';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [route, setRoute] = useState<string>(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    if (path === '/ucapan' || hash.includes('ucapan')) return 'ucapan';
    return 'main';
  });

  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/ucapan' || hash.includes('ucapan')) {
        setRoute('ucapan');
      } else {
        setRoute('main');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  if (route === 'ucapan') {
    return <PublicWishesPage />;
  }

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
