import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./components/cartContext";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SimpleQueriesPage from "./pages/SimpleQueriesPage";
import ComplexQueriesPage from "./pages/ComplexQueriesPage";
import CartPage from "./pages/CartPage";

function App() {
  return (
    <BrowserRouter
      future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
    >
      <CartProvider>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/simple-queries" element={<SimpleQueriesPage />}></Route>
          <Route
            path="/complex-queries"
            element={<ComplexQueriesPage />}
          ></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/cart" element={<CartPage />} />
          <Route path="/dashboard" element={<Dashboard />}></Route>
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
