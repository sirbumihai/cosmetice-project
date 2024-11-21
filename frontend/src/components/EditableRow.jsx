import { useState } from "react";
import PropTypes from "prop-types";
const EditableRow = ({ row, columns, onSave, onCancel }) => {
  const [localData, setLocalData] = useState({ ...row });

  return (
    <tr key={row.id}>
      {columns.map((col, index) => (
        <td key={`${row.id}-${col}-${index}`} className="py-2 px-4 border-b">
          <input
            type="text"
            value={localData[col] || ""}
            onChange={(e) =>
              setLocalData({ ...localData, [col]: e.target.value })
            }
            className="border p-2"
          />
        </td>
      ))}
      <td className="py-2 px-4 border-b">
        <button
          onClick={() => onSave(row.id, localData)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          ✔
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          X
        </button>
      </td>
    </tr>
  );
};

EditableRow.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
  columns: PropTypes.array.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default EditableRow;
