import { Link, useLocation } from "react-router-dom";
import GuideDropdown from "./GuideDropdown";
import { useState } from "react";

const NavigationBar = () => {
  const location = useLocation();

  const isGuidePage =
    location.pathname === "/" || location.pathname.startsWith("/guide");

  return (
    <div className="w3-bar w3-white w3-border-bottom w3-xlarge">
      <Link to="/" className="w3-bar-item w3-button w3-text-red w3-hover-red">
        <b>
          <i className="fa fa-map-marker w3-margin-right"></i>TourConnect
        </b>
      </Link>

      {isGuidePage && <GuideDropdown />}

      <a
        href="#"
        className="w3-bar-item w3-button w3-right w3-hover-red w3-text-grey"
      >
        <i className="fa fa-search"></i>
      </a>
    </div>
  );
};

export default NavigationBar;
