//client/src/components/TouristDropdown.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

const TouristDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w3-dropdown-hover w3-right">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w3-button w3-text-red w3-hover-red"
        style={{ borderRadius: "0", fontSize: "18px", padding: "14px 16px" }}
      >
        <b>Traveler</b>
      </button>

      {isOpen && (
        <div className="w3-dropdown-content w3-bar-block w3-border w3-light-grey w3-right">
          <Link
            to="/register"
            className="w3-bar-item w3-button"
            style={{ fontSize: "14px", padding: "4px 16px" }}
          >
            Register as Traveler
          </Link>
          <Link
            to="/login"
            className="w3-bar-item w3-button"
            style={{ fontSize: "14px", padding: "4px 16px" }}
          >
            Traveler Login
          </Link>
          <Link
            to="/profile"
            className="w3-bar-item w3-button"
            style={{ fontSize: "14px", padding: "4px 16px" }}
          >
            Traveler Profile
          </Link>
        </div>
      )}
    </div>
  );
};

export default TouristDropdown;
