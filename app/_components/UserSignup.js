"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BRAND = "#A73D4D";

const UserSignup = ({ onToggle }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSignUp = async () => {
    setErrorMsg("");

    if (!name || !email || !password || !confirmPassword || !city || !address || !mobile) {
      setErrorMsg("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      let response = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, city, address, mobile }),
      });

      const data = await response.json();

      if (data?.success) {
        const result = data.result || {};
        if (result.password) delete result.password;

        localStorage.setItem("user", JSON.stringify(result));
        router.push("/");
      } else {
        setErrorMsg("Signup failed. Please try again.");
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

  const showFieldError = !!errorMsg;

  return (
    <div
      style={{
        minHeight: "60vh",
        display: "grid",
        placeItems: "center",
        padding: "24px 16px",
        // background: "linear-gradient(180deg, #ffffff, #f5f6fb)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        style={{ width: "100%", maxWidth: 520 }}
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
             
              <div>
                <h3 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: "#101828" }}>
                  User Sign up
                </h3>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(16,24,40,0.55)" }}>
                  Create your account to order food
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

            {/* Form */}
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.06 } },
              }}
              style={{ marginTop: 16, display: "grid", gap: 12 }}
            >
              {[
                { label: "Name", value: name, setValue: setName, placeholder: "Enter Name" },
                { label: "Email", value: email, setValue: setEmail, placeholder: "Enter email", type: "email" },
                { label: "Password", value: password, setValue: setPassword, placeholder: "Enter Password", type: "password" },
                { label: "Confirm Password", value: confirmPassword, setValue: setConfirmPassword, placeholder: "Confirm Password", type: "password" },
                { label: "City", value: city, setValue: setCity, placeholder: "Enter City" },
                { label: "Address", value: address, setValue: setAddress, placeholder: "Enter Address" },
                { label: "Mobile", value: mobile, setValue: setMobile, placeholder: "Enter Mobile", type: "tel" },
              ].map((f) => (
                <motion.div
                  key={f.label}
                  variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                >
                  <label style={{ fontSize: 13, fontWeight: 700, color: "rgba(16,24,40,0.70)" }}>
                    {f.label}
                  </label>
                  <input
                    type={f.type || "text"}
                    value={f.value}
                    className="input-field"
                    placeholder={f.placeholder}
                    onChange={(e) => f.setValue(e.target.value)}
                    style={inputStyle(showFieldError && !f.value)}
                  />
                </motion.div>
              ))}

              <motion.button
                onClick={handleSignUp}
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
                  marginTop: 6,
                }}
              >
                {loading ? "Creating..." : "Sign Up"}
              </motion.button>

              {/* Switch line (uses same toggle logic from UserAuth) */}
              <div style={{ textAlign: "center", marginTop: 6 }}>
                <p style={{ margin: 0, fontSize: 13, color: "rgba(16,24,40,0.65)" }}>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={onToggle}
                    style={{
                      border: "none",
                      background: "transparent",
                      color: BRAND,
                      fontWeight: 900,
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
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserSignup;
