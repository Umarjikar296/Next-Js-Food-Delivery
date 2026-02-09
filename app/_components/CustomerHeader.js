"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

const BRAND = "#A73D4D";

const CustomerHeader = (props) => {
  const router = useRouter();
  const path = usePathname();

  const [user, setUser] = useState(null);
  const [cartItem, setCartItem] = useState([]);
  const cartNumber = cartItem?.length || 0;

  // ✅ load user/cart after mount (safe)
  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user") || "null");
    const c = JSON.parse(localStorage.getItem("cart") || "[]");
    setUser(u);
    setCartItem(Array.isArray(c) ? c : []);
  }, []);

  // ✅ handle cartData updates (from props)
  useEffect(() => {
    const item = props?.cartData;
    if (!item) return;

    setCartItem((prev) => {
      const current = Array.isArray(prev) ? [...prev] : [];
      const prevRestoId = current?.[0]?.resto_id;

      // if cart has items but different restaurant → reset cart
      if (current.length > 0 && prevRestoId && prevRestoId !== item.resto_id) {
        const next = [item];
        localStorage.setItem("cart", JSON.stringify(next));
        return next;
      }

      // same restaurant or empty cart → push
      const next = [...current, item];
      localStorage.setItem("cart", JSON.stringify(next));
      return next;
    });
  }, [props?.cartData]);

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/user-auth");
    router.refresh();
  };

  const isActive = (href) => path === href;

  const navLinkStyle = (active) => ({
    padding: "10px 12px",
    borderRadius: 12,
    textDecoration: "none",
    fontWeight: 900,
    fontSize: 14,
    color: active ? BRAND : "rgba(16,24,40,0.75)",
    background: active ? "rgba(167,61,77,0.10)" : "transparent",
    border: active ? "1px solid rgba(167,61,77,0.18)" : "1px solid transparent",
    transition: "160ms ease",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    whiteSpace: "nowrap",
  });

  const pillStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 10px",
    borderRadius: 999,
    border: "1px solid rgba(16,24,40,0.10)",
    background: "rgba(255,255,255,0.85)",
    fontSize: 13,
    color: "rgba(16,24,40,0.75)",
    fontWeight: 900,
    whiteSpace: "nowrap",
  };

  const initials = useMemo(() => {
    const n = user?.name?.trim();
    if (!n) return "U";
    return n[0].toUpperCase();
  }, [user]);

  return (
    <header
      style={{
        width: "100%",
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(16,24,40,0.08)",
      }}
    >
      <div
        style={{
          width: "100%",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
          }}
        >
          <Image src="/logo.jpg" alt="Logo" width={110} height={70} priority />
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontWeight: 950, color: "#101828", fontSize: 16 }}>Food Delivery</div>
            <div style={{ fontSize: 12, color: "rgba(16,24,40,0.55)", fontWeight: 800 }}>
              Order fast • Eat happy
            </div>
          </div>
        </Link>

        {/* Nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <Link href="/" style={navLinkStyle(isActive("/"))}>
            Home
          </Link>

          {!user ? (
            <>
              <Link href="/restaurant" style={navLinkStyle(isActive("/restaurant"))}>
                Restaurant?
              </Link>
              <Link href="/user-auth" style={navLinkStyle(isActive("/user-auth"))}>
                User?
              </Link>
            </>
          ) : (
            <>
              <span style={pillStyle} title={user?.email || ""}>
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 999,
                    background: "rgba(167,61,77,0.10)",
                    border: "1px solid rgba(167,61,77,0.18)",
                    color: BRAND,
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 950,
                  }}
                >
                  {initials}
                </span>
                {user?.name}
              </span>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={logout}
                style={{
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: "1px solid rgba(167,61,77,0.25)",
                  background: "rgba(167,61,77,0.08)",
                  color: BRAND,
                  fontWeight: 950,
                  cursor: "pointer",
                }}
              >
                Logout
              </motion.button>
            </>
          )}

          {/* Cart */}
          <Link href="/cart" style={navLinkStyle(isActive("/cart"))}>
            Cart{" "}
            <span
              style={{
                marginLeft: 4,
                padding: "3px 8px",
                borderRadius: 999,
                background: "rgba(167,61,77,0.10)",
                border: "1px solid rgba(167,61,77,0.18)",
                color: BRAND,
                fontWeight: 950,
                fontSize: 12,
              }}
            >
              {cartNumber}
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default CustomerHeader;
