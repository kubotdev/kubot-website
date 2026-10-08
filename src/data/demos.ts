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

export const demos: Record<string, Demo> = {
  kubot: {
    cmd: 'kubot',
    title: 'kubot — 96×32',
    lines: [
      [m('Kubernetes diagnostics for humans & agents. Read-only.')],
      blank,
      [m('Usage:')],
      [n('  inspect [workload]    full health report')],
      [n('  why <workload>        diagnosis for one workload')],
      [n('  events                warning events, most repeated first')],
      [n('  resources             requests / limits / usage per container')],
      [n('  networking            service, probe and ingress findings')],
      [n('  check                 CI gate (exit 2 when critical)')],
      [n('  inspect --json        machine-readable report (schema 1.0.0)')],
      [n('  mcp                   serve findings to agents over MCP')],
      blank,
      [m('Flags: --kubeconfig  --context  -n/--namespace  --no-color')],
    ],
  },
  'kubot inspect': {
    cmd: 'kubot inspect',
    title: 'kubot — inspect — 96×32',
    lines: [
      [m('connected · kind-kubot-demo · all namespaces · read-only')],
      blank,
      [m('Cluster health: '), r('0/100')],
      blank,
      [r('CRITICAL')],
      [r('● '), b('deployment/bad-image'), m('  unavailable 0/1')],
      [r('● '), b('deployment/crashy'), m('  unavailable 0/1')],
      [r('● '), b('pod/payments-api-68ffdf658-m2wq4'), m('  OOMKilled 137')],
      blank,
      [a('WARNING')],
      [a('● '), b('deployment/unready'), m('  rollout stuck')],
      blank,
      [m('1 failing rollout · 1 stuck · 1 OOMKill · checked pods, deploys, nodes')],
    ],
  },
  'kubot why payments-api': {
    cmd: 'kubot why payments-api',
    title: 'kubot — why — 96×32',
    lines: [
      [m('connected · kind-kubot-demo · read-only')],
      blank,
      [r('CRITICAL  '), b('pod/payments-api-68ffdf658-m2wq4'), m(' (default)')],
      [n('  Container "api" was OOMKilled (exit 137)')],
      blank,
      [m('  Evidence:')],
      [n('    · container: api   · exit_code: 137')],
      [n('    · memory_limit: 64Mi   · restart_count: 148')],
      blank,
      [m('  Recommendation:')],
      [n('  Increase the memory limit or investigate usage.')],
      blank,
      [m('ref: docs/findings/pod_oom_killed · verify: kubectl describe pod')],
    ],
  },
  'kubot events': {
    cmd: 'kubot events',
    title: 'kubot — events — 96×32',
    lines: [
      [m('COUNT  REASON            OBJECT')],
      [n('  148  OOMKilling        pod/payments-api-68ffdf658-m2wq4')],
      [n('   41  BackOff           pod/crashy-7f9c4b6d-2js8x')],
      [n('   23  FailedScheduling  pod/pending-tall-0')],
      [n('   12  ReplicaFailure    deployment/bad-image')],
      [n('    9  Sync              ingress/web')],
      blank,
      [m('warning events by count, most repeated first')],
      blank,
      [m('1 failing image · 1 OOMKill · 1 unschedulable')],
      blank,
      [m('Next: kubot why payments-api')],
      blank,
    ],
  },
  'kubot resources': {
    cmd: 'kubot resources',
    title: 'kubot — resources — 96×32',
    lines: [
      [m('CONTAINER  REQUEST  LIMIT  USAGE  STATE')],
      [n('api        64Mi     64Mi   63Mi   '), r('OOMKilled x148')],
      [n('worker     128Mi    256Mi  201Mi  '), a('79% of limit')],
      [n('web        —        —      41Mi   '), a('no limit/req')],
      [n('redis      128Mi    512Mi  190Mi  '), g('ok')],
      blank,
      [m('usage needs metrics-server; degrades without it')],
      blank,
      [m('1 critical · 2 warnings · 1 healthy')],
      blank,
      [m('Next: raise api limit, set web requests/limits')],
      blank,
      blank,
    ],
  },
  help: {
    cmd: 'help',
    title: 'kubot — help — 96×32',
    lines: [
      [m('commands')],
      blank,
      [n('  kubot                   health summary')],
      [n('  kubot inspect           every workload, in detail')],
      [n('  kubot why <workload>    root cause for one workload')],
      [n('  kubot events            warning events by count')],
      [n('  kubot resources         requests, limits, usage')],
      blank,
      [m('Point kubot at any cluster: uses kubeconfig like kubectl')],
      blank,
      [m('Read-only by default. No dashboard. Just diagnostics.')],
      blank,
      blank,
    ],
  },
};

export const commandOrder = [
  'kubot',
  'kubot inspect',
  'kubot why payments-api',
  'kubot events',
  'kubot resources',
  'help',
];
