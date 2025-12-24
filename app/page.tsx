'use client'

import CustomerHeader from './_components/CustomerHeader'
import RestaurantFooter from './_components/RestaurantFooter'
import { useEffect, useState } from "react";

export default function Home() {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState();
  const [showLocation, setShowLocation] = useState(false)

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    let response = await fetch('/api/customers/locations');
    let data = await response.json();

    if (data.success) {
      setLocations(data.result);
    }
  };

  const handleListItem = (item) => {
    setSelectedLocation(item);
    setShowLocation(false)
    console.log(selectedLocation);

  }

  return (
    <main>
      <CustomerHeader />

      <div className="main-page-banner">
        <h1>Food Delivery App</h1>

        <div className="input-wrapper">
          <input value={selectedLocation}
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
            placeholder="Search dish"
          />
        </div>
      </div>

      <RestaurantFooter />
    </main>
  );
}
