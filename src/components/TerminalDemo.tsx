import React, { useState } from 'react';
import { demos, commandOrder, type Line } from '../data/demos';

const renderLine = (line: Line, key: number) => (
  <div key={key}>
    <pre>
      {line.map((s, i) => (
        <span key={i} className={s.c}>
          {s.t}
        </span>
      ))}
    </pre>
  </div>
);

export const TerminalDemo: React.FC = () => {
  const [active, setActive] = useState('kubot inspect');
  const demo = demos[active];
  return (
    <div
      className="terminal"
      role="region"
      aria-label={`kubot demo terminal, showing ${demo.cmd}`}
    >
      <div className="term-bar">
        <div className="traffic" aria-hidden="true">
          <span style={{ background: '#F87171' }} />
          <span style={{ background: '#FBBF24' }} />
          <span style={{ background: '#34D399' }} />
        </div>
        <span className="term-title">{demo.title}</span>
        <span />
      </div>
      <div className="term-body">
        <div>
          <pre>
            <span className="t-prompt">➜ ~ </span>
            <span className="t-cmd">{demo.cmd}</span>
            <span className="cursor" aria-hidden="true" />
          </pre>
        </div>
        <hr className="t-divider" />
        <div className="term-scroll" aria-live="polite">
          {demo.lines.map(renderLine)}
        </div>
      </div>
      <div className="term-cmdbar" role="group" aria-label="demo commands">
        {commandOrder.map((c) => (
          <button key={c} aria-pressed={active === c} onClick={() => setActive(c)}>
            {c}
          </button>
        ))}
      </div>
      <div className="term-foot">
        <span>live demo — type a command above</span>
        <a href="https://github.com/kubotdev/kubot">see the real CLI →</a>
      </div>
    </div>
  );
};
