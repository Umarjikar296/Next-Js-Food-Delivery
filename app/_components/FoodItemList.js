"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BRAND = "#A73D4D";

const FoodItemList = () => {
  const [foodItems, setFoodItems] = useState(null); // null = loading, [] = empty
  const [restoId, setRestoId] = useState(null);
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [msg, setMsg] = useState("");

  const router = useRouter();

  useEffect(() => {
    const restaurantData = JSON.parse(localStorage.getItem("restaurantUser") || "null");
    setRestoId(restaurantData?._id || null);
  }, []);

  useEffect(() => {
    if (!restoId) return;
    setFoodItems(null);
    loadFoodItems(restoId);
  }, [restoId]);

  const loadFoodItems = async (id) => {
    try {
      setMsg("");
      const res = await fetch(`/api/restaurant/foods/${id}`, { cache: "no-store" });
      const data = await res.json();
      if (data?.success) setFoodItems(data.result || []);
      else setFoodItems([]);
    } catch (e) {
      setFoodItems([]);
      setMsg("Could not load items. Please refresh.");
    }
  };

  const deleteFoodItem = async (id) => {
    if (!restoId) return;
    try {
      setBusyId(id);
      setMsg("");
      const res = await fetch(`/api/restaurant/foods/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data?.success) {
        await loadFoodItems(restoId);
        setMsg("Item deleted ✅");
      } else {
        setMsg("Delete failed. Try again.");
      }
    } catch (e) {
      setMsg("Delete failed. Try again.");
    } finally {
      setBusyId(null);
    }
  };

  const filtered = useMemo(() => {
    if (!foodItems) return null;
    const q = query.trim().toLowerCase();
    if (!q) return foodItems;
    return foodItems.filter((x) => {
      const name = (x?.name || "").toLowerCase();
      const desc = (x?.description || "").toLowerCase();
      return name.includes(q) || desc.includes(q);
    });
  }, [foodItems, query]);

  const cardStyle = {
    width: "100%",
    borderRadius: 18,
    background: "#ffffff",
    border: "1px solid rgba(16,24,40,0.10)",
    boxShadow: "0 18px 40px rgba(16,24,40,0.08), 0 2px 6px rgba(16,24,40,0.05)",
  };

  const chip = {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(16,24,40,0.10)",
    background: "rgba(245,246,251,0.90)",
    fontSize: 12,
    fontWeight: 900,
    color: "rgba(16,24,40,0.75)",
  };

  const btn = (variant) => {
    const base = {
      padding: "9px 12px",
      borderRadius: 12,
      fontWeight: 900,
      cursor: "pointer",
      border: "1px solid rgba(16,24,40,0.12)",
      background: "#fff",
      color: "rgba(16,24,40,0.78)",
      transition: "160ms ease",
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      whiteSpace: "nowrap",
    };

    if (variant === "primary") {
      return {
        ...base,
        border: "1px solid rgba(167,61,77,0.25)",
        background: "rgba(167,61,77,0.10)",
        color: BRAND,
      };
    }
    if (variant === "danger") {
      return {
        ...base,
        border: "1px solid rgba(220,38,38,0.20)",
        background: "rgba(220,38,38,0.08)",
        color: "rgba(185,28,28,1)",
      };
    }
    return base;
  };

  const inputStyle = {
    width: "min(420px, 100%)",
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(16,24,40,0.14)",
    outline: "none",
    background: "#fff",
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 14,
              background: BRAND,
              boxShadow: "0 12px 22px rgba(167,61,77,0.18)",
            }}
          />
          <div>
            <div style={{ fontSize: 18, fontWeight: 950, color: "#101828" }}>Food Items</div>
            <div style={{ fontSize: 13, color: "rgba(16,24,40,0.55)", fontWeight: 700 }}>
              Manage your menu items
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or description..."
            style={inputStyle}
          />
          <button type="button" style={btn()} onClick={() => restoId && loadFoodItems(restoId)}>
            Refresh
          </button>
        </div>
      </div>

      {/* message */}
      <AnimatePresence>
        {msg ? (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            style={{
              marginTop: 12,
              padding: "10px 12px",
              borderRadius: 14,
              border: "1px solid rgba(167,61,77,0.18)",
              background: "rgba(167,61,77,0.08)",
              color: "#101828",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {msg}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Table card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.05 }}
        style={{ ...cardStyle, marginTop: 16, overflow: "hidden" }}
      >
        {/* table header row */}
        <div
          style={{
            padding: "12px 14px",
            borderBottom: "1px solid rgba(16,24,40,0.08)",
            background: "rgba(245,246,251,0.70)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <span style={chip}>
            {filtered === null ? "Loading..." : `${filtered.length} item(s)`}
          </span>
          <span style={{ fontSize: 12, fontWeight: 800, color: "rgba(16,24,40,0.55)" }}>
            Tip: Click Edit to update an item
          </span>
        </div>

        {/* table body */}
        <div style={{ width: "100%", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 860 }}>
            <thead>
              <tr style={{ textAlign: "left" }}>
                <th style={th}>#</th>
                <th style={th}>Item</th>
                <th style={th}>Price</th>
                <th style={th}>Description</th>
                <th style={th}>Image</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {/* Loading skeleton */}
              {filtered === null ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} style={{ borderTop: "1px solid rgba(16,24,40,0.06)" }}>
                    <td style={td}>—</td>
                    <td style={td}>Loading...</td>
                    <td style={td}>—</td>
                    <td style={td}>—</td>
                    <td style={td}>—</td>
                    <td style={td}>—</td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: 24, textAlign: "center", color: "rgba(16,24,40,0.60)", fontWeight: 800 }}>
                    No items found. Add your first food item ✨
                  </td>
                </tr>
              ) : (
                filtered.map((item, index) => (
                  <tr key={item._id} style={{ borderTop: "1px solid rgba(16,24,40,0.06)" }}>
                    <td style={td}>{index + 1}</td>

                    <td style={td}>
                      <div style={{ fontWeight: 950, color: "#101828" }}>{item.name}</div>
                      <div style={{ fontSize: 12, color: "rgba(16,24,40,0.55)", fontWeight: 700 }}>
                        ID: {String(item._id).slice(0, 8)}…
                      </div>
                    </td>

                    <td style={td}>
                      <span style={{ ...chip, borderColor: "rgba(167,61,77,0.18)", background: "rgba(167,61,77,0.08)", color: BRAND }}>
                        € {item.price}
                      </span>
                    </td>

                    <td style={td}>
                      <div style={{ maxWidth: 420, color: "rgba(16,24,40,0.75)" }}>
                        {item.description}
                      </div>
                    </td>

                    <td style={td}>
                      <div
                        style={{
                          width: 84,
                          height: 54,
                          borderRadius: 12,
                          overflow: "hidden",
                          border: "1px solid rgba(16,24,40,0.10)",
                          background: "#fff",
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
                    </td>

                    <td style={td}>
                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          style={btn("primary")}
                          onClick={() => router.push("dashboard/" + item._id)}
                        >
                          Edit
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          style={btn("danger")}
                          disabled={busyId === item._id}
                          onClick={() => deleteFoodItem(item._id)}
                        >
                          {busyId === item._id ? "Deleting..." : "Delete"}
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

const th = {
  padding: "12px 14px",
  fontSize: 12,
  letterSpacing: "0.02em",
  textTransform: "uppercase",
  color: "rgba(16,24,40,0.55)",
  fontWeight: 950,
  background: "#fff",
};

const td = {
  padding: "12px 14px",
  verticalAlign: "top",
  fontSize: 14,
  color: "rgba(16,24,40,0.85)",
  fontWeight: 700,
};

export default FoodItemList;
