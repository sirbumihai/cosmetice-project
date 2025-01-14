import { createContext, useState, useContext } from "react";
import PropTypes from "prop-types";

// Creăm contextul pentru coșul de cumpărături
const CartContext = createContext();

// Componenta care va furniza contextul în aplicație
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Adăugăm un produs în coș
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find(
        (item) => item.produs_id === product.produs_id
      );
      if (existingProduct) {
        // Dacă produsul există deja în coș, actualizăm cantitatea
        return prevCart.map((item) =>
          item.produs_id === product.produs_id
            ? { ...item, cantitate: item.cantitate + 1 }
            : item
        );
      } else {
        // Dacă produsul nu există, îl adăugăm în coș
        return [...prevCart, { ...product, cantitate: 1 }];
      }
    });
  };

  // Eliminăm un produs din coș
  const removeFromCart = (productId) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.produs_id !== productId)
    );
  };

  // Golim coșul de cumpărături
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Hook personalizat pentru a accesa contextul coșului de cumpărături
export const useCart = () => useContext(CartContext);
