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


  return (
    <main>
      <CustomerHeader />

      <div className="main-page-banner">
        <h1>Food Delivery App</h1>

        <div className="input-wrapper">
          <input value={selectedLocation} readOnly
            onClick={() => setShowLocation(true)} type="text" className="select-input" placeholder="Select Place" />

          <ul className='location-list'>
            {
              showLocation && locations.map((item) => (
                <li key={item} onClick={() => handleListItem(item)}>{item}</li>
              ))
            }
          </ul>


          <input
            type="text"
            className="search-input"
            placeholder="Search restaurant"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

        </div>
      </div>
      <div>

        <div className='restaurant-list-container'>

          {
            restaurants.map((item) => (
              <div
                onClick={() => router.push(`/explore/${item._id}`)}
                className="restaurant-wrapper"
                key={item._id}
              >
                <div className="restaurant-card">
                  <h2>{item.rname}</h2>
                  <h4>Contact: {item.contact}</h4>
                  <h4>{item.city}</h4>
                </div>
              </div>
            ))

            // Old code
            // restaurants.map((item: Restaurant) => (
            //   <div onClick={() => router.push('/explore/' + item._id)}
            //     className='restaurant-wrapper' key={item._id || item.rname}>
            //     <div className='restaurant-card'>
            //       <h2>{item.rname}</h2>
            //       <h4>Contact: {item.contact}</h4>
            //       <h4>{item.city}</h4>
            //     </div>
            //   </div>
            // ))
          }

        </div>
      </div>

      <RestaurantFooter />
    </main>
  );
}
