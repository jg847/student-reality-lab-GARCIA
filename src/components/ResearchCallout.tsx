type ResearchCalloutProps = {
  title: string;
  finding: string;
  sourceLabel: string;
  sourceUrl: string;
};

export function ResearchCallout({
  title,
  finding,
  sourceLabel,
  sourceUrl,
}: ResearchCalloutProps) {
  return (
    <aside
      className="story-card"
      style={{
        borderLeft: "6px solid var(--trend-line)",
        background: "linear-gradient(180deg, #f9fbfd 0%, #ffffff 100%)",
      }}
      aria-label={`Research callout: ${title}`}
    >
      <p
        style={{
          margin: 0,
          color: "var(--text-strong)",
          fontWeight: 700,
          fontFamily: "var(--font-display)",
          fontSize: "var(--step-1)",
        }}
      >
        {title}
      </p>
      <p className="story-body" style={{ marginTop: "0.5rem", marginBottom: "0.75rem" }}>
        {finding}
      </p>
      <a
        href={sourceUrl}
        target="_blank"
        rel="noreferrer"
        style={{ color: "var(--trend-line)", fontWeight: 600, textDecoration: "underline" }}
      >
        Source: {sourceLabel}
      </a>
    </aside>
  );
}
