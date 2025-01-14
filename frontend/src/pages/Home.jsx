import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../components/cartContext";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

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
    axios
      .get("http://localhost:3000/auth/queries/products-categories")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products", error);
      });

    fetchUser();
  }, [navigate]);

  const handleAddToCart = async (product) => {
    if (user) {
      try {
        console.log("Product:", product); // Adăugăm un mesaj de logare pentru a verifica valorile din product
        const token = localStorage.getItem("token");
        await axios.post(
          "http://localhost:3000/auth/add-to-cart",
          {
            produs_id: product.produs_id,
            cantitate: 1,
            pret_unitar: product.pret,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        addToCart(product);
        alert("Produsul a fost adăugat în coș!");
      } catch (err) {
        console.error("Error adding product to cart:", err);
        alert("A apărut o eroare la adăugarea produsului în coș.");
      }
    } else {
      alert("You need to log in first!");
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.isArray(products) ? (
              products.map((product, index) => (
                <ProductCard
                  key={`products-${index}`}
                  product={product}
                  renderItem={(prod) => (
                    <>
                      <h3 className="text-lg font-bold mb-2">
                        {prod.nume_produs}
                      </h3>
                      <p className="text-gray-700">{prod.nume_categorie}</p>
                      <p className="text-gray-700">{prod.pret} RON</p>
                    </>
                  )}
                  onAddToCart={() => handleAddToCart(product)}
                />
              ))
            ) : (
              <p>No products available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
