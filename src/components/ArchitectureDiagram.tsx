import React from 'react';

export const ArchitectureDiagram: React.FC = () => (
  <div>
    <div className="diagram-box" role="img" aria-label="kubot architecture: local CLI and in-cluster modes converge on the Kubernetes API, then diagnostic engine, then findings">
      <pre>{`                      kubot
                        │
           ┌────────────┴────────────┐
           │                         │
       Local CLI                 In-cluster
           │                         │
      kubeconfig              ServiceAccount
           │                         │
           └────────────┬────────────┘
                        ▼
                 Kubernetes API
                 (GET/LIST only)
                        │
                 Diagnostic engine
                 collect → rules → report
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
        Pods      Deployments      Nodes
     Services      Ingresses      Events
          │             │             │
          └─────────────┼─────────────┘
                        ▼
                     Findings
          text · json · mcp · check`}</pre>
    </div>
    <div className="env-cards">
      <div className="env-card">
        <h3>Local</h3>
        <p>
          <code>kubot</code> uses kubeconfig just like <code>kubectl</code> —{' '}
          <code>--kubeconfig</code>, <code>$KUBECONFIG</code>,{' '}
          <code>~/.kube/config</code>, <code>--context</code>. A read-only role
          is sufficient and recommended.
        </p>
      </div>
      <div className="env-card">
        <h3>In-cluster</h3>
        <p>
          Runs inside Kubernetes on a <code>ServiceAccount</code>. Same
          collector, same deterministic rules. Default behavior is read-only —
          it never writes anything.
        </p>
      </div>
    </div>
  </div>
);
