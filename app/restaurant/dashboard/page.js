"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AddFoodItems from "../../_components/AddFoodItem";
import RestaurantHeader from "../../_components/restaurantHeader";
import FoodItemList from "../../_components/FoodItemList";
import "./../style.css";

const BRAND = "#A73D4D";

const Dashboard = () => {
  const [addItem, setAddItem] = useState(false);

  const tabBtn = (active) => ({
    flex: 1,
    padding: "12px 14px",
    borderRadius: 12,
    border: active ? "1px solid rgba(167,61,77,0.22)" : "1px solid rgba(16,24,40,0.10)",
    background: active ? "rgba(167,61,77,0.10)" : "#fff",
    color: active ? BRAND : "rgba(16,24,40,0.75)",
    fontWeight: 900,
    cursor: "pointer",
    transition: "160ms ease",
  });

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #ffffff, #f5f6fb)" }}>
      <RestaurantHeader />

      <div style={{ width: "100%", padding: "18px 16px" }}>
        <div style={{ width: "min(1200px, 100%)", margin: "0 auto" }}>
          {/* Top toolbar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "relative",
              borderRadius: 18,
              background: "#ffffff",
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
            {/* Title */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 14,
                //   background: BRAND,
                  boxShadow: "0 12px 22px rgba(167,61,77,0.18)",
                }}
              /> */}
              <div>
                <div style={{ fontSize: 18, fontWeight: 950, color: "#101828" }}>
                  Restaurant Dashboard
                </div>
                <div style={{ fontSize: 13, color: "rgba(16,24,40,0.55)", fontWeight: 700 }}>
                  Manage your food items and updates
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div
              style={{
                display: "flex",
                gap: 10,
                padding: 8,
                borderRadius: 16,
                border: "1px solid rgba(16,24,40,0.08)",
                background: "rgba(255,255,255,0.75)",
              }}
            >
              <button type="button" style={tabBtn(!addItem)} onClick={() => setAddItem(false)}>
                Dashboard
              </button>
              <button type="button" style={tabBtn(addItem)} onClick={() => setAddItem(true)}>
                Add Item
              </button>
            </div>
          </motion.div>

          {/* Content */}
          <div style={{ marginTop: 16 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={addItem ? "add" : "list"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                style={{
                  borderRadius: 18,
                  background: "#ffffff",
                  border: "1px solid rgba(16,24,40,0.10)",
                  boxShadow: "0 18px 40px rgba(16,24,40,0.08), 0 2px 6px rgba(16,24,40,0.05)",
                  padding: 16,
                }}
              >
                {addItem ? <AddFoodItems setAddItem={setAddItem} /> : <FoodItemList />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
