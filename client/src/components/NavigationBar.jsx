import { Link, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import LanguageSelector from "./LanguageSelector.jsx";
import GuideDropdown from "./GuideDropdown";

const NavigationBar = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div
      className="w3-white w3-border-bottom w3-xlarge"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.5rem 1rem"
      }}
    >
      {/* Left — Logo */}
      <Link to="/" className="w3-button w3-text-red w3-hover-red">
        <b>
          <i className="fa fa-map-marker w3-margin-right"></i>TourConnect
        </b>
      </Link>

      {/* Center — Language Selector */}
      <div style={{ display: "flex", justifyContent: "center", flex: 1 }}>
        <LanguageSelector changeLanguage={changeLanguage} />
      </div>

      {/* Right — Guide Dropdown (was 'Become a Guide') */}
      <GuideDropdown />
    </div>
  );
};

export default NavigationBar;
