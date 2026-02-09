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


  const Info = ({ label, value }) => (
    <div
      style={{
        padding: 12,
        borderRadius: 14,
        border: "1px solid rgba(16,24,40,0.08)",
        background: "rgba(245,246,251,0.70)",
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 950, color: "rgba(16,24,40,0.55)" }}>{label}</div>
      <div style={{ marginTop: 4, fontSize: 14, fontWeight: 950, color: "#101828" }}>
        {value || "—"}
      </div>
    </div>
  );

  const primaryBtn = {
    padding: "10px 12px",
    borderRadius: 12,
    border: 0,
    background: "#A73D4D",
    color: "#fff",
    fontWeight: 950,
    cursor: "pointer",
    boxShadow: "0 12px 22px rgba(167,61,77,0.22)",
  };

  const dangerBtn = {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(220,38,38,0.20)",
    background: "rgba(220,38,38,0.08)",
    color: "rgba(185,28,28,1)",
    fontWeight: 950,
    cursor: "pointer",
  };


  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#ffffff,#f5f6fb)" }}>
      <CustomerHeader cartData={cartData} removeCartData={removeCartData} />

      {/* Top Bar */}
      <div style={{ width: "100%", padding: "18px 16px 10px" }}>
        <div
          style={{
            width: "100%",
            borderRadius: 18,
            background: "#fff",
            border: "1px solid rgba(16,24,40,0.10)",
            boxShadow: "0 18px 40px rgba(16,24,40,0.08), 0 2px 6px rgba(16,24,40,0.05)",
            padding: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 16,
                background: "#A73D4D",
                boxShadow: "0 12px 22px rgba(167,61,77,0.18)",
              }}
            />
            <div>
              <div style={{ fontSize: 18, fontWeight: 950, color: "#101828" }}>
                {restaurantDetails?.rname || "Loading restaurant..."}
              </div>
              <div style={{ fontSize: 13, color: "rgba(16,24,40,0.55)", fontWeight: 700 }}>
                Explore menu and add to cart
              </div>
            </div>
          </div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 999,
              border: "1px solid rgba(16,24,40,0.10)",
              background: "rgba(245,246,251,0.90)",
              fontWeight: 950,
              color: "rgba(16,24,40,0.75)",
              fontSize: 13,
              whiteSpace: "nowrap",
            }}
          >
            Items: {foodItems.length}
          </div>
        </div>

        {/* Restaurant Details */}
        {restaurantDetails && (
          <div
            style={{
              marginTop: 12,
              width: "100%",
              borderRadius: 18,
              background: "#fff",
              border: "1px solid rgba(16,24,40,0.10)",
              boxShadow: "0 12px 28px rgba(16,24,40,0.06)",
              padding: 14,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 10,
            }}
          >
            <Info label="City" value={restaurantDetails.city} />
            <Info label="Contact" value={restaurantDetails.contact} />
            <Info label="Email" value={restaurantDetails.email} />
          </div>
        )}
      </div>

      {/* Food Items */}
      <div style={{ width: "100%", padding: "0 16px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <h2 style={{ margin: "10px 0", fontSize: 18, fontWeight: 950, color: "#101828" }}>Food Items</h2>

          <div style={{ fontSize: 13, fontWeight: 800, color: "rgba(16,24,40,0.55)" }}>
            Tap Add to Cart to continue
          </div>
        </div>

        {foodItems.length === 0 ? (
          <div
            style={{
              width: "100%",
              borderRadius: 18,
              background: "#fff",
              border: "1px solid rgba(16,24,40,0.10)",
              padding: 18,
              fontWeight: 900,
              color: "rgba(16,24,40,0.65)",
              textAlign: "center",
            }}
          >
            No items found.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 14,
              width: "100%",
            }}
          >
            {foodItems.map((item) => {
              const inCart = cartIds.includes(item._id);

              return (
                <div
                  key={item._id}
                  style={{
                    borderRadius: 18,
                    background: "#fff",
                    border: inCart ? "1px solid rgba(167,61,77,0.25)" : "1px solid rgba(16,24,40,0.10)",
                    boxShadow: "0 14px 32px rgba(16,24,40,0.06)",
                    overflow: "hidden",
                  }}
                >
                  {/* image */}
                  <div
                    style={{
                      height: 160,
                      background: "rgba(245,246,251,0.90)",
                      borderBottom: "1px solid rgba(16,24,40,0.08)",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.img_path}
                      alt={item.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>

                  {/* content */}
                  <div style={{ padding: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                      <div style={{ fontSize: 16, fontWeight: 950, color: "#101828" }}>{item.name}</div>
                      <span
                        style={{
                          padding: "6px 10px",
                          borderRadius: 999,
                          background: "rgba(167,61,77,0.10)",
                          border: "1px solid rgba(167,61,77,0.18)",
                          color: "#A73D4D",
                          fontWeight: 950,
                          fontSize: 12,
                          whiteSpace: "nowrap",
                        }}
                      >
                        € {item.price}
                      </span>
                    </div>

                    <p style={{ margin: "10px 0 0", fontSize: 13, fontWeight: 700, color: "rgba(16,24,40,0.65)" }}>
                      {item.description}
                    </p>

                    <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {inCart ? (
                        <button
                          onClick={() => removeFromCart(item._id)}
                          style={dangerBtn}
                        >
                          Remove from Cart
                        </button>
                      ) : (
                        <button
                          onClick={() => addToCart(item)}
                          style={primaryBtn}
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <RestaurantFooter />
    </div>
  );
  ;
}
