import "./App.css";
import React, { createContext, useState } from "react";
import ChatBot from "./component/ChatBot";
import Header from "./component/Header";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./component/Login";
import Register from "./component/Register";
export const UserContext = createContext(null);
function App() {
  const [user, setUser] = useState("");
  return (
    <div>
      <UserContext.Provider value={{ user, setUser }}>
        <div className="mb-10">
          <Header />
        </div>
        <div className="mt-5">
          <Routes>
            <Route
              exact
              path="/"
              element={user ? <ChatBot /> : <Navigate to="/login" />}
            />
            <Route path="/login" element={user ? <ChatBot /> : <Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </UserContext.Provider>
    </div>
  );
}

export default App;
