"use client";
import { useState } from "react";
import RestaurantLogin from "../_components/restaurantLogin";
import "./style.css";
import RestaurantFooter from "../_components/RestaurantFooter";
import RestaurantHeader from "../_components/restaurantHeader";
import RestaurantSignup from "../_components/restaurantSignup";

const Restaurant = () => {
  const [login, setLogin] = useState(true);

  // ✅ same logic, just reuse it
  const toggleAuth = () => setLogin(!login);

  return (
    <>
      <div className="container">
        <RestaurantHeader />
        <div style={{ textAlign: 'center' }}>

          <h1>Restaurant Login / Signup Page</h1>
        </div>

        {login ? (
          <RestaurantLogin onToggle={toggleAuth} />
        ) : (
          <RestaurantSignup onToggle={toggleAuth} />
        )}

      </div>

      <RestaurantFooter />
    </>
  );
};

export default Restaurant;
