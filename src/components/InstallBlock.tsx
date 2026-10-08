import React, { useState } from 'react';

const CURL = 'curl -fsSL https://raw.githubusercontent.com/kubotdev/kubot/main/install.sh | sh';
const GO = 'go install github.com/kubotdev/kubot/cmd/kubot@latest';

export const InstallBlock: React.FC = () => {
  const [tab, setTab] = useState<'curl' | 'go'>('curl');
  const [copied, setCopied] = useState(false);
  const text = tab === 'curl' ? CURL : GO;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  return (
    <div>
      <div className="install-tabs" role="group" aria-label="install method">
        <button aria-pressed={tab === 'curl'} onClick={() => setTab('curl')}>
          curl
        </button>
        <button aria-pressed={tab === 'go'} onClick={() => setTab('go')}>
          go
        </button>
      </div>
      <div className="codeblock">
        <code>
          <span className="ps1">$ </span>
          {text}
        </code>
        <button className="copybtn" onClick={copy}>
          {copied ? 'copied' : 'copy'}
        </button>
      </div>
      <p className="small muted" style={{ marginTop: 10 }}>
        {tab === 'curl'
          ? 'No Go needed. Verifies sha256 always; cosign signature when cosign is on PATH.'
          : 'Needs Go. Reports module version via kubot --version.'}{' '}
        Needs a kubeconfig that can read the cluster — same resolution as
        kubectl. GET/LIST only.
      </p>
    </div>
  );
};
