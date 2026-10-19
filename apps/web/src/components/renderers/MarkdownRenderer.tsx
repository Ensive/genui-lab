import ReactMarkdown from "react-markdown";

interface MarkdownRendererProps {
  markdown: string;
}

export function MarkdownRenderer({ markdown }: MarkdownRendererProps) {
  return (
    <article
      className="prose-lab max-w-none space-y-3 text-sm leading-relaxed"
      data-testid="markdown-result"
    >
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl font-semibold tracking-tight text-[var(--color-ink)]">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-4 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-mono text-sm font-medium text-[var(--color-ink)]">{children}</h3>
          ),
          p: ({ children }) => <p className="text-[var(--color-ink)]">{children}</p>,
          ul: ({ children }) => (
            <ul className="list-disc space-y-1 pl-5 text-[var(--color-ink)]">{children}</ul>
          ),
          li: ({ children }) => <li>{children}</li>,
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          code: ({ children }) => (
            <code className="rounded bg-[var(--color-panel-muted)] px-1 py-0.5 font-mono text-[12px]">
              {children}
            </code>
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </article>
  );
}
