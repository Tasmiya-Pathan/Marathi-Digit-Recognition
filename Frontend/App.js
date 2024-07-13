import "./App.css";
import Footer from "./components/Footer";
import Home from "./components/Home";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "./components/Header";
function App() {
  return (
    <Router>
      <Header />
      <div className="home-space">
        <Routes>
        <Route
          exact
          path="/"
          element={<Home />}
        />
        </Routes>
      </div>
      
      <Footer />
      <ToastContainer />
    </Router>
  );
}

export default App;
