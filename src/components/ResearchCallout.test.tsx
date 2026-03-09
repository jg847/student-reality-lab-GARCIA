import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ResearchCallout } from "./ResearchCallout";

describe("ResearchCallout", () => {
  it("renders finding text and source link", () => {
    render(
      <ResearchCallout
        title="Cost Burden Is Widespread"
        finding="Half of U.S. renters were cost burdened in 2022."
        sourceLabel="Harvard JCHS"
        sourceUrl="https://www.jchs.harvard.edu/americas-rental-housing-2024"
      />
    );

    expect(screen.getByText(/half of u\.s\. renters were cost burdened/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /source: harvard jchs/i })).toHaveAttribute(
      "href",
      "https://www.jchs.harvard.edu/americas-rental-housing-2024"
    );
  });
});
