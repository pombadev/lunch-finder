import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { FilterControls, type FilterChip } from "./FilterControls";

describe("FilterControls", () => {
  const defaultProps = {
    sortBy: "distance" as const,
    onSortChange: vi.fn(),
    activeChips: new Set<FilterChip>(),
    onChipToggle: vi.fn(),
  };

  it("should render filters header and sort options", () => {
    render(<FilterControls {...defaultProps} />);

    expect(screen.getByText(/filters/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/sort/i)).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: /closest first/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: /most popular/i }),
    ).toBeInTheDocument();
  });

  it("should render quick filter chips", () => {
    render(<FilterControls {...defaultProps} />);

    expect(
      screen.getByRole("button", { name: /open now/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /under 500m/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /top rated/i }),
    ).toBeInTheDocument();
  });

  it("should call onSortChange when selecting most popular", () => {
    const onSortChange = vi.fn();
    render(<FilterControls {...defaultProps} onSortChange={onSortChange} />);

    fireEvent.change(screen.getByLabelText(/sort/i), {
      target: { value: "popularity" },
    });

    expect(onSortChange).toHaveBeenCalledWith("popularity");
  });

  it("should call onChipToggle when a chip is clicked", () => {
    const onChipToggle = vi.fn();
    render(<FilterControls {...defaultProps} onChipToggle={onChipToggle} />);

    fireEvent.click(screen.getByRole("button", { name: /open now/i }));

    expect(onChipToggle).toHaveBeenCalledWith("openNow");
  });

  it("should mark active chips with aria-pressed", () => {
    render(
      <FilterControls
        {...defaultProps}
        activeChips={new Set<FilterChip>(["openNow"])}
      />,
    );

    expect(screen.getByRole("button", { name: /open now/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: /under 500m/i })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("should reflect selected sort value", () => {
    const { rerender } = render(<FilterControls {...defaultProps} />);

    expect(screen.getByLabelText(/sort/i)).toHaveValue("distance");

    rerender(<FilterControls {...defaultProps} sortBy="popularity" />);

    expect(screen.getByLabelText(/sort/i)).toHaveValue("popularity");
  });

  it("should collapse and expand when toggle is clicked", () => {
    render(<FilterControls {...defaultProps} />);

    expect(screen.getByLabelText(/sort/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /filters/i }));
    expect(screen.queryByLabelText(/sort/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /filters/i }));
    expect(screen.getByLabelText(/sort/i)).toBeInTheDocument();
  });

  it("should show hint text when popularity sort is selected", () => {
    render(<FilterControls {...defaultProps} sortBy="popularity" />);

    expect(screen.getByText(/ranked by google places/i)).toBeInTheDocument();
  });

  it("should not show hint text when distance sort is selected", () => {
    render(<FilterControls {...defaultProps} sortBy="distance" />);

    expect(
      screen.queryByText(/ranked by google places/i),
    ).not.toBeInTheDocument();
  });
});
