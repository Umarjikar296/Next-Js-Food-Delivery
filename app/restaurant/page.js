"use client"
import { useState } from "react";
import RestaurantLogin from "../_components/restaurantLogin";
import './style.css'
import RestaurantFooter from "../_components/RestaurantFooter";
import RestaurantHeader from "../_components/restaurantHeader";
import RestaurantSignup from "../_components/restaurantSignup";

const Restaurant = () => {
    const [login, setLogin] = useState(true);
    return (
        <>

            <div className="container">
                <RestaurantHeader />
                <h1>Restaurant Login / Signup Page
                </h1>
                {
                    login ?
                        <RestaurantLogin /> : <RestaurantSignup />
                }
                <div>
                    <button className="button-link" onClick={() => setLogin(!login)}>{
                        login ? "Don't have an account? SignUp" : "Already have an accoint LogIn"}

                    </button>
                </div>
            </div>
            <RestaurantFooter />
        </>
    )
}

export default Restaurant;