import React from "react";
import { render, screen } from "@testing-library/react";
import { StatsCard } from "@/components/layout/StatsCard";

describe("StatsCard", () => {
  it("renders label, value, and sub", () => {
    render(<StatsCard label="Total Nodes" value={100} sub="Registered" />);
    expect(screen.getByText("Total Nodes")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("Registered")).toBeInTheDocument();
  });

  it("renders accent bar when accent=true", () => {
    const { container } = render(
      <StatsCard label="Active" value={50} accent />
    );
    const accentBar = container.querySelector(".bg-swiss-red");
    expect(accentBar).toBeInTheDocument();
  });

  it("does not render accent bar when accent=false", () => {
    const { container } = render(
      <StatsCard label="Total" value={100} />
    );
    const accentBar = container.querySelector(".bg-swiss-red");
    expect(accentBar).not.toBeInTheDocument();
  });

  it("renders up trend arrow and value", () => {
    const { container } = render(
      <StatsCard label="Active" value={50} trend="up" trendValue="+12%" />
    );
    expect(container.textContent).toContain("↑");
    expect(container.textContent).toContain("+12%");
  });

  it("renders down trend arrow and value", () => {
    const { container } = render(
      <StatsCard label="Active" value={50} trend="down" trendValue="-5%" />
    );
    expect(container.textContent).toContain("↓");
    expect(container.textContent).toContain("-5%");
  });

  it("renders neutral trend arrow", () => {
    const { container } = render(
      <StatsCard label="Active" value={50} trend="neutral" trendValue="0%" />
    );
    expect(container.textContent).toContain("→");
  });

  it("does not render sub when not provided", () => {
    render(<StatsCard label="Nodes" value={10} />);
    expect(screen.queryByText("Registered")).not.toBeInTheDocument();
  });

  it("has aria-label with label and value", () => {
    render(<StatsCard label="Total Nodes" value={100} />);
    const region = screen.getByRole("region");
    expect(region).toHaveAttribute("aria-label", "Total Nodes: 100");
  });
});