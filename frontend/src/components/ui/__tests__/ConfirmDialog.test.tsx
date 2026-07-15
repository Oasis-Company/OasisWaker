import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

describe("ConfirmDialog", () => {
  const defaultProps = {
    isOpen: false,
    title: "Delete Node",
    message: "Are you sure you want to delete this node?",
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders when open", () => {
    render(<ConfirmDialog {...defaultProps} isOpen />);
    expect(screen.getByText("Delete Node")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to delete this node?")
    ).toBeInTheDocument();
  });

  it("dialog is not open when closed", () => {
    const { container } = render(
      <ConfirmDialog {...defaultProps} isOpen={false} />
    );
    const dialog = container.querySelector("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog?.open).toBe(false);
  });

  it("has correct accessibility attributes", () => {
    const { container } = render(
      <ConfirmDialog {...defaultProps} isOpen />
    );
    const dialog = container.querySelector("dialog");
    expect(dialog).toHaveAttribute("role", "alertdialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute(
      "aria-labelledby",
      "confirm-dialog-title"
    );
  });

  it("calls onConfirm when confirm button is clicked", () => {
    const onConfirm = vi.fn();
    render(<ConfirmDialog {...defaultProps} isOpen onConfirm={onConfirm} />);
    fireEvent.click(screen.getByText("Confirm"));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when cancel button is clicked", () => {
    const onCancel = vi.fn();
    render(<ConfirmDialog {...defaultProps} isOpen onCancel={onCancel} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("renders danger variant with red confirm button", () => {
    render(<ConfirmDialog {...defaultProps} isOpen variant="danger" />);
    const confirmBtn = screen.getByText("Confirm");
    expect(confirmBtn.className).toContain("bg-swiss-red");
  });

  it("shows loading state and disables buttons", () => {
    render(<ConfirmDialog {...defaultProps} isOpen isLoading />);
    expect(screen.getByText("Processing...")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeDisabled();
    expect(screen.getByText("Processing...")).toBeDisabled();
  });

  it("does not call onCancel when backdrop is clicked while loading", () => {
    const onCancel = vi.fn();
    const { container } = render(
      <ConfirmDialog {...defaultProps} isOpen isLoading onCancel={onCancel} />
    );
    // Simulate clicking the backdrop (dialog element itself)
    const dialog = container.querySelector("dialog");
    if (dialog) fireEvent.click(dialog);
    expect(onCancel).not.toHaveBeenCalled();
  });

  it("renders custom button labels", () => {
    render(
      <ConfirmDialog
        {...defaultProps}
        isOpen
        confirmLabel="Yes, delete"
        cancelLabel="No, keep"
      />
    );
    expect(screen.getByText("Yes, delete")).toBeInTheDocument();
    expect(screen.getByText("No, keep")).toBeInTheDocument();
  });
});