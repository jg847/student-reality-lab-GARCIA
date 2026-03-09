import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ResourceList } from "./ResourceList";

describe("ResourceList", () => {
  it("renders resources with outbound links", () => {
    render(
      <ResourceList
        resources={[
          {
            name: "La Casa de Don Pedro",
            summary: "HUD-certified housing counseling and foreclosure prevention.",
            url: "https://www.lacasadedonpedro.org/housing/",
          },
        ]}
      />
    );

    expect(screen.getByText(/la casa de don pedro/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /visit resource/i })).toHaveAttribute(
      "href",
      "https://www.lacasadedonpedro.org/housing/"
    );
  });
});
