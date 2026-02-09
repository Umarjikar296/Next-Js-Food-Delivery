"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

const BRAND = "#A73D4D";

const RestaurantHeader = () => {
  const [details, setDetails] = useState(null);
  const router = useRouter();
  const pathName = usePathname();

  // Read once per route change (important!)
  useEffect(() => {
    const data = localStorage.getItem("restaurantUser");
    const parsed = data ? JSON.parse(data) : null;

    // routing rules (your same behavior)
    if (!parsed && pathName === "/restaurant/dashboard") {
      router.push("/restaurant");
      return;
    }
    if (parsed && pathName === "/restaurant") {
      router.push("/restaurant/dashboard");
      return;
    }

    setDetails(parsed);
  }, [pathName, router]);

  const logout = () => {
    localStorage.removeItem("restaurantUser");
    setDetails(null);
    router.push("/restaurant");
    router.refresh();
  };

  const isActive = (href) => pathName === href;

  const navLinkStyle = (active) => ({
    padding: "10px 12px",
    borderRadius: 12,
    textDecoration: "none",
    fontWeight: 800,
    fontSize: 14,
    color: active ? BRAND : "rgba(16,24,40,0.70)",
    background: active ? "rgba(167,61,77,0.10)" : "transparent",
    border: active ? "1px solid rgba(167,61,77,0.18)" : "1px solid transparent",
    transition: "160ms ease",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  });

  const chipStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 10px",
    borderRadius: 999,
    border: "1px solid rgba(16,24,40,0.10)",
    background: "rgba(255,255,255,0.85)",
    fontSize: 13,
    color: "rgba(16,24,40,0.70)",
  };

  const brandBadge = useMemo(() => {
    const letter = details?.rname?.trim()?.[0]?.toUpperCase() || "R";
    return letter;
  }, [details]);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(16,24,40,0.08)",
      }}
    >
      {/* ✅ Break out of max-width parent safely */}
      <div
        style={{
          width: "100vw",
          marginLeft: "calc(50% - 50vw)",
          marginRight: "calc(50% - 50vw)",
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
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                background: BRAND,
                boxShadow: "0 12px 22px rgba(167,61,77,0.18)",
                display: "grid",
                placeItems: "center",
                color: "white",
                fontWeight: 900,
                letterSpacing: 0.3,
              }}
              aria-hidden
            >
              {brandBadge}
            </div>
            <div style={{ lineHeight: 1.1 }}>
              <div style={{ fontWeight: 950, color: "#101828", fontSize: 16 }}>
                Food Delivery
              </div>
              <div style={{ fontSize: 12, color: "rgba(16,24,40,0.55)", fontWeight: 700 }}>
                Restaurant Panel
              </div>
            </div>
          </Link>

          {/* Nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <Link href="/" style={navLinkStyle(isActive("/"))}>
              Home
            </Link>

            {details?.rname ? (
              <>
                <Link
                  href="/restaurant/dashboard"
                  style={navLinkStyle(isActive("/restaurant/dashboard"))}
                >
                  Dashboard
                </Link>

                {/* Profile (change route if you have a real profile page) */}
                <Link href="/restaurant/profile" style={navLinkStyle(isActive("/restaurant/profile"))}>
                  Profile
                </Link>

                <span style={chipStyle} title={details?.email || ""}>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 999,
                      background: "rgba(34,197,94,0.80)",
                    }}
                  />
                  {details?.rname}
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
                    fontWeight: 900,
                    cursor: "pointer",
                  }}
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <Link href="/restaurant" style={navLinkStyle(isActive("/restaurant"))}>
                  Restaurant Login
                </Link>
                <Link href="/user-auth" style={navLinkStyle(isActive("/user-auth"))}>
                  User?
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default RestaurantHeader;
