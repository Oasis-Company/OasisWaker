import { formatBytes, formatDate, formatTimeAgo } from "@/lib/format";

describe("formatBytes", () => {
  it("returns '0 B' for 0 bytes", () => {
    expect(formatBytes(0)).toBe("0 B");
  });

  it("formats 1024 bytes as '1 KB'", () => {
    expect(formatBytes(1024)).toBe("1.0 KB");
  });

  it("formats 1.5 GB correctly", () => {
    expect(formatBytes(1.5 * 1024 * 1024 * 1024)).toBe("1.5 GB");
  });

  it("respects decimal places", () => {
    expect(formatBytes(1536, 0)).toBe("2 KB");
  });
});

describe("formatDate", () => {
  it("formats a date string correctly", () => {
    const result = formatDate("2024-06-15T12:00:00Z");
    expect(result).toBe("Jun 15, 2024");
  });
});

describe("formatTimeAgo", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-06-15T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns 'just now' for less than 5 seconds", () => {
    const date = new Date("2024-06-15T12:00:02Z").toISOString();
    expect(formatTimeAgo(date)).toBe("just now");
  });

  it("returns '5m ago' for 5 minutes ago", () => {
    const date = new Date("2024-06-15T11:55:00Z").toISOString();
    expect(formatTimeAgo(date)).toBe("5m ago");
  });

  it("returns '2h ago' for 2 hours ago", () => {
    const date = new Date("2024-06-15T10:00:00Z").toISOString();
    expect(formatTimeAgo(date)).toBe("2h ago");
  });

  it("returns '3d ago' for 3 days ago", () => {
    const date = new Date("2024-06-12T12:00:00Z").toISOString();
    expect(formatTimeAgo(date)).toBe("3d ago");
  });
});