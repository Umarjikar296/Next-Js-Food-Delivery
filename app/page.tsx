'use client'
import { useRouter } from 'next/navigation';
import CustomerHeader from './_components/CustomerHeader'
import RestaurantFooter from './_components/RestaurantFooter'
import { useEffect, useState } from "react";

export default function Home() {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showLocation, setShowLocation] = useState(false)
  const [restaurants, setRestaurant] = useState<Restaurant[]>([]);
  const [searchText, setSearchText] = useState("");
  const router = useRouter();


  useEffect(() => {
    const t = setTimeout(() => {
      // If searchText is present, search by restaurant name
      if (searchText.trim()) {
        loadRestaurants({ restaurant: searchText.trim() });
      } else if (selectedLocation) {
        // If search is empty, fall back to selected location
        loadRestaurants({ location: selectedLocation });
      } else {
        // If nothing selected and no search, load all
        loadRestaurants();
      }
    }, 400); // debounce time

    return () => clearTimeout(t);
  }, [searchText, selectedLocation]);


  useEffect(() => {
    loadLocations();
    loadRestaurants();
  }, []);

  const loadLocations = async () => {
    let response = await fetch('/api/customers/locations');
    let data = await response.json();
    // console.log(data);


    if (data.success) {
      setLocations(data.result);
    }
  };

  type RestaurantParams = {
    location?: string;
    restaurant?: string;
  };

  type Restaurant = {
    _id: string;
    rname: string;
    contact?: string;
    city?: string;
  };

  const loadRestaurants = async (params: RestaurantParams = {}) => {
    const query = new URLSearchParams();

    if (params.location) query.set("location", params.location);
    if (params.restaurant) query.set("restaurant", params.restaurant);

    const url = `/api/customers${query.toString() ? `?${query.toString()}` : ""}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.success) setRestaurant(data.result);
  };

  // const loadRestaurants = async (params = {}) => {
  //   const query = new URLSearchParams();

  //   if (params?.location) query.set("location", params.location);
  //   if (params?.restaurant) query.set("restaurant", params.restaurant);

  //   const url = `http://localhost:3000/api/customers${query.toString() ? `?${query}` : ""}`;

  //   const res = await fetch(url);
  //   const data = await res.json();

  //   if (data.success) setRestaurant(data.result);
  // };


  const handleListItem = (item: string) => {
    setSelectedLocation(item);
    setShowLocation(false);
    loadRestaurants({ location: item }); // ✅ use location (singular)
  };

  const inputStyle = () => ({
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(16,24,40,0.14)",
    background: "#fff",
    color: "#101828",
    outline: "none",
    fontWeight: 800,
  });

  const labelStyle = {
    display: "block",
    fontSize: 13,
    fontWeight: 900,
    color: "rgba(16,24,40,0.70)",
    marginBottom: 6,
  };

  const ghostBtn = {
    padding: "12px 12px",
    borderRadius: 12,
    border: "1px solid rgba(16,24,40,0.12)",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 900,
    color: "rgba(16,24,40,0.75)",
    whiteSpace: "nowrap",
  };

  const chip = {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(16,24,40,0.10)",
    background: "rgba(245,246,251,0.90)",
    fontSize: 12,
    fontWeight: 950,
    color: "rgba(16,24,40,0.75)",
  };


  return (
    <main style={{ background: "linear-gradient(180deg,#ffffff,#f5f6fb)", minHeight: "100vh" }}>
      <CustomerHeader />

      {/* HERO */}
      <section style={{ width: "100%", padding: "18px 16px 10px" }}>
        {/* Title row (no big card) */}
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 14,
                background: "#A73D4D",
                boxShadow: "0 10px 18px rgba(167,61,77,0.16)",
              }}
            />
            <div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 950, color: "#101828" }}>
                Discover restaurants
              </h1>
              <p style={{ margin: "4px 0 0", fontSize: 13, fontWeight: 700, color: "rgba(16,24,40,0.55)" }}>
                Choose a location or search by restaurant name
              </p>
            </div>
          </div>

          <div style={chip}>{restaurants.length} restaurant(s)</div>
        </div>

        {/* Filter bar card (small + clean) */}
        <div
          style={{
            marginTop: 14,
            width: "100%",
            borderRadius: 18,
            background: "#fff",
            border: "1px solid rgba(16,24,40,0.10)",
            boxShadow: "0 16px 36px rgba(16,24,40,0.06), 0 2px 6px rgba(16,24,40,0.04)",
            padding: 14,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.2fr auto",
              gap: 12,
              alignItems: "end",
            }}
          >
            {/* Location */}
            <div style={{ position: "relative" }}>
              <label style={labelStyle}>Location</label>

              <input
                value={selectedLocation}
                readOnly
                onClick={() => setShowLocation((v) => !v)}
                type="text"
                placeholder="Select Place"
                style={inputStyle()}
              />

              {showLocation && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    marginTop: 8,
                    background: "#fff",
                    border: "1px solid rgba(16,24,40,0.10)",
                    borderRadius: 14,
                    boxShadow: "0 18px 40px rgba(16,24,40,0.10)",
                    overflow: "hidden",
                    zIndex: 10,
                    maxHeight: 260,
                    overflowY: "auto",
                  }}
                >
                  {locations.length === 0 ? (
                    <div style={{ padding: 12, color: "rgba(16,24,40,0.60)", fontWeight: 800, fontSize: 13 }}>
                      Loading locations...
                    </div>
                  ) : (
                    locations.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => handleListItem(item)}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "12px 12px",
                          border: 0,
                          background: item === selectedLocation ? "rgba(167,61,77,0.10)" : "#fff",
                          cursor: "pointer",
                          fontWeight: 900,
                          color: item === selectedLocation ? "#A73D4D" : "rgba(16,24,40,0.80)",
                        }}
                      >
                        {item}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Search */}
            <div>
              <label style={labelStyle}>Search</label>
              <input
                type="text"
                placeholder="Search restaurant"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={inputStyle()}
              />
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => {
                  setSearchText("");
                  loadRestaurants(selectedLocation ? { location: selectedLocation } : {});
                }}
                style={ghostBtn}
                title="Clear search"
              >
                Clear Search
              </button>

              <button
                type="button"
                onClick={() => {
                  setSearchText("");
                  setSelectedLocation("");
                  setShowLocation(false);
                  loadRestaurants();
                }}
                style={{
                  ...ghostBtn,
                  borderColor: "rgba(167,61,77,0.22)",
                  color: "#A73D4D",
                  fontWeight: 950,
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* RESTAURANT LIST */}
      <section style={{ width: "100%", padding: "0 16px 28px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 14,
            width: "100%",
          }}
        >
          {restaurants.length === 0 ? (
            <div
              style={{
                gridColumn: "1 / -1",
                padding: 18,
                borderRadius: 18,
                background: "#fff",
                border: "1px solid rgba(16,24,40,0.10)",
                color: "rgba(16,24,40,0.65)",
                fontWeight: 900,
                textAlign: "center",
              }}
            >
              No restaurants found. Try another search or location.
            </div>
          ) : (
            restaurants.map((item) => (
              <button
                key={item._id}
                onClick={() => router.push(`/explore/${item._id}`)}
                style={{
                  textAlign: "left",
                  border: "1px solid rgba(16,24,40,0.10)",
                  background: "#fff",
                  borderRadius: 18,
                  padding: 16,
                  cursor: "pointer",
                  boxShadow: "0 14px 32px rgba(16,24,40,0.06)",
                  transition: "160ms ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0px)")}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ fontSize: 18, fontWeight: 950, color: "#101828" }}>{item.rname}</div>
                  <span
                    style={{
                      padding: "6px 10px",
                      borderRadius: 999,
                      background: "rgba(167,61,77,0.10)",
                      border: "1px solid rgba(167,61,77,0.18)",
                      color: "#A73D4D",
                      fontWeight: 950,
                      fontSize: 12,
                      whiteSpace: "nowrap",
                    }}
                  >
                    View
                  </span>
                </div>

                <div style={{ marginTop: 10, display: "grid", gap: 6 }}>
                  <div style={{ fontSize: 13, color: "rgba(16,24,40,0.65)", fontWeight: 800 }}>
                    📍 {item.city || "—"}
                  </div>
                  <div style={{ fontSize: 13, color: "rgba(16,24,40,0.65)", fontWeight: 800 }}>
                    📞 {item.contact || "—"}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </section>

      <RestaurantFooter />
    </main>
  );

}
