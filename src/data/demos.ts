export type SegClass =
  | 't-prompt'
  | 't-cmd'
  | 't-normal'
  | 't-muted'
  | 't-green'
  | 't-amber'
  | 't-red'
  | 't-blue';

export interface Seg {
  t: string;
  c: SegClass;
}

export type Line = Seg[];

const n = (t: string): Seg => ({ t, c: 't-normal' });
const m = (t: string): Seg => ({ t, c: 't-muted' });
const g = (t: string): Seg => ({ t, c: 't-green' });
const a = (t: string): Seg => ({ t, c: 't-amber' });
const r = (t: string): Seg => ({ t, c: 't-red' });
const b = (t: string): Seg => ({ t, c: 't-blue' });

export interface Demo {
  cmd: string;
  title: string;
  lines: Line[];
}

const blank: Line = [{ t: ' ', c: 't-normal' }];

// Demo outputs mirror the real CLI (kind-kubot-prod). Wording is verbatim;
// only over-long tails are trimmed so every line fits the fixed terminal
// (no scrollbars, ever) — like the real CLI cutting columns to fit -width.
const conn = (): Line => [
  g('connected'),
  m(' · '),
  b('kind-kubot-prod'),
  m(' · all namespaces · read-only'),
];

// --- bordered lipgloss-style tables -------------------------------------
const padR = (s: string, w: number): string => {
  const r = [...s];
  if (r.length > w) return r.slice(0, w - 1).join('') + '…';
  return s + ' '.repeat(w - r.length);
};
// cutMiddle keeps head+tail like the real CLI: pod names carry the workload
// up front and the unique id at the end, the hash in the middle is expendable
const cutMid = (s: string, w: number): string => {
  const r = [...s];
  if (r.length <= w) return s + ' '.repeat(w - r.length);
  const keep = w - 1;
  const head = Math.floor((keep * 2) / 3);
  return r.slice(0, head).join('') + '…' + r.slice(r.length - (keep - head)).join('');
};
const hline = (w: number[], l: string, j: string, rr: string): Line => [
  { t: l + w.map((x) => '─'.repeat(x + 2)).join(j) + rr, c: 't-muted' },
];
const trow = (cells: string[], w: number[], cls: SegClass = 't-normal'): Line => [
  { t: '│ ' + cells.join(' │ ') + ' │', c: cls },
];

const EV_W = [10, 28, 16, 5, 13];
const evHeader = (): Line[] => [
  hline(EV_W, '╭', '┬', '╮'),
  trow(['NS', 'OBJECT', 'REASON', 'COUNT', 'MESSAGE'].map((c, i) => padR(c, EV_W[i])), EV_W, 't-muted'),
  hline(EV_W, '├', '┼', '┤'),
];
const evRow = (ns: string, obj: string, reason: string, count: string, msg: string): Line => {
  const cells = [padR(ns, 10), cutMid(obj, 28), padR(reason, 16)];
  const tail = padR(msg, 13);
  return [
    { t: '│ ' + cells.join(' │ ') + ' │ ', c: 't-normal' },
    { t: padR(count, 5), c: 't-amber' },
    { t: ' │ ' + tail + ' │', c: 't-normal' },
  ];
};
const evEnd = (): Line[] => [hline(EV_W, '╰', '┴', '╯')];

const RES_W = [20, 12, 7, 7, 9, 7, 4];
const resHeader = (): Line[] => [
  hline(RES_W, '╭', '┬', '╮'),
  trow(['POD', 'CONTAINER', 'CPU-REQ', 'MEM-REQ', 'MEM-LIMIT', 'MEM-USE', 'USE%'].map((c, i) => padR(c, RES_W[i])), RES_W, 't-muted'),
  hline(RES_W, '├', '┼', '┤'),
];
const resRow = (pod: string, c: string, cpu: string, mr: string, ml: string, mu: string, up: string): Line =>
  trow([cutMid(pod, 20), padR(c, 12), padR(cpu, 7), padR(mr, 7), padR(ml, 9), padR(mu, 7), padR(up, 4)], RES_W);
const resEnd = (): Line[] => [hline(RES_W, '╰', '┴', '╯')];

export const demos: Record<string, Demo> = {
  kubot: {
    cmd: 'kubot',
    title: 'kubot — 96×32',
    lines: [
      [n('Kubernetes diagnostics for humans and AI agents')],
      blank,
      [m('Usage:')],
      [n('  kubot [command]')],
      blank,
      [m('Available Commands:')],
      [n('  ask         Ask about cluster health, answered from deterministic findings')],
      [n('  check       CI gate: exit non-zero when problems meet --fail-on')],
      [n('  events      Show Warning events related to unhealthy workloads')],
      [n('  explain     Print the deterministic report plus an AI reading of it')],
      [n('  inspect     Inspect the cluster or one workload')],
      [n('  mcp         Run as an MCP server over stdio (for AI agents like Claude)')],
      [n('  networking  Check Service and endpoint problems')],
      [n('  resources   Per-container requests, limits, and live usage, plus resource problems')],
      [n('  why         Explain why a workload is unhealthy')],
      blank,
      [m('Flags: --config, --context, --kubeconfig, -n/--namespace, --timeout, --no-color')],
    ],
  },
  'kubot inspect': {
    cmd: 'kubot inspect',
    title: 'kubot — inspect — 96×32',
    lines: [
      conn(),
      [m('Cluster health: '), r('0/100')],
      [r('CRITICAL')],
      [r('● '), b('deployment/checkout-api'), m(' (production)')],
      [n('    Deployment has 3 unavailable replica(s) (ready 0/3)')],
      [r('● '), b('pod/billing-worker-5cbb5b98dc-zrr89'), m(' (production)')],
      [n('    Container "worker" was OOMKilled (exit 137)')],
      [r('● '), b('pod/checkout-api-85566fcb9f-5ph2n'), m(' (production)')],
      [n('    Container "api" cannot pull image "hashicorp/http-echo:0.2.9')],
      [n('    9" (ImagePullBackOff)')],
      [a('WARNING')],
      [a('● '), b('cronjob/nightly-reconcile'), m(' (production)')],
      [n('    Latest run (nightly-reconcile-29858079) failed with no success since')],
      [a('● '), b('deployment/checkout-api'), m(' (production)')],
      [n('    Rollout exceeded its progress deadline and is stuck')],
      [m('checked · daemonsets · deployments · events · ingresses · jobs · nodes · pods · services · statefulsets')],
      [m('Details: kubot inspect --full   ·   Machine-readable: kubot inspect --json')],
    ],
  },
  'kubot why search-api': {
    cmd: 'kubot why search-api',
    title: 'kubot — why — 96×32',
    lines: [
      conn(),
      blank,
      [r('CRITICAL')],
      [n('  '), b('deployment/search-api'), m(' (production)')],
      [n('    Deployment has 2 unavailable replica(s) (ready 0/2)')],
      blank,
      [m('    Evidence:')],
      [n('      · available: 0 · desired: 2 · ready: 0 · unavailable: 2 · failing_pods: 2')],
      blank,
      [m('    Recommendation:')],
      [n('      Inspect the failing pods; check rollout status and pod events.')],
      blank,
      [a('WARNING')],
      [n('  '), b('deployment/search-api'), m(' (production)')],
      [n('    Rollout exceeded its progress deadline and is stuck')],
      [n('  '), b('service/search-api'), m(' (production)')],
      [n('    Service has no ready endpoints')],
      [m('checked · daemonsets · deployments · events · ingresses · jobs · nodes · pods · services · statefulsets')],
    ],
  },
  'kubot events': {
    cmd: 'kubot events',
    title: 'kubot — events — 96×32',
    lines: [
      conn(),
      blank,
      ...evHeader(),
      evRow('production', 'pod/checkout-api-85566fcb9f-5ph2n', 'ImagePullBackOff', 'x41', 'Back-off pulling image'),
      evRow('production', 'pod/billing-worker-5cbb5b98dc-zrr89', 'OOMKilling', 'x23', 'Container OOMKilled 137'),
      evRow('production', 'pod/analytics-export', 'FailedScheduling', 'x17', '0/3 nodes: no memory'),
      evRow('production', 'job/nightly-reconcile-29858079', 'BackoffLimitExceeded', 'x3', 'failed, no success'),
      ...evEnd(),
      blank,
      [m('warning events, most repeated first')],
    ],
  },
  'kubot resources': {
    cmd: 'kubot resources',
    title: 'kubot — resources — 96×32',
    lines: [
      conn(),
      blank,
      ...resHeader(),
      resRow('kube-system/coredns-5d78d47d9d-74mvg', 'coredns', '100m', '70Mi', '170Mi', '14Mi', '9%'),
      resRow('kube-system/etcd-kind-control-plane', 'etcd', '100m', '100Mi', 'none', '-', '-'),
      resRow('production/admin-console-844756-mhdf4', 'web', '25m', '32Mi', '64Mi', '1Mi', '2%'),
      resRow('production/analytics-export', 'export', '-', '-', 'none', '-', '-'),
      resRow('production/billing-worker-5cbb5b98dc-zrr89', 'worker', '50m', '64Mi', '64Mi', '-', '-'),
      resRow('production/checkout-api-85566fcb9f-5ph2n', 'api', '50m', '64Mi', '128Mi', '-', '-'),
      resRow('production/db-migrate-42-zll82', 'migrate', '-', '-', 'none', '-', '-'),
      resRow('production/feature-flags-77d579cffd-tckll', 'api', '-', '-', 'none', '-', '-'),
      ...resEnd(),
      blank,
      [m('8 of 50 rows shown')],
    ],
  },
  'kubot networking': {
    cmd: 'kubot networking',
    title: 'kubot — networking — 96×32',
    lines: [
      conn(),
      blank,
      [a('WARNING')],
      [a('● '), b('ingress/shop'), m(' (production)')],
      [n('    Ingress class "nginx" matches no installed IngressClass')],
      [a('● '), b('service/admin-console'), m(' (production)')],
      [n('    Service selector matches no pods')],
      [a('● '), b('service/checkout-api'), m(' (production)')],
      [n('    Service has no ready endpoints')],
      [a('● '), b('service/search-api'), m(' (production)')],
      [n('    Service has no ready endpoints')],
      blank,
      [m('checked · daemonsets · deployments · events · ingresses · jobs · nodes · pods · services · statefulsets')],
      blank,
      [m('Details: kubot inspect --full   ·   Machine-readable: kubot inspect --json')],
    ],
  },
  'kubot ask "what\'s broken?"': {    cmd: 'kubot ask "what\'s broken?"',
    title: 'kubot — ask — 96×32',
    lines: [
      [n('Send the findings to gemini (gemini-3.5-flash-lite) for explanation? [y/N] y')],
      [m('────────────────────────────────────────────────────────────')],
      [m('AI reading (gemini/gemini-3.5-flash-lite — verify before acting)')],
      [n('The cluster status is critical, with multiple failing workloads')],
      [n('preventing customers from paying.')],
      blank,
      [n('deployment/checkout-api (production) has 3 unavailable replica(s) (ready 0/3)')],
      [n('because container api cannot pull image hashicorp/http-echo:0.2.99 (ImagePullBackOff).')],
      blank,
      [b('Why this is happening:')],
      [n('Back-off pulling image: ErrImagePull — docker.io/hashicorp/http-echo:0.2.99: not found.')],
      blank,
      [b('Check next:')],
      [n('Verify the image tag exists and registry credentials (imagePullSecrets) are correct.')],
      blank,
      [n('deployment/billing-worker (production): OOMKilled (exit 137) — raise the memory limit.')],
    ],
  },
};

export const commandOrder = [
  'kubot',
  'kubot inspect',
  'kubot why search-api',
  'kubot events',
  'kubot resources',
  'kubot networking',
  'kubot ask "what\'s broken?"',
];
