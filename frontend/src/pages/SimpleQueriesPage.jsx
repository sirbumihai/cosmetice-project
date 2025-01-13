import { useState } from "react";
import axios from "axios";
import QueryResult from "../components/QueryResult";

const SimpleQueriesPage = () => {
  const [year, setYear] = useState("");
  const [ordersByYear, setOrdersByYear] = useState([]);
  const [productsCategories, setProductsCategories] = useState([]);
  const [productsSuppliers, setProductsSuppliers] = useState([]);

  // Fetch orders by year
  const fetchOrdersByYear = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/auth/queries/orders-by-year`,
        { params: { year } } // Parametru pentru anul dorit
      );
      setOrdersByYear(response.data);
    } catch (err) {
      console.error("Error fetching orders by year:", err);
    }
  };

  const fetchProductsCategories = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/auth/queries/products-categories-simple`
      );
      setProductsCategories(response.data);
    } catch (err) {
      console.error("Error fetching products and categories:", err);
    }
  };

  const fetchProductsSuppliers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/auth/queries/products-suppliers-simple`
      );
      setProductsSuppliers(response.data);
    } catch (err) {
      console.error("Error fetching products and suppliers:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-blue-500 mb-4">Simple Queries</h1>

      {/* Orders by Year */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-700 mb-2">Orders by Year</h2>
        <input
          type="number"
          placeholder="Enter Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border p-2 mr-2"
        />
        <button
          onClick={fetchOrdersByYear}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Fetch Orders
        </button>
        <QueryResult
          title="Orders by Year"
          data={ordersByYear}
          renderItem={(item) => (
            <p>
              <strong>Order ID:</strong> {item.comanda_id},{" "}
              <strong>Total:</strong> {item.total}, <strong>Client:</strong>{" "}
              {item.username}
            </p>
          )}
        />
      </div>

      {/* Products and Categories */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-700 mb-2">
          Products and Categories
        </h2>
        <button
          onClick={fetchProductsCategories}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Fetch Products and Categories
        </button>
        <QueryResult
          title="Products and Categories"
          data={productsCategories}
          renderItem={(item) => (
            <p>
              <strong>Product:</strong> {item.nume_produs},{" "}
              <strong>Category:</strong> {item.nume_categorie}
            </p>
          )}
        />
      </div>

      {/* Products and Suppliers */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-700 mb-2">
          Products and Suppliers
        </h2>
        <button
          onClick={fetchProductsSuppliers}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          Fetch Products and Suppliers
        </button>
        <QueryResult
          title="Products and Suppliers"
          data={productsSuppliers}
          renderItem={(item) => (
            <p>
              <strong>Product:</strong> {item.nume_produs},{" "}
              <strong>Supplier:</strong> {item.nume_furnizor}
            </p>
          )}
        />
      </div>
    </div>
  );
};

export default SimpleQueriesPage;
