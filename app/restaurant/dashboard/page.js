"use client"
import { useState } from 'react';
import AddFoodItems from '../../_components/AddFoodItem';
import RestaurantHeader from '../../_components/restaurantHeader';
import './../style.css'
import FoodItemList from '../../_components/FoodItemList';
const Dashboard = () => {
    const [addItem, setAddItem] = useState(false)
    return (
        <div>
            <RestaurantHeader />
            <button onClick={() => setAddItem(true)}>Add Food Item</button>
            <button onClick={() => setAddItem(false)}>Dashboard</button>
            {
                addItem ? <AddFoodItems setAddItem={setAddItem} /> :
                    <FoodItemList />
            }

        </div>
    )
}

export default Dashboard;