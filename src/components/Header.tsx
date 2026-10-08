import React, { useEffect, useState } from 'react';
import { SailingKubot } from './SailingKubot';

const GhIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
  </svg>
);

export const GhPill: React.FC<{ stars?: string | null }> = ({ stars = null }) => (
  <a className="gh-pill" href="https://github.com/kubotdev/kubot">
    <span className="gh-left">
      <GhIcon /> kubot
    </span>
    {stars !== null && <span className="gh-stars">★ {stars}</span>}
  </a>
);

export const BrandHero: React.FC = () => {
  return (
    <div className="brand-hero">
      <SailingKubot size={170} />
      <div className="brand-name">
        <span className="bdot" />
        kubot
      </div>
    </div>
  );
};

export const Navbar: React.FC = () => {
  const [stars, setStars] = useState<string | null>(null);
  useEffect(() => {
    fetch('https://api.github.com/repos/kubotdev/kubot')
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (j && typeof j.stargazers_count === 'number') setStars(String(j.stargazers_count));
      })
      .catch(() => undefined);
  }, []);
  return (
    <header className="site-nav">
      <div className="wrap nav-inner">
        <a className="nav-brand" href="#top" aria-label="kubot home">
          <img src="./favicon.png" alt="kubot" width={24} height={24} />
          <span>kubot</span>
        </a>
        <nav className="nav-links" aria-label="primary">
          <a href="#how">How it works</a>
          <a href="#features">Features</a>
          <a href="#mcp">MCP</a>
          <a href="https://github.com/kubotdev/kubot/tree/main/docs">Docs</a>
        </nav>
        <GhPill stars={stars} />
      </div>
    </header>
  );
};
