import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { FilterControls } from "./FilterControls";

describe("FilterControls", () => {
  it("should render filters header and sort options", () => {
    render(<FilterControls sortBy="distance" onSortChange={vi.fn()} />);

    expect(screen.getByText("Filters")).toBeInTheDocument();
    expect(screen.getByLabelText(/sort by/i)).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: /distance/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: /popularity/i }),
    ).toBeInTheDocument();
  });

  it("should call onSortChange when selecting popularity", () => {
    const onSortChange = vi.fn();
    render(<FilterControls sortBy="distance" onSortChange={onSortChange} />);

    fireEvent.change(screen.getByLabelText(/sort by/i), {
      target: { value: "popularity" },
    });

    expect(onSortChange).toHaveBeenCalledWith("popularity");
  });

  it("should reflect selected sort value", () => {
    const { rerender } = render(
      <FilterControls sortBy="distance" onSortChange={vi.fn()} />,
    );

    expect(screen.getByLabelText(/sort by/i)).toHaveValue("distance");

    rerender(<FilterControls sortBy="popularity" onSortChange={vi.fn()} />);

    expect(screen.getByLabelText(/sort by/i)).toHaveValue("popularity");
  });
});
