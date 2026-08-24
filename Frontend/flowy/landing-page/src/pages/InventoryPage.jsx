import { useMemo, useState } from "react";
import TopNavbar from "../components/common/home/TopNavbar.jsx";
import SideNavbar from "../components/common/home/SideNavbar.jsx";
import PolkaField from "../components/common/home/PolkaField.jsx";
import "./inventoryPage.css";

const DEFAULT_USERNAME = "User";

const DEFAULT_COLUMNS = [
  { id: "product_id", label: "Product_id" },
  { id: "product_name", label: "Product_name" },
  { id: "quantity", label: "Quantity" },
];

const DEFAULT_ROWS = [
  {
    id: "row-1",
    product_id: "P-001",
    product_name: "Sample item",
    quantity: "24",
  },
  {
    id: "row-2",
    product_id: "P-002",
    product_name: "Packaging box",
    quantity: "120",
  },
  {
    id: "row-3",
    product_id: "P-003",
    product_name: "Barcode label",
    quantity: "64",
  },
];

function createBlankRow(columns, index) {
  const row = { id: `row-${Date.now()}-${index}` };
  columns.forEach((column) => {
    row[column.id] = "";
  });
  return row;
}

function createColumnId(columns) {
  return `column_${columns.length + 1}_${Date.now()}`;
}

export default function InventoryPage({
  username = DEFAULT_USERNAME,
  inventoryData,
}) {
  const initialColumns = useMemo(() => {
    if (
      inventoryData?.columns &&
      Array.isArray(inventoryData.columns) &&
      inventoryData.columns.length >= 3
    ) {
      return inventoryData.columns.map((column, index) => ({
        id: column.id || `column-${index + 1}`,
        label: column.label || `Column ${index + 1}`,
      }));
    }

    return DEFAULT_COLUMNS;
  }, [inventoryData]);

  const initialRows = useMemo(() => {
    if (
      inventoryData?.rows &&
      Array.isArray(inventoryData.rows) &&
      inventoryData.rows.length
    ) {
      return inventoryData.rows.map((row, index) => ({
        id: row.id || `row-${index + 1}`,
        ...row,
      }));
    }

    return DEFAULT_ROWS;
  }, [inventoryData]);

  const [columns, setColumns] = useState(initialColumns);
  const [rows, setRows] = useState(initialRows);

  const [editingColumnId, setEditingColumnId] = useState(null);
  const [editingRowId, setEditingRowId] = useState(null);

  const handleCellChange = (rowId, columnId, value) => {
    setRows((currentRows) =>
      currentRows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              [columnId]: value,
            }
          : row,
      ),
    );
  };

  const handleColumnRename = (columnId, value) => {
    setColumns((currentColumns) =>
      currentColumns.map((column) =>
        column.id === columnId
          ? {
              ...column,
              label: value || column.label,
            }
          : column,
      ),
    );
  };

  const handleRowRename = (rowId, value) => {
    setRows((currentRows) =>
      currentRows.map((row, index) =>
        row.id === rowId
          ? {
              ...row,
              rowLabel: value || row.rowLabel || `Row ${index + 1}`,
            }
          : row,
      ),
    );
  };

  const addRow = () => {
    setRows((currentRows) => [
      ...currentRows,
      createBlankRow(columns, currentRows.length + 1),
    ]);
  };

  const addColumn = () => {
    const nextColumnId = createColumnId(columns);
    const nextColumnLabel = `Column ${columns.length + 1}`;

    setColumns((currentColumns) => [
      ...currentColumns,
      { id: nextColumnId, label: nextColumnLabel },
    ]);

    setRows((currentRows) =>
      currentRows.map((row) => ({
        ...row,
        [nextColumnId]: "",
      })),
    );
  };

  const deleteLastRow = () => {
    setRows((currentRows) => {
      if (currentRows.length <= 1) return currentRows;
      return currentRows.slice(0, -1);
    });
  };

  const deleteLastColumn = () => {
    setColumns((currentColumns) => {
      if (currentColumns.length <= 3) return currentColumns;

      const nextColumns = currentColumns.slice(0, -1);
      const removedColumn = currentColumns[currentColumns.length - 1];

      setRows((currentRows) =>
        currentRows.map((row) => {
          const nextRow = { ...row };
          delete nextRow[removedColumn.id];
          return nextRow;
        }),
      );

      return nextColumns;
    });
  };

  return (
    <div className="inventory-main">
      <TopNavbar />

      <div className="inventory-shell">
        <SideNavbar />

        <main className="inventory-workspace">
          <PolkaField />

          <section className="inventory-stage">
            <div className="inventory-card">
              <header className="inventory-card__header">
                <div>
                  <p className="inventory-card__eyebrow">
                    Inventory management
                  </p>
                  <h1>Inventory of {username}</h1>
                  <p className="inventory-card__subtext">
                    This table is ready for dynamic backend-driven inventory
                    data and manual updates.
                  </p>
                </div>

                <div className="inventory-card__actions">
                  <button
                    type="button"
                    className="inventory-action-button inventory-action-button--primary"
                    onClick={addRow}
                  >
                    + Add row
                  </button>

                  <button
                    type="button"
                    className="inventory-action-button"
                    onClick={addColumn}
                  >
                    + Add column
                  </button>

                  <button
                    type="button"
                    className="inventory-action-button inventory-action-button--danger"
                    onClick={deleteLastRow}
                  >
                    − Delete row
                  </button>

                  <button
                    type="button"
                    className="inventory-action-button inventory-action-button--danger"
                    onClick={deleteLastColumn}
                  >
                    − Delete column
                  </button>
                </div>
              </header>

              <div className="inventory-table-shell">
                <div className="inventory-table-scroll">
                  <table className="inventory-table">
                    <thead>
                      <tr>
                        <th className="inventory-table__index">#</th>

                        {columns.map((column, index) => (
                          <th key={column.id}>
                            {editingColumnId === column.id ? (
                              <input
                                className="inventory-table__rename-input"
                                autoFocus
                                defaultValue={column.label}
                                onBlur={(event) => {
                                  handleColumnRename(
                                    column.id,
                                    event.target.value.trim(),
                                  );
                                  setEditingColumnId(null);
                                }}
                                onKeyDown={(event) => {
                                  if (event.key === "Enter") {
                                    handleColumnRename(
                                      column.id,
                                      event.target.value.trim(),
                                    );
                                    setEditingColumnId(null);
                                  }

                                  if (event.key === "Escape") {
                                    setEditingColumnId(null);
                                  }
                                }}
                              />
                            ) : (
                              <button
                                type="button"
                                className="inventory-table__heading-button"
                                onDoubleClick={() =>
                                  setEditingColumnId(column.id)
                                }
                                title="Double-click to rename column"
                              >
                                {column.label || `Column ${index + 1}`}
                              </button>
                            )}
                          </th>
                        ))}

                        <th className="inventory-table__append">
                          <div className="inventory-table__append-stack">
                            <button
                              type="button"
                              className="inventory-table__add-button"
                              onClick={addColumn}
                              title="Add column"
                            >
                              +
                            </button>

                            <button
                              type="button"
                              className="inventory-table__remove-button"
                              onClick={deleteLastColumn}
                              title="Delete last column"
                              disabled={columns.length <= 3}
                            >
                              −
                            </button>
                          </div>
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {rows.map((row, rowIndex) => (
                        <tr key={row.id}>
                          <th
                            className="inventory-table__row-label"
                            scope="row"
                          >
                            {editingRowId === row.id ? (
                              <input
                                className="inventory-table__rename-input"
                                autoFocus
                                defaultValue={
                                  row.rowLabel || `Row ${rowIndex + 1}`
                                }
                                onBlur={(event) => {
                                  handleRowRename(
                                    row.id,
                                    event.target.value.trim(),
                                  );
                                  setEditingRowId(null);
                                }}
                                onKeyDown={(event) => {
                                  if (event.key === "Enter") {
                                    handleRowRename(
                                      row.id,
                                      event.target.value.trim(),
                                    );
                                    setEditingRowId(null);
                                  }

                                  if (event.key === "Escape") {
                                    setEditingRowId(null);
                                  }
                                }}
                              />
                            ) : (
                              <button
                                type="button"
                                className="inventory-table__heading-button inventory-table__heading-button--row"
                                onDoubleClick={() => setEditingRowId(row.id)}
                                title="Double-click to rename row"
                              >
                                {row.rowLabel || `Row ${rowIndex + 1}`}
                              </button>
                            )}
                          </th>

                          {columns.map((column) => (
                            <td key={`${row.id}-${column.id}`}>
                              <input
                                className="inventory-table__cell-input"
                                type="text"
                                value={row[column.id] ?? ""}
                                onChange={(event) =>
                                  handleCellChange(
                                    row.id,
                                    column.id,
                                    event.target.value,
                                  )
                                }
                                placeholder={`Enter ${column.label}`}
                              />
                            </td>
                          ))}

                          <td className="inventory-table__append">
                            {rowIndex === rows.length - 1 ? (
                              <div className="inventory-table__append-stack">
                                <button
                                  type="button"
                                  className="inventory-table__add-button"
                                  onClick={addRow}
                                  title="Add row"
                                >
                                  +
                                </button>

                                <button
                                  type="button"
                                  className="inventory-table__remove-button"
                                  onClick={deleteLastRow}
                                  title="Delete last row"
                                  disabled={rows.length <= 1}
                                >
                                  −
                                </button>
                              </div>
                            ) : null}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
