type Resource = {
  name: string;
  summary: string;
  url: string;
};

type ResourceListProps = {
  resources: Resource[];
};

export function ResourceList({ resources }: ResourceListProps) {
  return (
    <section className="grid gap-4" aria-label="Newark and Essex housing support resources">
      <h3
        style={{
          margin: 0,
          color: "var(--text-strong)",
          fontFamily: "var(--font-display)",
          fontSize: "var(--step-1)",
        }}
      >
        Newark and Essex Help You Can Use Now
      </h3>

      <div className="grid gap-3">
        {resources.map((resource) => (
          <article
            key={resource.name}
            className="story-card"
            style={{
              borderLeft: "4px solid var(--burden-safe)",
              padding: "1rem 1.25rem",
            }}
          >
            <p style={{ margin: 0, color: "var(--text-strong)", fontWeight: 700 }}>{resource.name}</p>
            <p className="story-body" style={{ marginTop: "0.4rem", marginBottom: "0.5rem" }}>
              {resource.summary}
            </p>
            <a
              href={resource.url}
              target="_blank"
              rel="noreferrer"
              style={{ color: "var(--trend-line)", fontWeight: 600, textDecoration: "underline" }}
            >
              Visit resource
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
