import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

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
    fetchUser();
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
      <div className="flex flex-col items-center justify-center pt-20">
        <div className="bg-white shadow-lg rounded-lg p-8 w-96 mt-8">
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
      </div>
    </div>
  );
};

export default Home;
