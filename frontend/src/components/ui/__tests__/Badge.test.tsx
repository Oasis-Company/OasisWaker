import React from "react";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/Badge";

describe("Badge", () => {
  it("renders online variant", () => {
    render(<Badge variant="online">online</Badge>);
    const badge = screen.getByRole("status");
    expect(badge).toHaveTextContent("online");
    expect(badge).toHaveAttribute("aria-label", "Status: online");
  });

  it("renders offline variant", () => {
    render(<Badge variant="offline">offline</Badge>);
    const badge = screen.getByRole("status");
    expect(badge).toHaveTextContent("offline");
    expect(badge).toHaveAttribute("aria-label", "Status: offline");
  });

  it("renders error variant", () => {
    render(<Badge variant="error">error</Badge>);
    const badge = screen.getByRole("status");
    expect(badge).toHaveTextContent("error");
  });

  it("renders default variant", () => {
    render(<Badge>default</Badge>);
    const badge = screen.getByRole("status");
    expect(badge).toHaveTextContent("default");
  });

  it("has role=status", () => {
    render(<Badge>test</Badge>);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("has no tabIndex on non-interactive element", () => {
    render(<Badge>test</Badge>);
    expect(screen.getByRole("status")).not.toHaveAttribute("tabindex");
  });
});