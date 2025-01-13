import PropTypes from "prop-types";

const QueryResult = ({ title, data, renderItem }) => (
  <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl mt-8">
    <h2 className="text-2xl font-bold text-blue-500 mb-4">{title}</h2>
    {data.length > 0 ? (
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="p-4 border rounded-lg bg-gray-50">
            {renderItem(item)}
          </div>
        ))}
      </div>
    ) : (
      <p className="text-lg text-gray-700">No data available</p>
    )}
  </div>
);
QueryResult.propTypes = {
  title: PropTypes.string,
  data: PropTypes.array,
  renderItem: PropTypes.func,
};
export default QueryResult;
