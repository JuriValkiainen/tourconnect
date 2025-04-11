import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const CitySelection = ({ selectedCity, onCitySelect }) => {
  const [cities, setCities] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);
  const [inputWidth, setInputWidth] = useState("auto");

  const containerRef = useRef(null);

  useEffect(() => {
    axios.get("http://localhost:5001/cities")
      .then(response => {
        const uniqueCities = [...new Set(response.data)];
        setCities(uniqueCities);
      })
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
    const inputElement = document.getElementById("city-input");
    if (inputElement) {
      setInputWidth(`${inputElement.offsetWidth}px`);
    }
  }, [inputValue]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setFilteredCities([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w3-container" style={{ position: "relative" }} ref={containerRef}>
      <input
        id="city-input"
        className="w3-input w3-border"
        type="text"
        placeholder="Enter city"
        value={inputValue}
        autoComplete="off"
        onChange={(e) => {
          const value = e.target.value;
          setInputValue(value);
          onCitySelect(value);
        }}
        onFocus={() => {
          if (cities.length > 0) {
            setFilteredCities(cities.filter(city =>
              city.toLowerCase().includes(inputValue.toLowerCase())
            ));
          }
        }}
        onBlur={() => {
          // небольшая задержка, чтобы дать обработаться клику по пункту
          setTimeout(() => setFilteredCities([]), 100);
        }}
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
            width: inputWidth,
            marginTop: "4px"
          }}>
          {filteredCities.map((city, index) => (
            <li
              key={index}
              className="w3-hover-light-gray"
              style={{ cursor: "pointer", padding: "8px" }}
              onMouseDown={() => {
                setInputValue(city);
                onCitySelect(city);
                // список сам скроется в onBlur
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
