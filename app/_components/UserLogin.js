"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BRAND = "#A73D4D";

const UserLogin = ({ onToggle }) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const loginHandle = async () => {
        setErrorMsg("");

        if (!email || !password) {
            setErrorMsg("Please enter email and password.");
            return;
        }

        try {
            setLoading(true);

            let response = await fetch("/api/user/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data?.success) {
                const result = data.result || {};
                if (result.password) delete result.password;

                localStorage.setItem("user", JSON.stringify(result));
                router.push("/");
            } else {
                setErrorMsg("Login failed. Check your credentials.");
            }
        } catch (e) {
            setErrorMsg("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

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

    const emptyEmail = !!errorMsg && !email;
    const emptyPw = !!errorMsg && !password;

    return (
        <div
            style={{
                minHeight: "60vh",
                display: "grid",
                placeItems: "center",
                padding: "24px 16px",
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                style={{ width: "100%", maxWidth: 460 }}
            >
                <div
                    style={{
                        position: "relative",
                        borderRadius: 18,
                        background: "#ffffff",
                        border: "1px solid rgba(16,24,40,0.10)",
                        boxShadow:
                            "0 18px 40px rgba(16,24,40,0.10), 0 2px 6px rgba(16,24,40,0.06)",
                        padding: 22,
                    }}
                >
                    {/* Brand accent bar */}
                    <div
                        style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: 6,
                            background: BRAND,
                            borderTopLeftRadius: 18,
                            borderBottomLeftRadius: 18,
                        }}
                    /> 


                    <div style={{ paddingLeft: 10 }}>
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
                                <h3 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: "#101828" }}>
                                    User Login
                                </h3>
                                <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(16,24,40,0.55)" }}>
                                    Sign in to continue your order
                                </p>
                            </div>
                        </div>

                        <AnimatePresence>
                            {errorMsg ? (
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
                                    {errorMsg}
                                </motion.div>
                            ) : null}
                        </AnimatePresence>

                        {/* Fields */}
                        <div style={{ marginTop: 16, display: "grid", gap: 14 }}>
                            <div className="input-wrapper">
                                <label style={{ fontSize: 13, fontWeight: 700, color: "rgba(16,24,40,0.70)" }}>
                                    Email
                                </label>
                                <input
                                    className="input-field"
                                    type="email"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={inputStyle(emptyEmail)}
                                />
                            </div>

                            <div className="input-wrapper">
                                <label style={{ fontSize: 13, fontWeight: 700, color: "rgba(16,24,40,0.70)" }}>
                                    Password
                                </label>
                                <input
                                    className="input-field"
                                    type="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={inputStyle(emptyPw)}
                                />
                            </div>

                            <motion.button
                                onClick={loginHandle}
                                disabled={loading}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                transition={{ type: "spring", stiffness: 350, damping: 22 }}
                                className="button"
                                style={{
                                    width: "100%",
                                    border: 0,
                                    borderRadius: 12,
                                    padding: "12px 14px",
                                    color: "white",
                                    fontWeight: 900,
                                    cursor: "pointer",
                                    background: BRAND,
                                    boxShadow: "0 12px 22px rgba(167,61,77,0.22)",
                                    opacity: loading ? 0.7 : 1,
                                    marginTop: 4,
                                }}
                            >
                                {loading ? "Logging in..." : "Login"}
                            </motion.button>
                        </div>
                        <div style={{ textAlign: "center", marginTop: 12 }}>
                            <p style={{ margin: 0, fontSize: 13, color: "rgba(16,24,40,0.65)" }}>
                                Don&apos;t have an account?{" "}
                                <button
                                    type="button"
                                    onClick={onToggle}
                                    style={{
                                        border: "none",
                                        background: "transparent",
                                        color: "#A73D4D",
                                        fontWeight: 900,
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

                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default UserLogin;
