import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login";
import AppShell from "./AppShell";

const App: React.FC = () => {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("auth_token")
  );

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isLoggedIn ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login setIsLoggedIn={setIsLoggedIn} />
          )
        }
      />

      <Route
        path="/*"
        element={isLoggedIn ? <AppShell /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
};

export default App;
