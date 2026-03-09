import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AffordabilityCalculator } from "./AffordabilityCalculator";

function fillRequired(income: string, rent: string, utilities = "150") {
  fireEvent.change(screen.getByLabelText(/monthly gross income/i), { target: { value: income } });
  fireEvent.change(screen.getByLabelText(/total monthly rent for the unit/i), {
    target: { value: rent },
  });
  fireEvent.change(screen.getByLabelText(/monthly utilities/i), {
    target: { value: utilities },
  });
}

describe("AffordabilityCalculator", () => {
  it("calculates gross burden percentage correctly", () => {
    render(<AffordabilityCalculator />);

    fillRequired("4000", "2000", "200");

    expect(screen.getByText(/gross burden percentage:/i).closest("p")).toHaveTextContent("55.00%");
  });

  it("splits rent share correctly for 0, 1, 2, and 3 roommates", () => {
    render(<AffordabilityCalculator />);

    fillRequired("5000", "2400", "0");

    expect(screen.getByText(/your rent share:/i).closest("p")).toHaveTextContent("$2400.00");

    const plus = screen.getByRole("button", { name: /increase roommates/i });
    fireEvent.click(plus);
    expect(screen.getByText(/your rent share:/i).closest("p")).toHaveTextContent("$1200.00");

    fireEvent.click(plus);
    expect(screen.getByText(/your rent share:/i).closest("p")).toHaveTextContent("$800.00");

    fireEvent.click(plus);
    expect(screen.getByText(/your rent share:/i).closest("p")).toHaveTextContent("$600.00");
  });

  it("calculates hourly wage needed to two decimals", () => {
    render(<AffordabilityCalculator />);

    fillRequired("5000", "1800", "200");

    expect(
      screen.getByText(/hourly wage needed to stay under 30% gross burden/i).closest("p")
    ).toHaveTextContent("$38.46/hr");
  });

  it("shows monthly surplus positive and negative states", () => {
    render(<AffordabilityCalculator />);

    fillRequired("3000", "1200", "100");
    expect(screen.getByText(/monthly surplus or deficit:/i).closest("p")).toHaveTextContent("$1700.00");

    fireEvent.change(screen.getByLabelText(/monthly gross income/i), { target: { value: "1200" } });
    expect(screen.getByText(/monthly surplus or deficit:/i).closest("p")).toHaveTextContent("$-100.00");
  });

  it("renders severely rent-burdened verdict above 50%", () => {
    render(<AffordabilityCalculator />);

    fillRequired("3000", "2000", "200");

    expect(screen.getByText(/you are severely rent-burdened/i)).toBeInTheDocument();
  });

  it("renders no results panel when income is empty", () => {
    render(<AffordabilityCalculator />);

    fireEvent.change(screen.getByLabelText(/total monthly rent for the unit/i), {
      target: { value: "2000" },
    });

    expect(screen.getByText(/please enter your monthly income to see results/i)).toBeInTheDocument();
    expect(screen.queryByText(/gross burden percentage:/i)).not.toBeInTheDocument();
  });

  it("does not render ResourceList inside calculator", () => {
    render(<AffordabilityCalculator />);

    fillRequired("6000", "1200", "100");
    expect(screen.queryByText(/newark and essex help you can use now/i)).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/monthly gross income/i), { target: { value: "2000" } });
    expect(screen.queryByText(/newark and essex help you can use now/i)).not.toBeInTheDocument();
  });
});
