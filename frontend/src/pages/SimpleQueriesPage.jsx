import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import QueryResult from "../components/QueryResult";
import MonthlyRevenueChart from "../components/MonthlyRevenueChart";
import ProductCard from "../components/ProductCard";

const SimpleQueriesPage = () => {
  const [year, setYear] = useState("");
  const [category, setCategory] = useState("");
  const [ordersByYear, setOrdersByYear] = useState([]);
  const [productsCategories, setProductsCategories] = useState([]);
  const [productsSuppliers, setProductsSuppliers] = useState([]);
  const [clientsComands, setClientsComands] = useState([]);
  const [productsIngredients, setProductsIngredients] = useState([]);
  const [currentMonthOrders, setCurrentMonthOrders] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState([]);
  const [mostExpensiveProducts, setMostExpensiveProducts] = useState([]);
  const [topClients, setTopClients] = useState([]);
  const [unsoldProducts, setUnsoldProducts] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
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
        `http://localhost:3000/auth/queries/products-categories`
      );
      setProductsCategories(response.data);
    } catch (err) {
      console.error("Error fetching products and categories:", err);
    }
  };

  const fetchProductsSuppliers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/auth/queries/products-suppliers`
      );
      setProductsSuppliers(response.data);
    } catch (err) {
      console.error("Error fetching products and suppliers:", err);
    }
  };
  // Fetch data for clients and their orders
  const fetchClientsOrders = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/auth/queries/clients-orders"
      );
      setClientsComands(response.data);
    } catch (err) {
      console.error("Error fetching clients and their orders:", err);
    }
  };
  // Fetch data for products and their ingredients
  const fetchProductsIngredients = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/auth/queries/products-ingredients"
      );
      setProductsIngredients(response.data);
    } catch (err) {
      console.error("Error fetching products and ingredients:", err);
    }
  };
  // Fetch data for clients with current month's orders
  const fetchCurrentMonthOrders = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/auth/queries/clients-current-month-orders"
      );
      setCurrentMonthOrders(response.data);
    } catch (err) {
      console.error("Error fetching current month orders:", err);
    }
  };
  // Fetch data for products by a specific category
  const fetchProductsByCategory = async () => {
    if (!category) {
      alert("Please provide a category!");
      return;
    }
    try {
      const response = await axios.get(
        "http://localhost:3000/auth/queries/products-by-category",
        {
          params: { category },
        }
      );
      setProductsByCategory(response.data);
    } catch (err) {
      console.error("Error fetching products by category:", err);
    }
  };
  // Fetch data for the most expensive products per category
  const fetchMostExpensiveProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/auth/queries/most-expensive-products"
      );
      setMostExpensiveProducts(response.data);
    } catch (err) {
      console.error("Error fetching most expensive products:", err);
    }
  };
  // Fetch data for the top 5 clients by total order value
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
  // Fetch data for unsold products
  const fetchUnsoldProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/auth/queries/unsold-products"
      );
      setUnsoldProducts(response.data);
    } catch (err) {
      console.error("Error fetching unsold products:", err);
    }
  };
  // Fetch data for monthly revenue
  const fetchMonthlyRevenue = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/auth/queries/monthly-revenue"
      );
      setMonthlyRevenue(response.data);
    } catch (err) {
      console.error("Error fetching monthly revenue:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md w-full fixed top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-blue-500">
                Cosmetice
              </Link>
            </div>
            <div className="flex items-center">
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-blue-500 mx-4"
              >
                Dashboard
              </Link>
              <Link
                to="/simple-queries"
                className="text-gray-700 hover:text-blue-500 mx-4"
              >
                SimpleQueries
              </Link>
              <Link
                to="/complex-queries"
                className="text-gray-700 hover:text-blue-500 mx-4"
              >
                ComplexQueries
              </Link>
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-500 mx-4"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-gray-700 hover:text-blue-500 mx-4"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <h1 className="text-3xl font-bold text-blue-500 mb-4 mt-8 py-10">
        Simple Queries
      </h1>

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
        <div className="flex flex-wrap justify-center">
          {productsCategories.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
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
      {/* Clients and Orders */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-700 mb-2">
          Clients and Their Orders
        </h2>
        <button
          onClick={fetchClientsOrders}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Fetch Clients and Orders
        </button>
        <QueryResult
          title="Clients and Orders"
          data={clientsComands}
          renderItem={(item) => (
            <p>
              <strong>Client:</strong> {item.username},{" "}
              <strong>Order ID:</strong> {item.comanda_id},{" "}
              <strong>Total:</strong> {item.total}
            </p>
          )}
        />
      </div>
      {/* Products and Ingredients */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-700 mb-2">
          Products and Their Ingredients
        </h2>
        <button
          onClick={fetchProductsIngredients}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Fetch Products and Ingredients
        </button>
      </div>
      <QueryResult
        title="Products and Ingredients"
        data={productsIngredients}
        renderItem={(item) => (
          <p>
            <strong>Product:</strong> {item.nume_produs},{" "}
            <strong>Ingredient:</strong> {item.nume_ingredient}
          </p>
        )}
      />
      {/* Clients with Current Month's Orders */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-700 mb-2">
          Clients with Orders This Month
        </h2>
        <button
          onClick={fetchCurrentMonthOrders}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          Fetch Clients with Orders
        </button>
      </div>
      <QueryResult
        title="Clients with Orders This Month"
        data={currentMonthOrders}
        renderItem={(item) => (
          <p>
            <strong>Client:</strong> {item.username}, <strong>Order ID:</strong>{" "}
            {item.comanda_id}
          </p>
        )}
      />
      {/* Products by Category */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-700 mb-2">
          Products by Category
        </h2>
        <input
          type="text"
          placeholder="Enter category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 mr-2"
        />
        <button
          onClick={fetchProductsByCategory}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Fetch Products by Category
        </button>
      </div>
      <QueryResult
        title="Products by Category"
        data={productsByCategory}
        renderItem={(item) => (
          <p>
            <strong>Product:</strong> {item.nume_produs}
          </p>
        )}
      />
      {/* Most Expensive Products */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-700 mb-2">
          Most Expensive Products
        </h2>
        <button
          onClick={fetchMostExpensiveProducts}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Fetch Most Expensive Products
        </button>
      </div>
      <QueryResult
        title="Most Expensive Products"
        data={mostExpensiveProducts}
        renderItem={(item) => (
          <p>
            <strong>Product:</strong> {item.nume_produs},{" "}
            <strong>Price:</strong> {item.pret}
          </p>
        )}
      />
      {/* Top Clients */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-700 mb-2">Top Clients</h2>
        <button
          onClick={fetchTopClients}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          Fetch Top Clients
        </button>
      </div>
      <QueryResult
        title="Top Clients"
        data={topClients}
        renderItem={(item) => (
          <p>
            <strong>Client:</strong> {item.username},{" "}
            <strong>Total Orders:</strong> {item.total_comenzi}
          </p>
        )}
      />
      {/* Unsold Products */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-700 mb-2">
          Unsold Products
        </h2>
        <button
          onClick={fetchUnsoldProducts}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Fetch Unsold Products
        </button>
      </div>
      <QueryResult
        title="Unsold Products"
        data={unsoldProducts}
        renderItem={(item) => (
          <p>
            <strong>Product:</strong> {item.nume_produs}
          </p>
        )}
      />
      {/* Monthly Revenue */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-700 mb-2">
          Monthly Revenue
        </h2>
        <button
          onClick={fetchMonthlyRevenue}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Fetch Monthly Revenue
        </button>
      </div>
      {monthlyRevenue.length > 0 ? (
        <MonthlyRevenueChart data={monthlyRevenue} />
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default SimpleQueriesPage;
