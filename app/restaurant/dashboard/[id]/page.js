"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const BRAND = "#A73D4D";

const EditFoodItems = () => {
    const { id } = useParams();
    const router = useRouter();

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [path, setPath] = useState("");
    const [description, setDescription] = useState("");

    const [error, setError] = useState(false);
    const [serverMsg, setServerMsg] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!id) return;

        const handleLoadFoodItem = async () => {
            try {
                setLoading(true);
                setServerMsg("");

                const res = await fetch(`/api/restaurant/foods/edit/${id}`, { cache: "no-store" });
                const data = await res.json();

                if (data?.success && data?.result) {
                    setName(data.result.name ?? "");
                    setPrice(String(data.result.price ?? ""));
                    setPath(data.result.img_path ?? "");
                    setDescription(data.result.description ?? "");
                } else {
                    setServerMsg("Could not load item. Please try again.");
                }
            } catch (e) {
                setServerMsg("Could not load item. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        handleLoadFoodItem();
    }, [id]);

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

    const handleEditFoodItem = async () => {
        setServerMsg("");

        if (!name || !path || !price || !description) {
            setError(true);
            setServerMsg("Please fill all fields.");
            return;
        }

        setError(false);

        try {
            setSaving(true);

            const res = await fetch(`/api/restaurant/foods/edit/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    price: Number(price),
                    img_path: path,
                    description,
                }),
            });

            const data = await res.json();

            if (data?.success) {
                setServerMsg("Updated successfully ✅");
                // go back after short UI feedback (no delay promise)
                router.push("../dashboard");
            } else {
                setServerMsg("Update failed. Please try again.");
            }
        } catch (e) {
            setServerMsg("Update failed. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const looksLikeUrl = /^https?:\/\//i.test(path);

    return (
        <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #ffffff, #f5f6fb)" }}>
            <div style={{ width: "100%", padding: "18px 16px" }}>
                {/* Full width page container */}
                <div style={{ width: 1100,}}>
                    {/* Top title bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{
                            width: "100%",
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
                                <div style={{ fontSize: 18, fontWeight: 950, color: "#101828" }}>
                                    Update Food Item
                                </div>
                                <div style={{ fontSize: 13, color: "rgba(16,24,40,0.55)", fontWeight: 700 }}>
                                    Edit name, price, image path and description
                                </div>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                            <button
                                type="button"
                                onClick={() => router.push("../dashboard")}
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
                                Back to Dashboard
                            </button>

                            <button
                                type="button"
                                onClick={handleEditFoodItem}
                                disabled={saving || loading}
                                style={{
                                    padding: "10px 12px",
                                    borderRadius: 12,
                                    border: 0,
                                    background: BRAND,
                                    color: "#fff",
                                    fontWeight: 950,
                                    cursor: "pointer",
                                    boxShadow: "0 12px 22px rgba(167,61,77,0.22)",
                                    opacity: saving || loading ? 0.7 : 1,
                                }}
                            >
                                {saving ? "Updating..." : "Update"}
                            </button>
                        </div>
                    </motion.div>

                    {/* Status message */}
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

                    {/* Form card */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: 0.05 }}
                        style={{
                            marginTop: 16,
                            width: "100%",
                            borderRadius: 18,
                            background: "#ffffff",
                            border: "1px solid rgba(16,24,40,0.10)",
                            boxShadow: "0 18px 40px rgba(16,24,40,0.08), 0 2px 6px rgba(16,24,40,0.05)",
                            padding: 16,
                        }}
                    >
                        {loading ? (
                            <div style={{ padding: 18, fontWeight: 900, color: "rgba(16,24,40,0.60)" }}>
                                Loading item...
                            </div>
                        ) : (
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1.2fr 0.8fr",
                                    gap: 16,
                                }}
                            >
                                {/* Left: fields */}
                                <div style={{ display: "grid", gap: 12 }}>
                                    <div>
                                        <label style={labelStyle}>Food Name</label>
                                        <input
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            type="text"
                                            placeholder="Enter food name"
                                            style={inputStyle(invalid.name)}
                                        />
                                    </div>

                                    <div>
                                        <label style={labelStyle}>Price</label>
                                        <input
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            type="number"
                                            placeholder="Enter price"
                                            style={inputStyle(invalid.price)}
                                        />
                                    </div>

                                    <div>
                                        <label style={labelStyle}>Image Path / URL</label>
                                        <input
                                            value={path}
                                            onChange={(e) => setPath(e.target.value)}
                                            type="text"
                                            placeholder="Enter image path (e.g. /food.png or https://...)"
                                            style={inputStyle(invalid.path)}
                                        />
                                        <div style={{ marginTop: 6, fontSize: 12, color: "rgba(16,24,40,0.55)" }}>
                                            Tip: Use a full URL to preview image here.
                                        </div>
                                    </div>

                                    <div>
                                        <label style={labelStyle}>Description</label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Enter description"
                                            style={{
                                                ...inputStyle(invalid.description),
                                                minHeight: 110,
                                                resize: "vertical",
                                            }}
                                        />
                                    </div>

                                    {/* bottom buttons */}
                                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 4 }}>
                                        <button
                                            type="button"
                                            onClick={handleEditFoodItem}
                                            disabled={saving}
                                            style={{
                                                padding: "12px 14px",
                                                borderRadius: 12,
                                                border: 0,
                                                background: BRAND,
                                                color: "#fff",
                                                fontWeight: 950,
                                                cursor: "pointer",
                                                boxShadow: "0 12px 22px rgba(167,61,77,0.22)",
                                                opacity: saving ? 0.7 : 1,
                                            }}
                                        >
                                            {saving ? "Updating..." : "Update Food Item"}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => router.push("../dashboard")}
                                            style={{
                                                padding: "12px 14px",
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
                                    </div>
                                </div>

                                {/* Right: preview */}
                                <div
                                    style={{
                                        borderRadius: 16,
                                        border: "1px solid rgba(16,24,40,0.10)",
                                        background: "rgba(245,246,251,0.90)",
                                        padding: 14,
                                        height: "fit-content",
                                    }}
                                >
                                    <div style={{ fontWeight: 950, color: "#101828", marginBottom: 10 }}>
                                        Preview
                                    </div>

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
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default EditFoodItems;
