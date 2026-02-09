"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BRAND = "#A73D4D";

const RestaurantSignup = ({ onToggle }) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cpassword, setCpassword] = useState("");
    const [contact, setContact] = useState("");
    const [rname, setRname] = useState("");
    const [city, setCity] = useState("");

    const [error, setError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSignup = async () => {
        setServerError("");

        if (password !== cpassword) {
            setPasswordError(true);
            return;
        } else {
            setPasswordError(false);
        }

        if (!email || !password || !cpassword || !contact || !rname || !city) {
            setError(true);
            return;
        } else {
            setError(false);
        }

        try {
            setLoading(true);

            let response = await fetch("/api/restaurant", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, contact, rname, city }),
            });

            response = await response.json();

            if (response.success) {
                const { result } = response;
                delete result.password;

                localStorage.setItem("restaurantUser", JSON.stringify(result));

                router.replace("/restaurant/dashboard");
                router.refresh();
            } else {
                setServerError("Signup failed. Please try again.");
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

    // helper to render animated error text
    const Err = ({ show, text }) => (
        <AnimatePresence>
            {show ? (
                <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    style={{ marginTop: 6, fontSize: 12, color: "rgba(16,24,40,0.65)" }}
                >
                    {text}
                </motion.div>
            ) : null}
        </AnimatePresence>
    );

    return (
        <div
            style={{
                minHeight: "70vh",
                display: "grid",
                placeItems: "center",
                padding: "24px 16px",
                // background: "#ffffff", // ✅ clean
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                style={{ width: "100%", maxWidth: 520 }}
            >
                {/* Glass card */}
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
                                Restaurant Sign up
                            </h3>
                            <p style={{ margin: "4px 0 0", fontSize: 16, color: "rgba(16,24,40,0.55)" }}>
                                Create your restaurant profile
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

                    {/* Form fields */}
                    <motion.div
                        initial="hidden"
                        animate="show"
                        variants={{
                            hidden: {},
                            show: { transition: { staggerChildren: 0.06 } },
                        }}
                        style={{ marginTop: 16, display: "grid", gap: 14 }}
                    >
                        {/* Email */}
                        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
                            <label style={{ fontSize: 13, fontWeight: 700, color: "rgba(16,24,40,0.70)" }}>
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="Enter Email Id"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={inputStyle(error && !email)}
                            />
                            <Err show={error && !email} text="Please enter email" />
                        </motion.div>

                        {/* Password */}
                        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
                            <label style={{ fontSize: 13, fontWeight: 700, color: "rgba(16,24,40,0.70)" }}>
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="Enter Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={inputStyle((error && !password) || passwordError)}
                            />
                            <Err show={passwordError} text="Password doesn't match" />
                            <Err show={error && !password} text="Please enter password" />
                        </motion.div>

                        {/* Confirm Password */}
                        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
                            <label style={{ fontSize: 13, fontWeight: 700, color: "rgba(16,24,40,0.70)" }}>
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={cpassword}
                                onChange={(e) => setCpassword(e.target.value)}
                                style={inputStyle((error && !cpassword) || passwordError)}
                            />
                            <Err show={passwordError} text="Password doesn't match" />
                            <Err show={error && !cpassword} text="Please confirm password" />
                        </motion.div>

                        {/* Contact */}
                        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
                            <label style={{ fontSize: 13, fontWeight: 700, color: "rgba(16,24,40,0.70)" }}>
                                Contact Number
                            </label>
                            <input
                                type="tel"
                                placeholder="Contact Number"
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                                style={inputStyle(error && !contact)}
                            />
                            <Err show={error && !contact} text="Please enter contact" />
                        </motion.div>

                        {/* Restaurant Name */}
                        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
                            <label style={{ fontSize: 13, fontWeight: 700, color: "rgba(16,24,40,0.70)" }}>
                                Restaurant Name
                            </label>
                            <input
                                type="text"
                                placeholder="Enter Restaurant Name"
                                value={rname}
                                onChange={(e) => setRname(e.target.value)}
                                style={inputStyle(error && !rname)}
                            />
                            <Err show={error && !rname} text="Please enter name" />
                        </motion.div>

                        {/* City */}
                        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
                            <label style={{ fontSize: 13, fontWeight: 700, color: "rgba(16,24,40,0.70)" }}>
                                City
                            </label>
                            <input
                                type="text"
                                placeholder="Enter city"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                style={inputStyle(error && !city)}
                            />
                            <Err show={error && !city} text="Please enter city" />
                        </motion.div>

                        {/* Button */}
                        <motion.button
                            onClick={handleSignup}
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 350, damping: 22 }}
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
                                marginTop: 4,
                            }}
                        >
                            {loading ? "Creating..." : "Sign Up"}
                        </motion.button>
                    </motion.div>

                    {/* Keep your switch line here if you want (or keep only in page.js) */}
                    <div style={{ textAlign: "center", marginTop: 12 }}>
                        <p style={{ margin: 0, fontSize: 16, color: "rgba(16,24,40,0.65)" }}>
                            Already have an account?{" "}
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
                                Log in
                            </button>
                        </p>

                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default RestaurantSignup;
