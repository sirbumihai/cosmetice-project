import { useState } from "react";
import axios from "axios";
import QueryResult from "../components/QueryResult";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const ComplexQueriesPage = () => {
  const [lowStockPopular, setLowStockPopular] = useState([]);
  const [stockLimit, setStockLimit] = useState(50);
  const [loyalCustomersRevenue, setLoyalCustomersRevenue] = useState([]);
  const [productsBoughtTogether, setProductsBoughtTogether] = useState([]);
  const [productName, setProductName] = useState("Matte Control Serum");
  const [topDiscountProducts, setTopDiscountProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("parfum dama");
  const [topProductsByCategory, setTopProductsByCategory] = useState([]);
  const [lowStockFrequent, setLowStockFrequent] = useState([]);
  const [categoriesAboveAverage, setCategoriesAboveAverage] = useState([]);

  // Fetch loyal customers revenue
  const fetchLoyalCustomersRevenue = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/auth/queries/loyal-customers-revenue"
      );
      setLoyalCustomersRevenue(response.data);
    } catch (err) {
      console.error("Error fetching loyal customers revenue:", err);
    }
  };
  // Fetch Products bought together
  const fetchProductsBoughtTogether = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/auth/queries/products-bought-together",
        {
          params: { productName },
        }
      );
      setProductsBoughtTogether(response.data);
    } catch (err) {
      console.error("Error fetching products bought together:", err);
    }
  };

  // Fetch Low Stock but Popular Products
  const fetchLowStockPopular = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/auth/queries/popular-low-stock",
        {
          params: { stockLimit },
        }
      );
      setLowStockPopular(response.data);
    } catch (err) {
      console.error("Error fetching low stock but popular products:", err);
    }
  };
  // Fetch Top discount products
  const fetchTopDiscountProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/auth/queries/top-discount-products",
        {
          params: { categoryName },
        }
      );
      setTopDiscountProducts(response.data);
    } catch (err) {
      console.error("Error fetching top discount products:", err);
    }
  };

  // Fetch Top Products by Category
  const fetchTopProductsByCategory = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/auth/queries/top-products-by-category",
        {
          params: { categoryName },
        }
      );
      setTopProductsByCategory(response.data);
    } catch (err) {
      console.error("Error fetching top products by category:", err);
    }
  };

  // Fetch Low stock frequent
  const fetchLowStockFrequent = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/auth/queries/low-stock-frequent",
        {
          params: { stockLimit },
        }
      );
      setLowStockFrequent(response.data);
    } catch (err) {
      console.error("Error fetching low stock frequent:", err);
    }
  };

  // Fetch Categories Above Average
  const fetchCategoriesAboveAverage = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/auth/queries/categories-above-average"
      );
      setCategoriesAboveAverage(response.data);
    } catch (err) {
      console.error("Error fetching categories above average price:", err);
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
                to="/cart"
                className="text-gray-700 hover:text-blue-500 mx-4"
              >
                Cart
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
        Complex Queries
      </h1>
      {/* Loyal Customers Revenue */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-700 mb-2">
          Loyal Customers Revenue
        </h2>
        <button
          onClick={fetchLoyalCustomersRevenue}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Fetch Loyal Customers Revenue
        </button>
        <QueryResult
          title="Loyal Customers Revenue"
          data={loyalCustomersRevenue}
          renderItem={(item) => (
            <p>
              <strong>Client:</strong> {item.username},{" "}
              <strong>Revenue:</strong> {item.total_venituri}
            </p>
          )}
        />
      </div>
      {/* Products Bought Together */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-700 mb-2">
          Products Bought Together
        </h2>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="border p-2 mr-2"
          placeholder="Product Name"
        />
        <button
          onClick={fetchProductsBoughtTogether}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Fetch Products Bought Together
        </button>
        <div className="flex flex-wrap justify-center mt-4">
          {productsBoughtTogether.map((product, index) => (
            <ProductCard
              key={`bought-together-${index}`}
              product={{ ...product }}
              renderItem={(prod) => (
                <>
                  <div className="font-bold text-lg mb-2">
                    {prod.nume_produs}
                  </div>
                  <p>Orders Together: {prod.cumparari_impreuna}</p>
                </>
              )}
            />
          ))}
        </div>
      </div>

      {/* Low Stock but Popular Products */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-700 mb-2">
          Low Stock but Popular Products
        </h2>
        <input
          type="number"
          value={stockLimit}
          onChange={(e) => setStockLimit(e.target.value)}
          className="border p-2 mr-2"
          placeholder="Stock Limit"
        />
        <button
          onClick={fetchLowStockPopular}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Fetch Low Stock Popular Products
        </button>
        <div className="flex flex-wrap justify-center mt-4">
          {lowStockPopular.map((product, index) => (
            <ProductCard
              key={`low-stock-popular-${index}`}
              product={{ ...product }}
              renderItem={(prod) => (
                <>
                  <div className="font-bold text-lg mb-2">
                    {prod.nume_produs}
                  </div>
                  <p>Stock: {prod.stoc}</p>
                  <p>Orders: {prod.numar_cumparari}</p>
                </>
              )}
            />
          ))}
        </div>
      </div>

      {/* Top Discount Products */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-700 mb-2">
          Top Discount Products
        </h2>
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="border p-2 mr-2"
          placeholder="Category Name"
        />
        <button
          onClick={fetchTopDiscountProducts}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Fetch Top Discount Products
        </button>
        <div className="flex flex-wrap justify-center mt-4">
          {topDiscountProducts.map((product, index) => (
            <ProductCard
              key={`top-discount-${index}`}
              product={{ ...product }}
              renderItem={(prod) => (
                <>
                  <div className="font-bold text-lg mb-2">
                    {prod.nume_produs}
                  </div>
                  <p>Discount: {prod.discount_maxim}%</p>
                </>
              )}
            />
          ))}
        </div>
      </div>

      {/* Top Products by Category */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-700 mb-2">
          Top Products by Category
        </h2>
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="border p-2 mr-2"
          placeholder="Category Name"
        />
        <button
          onClick={fetchTopProductsByCategory}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Fetch Top Products by Category
        </button>
        <div className="flex flex-wrap justify-center mt-4">
          {topProductsByCategory.map((product, index) => (
            <ProductCard
              key={`top-products-category-${index}`}
              product={{ ...product }}
              renderItem={(prod) => (
                <>
                  <div className="font-bold text-lg mb-2">
                    {prod.nume_produs}
                  </div>
                  <p>Orders: {prod.numar_comenzi}</p>
                </>
              )}
            />
          ))}
        </div>
      </div>

      {/* Low Stock Frequent */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-700 mb-2">
          Low Stock Frequent
        </h2>
        <input
          type="number"
          value={stockLimit}
          onChange={(e) => setStockLimit(e.target.value)}
          className="border p-2 mr-2"
          placeholder="Stock Limit"
        />
        <button
          onClick={fetchLowStockFrequent}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Fetch Low Stock Frequent
        </button>
        <div className="flex flex-wrap justify-center mt-4">
          {lowStockFrequent.map((product, index) => (
            <ProductCard
              key={`low-stock-frequent-${index}`}
              product={{ ...product }}
              renderItem={(prod) => (
                <>
                  <div className="font-bold text-lg mb-2">
                    {prod.nume_produs}
                  </div>
                  <p>Orders: {prod.numar_comenzi}</p>
                </>
              )}
            />
          ))}
        </div>
      </div>

      {/* Categories Above Average */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-700 mb-2">
          Categories Above Average
        </h2>
        <button
          onClick={fetchCategoriesAboveAverage}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Fetch Categories Above Average
        </button>
        <QueryResult
          title="Categories Above Average"
          data={categoriesAboveAverage}
          renderItem={(item) => (
            <p>
              <strong>Category:</strong> {item.nume_categorie},{" "}
              <strong>Max Price:</strong> {item.pret_maxim}
            </p>
          )}
        />
      </div>
    </div>
  );
};

export default ComplexQueriesPage;
