'use client'

import CustomerHeader from '../../_components/CustomerHeader';
import RestaurantFooter from '../../_components/RestaurantFooter';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';

export default function Page() {
  const { id } = useParams();

  const [restaurantDetails, setRestaurantDetails] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [cartData, setCartData] = useState(null);

  // ✅ start with empty array
  const [cartStorage, setCartStorage] = useState([]);

  const [removeCartData, setRemoveCartData] = useState();

  // ✅ read localStorage only after mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('cart');
      const parsed = raw ? JSON.parse(raw) : [];
      setCartStorage(Array.isArray(parsed) ? parsed : []);
    } catch (e) {
      setCartStorage([]);
    }
  }, []);

  // ✅ derived value (no extra state needed)
  const cartIds = useMemo(() => cartStorage.map((item) => item._id), [cartStorage]);

  useEffect(() => {
    if (!id) return;

    const loadRestaurantDetails = async () => {
      const res = await fetch(`/api/customers/${id}`);
      const data = await res.json();

      if (data.success) {
        setRestaurantDetails(data.details);
        setFoodItems(data.foodItems);
      }
    };

    loadRestaurantDetails();
  }, [id]);


  const addToCart = (item) => {
    setCartData(item);

    // (optional) actually push into cart + persist
    setCartStorage((prev) => {
      const next = Array.isArray(prev) ? [...prev, item] : [item];
      localStorage.setItem('cart', JSON.stringify(next));
      return next;
    });
  };

  const removeFromCart = (foodId) => {
    setCartStorage((prev) => {
      const next = prev.filter((item) => item._id !== foodId);
      localStorage.setItem("cart", JSON.stringify(next));
      return next;
    });
  };


  return (
    <div>
      <CustomerHeader cartData={cartData} removeCartData={removeCartData} />

      <div className="restaurant-page-banner">
        <h1>{restaurantDetails?.rname || "Loading..."}</h1>
      </div>

      {restaurantDetails && (
        <div className='detail-wrapper' style={{ marginTop: 12 }}>
          <p><b>City:</b> {restaurantDetails.city}</p>
          <p><b>Contact:</b> {restaurantDetails.contact}</p>
          <p><b>Email:</b> {restaurantDetails.email}</p>
        </div>
      )}

      <div className='food-item-wrapper'>
        <h2>Food Items</h2>
        {foodItems.length === 0 ? (
          <p>No items found.</p>
        ) : (
          foodItems.map((item) => (
            <div className='list-item' key={item._id}>
              <img style={{ width: 100 }} src={item.img_path} alt="" />
              <div className='item-content'>
                <h4>{item.name}</h4>
                <p>Description: {item.description}</p>
                <p>Price: {item.price}</p>
                {
                  cartIds.includes(item._id) ?
                    <button onClick={() => removeFromCart(item._id)} >Remove from Cart</button> :
                    <button onClick={() => addToCart(item)}>Add to Cart</button>
                }
              </div>
            </div>
          ))
        )}
      </div>

      <RestaurantFooter />
    </div>
  );
}
