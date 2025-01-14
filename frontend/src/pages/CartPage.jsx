import { useCart } from "../components/cartContext"; // Importăm contextul Cart
import { useEffect, useState } from "react";
import axios from "axios";
import CartProductCard from "../components/CartProductCard"; // Importăm componenta CartProductCard
import { Link } from "react-router-dom";

const CartPage = () => {
  const { clearCart } = useCart();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/auth/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Cart Items:", response.data); // Adăugăm un mesaj de logare pentru a verifica datele din coș
        setCartItems(response.data);
      } catch (err) {
        console.error("Error fetching cart items:", err);
      }
    };

    fetchCartItems();
  }, []);

  const handleRemove = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/auth/cart/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems(cartItems.filter((item) => item.produs_id !== productId));
    } catch (err) {
      console.error("Error removing product from cart:", err);
    }
  };

  const handleClearCart = async () => {
    try {
      const token = localStorage.getItem("token");
      for (const item of cartItems) {
        await axios.delete(
          `http://localhost:3000/auth/cart/${item.produs_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      setCartItems([]);
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/auth/place-order",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(response.data.message);
      clearCart();
      setCartItems([]);
    } catch (err) {
      console.error("Error placing order:", err);
      alert("A apărut o eroare la plasarea comenzii.");
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/auth/cart/${productId}`,
        { cantitate: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.produs_id === productId
            ? { ...item, cantitate: newQuantity }
            : item
        )
      );
    } catch (err) {
      console.error("Error updating product quantity:", err);
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.pret_unitar * item.cantitate,
    0
  ); // Ensure 'quantity' is used

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
          <h1 className="text-3xl font-bold text-blue-500 mb-4">Your Cart</h1>
          {cartItems.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cartItems.map((item) => (
                  <CartProductCard
                    key={item.produs_id}
                    product={item}
                    onRemove={handleRemove}
                    onUpdateQuantity={handleUpdateQuantity}
                  />
                ))}
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-bold">Total: {total} Lei</h3>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                  onClick={handleClearCart}
                >
                  Clear Cart
                </button>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={handlePlaceOrder}
                >
                  Place Order
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
