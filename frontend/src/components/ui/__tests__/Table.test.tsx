import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Table, type Column } from "@/components/ui/Table";

interface TestItem {
  id: string;
  name: string;
  value: number;
}

const columns: Column<TestItem>[] = [
  { key: "name", header: "Name", sortable: true, sortValue: (i) => i.name, render: (i) => i.name },
  { key: "value", header: "Value", sortable: true, sortValue: (i) => i.value, render: (i) => String(i.value) },
];

const data: TestItem[] = [
  { id: "1", name: "Alpha", value: 100 },
  { id: "2", name: "Beta", value: 50 },
  { id: "3", name: "Gamma", value: 200 },
  { id: "4", name: "Delta", value: 75 },
  { id: "5", name: "Epsilon", value: 150 },
  { id: "6", name: "Zeta", value: 25 },
  { id: "7", name: "Eta", value: 300 },
  { id: "8", name: "Theta", value: 10 },
  { id: "9", name: "Iota", value: 90 },
  { id: "10", name: "Kappa", value: 180 },
  { id: "11", name: "Lambda", value: 60 },
];

describe("Table", () => {
  it("renders columns and data", () => {
    render(
      <Table columns={columns} data={data.slice(0, 3)} getRowKey={(i) => i.id} />
    );
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Value")).toBeInTheDocument();
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("shows empty message when no data", () => {
    render(
      <Table
        columns={columns}
        data={[]}
        getRowKey={(i) => i.id}
        emptyMessage="No items"
      />
    );
    expect(screen.getByText("No items")).toBeInTheDocument();
  });

  it("paginates when data exceeds pageSize", () => {
    render(
      <Table
        columns={columns}
        data={data}
        getRowKey={(i) => i.id}
        pageSize={5}
      />
    );
    // First page: first 5 items
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Epsilon")).toBeInTheDocument();
    // Zeta is on page 2
    expect(screen.queryByText("Zeta")).not.toBeInTheDocument();
  });

  it("sorts ascending on first header click", () => {
    render(
      <Table columns={columns} data={data.slice(0, 3)} getRowKey={(i) => i.id} />
    );
    // Click Name header to sort ascending
    fireEvent.click(screen.getByText("Name"));
    const rows = screen.getAllByRole("row");
    // After ascending sort: Alpha, Beta, Gamma
    expect(rows[1]).toHaveTextContent("Alpha");
    expect(rows[2]).toHaveTextContent("Beta");
    expect(rows[3]).toHaveTextContent("Gamma");
  });

  it("sorts descending on second header click", () => {
    render(
      <Table columns={columns} data={data.slice(0, 3)} getRowKey={(i) => i.id} />
    );
    // Click twice for descending
    fireEvent.click(screen.getByText("Name"));
    fireEvent.click(screen.getByText("Name"));
    const rows = screen.getAllByRole("row");
    // After descending sort: Gamma, Beta, Alpha
    expect(rows[1]).toHaveTextContent("Gamma");
    expect(rows[3]).toHaveTextContent("Alpha");
  });

  it("filters data with search", () => {
    render(
      <Table
        columns={columns}
        data={data}
        getRowKey={(i) => i.id}
        searchable
      />
    );
    const searchInput = screen.getByLabelText("Search table");
    fireEvent.change(searchInput, { target: { value: "Alpha" } });
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.queryByText("Beta")).not.toBeInTheDocument();
  });

  it("calls onRowClick when row is clicked", () => {
    const handleClick = vi.fn();
    render(
      <Table
        columns={columns}
        data={data.slice(0, 1)}
        getRowKey={(i) => i.id}
        onRowClick={handleClick}
      />
    );
    fireEvent.click(screen.getByText("Alpha"));
    expect(handleClick).toHaveBeenCalledWith(data[0]);
  });

  it("shows skeleton when loading", () => {
    const { container } = render(
      <Table
        columns={columns}
        data={[]}
        getRowKey={(i) => i.id}
        isLoading
      />
    );
    const skeleton = container.querySelector(".skeleton");
    expect(skeleton).toBeInTheDocument();
  });
});