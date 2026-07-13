import React from "react";

export interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
}

export function Table<T extends object>({
  columns,
  data,
  onRowClick,
}: TableProps<T>) {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key} className={col.className}>
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 && (
          <tr>
            <td
              colSpan={columns.length}
              className="text-center text-swiss-gray-400 py-3xl"
            >
              No data available
            </td>
          </tr>
        )}
        {data.map((item, idx) => (
          <tr
            key={idx}
            onClick={() => onRowClick?.(item)}
            className={onRowClick ? "cursor-pointer" : ""}
          >
            {columns.map((col) => (
              <td key={col.key} className={col.className}>
                {col.render(item)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}