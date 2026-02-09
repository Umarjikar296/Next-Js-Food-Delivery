"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BRAND = "#A73D4D";

const AddFoodItems = (props) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [path, setPath] = useState("");
  const [description, setDescription] = useState("");

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverMsg, setServerMsg] = useState("");

  const invalid = useMemo(() => {
    if (!error) return {};
    return {
      name: !name,
      price: !price,
      path: !path,
      description: !description,
    };
  }, [error, name, price, path, description]);

  const inputStyle = (bad) => ({
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: `1px solid ${bad ? "rgba(167,61,77,0.55)" : "rgba(16,24,40,0.16)"}`,
    background: "#fff",
    color: "#101828",
    outline: "none",
    transition: "180ms ease",
    boxShadow: bad ? "0 0 0 4px rgba(167,61,77,0.14)" : "none",
  });

  const labelStyle = {
    fontSize: 13,
    fontWeight: 800,
    color: "rgba(16,24,40,0.70)",
    marginBottom: 6,
    display: "block",
  };

  const looksLikeUrl = /^https?:\/\//i.test(path);

  const handleAddFoodItem = async () => {
    setServerMsg("");

    if (!name || !path || !price || !description) {
      setError(true);
      setServerMsg("Please fill all fields.");
      return;
    }
    setError(false);

    const restaurantData = JSON.parse(localStorage.getItem("restaurantUser") || "null");
    const resto_id = restaurantData?._id;

    if (!resto_id) {
      setServerMsg("Restaurant not logged in. Please login again.");
      return;
    }

    try {
      setLoading(true);

      let response = await fetch("/api/restaurant/foods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price: Number(price),
          img_path: path,
          description,
          resto_id,
        }),
      });

      const data = await response.json();

      if (data?.success) {
        setServerMsg("Food item added ✅");
        props.setAddItem(false);
      } else {
        setServerMsg("Could not add item. Please try again.");
      }
    } catch (e) {
      setServerMsg("Could not add item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      style={{ width: "100%" }}
    >
      {/* Header row */}
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
            <div style={{ fontSize: 18, fontWeight: 950, color: "#101828" }}>Add New Food Item</div>
            <div style={{ fontSize: 13, color: "rgba(16,24,40,0.55)", fontWeight: 700 }}>
              Fill details and publish to your menu
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            onClick={() => props.setAddItem(false)}
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid rgba(16,24,40,0.12)",
              background: "#fff",
              fontWeight: 900,
              cursor: "pointer",
              color: "rgba(16,24,40,0.75)",
            }}
          >
            Cancel
          </button>

          <motion.button
            type="button"
            onClick={handleAddFoodItem}
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: 0,
              background: BRAND,
              color: "#fff",
              fontWeight: 950,
              cursor: "pointer",
              boxShadow: "0 12px 22px rgba(167,61,77,0.22)",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Adding..." : "Add Item"}
          </motion.button>
        </div>
      </div>

      {/* Status */}
      <AnimatePresence>
        {serverMsg ? (
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
            {serverMsg}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Form grid */}
      <div
        style={{
          marginTop: 16,
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: 16,
        }}
      >
        {/* Fields */}
        <div style={{ display: "grid", gap: 12 }}>
          <div>
            <label style={labelStyle}>Food Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="e.g. Chicken Burger"
              style={inputStyle(invalid.name)}
            />
          </div>

          <div>
            <label style={labelStyle}>Price</label>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              placeholder="e.g. 8.99"
              style={inputStyle(invalid.price)}
            />
          </div>

          <div>
            <label style={labelStyle}>Image Path / URL</label>
            <input
              value={path}
              onChange={(e) => setPath(e.target.value)}
              type="text"
              placeholder="e.g. /food.png OR https://..."
              style={inputStyle(invalid.path)}
            />
            <div style={{ marginTop: 6, fontSize: 12, color: "rgba(16,24,40,0.55)" }}>
              Tip: use a full URL for preview.
            </div>
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short and tasty description…"
              style={{
                ...inputStyle(invalid.description),
                minHeight: 110,
                resize: "vertical",
              }}
            />
          </div>

          {/* Inline validation message */}
          <AnimatePresence>
            {error ? (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                style={{ fontSize: 12, color: "rgba(16,24,40,0.65)" }}
              >
                Please fill all fields correctly.
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Preview */}
        <div
          style={{
            borderRadius: 16,
            border: "1px solid rgba(16,24,40,0.10)",
            background: "rgba(245,246,251,0.90)",
            padding: 14,
            height: "fit-content",
          }}
        >
          <div style={{ fontWeight: 950, color: "#101828", marginBottom: 10 }}>Preview</div>

          <div
            style={{
              borderRadius: 14,
              overflow: "hidden",
              border: "1px solid rgba(16,24,40,0.10)",
              background: "#fff",
              aspectRatio: "16 / 10",
              display: "grid",
              placeItems: "center",
            }}
          >
            {looksLikeUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={path}
                alt="Preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={() => setServerMsg("Image preview failed. Check URL/path.")}
              />
            ) : (
              <div style={{ fontSize: 13, color: "rgba(16,24,40,0.55)", padding: 12, textAlign: "center" }}>
                Add a full image URL to see preview here.
              </div>
            )}
          </div>

          <div style={{ marginTop: 10, fontSize: 12, color: "rgba(16,24,40,0.55)" }}>
            Name: <span style={{ color: "#101828", fontWeight: 800 }}>{name || "-"}</span>
            <br />
            Price: <span style={{ color: "#101828", fontWeight: 800 }}>{price || "-"}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AddFoodItems;
