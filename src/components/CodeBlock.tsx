import { useState } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export default function CodeBlock({ code, language = 'tsx', filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-border my-4 bg-code-bg">
      {filename && (
        <div className="flex items-center justify-between px-4 py-2 bg-surface-lighter/50 border-b border-border text-sm text-text-muted">
          <span className="font-mono">{filename}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-text-muted hover:text-text transition-colors cursor-pointer"
          >
            {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
            {copied ? 'Copiado' : 'Copiar'}
          </button>
        </div>
      )}
      {!filename && (
        <div className="flex justify-end px-4 py-1.5 bg-surface-lighter/30">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text transition-colors cursor-pointer"
          >
            {copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
            {copied ? 'Copiado' : 'Copiar'}
          </button>
        </div>
      )}
      <Highlight theme={themes.nightOwl} code={code.trim()} language={language}>
        {({ style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className="p-4 overflow-x-auto text-sm leading-relaxed"
            style={{ ...style, background: 'transparent', margin: 0 }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })} className="table-row">
                <span className="table-cell pr-4 text-right text-text-muted/40 select-none text-xs w-8">
                  {i + 1}
                </span>
                <span className="table-cell">
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </span>
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
