import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import EditableRow from "./EditableRow";

const TableComponent = ({
  title,
  data,
  columns,
  onInsert,
  onUpdate,
  onDelete,
  reloadData,
}) => {
  const [rows, setRows] = useState([]);
  const [editingRowId, setEditingRowId] = useState(null);
  const [newData, setNewData] = useState({});

  useEffect(() => {
    const initializedRows = data.map((row, index) => ({
      ...row,
      id: row[columns[0]] || row.id || `${columns[0]}-${index}-${Date.now()}`,
    }));
    setRows(initializedRows);
  }, [data, columns]);

  const handleInsert = async () => {
    const newRow = { id: `${columns[0]}-${Date.now()}`, ...newData };
    await onInsert(newRow);
    setNewData({});
    reloadData();
  };

  const handleUpdate = async (id, updatedData) => {
    await onUpdate(id, updatedData);
    setEditingRowId(null);
    reloadData();
  };

  const handleDelete = async (id) => {
    await onDelete(id);
    reloadData();
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-700 mb-4">{title}</h2>
      {rows.length !== 0 ? (
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={`${col}-${index}`}
                  className="py-2 px-4 border-b text-left"
                >
                  {col}
                </th>
              ))}
              <th className="py-2 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => {
              if (editingRowId === row.id) {
                return (
                  <EditableRow
                    key={`${row.id}-${rowIndex}`}
                    row={row}
                    columns={columns}
                    onSave={handleUpdate}
                    onCancel={() => setEditingRowId(null)}
                  />
                );
              } else {
                return (
                  <tr key={`${row.id}-${rowIndex}`}>
                    {columns.map((col, colIndex) => (
                      <td
                        key={`${row.id}-${col}-${colIndex}`}
                        className="py-2 px-4 border-b"
                      >
                        {row[col]}
                      </td>
                    ))}
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => setEditingRowId(row.id)}
                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2"
                      >
                        ✐
                      </button>
                      <button
                        onClick={() => handleDelete(row.id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      >
                        DELETE
                      </button>
                    </td>
                  </tr>
                );
              }
            })}
          </tbody>
        </table>
      ) : (
        <p className="text-lg text-gray-700">Nu sunt {title.toLowerCase()}</p>
      )}
      <div className="mt-4">
        {columns.map((col, index) => (
          <input
            key={`${col}-${index}`}
            type="text"
            placeholder={col}
            value={newData[col] || ""}
            onChange={(e) => setNewData({ ...newData, [col]: e.target.value })}
            className="border p-2 mr-2"
          />
        ))}
        <button
          onClick={handleInsert}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Add {title}
        </button>
      </div>
    </div>
  );
};

TableComponent.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }),
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ).isRequired,
  columns: PropTypes.array.isRequired,
  onInsert: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
};

export default TableComponent;
