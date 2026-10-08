import React from 'react';

const features = [
  {
    n: '01',
    t: 'Find broken workloads',
    code: 'pod_oom_killed · pod_crashloop_backoff',
    d: 'CrashLoopBackOff with the backoff window, OOMKilled with the memory limit as evidence, ImagePullBackOff with the registry error, restart loops.',
  },
  {
    n: '02',
    t: 'Explain scheduling failures',
    code: 'pod_pending',
    d: 'Pending pods the scheduler cannot place — requests vs capacity, taints, tolerations, affinity and node constraints.',
  },
  {
    n: '03',
    t: 'Trace service problems',
    code: 'service_no_endpoints · ingress_no_backends',
    d: 'Services whose selector matches no pods, broken selectors, unhealthy backends, ingresses pointing at missing or endpoint-less services.',
  },
  {
    n: '04',
    t: 'Inspect deployments',
    code: 'deployment_unavailable · deployment_rollout_stalled',
    d: 'Unavailable replicas, rollouts past their progress deadline, old ReplicaSets still running beside the newest.',
  },
  {
    n: '05',
    t: 'Understand cluster pressure',
    code: 'node_pressure · pod_probe_failing',
    d: 'Nodes under memory/disk/PID pressure, failing probes (sustained only), pending PVCs, volume mount failures, failed Jobs and CronJobs.',
  },
  {
    n: '06',
    t: 'Built for humans and agents',
    code: 'schema 1.0.0 · exit 0/1/2/3/64',
    d: 'Readable terminal output with evidence per finding, versioned JSON, exit codes for CI, MCP tools for agents.',
  },
];

export const FeatureList: React.FC = () => (
  <div className="features">
    {features.map((f) => (
      <article key={f.n}>
        <div className="n">{f.n}</div>
        <div>
          <h3>
            {f.t} <code>{f.code}</code>
          </h3>
          <p>{f.d}</p>
        </div>
      </article>
    ))}
  </div>
);

const capsLeft = [
  'CrashLoopBackOff detection',
  'OOMKilled detection',
  'ImagePullBackOff detection',
  'Failed probe detection',
  'Pending pod diagnosis',
  'Scheduling analysis',
  'Deployment rollout analysis',
  'Service endpoint analysis',
  'Ingress + TLS analysis',
];

const capsRight = [
  'Node pressure detection',
  'Kubernetes event analysis',
  'StatefulSet + DaemonSet checks',
  'Job / CronJob failure detection',
  'PVC + volume mount checks',
  'Resource configuration checks',
  'Structured JSON output',
  'Exit codes + CI gate',
  'MCP support',
];

export const CapabilityList: React.FC = () => (
  <div className="corelist">
    <ul>
      {capsLeft.map((c) => (
        <li key={c}>{c}</li>
      ))}
    </ul>
    <ul>
      {capsRight.map((c) => (
        <li key={c}>{c}</li>
      ))}
    </ul>
  </div>
);

const why = [
  ['Not just kubectl output.', 'Context.', 'kubectl lists state. kubot correlates it — exit code + limit + restarts + recommendation, with kubectl to verify.'],
  ['Not another dashboard.', 'Diagnosis.', 'No UI to operate. One command answers "I know something is broken — tell me why."'],
  ['Not just alerts.', 'Root cause.', 'Evidence and likely cause per finding, each with a reference page under docs/findings.'],
  ['Not just for humans.', 'Built for agents.', 'Deterministic findings over MCP and JSON. The model narrates; kubot provides the facts.'],
];

export const WhyKubot: React.FC = () => (
  <div className="why">
    {why.map(([a, b, d]) => (
      <div key={a}>
        <strong>
          {a} <em>{b}</em>
        </strong>
        <span>{d}</span>
      </div>
    ))}
  </div>
);
