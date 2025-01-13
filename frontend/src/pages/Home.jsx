import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import QueryResult from "../components/QueryResult";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [ordersClients, setOrdersClients] = useState([]);
  const [productsCategories, setProductsCategories] = useState([]);
  const [productsSuppliers, setProductsSuppliers] = useState([]);
  const [ordersProducts, setOrdersProducts] = useState([]);
  const [productsIngredients, setProductsIngredients] = useState([]);
  const [ordersClientsProducts, setOrdersClientsProducts] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/auth/home", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setUser(response.data.user);
        } else {
          navigate("/login");
        }
      } catch (err) {
        navigate("/login");
        console.log(err);
      }
    };

    const fetchData = async () => {
      try {
        const ordersClientsResponse = await axios.get(
          "http://localhost:3000/auth/queries/orders-clients"
        );
        setOrdersClients(ordersClientsResponse.data);

        const productsCategoriesResponse = await axios.get(
          "http://localhost:3000/auth/queries/products-categories"
        );
        setProductsCategories(productsCategoriesResponse.data);

        const productsSuppliersResponse = await axios.get(
          "http://localhost:3000/auth/queries/products-suppliers"
        );
        setProductsSuppliers(productsSuppliersResponse.data);

        const ordersProductsResponse = await axios.get(
          "http://localhost:3000/auth/queries/orders-products"
        );
        setOrdersProducts(ordersProductsResponse.data);

        const productsIngredientsResponse = await axios.get(
          "http://localhost:3000/auth/queries/products-ingredients"
        );
        setProductsIngredients(productsIngredientsResponse.data);

        const ordersClientsProductsResponse = await axios.get(
          "http://localhost:3000/auth/queries/orders-clients-products"
        );
        setOrdersClientsProducts(ordersClientsProductsResponse.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
    fetchData();
  }, [navigate]);

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
      <div className="flex flex-col items-center justify-center pt-20 px-4">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl mt-8">
          <h1 className="text-3xl font-bold text-blue-500 mb-4">
            Welcome Home
          </h1>
          {user ? (
            <div>
              <p className="text-lg text-gray-700 mb-2">
                Hello, {user.username}!
              </p>
              <p className="text-sm text-gray-500">Email: {user.email}</p>
            </div>
          ) : (
            <p className="text-lg text-gray-700">Loading...</p>
          )}
        </div>
        <QueryResult
          title="Orders and Clients"
          data={ordersClients}
          renderItem={(item) => (
            <p>
              <strong>Order ID:</strong> {item.comanda_id},{" "}
              <strong>Date:</strong> {item.data_comanda},{" "}
              <strong>Total:</strong> {item.total}, <strong>Client:</strong>{" "}
              {item.username}, <strong>Email:</strong> {item.email}
            </p>
          )}
        />
        <QueryResult
          title="Products and Categories"
          data={productsCategories}
          renderItem={(item) => (
            <p>
              <strong>Product ID:</strong> {item.produs_id},{" "}
              <strong>Name:</strong> {item.nume_produs}, <strong>Price:</strong>{" "}
              {item.pret}, <strong>Category:</strong> {item.nume_categorie}
            </p>
          )}
        />
        <QueryResult
          title="Products and Suppliers"
          data={productsSuppliers}
          renderItem={(item) => (
            <p>
              <strong>Product ID:</strong> {item.produs_id},{" "}
              <strong>Name:</strong> {item.nume_produs}, <strong>Price:</strong>{" "}
              {item.pret}, <strong>Supplier:</strong> {item.nume_furnizor},{" "}
              <strong>Email:</strong> {item.contact_email}
            </p>
          )}
        />
        <QueryResult
          title="Orders and Products"
          data={ordersProducts}
          renderItem={(item) => (
            <p>
              <strong>Order ID:</strong> {item.comanda_id},{" "}
              <strong>Date:</strong> {item.data_comanda},{" "}
              <strong>Product:</strong> {item.nume_produs},{" "}
              <strong>Quantity:</strong> {item.cantitate},{" "}
              <strong>Unit Price:</strong> {item.pret_unitar}
            </p>
          )}
        />
        <QueryResult
          title="Products and Ingredients"
          data={productsIngredients}
          renderItem={(item) => (
            <p>
              <strong>Product ID:</strong> {item.produs_id},{" "}
              <strong>Name:</strong> {item.nume_produs},{" "}
              <strong>Ingredient:</strong> {item.nume_ingredient}
            </p>
          )}
        />
        <QueryResult
          title="Orders, Clients, and Products"
          data={ordersClientsProducts}
          renderItem={(item) => (
            <p>
              <strong>Order ID:</strong> {item.comanda_id},{" "}
              <strong>Date:</strong> {item.data_comanda},{" "}
              <strong>Client:</strong> {item.username}, <strong>Email:</strong>{" "}
              {item.email}, <strong>Product:</strong> {item.nume_produs},{" "}
              <strong>Quantity:</strong> {item.cantitate},{" "}
              <strong>Unit Price:</strong> {item.pret_unitar}
            </p>
          )}
        />
      </div>
    </div>
  );
};

export default Home;
