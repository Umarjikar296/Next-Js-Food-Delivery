"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BRAND = "#A73D4D";

const RestaurantLogin = ({ onToggle }) => {

    const [email, setEmail] = useState("");       // ✅ avoid undefined
    const [password, setPassword] = useState(""); // ✅ avoid undefined
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState("");

    const router = useRouter();

    const handleLogin = async () => {
        setServerError("");

        if (!email || !password) {
            setError(true);
            return;
        }
        setError(false);

        try {
            setLoading(true);

            let response = await fetch("/api/restaurant", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, login: true }),
            });

            response = await response.json();

            if (response.success) {
                const { result } = response;
                delete result.password;

                localStorage.setItem("restaurantUser", JSON.stringify(result));

                router.replace("/restaurant/dashboard");
                router.refresh();
            } else {
                setServerError("Login failed. Check your credentials.");
            }
        } catch (e) {
            setServerError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = (bad) => ({
        width: "100%",
        padding: "12px 14px",
        borderRadius: 14,
        border: `1px solid ${bad ? "rgba(167,61,77,0.70)" : "rgba(16,24,40,0.12)"}`,
        outline: "none",
        background: "rgba(255,255,255,0.85)",
        color: "#101828",
        boxShadow: bad ? "0 0 0 6px rgba(167,61,77,0.12)" : "none",
        transition: "180ms ease",
    });

    return (
        <div
            style={{
                minHeight: "70vh",
                display: "grid",
                placeItems: "center",
                padding: "24px 16px",
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                style={{ width: "100%", maxWidth: 460 }}
            >
                {/* Glass card only */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05, duration: 0.35 }}
                    style={{
                        borderRadius: 22,
                        border: "1px solid rgba(16,24,40,0.10)",
                        background: "rgba(223, 223, 223, 0.72)",
                        backdropFilter: "blur(12px)",
                        boxShadow: "0 18px 45px rgba(16,24,40,0.10)",
                        padding: 22,
                    }}
                >
                    {/* Header */}
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        {/* <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 16,
                background: BRAND,
                boxShadow: "0 12px 22px rgba(167,61,77,0.18)",
              }}
            /> */}
                        <div>
                            <h3 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: "#101828" }}>
                                Restaurant Login
                            </h3>
                            <p style={{ margin: "8px 0 0", fontSize: 16, color: "rgba(16,24,40,0.55)" }}>
                                Use your restaurant account to continue.
                            </p>
                        </div>
                    </div>

                    <AnimatePresence>
                        {serverError ? (
                            <motion.div
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                style={{
                                    marginTop: 14,
                                    padding: "10px 12px",
                                    borderRadius: 14,
                                    border: "1px solid rgba(167,61,77,0.25)",
                                    background: "rgba(167,61,77,0.08)",
                                    color: "#101828",
                                    fontSize: 13,
                                }}
                            >
                                {serverError}
                            </motion.div>
                        ) : null}
                    </AnimatePresence>

                    {/* Form */}
                    <div style={{ marginTop: 16, display: "grid", gap: 14 }}>
                        <div className="input-wrapper">
                            <label style={{ fontSize: 13, fontWeight: 700, color: "rgba(16,24,40,0.70)" }}>
                                Email
                            </label>
                            <input
                                className="input-field"
                                type="email"
                                placeholder="Enter Email Id"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={inputStyle(error && !email)}
                            />
                            {error && !email && (
                                <span className="input-error" style={{ display: "block", marginTop: 6, fontSize: 12, color: "rgba(16,24,40,0.65)" }}>
                                    Please enter a valid email
                                </span>
                            )}
                        </div>

                        <div className="input-wrapper">
                            <label style={{ fontSize: 13, fontWeight: 700, color: "rgba(16,24,40,0.70)" }}>
                                Password
                            </label>
                            <input
                                className="input-field"
                                type="password"
                                placeholder="Enter Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={inputStyle(error && !password)}
                            />
                            {error && !password && (
                                <span className="input-error" style={{ display: "block", marginTop: 6, fontSize: 12, color: "rgba(16,24,40,0.65)" }}>
                                    Please enter a valid password
                                </span>
                            )}
                        </div>

                        <motion.button
                            onClick={handleLogin}
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            animate={error && (!email || !password) ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
                            transition={{ type: "spring", stiffness: 350, damping: 22 }}
                            className="button"
                            style={{
                                width: "100%",
                                border: 0,
                                borderRadius: 16,
                                padding: "12px 14px",
                                color: "white",
                                fontWeight: 900,
                                cursor: "pointer",
                                background: `linear-gradient(90deg, ${BRAND}, #c14b5d)`,
                                boxShadow: "0 12px 24px rgba(167,61,77,0.18)",
                                opacity: loading ? 0.75 : 1,
                            }}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </motion.button>
                    </div>

                    {/* Keep your switch line here if you want (or keep only in page.js) */}
                    <div style={{ textAlign: "center", marginTop: 12 }}>
                        <p style={{ margin: 0, fontSize: 16, color: "rgba(16,24,40,0.65)" }}>
                            Don&apos;t have an account?{" "}
                            <button
                                type="button"
                                onClick={onToggle}
                                style={{
                                    border: "none",
                                    background: "transparent",
                                    color: "#A73D4D",
                                    fontWeight: 900,
                                    fontSize: 16,
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                    textUnderlineOffset: 3,
                                    padding: 0,
                                }}
                            >
                                Sign up
                            </button>
                        </p>

                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default RestaurantLogin;
