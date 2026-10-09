import React from 'react';

const MCP_JSON = `{
  "mcpServers": {
    "kubot": {
      "command": "kubot",
      "args": ["--context", "my-cluster", "mcp"]
    }
  }
}`;

type Tok =
  | { k: 'key'; v: string }
  | { k: 'str'; v: string }
  | { k: 'punc'; v: string };

const highlightJson = (src: string): Tok[][] => {
  const lines = src.split('\n');
  return lines.map((line) => {
    const toks: Tok[] = [];
    const re = /("[^"]*")(\s*:)?|([\[\]{},:])/g;
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(line)) !== null) {
      if (m.index > last) toks.push({ k: 'punc', v: line.slice(last, m.index) });
      if (m[1] !== undefined) {
        toks.push({ k: m[2] !== undefined ? 'key' : 'str', v: m[1] });
        if (m[2] !== undefined) toks.push({ k: 'punc', v: m[2] });
      } else {
        toks.push({ k: 'punc', v: m[3] });
      }
      last = m.index + m[0].length;
    }
    if (last < line.length) toks.push({ k: 'punc', v: line.slice(last) });
    return toks;
  });
};

const Code: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <code className="c-blue">{children}</code>
);

export const MCPSection: React.FC = () => (
  <div>
    <p className="mcp-body">
      <Code>kubot mcp</Code> speaks the Model Context Protocol on stdio, so an
      AI agent can call kubot as a read-only tool. It exposes deterministic
      tools only — <Code>inspect</Code> (cluster or workload findings as JSON)
      and <Code>why</Code> (requires <Code>workload</Code>) — and lets the
      connected model do the explaining. No AI key involved: the agent reasons
      over the same findings the CLI computes.
    </p>
    <div className="secnum" style={{ marginTop: 32 }}>
      ADD IT TO ANY MCP CLIENT (CLAUDE, CURSOR, CODEX, …)
    </div>
    <div className="json-panel" role="img" aria-label="kubot MCP client configuration JSON">
      <pre>
        {highlightJson(MCP_JSON).map((toks, i) => (
          <div key={i}>
            {toks.map((t, j) => (
              <span key={j} className={t.k === 'key' ? 'j-key' : t.k === 'str' ? 'j-str' : 'j-punc'}>
                {t.v}
              </span>
            ))}
          </div>
        ))}
      </pre>
    </div>
    <div className="split2">
      <div>
        <h4>Read-only by construction</h4>
        <p>
          With flags set, the agent calls <Code>inspect</Code> with no
          arguments; stdio has no per-call connection, so point it at a cluster
          via <Code>--context</Code>. kubot only GETs/LISTs, so there&apos;s
          nothing an agent can break through it.
        </p>
      </div>
      <div>
        <h4>Tools, prompts, and resources</h4>
        <p>
          It also exposes a <Code>diagnose</Code> prompt — a one-click
          &ldquo;inspect and give me a prioritized diagnosis&rdquo; workflow —
          and a <Code>kubot://schema</Code> resource with the versioned inspect
          JSON Schema.
        </p>
      </div>
    </div>
  </div>
);

export const FinalCTA: React.FC = () => (
  <div className="cta">
    <h2 className="cta-title">Point it at a cluster.</h2>
    <p className="cta-sub">
      Read-only by default. No dashboard to operate. No agent to deploy. Just
      diagnostics.
    </p>
    <div className="btnrow" style={{ justifyContent: 'flex-start' }}>
      <a className="btn primary" href="#install">
        Install kubot
      </a>
      <a className="btn ghost" href="https://github.com/kubotdev/kubot">
        View on GitHub
      </a>
    </div>
  </div>
);

export const Footer: React.FC = () => (
  <footer className="site-footer">
    <div className="wrap">
      <div className="foot-row">
        <span>kubot — FREE</span>
        <nav aria-label="footer">
          <a href="https://github.com/kubotdev/kubot">GitHub</a>
          <a href="https://github.com/kubotdev/kubot/tree/main/docs">Docs</a>
          <a href="https://github.com/kubotdev/kubot/blob/main/CHANGELOG.md">
            Changelog
          </a>
          <a href="https://github.com/kubotdev/kubot/blob/main/docs/mcp.md">MCP</a>
        </nav>
        <span>go · kubernetes</span>
      </div>
    </div>
  </footer>
);
