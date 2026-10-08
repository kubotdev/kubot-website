import React from 'react';
import { BrandHero, Navbar } from './components/Header';
import { TerminalDemo } from './components/TerminalDemo';
import { InstallBlock } from './components/InstallBlock';
import { ArchitectureDiagram } from './components/ArchitectureDiagram';
import { FeatureList, CapabilityList, WhyKubot } from './components/Sections';
import { MCPSection, FinalCTA, Footer } from './components/Misc';

export const App: React.FC = () => (
  <div id="top">
    <Navbar />
    <div className="wrap">
      <BrandHero />
      <div className="center">
        <div className="hero-meta">OPEN SOURCE · GO · KUBERNETES · FREE</div>
        <div className="hero-copy">
          <h1>Kubernetes diagnostics for humans &amp; agents.</h1>
          <p className="hero-sub">When Kubernetes breaks, kubot tells you why.</p>
        </div>
      </div>
    </div>

    <div className="wrap-wide">
      <div className="wallpaper">
        <TerminalDemo />
      </div>
    </div>

    <main>
      <section className="block" id="install">
        <div className="wrap center">
          <p className="hero-text">
            Point kubot at a cluster. Get answers, not dashboards: what&apos;s
            broken, why, and what to check next.
          </p>
          <div style={{ height: 26 }} />
          <InstallBlock />
          <div className="cloudrow">
            <strong>Works with any Kubernetes:</strong>
            <div>
              <span>kind</span>·<span>minikube</span>·<span>EKS</span>·
              <span>GKE</span>·<span>AKS</span>·<span>k3s</span>
            </div>
          </div>
        </div>
      </section>

      <section className="block" id="how">
        <div className="wrap">
          <div className="secnum">HOW IT WORKS</div>
          <h2 className="sec" style={{ display: 'none' }}>How it works</h2>
          <p className="lede">
            Two paths to the same place: run the CLI locally with kubeconfig,
            or run it in-cluster on a ServiceAccount. Same read-only collector,
            same deterministic findings.
          </p>
          <ArchitectureDiagram />
        </div>
      </section>

      <section className="block" id="features">
        <div className="wrap">
          <div className="secnum">FEATURES</div>
          <p className="lede">
            Point kubot at a cluster and get visibility into workloads,
            scheduling, services, rollouts and node pressure — with evidence
            and next steps, not raw dumps.
          </p>
          <FeatureList />
        </div>
      </section>

      <section className="block" id="mcp">
        <div className="wrap">
          <div className="secnum">MCP — USE KUBOT AS AN AGENT TOOL</div>
          <MCPSection />
        </div>
      </section>

      <section className="block" id="capabilities">
        <div className="wrap">
          <div className="secnum">CORE CAPABILITIES</div>
          <CapabilityList />
        </div>
      </section>

      <section className="block" id="why">
        <div className="wrap">
          <div className="secnum">WHY KUBOT</div>
          <div style={{ height: 18 }} />
          <WhyKubot />
        </div>
      </section>

      <section className="block" id="cta">
        <div className="wrap">
          <FinalCTA />
        </div>
      </section>
    </main>

    <Footer />
  </div>
);
