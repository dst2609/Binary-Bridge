import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";

import Dashboard from "./Components/Dashboard/Dashboard";
import LoginForm from "./Components/LoginForm/LoginForm";
import RegistrationForm from "./Components/RegistrationForm/RegistrationForm";
import { jwtDecode } from "jwt-decode";
import "./App.css";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(true); // State to toggle between login and registration form

  useEffect(() => {
    const checkLoggedIn = () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 > Date.now()) {
          setLoggedIn(true);
        } else {
          handleLogout();
        }
      }
    };

    checkLoggedIn();
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const response = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.status === 200) {
        localStorage.setItem("token", data.token);
        setLoggedIn(true);
      } else {
        console.log(data.error || "Failed to login");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleRegistration = async (name, email, password) => {
    try {
      const response = await fetch("http://localhost:3000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (response.status === 201) {
        localStorage.setItem("token", data.token);
        setLoggedIn(true);
      } else {
        console.log(data.error || "Failed to register");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
  };

  return (
    <Router>
      <div className="app-container">
        {" "}
        {/* Flex container */}
        <Header /> {/* Header remains at the top */}
        <div className="content">
          {" "}
          {/* Main content area */}
          {loggedIn ? (
            <>
              <nav>
                <ul>
                  <li>
                    <NavLink
                      to="/"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <button onClick={handleLogout}>Logout</button>
                  </li>
                </ul>
              </nav>
              <Routes>
                <Route path="/" element={<Dashboard />} />
              </Routes>
            </>
          ) : (
            <div className="login-registration">
              {showLoginForm ? (
                <>
                  <LoginForm onLogin={handleLogin} />
                  <button onClick={() => setShowLoginForm(false)}>
                    Not a user yet? Register here
                  </button>
                </>
              ) : (
                <>
                  <RegistrationForm onRegister={handleRegistration} />
                  <button onClick={() => setShowLoginForm(true)}>
                    Already Registered? Login here
                  </button>
                </>
              )}
            </div>
          )}
        </div>
        <Footer /> {/* Footer fixed at the bottom */}
      </div>
    </Router>
  );
}

export default App;
