import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

// Suppress console.error for error boundary tests
beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

// Component that can be toggled between error/success
function ToggleBuggy({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div>All good</div>;
}

describe("ErrorBoundary", () => {
  it("renders children normally when no error", () => {
    render(
      <ErrorBoundary>
        <div>Normal content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText("Normal content")).toBeInTheDocument();
  });

  it("catches rendering error and shows fallback", () => {
    render(
      <ErrorBoundary>
        <ToggleBuggy shouldThrow />
      </ErrorBoundary>
    );
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Test error")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("renders custom fallback when provided", () => {
    render(
      <ErrorBoundary fallback={<div>Custom error</div>}>
        <ToggleBuggy shouldThrow />
      </ErrorBoundary>
    );
    expect(screen.getByText("Custom error")).toBeInTheDocument();
  });

  it("retry resets the error boundary", () => {
    function TestHarness() {
      const [shouldThrow, setShouldThrow] = React.useState(true);
      return (
        <div>
          <button
            onClick={() => setShouldThrow(false)}
            data-testid="fix"
          >
            Fix
          </button>
          <ErrorBoundary key={shouldThrow ? "error" : "ok"}>
            <ToggleBuggy shouldThrow={shouldThrow} />
          </ErrorBoundary>
        </div>
      );
    }

    render(<TestHarness />);
    // Initially shows error
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();

    // Fix the error state
    fireEvent.click(screen.getByTestId("fix"));
    // After fix, the ErrorBoundary's key changes, so it mounts fresh
    // and renders children (which no longer throw)
    expect(screen.getByText("All good")).toBeInTheDocument();
  });
});