import React, { useState, useEffect } from "react";
import axios from "axios";

const CitySelection = ({ selectedCity, onCitySelect }) => {
  const [cities, setCities] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);
  const [inputWidth, setInputWidth] = useState("auto");

  useEffect(() => {
    axios.get("http://localhost:5001/cities")
      .then(response => setCities(response.data))
      .catch(error => console.error("Error fetching cities:", error));
  }, []);
  useEffect(() => {
    if (inputValue.length > 0) {
      setFilteredCities(
        cities.filter(city => city.toLowerCase().includes(inputValue.toLowerCase()))
      );
    } else {
      setFilteredCities([]);
    }
  }, [inputValue, cities]);
  useEffect(() => {
    if (cities.includes(inputValue)) {
      setTimeout(() => setFilteredCities([]), 100);
    }
  }, [inputValue]);
  useEffect(() => {
    const inputElement = document.getElementById("city-input");
    if (inputElement) {
      setInputWidth(`${inputElement.offsetWidth}px`);
    }
  }, [inputValue]);

  return (
    <div className="w3-container" style={{ position: "relative" }}>
      <input
        id="city-input"
        className="w3-input w3-border"
        type="text"
        placeholder="Enter city"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={() => setFilteredCities(cities)}
      />
      {filteredCities.length > 0 && (
        <ul 
          className="w3-ul w3-border" 
          style={{ 
            maxHeight: "150px", 
            overflowY: "auto", 
            position: "absolute", 
            background: "white", 
            zIndex: 10, 
            width: inputWidth
          }}>
          {filteredCities.map((city, index) => (
            <li 
              key={index} 
              className="w3-hover-light-gray"
              style={{ cursor: "pointer", padding: "8px" }}
              onClick={() => {
                setInputValue(city);
                onCitySelect(city);
                setFilteredCities([]);
              }}
            >
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CitySelection;
