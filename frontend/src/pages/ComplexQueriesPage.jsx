import { useState } from "react";
import axios from "axios";
import QueryResult from "../components/QueryResult";

const ComplexQueriesPage = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [topStock, setTopStock] = useState([]);
  const [totalSales, setTotalSales] = useState([]);
  const [topClients, setTopClients] = useState([]);

  // Fetch top stock per category
  const fetchTopStock = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/auth/queries/top-stock-per-category"
      );
      setTopStock(response.data);
    } catch (err) {
      console.error("Error fetching top stock per category:", err);
    }
  };

  // Fetch total sales by category within a date range
  const fetchTotalSales = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/auth/queries/total-sales-by-category",
        {
          params: { startDate, endDate },
        }
      );
      setTotalSales(response.data);
    } catch (err) {
      console.error("Error fetching total sales by category:", err);
    }
  };

  // Fetch top clients
  const fetchTopClients = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/auth/queries/top-clients"
      );
      setTopClients(response.data);
    } catch (err) {
      console.error("Error fetching top clients:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-blue-500 mb-4">Complex Queries</h1>

      {/* Top Stock Per Category */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-700 mb-2">
          Top Stock Per Category
        </h2>
        <button
          onClick={fetchTopStock}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Fetch Top Stock
        </button>
        <QueryResult
          title="Top Stock Per Category"
          data={topStock}
          renderItem={(item) => (
            <p>
              <strong>Product:</strong> {item.nume_produs},{" "}
              <strong>Category:</strong> {item.nume_categorie},{" "}
              <strong>Stock:</strong> {item.stoc}
            </p>
          )}
        />
      </div>

      {/* Total Sales By Category */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-700 mb-2">
          Total Sales By Category
        </h2>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 mr-2"
        />
        <button
          onClick={fetchTotalSales}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Fetch Total Sales
        </button>
        <QueryResult
          title="Total Sales By Category"
          data={totalSales}
          renderItem={(item) => (
            <p>
              <strong>Category:</strong> {item.nume_categorie},{" "}
              <strong>Total Sales:</strong> {item.suma_totala}
            </p>
          )}
        />
      </div>

      {/* Top Clients */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-700 mb-2">Top Clients</h2>
        <button
          onClick={fetchTopClients}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          Fetch Top Clients
        </button>
        <QueryResult
          title="Top Clients"
          data={topClients}
          renderItem={(item) => (
            <p>
              <strong>Client:</strong> {item.username},{" "}
              <strong>Max Order:</strong> {item.comanda_maxima}
            </p>
          )}
        />
      </div>
    </div>
  );
};

export default ComplexQueriesPage;
