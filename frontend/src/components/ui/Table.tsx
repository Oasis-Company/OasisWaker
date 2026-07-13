import React, { useMemo, useReducer, useCallback } from "react";
import { Skeleton } from "./Skeleton";
import { Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";

export interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
  sortable?: boolean;
  sortValue?: (item: T) => string | number;
  width?: string;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  getRowKey: (item: T) => string | number;
  pageSize?: number;
  total?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  searchable?: boolean;
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
}

/* ── State management ───────────────────────────────────────────────────── */

interface TableState {
  sortKey: string | null;
  sortDir: "asc" | "desc" | null;
  searchQuery: string;
  page: number;
}

type TableAction =
  | { type: "SET_SORT"; key: string }
  | { type: "SET_SEARCH"; query: string }
  | { type: "SET_PAGE"; page: number };

function tableReducer(state: TableState, action: TableAction): TableState {
  switch (action.type) {
    case "SET_SORT":
      if (state.sortKey === action.key) {
        const nextDir =
          state.sortDir === "asc"
            ? "desc"
            : state.sortDir === "desc"
              ? null
              : "asc";
        return { ...state, sortKey: nextDir ? action.key : null, sortDir: nextDir, page: 0 };
      }
      return { ...state, sortKey: action.key, sortDir: "asc", page: 0 };
    case "SET_SEARCH":
      return { ...state, searchQuery: action.query, page: 0 };
    case "SET_PAGE":
      return { ...state, page: action.page };
  }
}

const initialState: TableState = {
  sortKey: null,
  sortDir: null,
  searchQuery: "",
  page: 0,
};

/* ── Component ──────────────────────────────────────────────────────────── */

export function Table<T extends object>({
  columns,
  data,
  getRowKey,
  pageSize = 10,
  total,
  currentPage,
  onPageChange,
  searchable = false,
  isLoading = false,
  emptyMessage = "No data available",
  onRowClick,
}: TableProps<T>) {
  const [state, dispatch] = useReducer(tableReducer, initialState);

  // Controlled pagination from parent
  const effectivePage = onPageChange ? (currentPage ?? 0) : state.page;
  const setPage = useCallback(
    (p: number) => {
      if (onPageChange) {
        onPageChange(p);
      } else {
        dispatch({ type: "SET_PAGE", page: p });
      }
    },
    [onPageChange]
  );

  // Filter + sort
  const processed = useMemo(() => {
    let result = data;

    // Search
    if (searchable && state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      result = result.filter((item) =>
        columns.some((col) => {
          const val = col.sortValue?.(item) ?? String(item[col.key as keyof T] ?? "");
          return String(val).toLowerCase().includes(q);
        })
      );
    }

    // Sort
    if (state.sortKey && state.sortDir) {
      const col = columns.find((c) => c.key === state.sortKey);
      if (col) {
        result = [...result].sort((a, b) => {
          const aVal = col.sortValue?.(a) ?? (a[state.sortKey as keyof T] as string | number);
          const bVal = col.sortValue?.(b) ?? (b[state.sortKey as keyof T] as string | number);
          const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
          return state.sortDir === "desc" ? -cmp : cmp;
        });
      }
    }

    return result;
  }, [data, columns, searchable, state.searchQuery, state.sortKey, state.sortDir]);

  // Pagination
  const totalItems = total ?? processed.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const pageData = processed.slice(effectivePage * pageSize, (effectivePage + 1) * pageSize);

  const SortIcon = ({ col }: { col: Column<T> }) => {
    if (state.sortKey !== col.key) return <ArrowUpDown className="w-3 h-3 inline ml-xs" />;
    return state.sortDir === "asc" ? (
      <ArrowUp className="w-3 h-3 inline ml-xs" />
    ) : (
      <ArrowDown className="w-3 h-3 inline ml-xs" />
    );
  };

  return (
    <div>
      {/* Search bar */}
      {searchable && (
        <div className="relative mb-md">
          <Search className="absolute left-sm top-1/2 -translate-y-1/2 w-4 h-4 text-swiss-gray-400" />
          <input
            type="text"
            value={state.searchQuery}
            onChange={(e) => dispatch({ type: "SET_SEARCH", query: e.target.value })}
            placeholder="Search..."
            className="w-full border border-swiss-gray-300 bg-swiss-white text-body text-swiss-black pl-xl pr-md py-sm focus:outline-none focus:border-swiss-black"
            aria-label="Search table"
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`${col.className ?? ""} ${col.sortable ? "cursor-pointer select-none hover:bg-swiss-gray-200" : ""}`}
                  onClick={() => col.sortable && dispatch({ type: "SET_SORT", key: col.key })}
                  role={col.sortable ? "columnheader button" : "columnheader"}
                  aria-sort={
                    state.sortKey === col.key
                      ? state.sortDir === "asc"
                        ? "ascending"
                        : "descending"
                      : undefined
                  }
                  tabIndex={col.sortable ? 0 : undefined}
                  onKeyDown={(e) => {
                    if (col.sortable && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      dispatch({ type: "SET_SORT", key: col.key });
                    }
                  }}
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.header}
                  {col.sortable && <SortIcon col={col} />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="p-0">
                  <Skeleton variant="table-row" rows={4} />
                </td>
              </tr>
            ) : pageData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center text-swiss-gray-400 py-3xl"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              pageData.map((item) => (
                <tr
                  key={getRowKey(item)}
                  onClick={() => onRowClick?.(item)}
                  className={onRowClick ? "cursor-pointer" : ""}
                  role="row"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (onRowClick && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      onRowClick(item);
                    }
                  }}
                >
                  {columns.map((col) => {
                    return (
                      <td
                        key={col.key}
                        className={col.className ?? ""}
                        role="gridcell"
                      >
                        {col.render(item)}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-md">
          <p className="text-caption text-swiss-gray-500">
            {effectivePage * pageSize + 1}–{Math.min((effectivePage + 1) * pageSize, totalItems)} of {totalItems}
          </p>
          <div className="flex items-center gap-sm">
            <button
              onClick={() => setPage(Math.max(0, effectivePage - 1))}
              disabled={effectivePage === 0}
              className="border border-swiss-gray-300 px-sm py-xs text-caption hover:bg-swiss-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
              const start = Math.max(0, Math.min(effectivePage - 2, totalPages - 5));
              const pageNum = start + i;
              if (pageNum >= totalPages) return null;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-sm py-xs text-caption border transition-colors ${
                    pageNum === effectivePage
                      ? "bg-swiss-black text-swiss-white border-swiss-black"
                      : "border-swiss-gray-300 hover:bg-swiss-gray-100"
                  }`}
                  aria-label={`Page ${pageNum + 1}`}
                  aria-current={pageNum === effectivePage ? "page" : undefined}
                >
                  {pageNum + 1}
                </button>
              );
            })}
            <button
              onClick={() => setPage(Math.min(totalPages - 1, effectivePage + 1))}
              disabled={effectivePage >= totalPages - 1}
              className="border border-swiss-gray-300 px-sm py-xs text-caption hover:bg-swiss-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}