import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RentBurden } from "./RentBurden";

describe("RentBurden", () => {
  it("renders a wage slider input", () => {
    render(<RentBurden currentMonthlyRent={2000} livingWage={25} />);

    const slider = screen.getByRole("slider", { name: /adjust expected hourly wage/i });
    expect(slider).toBeInTheDocument();
  });

  it("updates the displayed rent-to-income ratio when slider changes", () => {
    render(<RentBurden currentMonthlyRent={2000} livingWage={25} />);

    expect(screen.getByText(/Rent-to-Income Ratio: 46.15%/i)).toBeInTheDocument();

    const slider = screen.getByRole("slider", { name: /adjust expected hourly wage/i });
    fireEvent.change(slider, { target: { value: "35" } });

    expect(screen.getByText(/Rent-to-Income Ratio: 32.97%/i)).toBeInTheDocument();
  });

  it("drops the ratio by half when split-with-roommate is toggled", () => {
    render(<RentBurden currentMonthlyRent={2000} livingWage={25} />);

    expect(screen.getByText(/Rent-to-Income Ratio: 46.15%/i)).toBeInTheDocument();

    const roommateToggle = screen.getByLabelText(/split rent with 1 roommate/i);

    fireEvent.click(roommateToggle);

    expect(screen.getByText(/Rent-to-Income Ratio: 23.08%/i)).toBeInTheDocument();
  });
});
