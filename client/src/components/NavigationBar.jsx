import { Link, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next'
import LanguageSelector from "./LanguageSelector.jsx";


const NavigationBar = () => {
  const {t, i18n } = useTranslation();
  const location = useLocation();
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang)
  }
  return (
    <div className="w3-white w3-border-bottom w3-xlarge" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 1rem" }}>
  
  {/* Левая часть — логотип */}
  <Link to="/" className="w3-button w3-text-red w3-hover-red">
    <b>
      <i className="fa fa-map-marker w3-margin-right"></i>TourConnect
    </b>
  </Link>

  {/* Центр — выбор языка */}
  <div style={{ display: "flex", justifyContent: "center", flex: 1 }}>
    <LanguageSelector changeLanguage={changeLanguage} />
  </div>

  {/* Правая часть — ссылка (если на главной) */}
  {location.pathname === "/" && (
    <Link
      to="/guide-register"
      className="w3-button w3-text-red w3-hover-red"
    >
      <b>{t('become_guide')}</b>
    </Link>
  )}

      {/* <a href="#" className="w3-bar-item w3-button w3-right w3-hover-red w3-text-grey">
        <i className="fa fa-search"></i>
      </a> */}
    </div>
  );
};
export default NavigationBar;
