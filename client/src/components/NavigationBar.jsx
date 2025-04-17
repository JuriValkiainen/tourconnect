import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import LanguageSelector from "./LanguageSelector.jsx";
import GuideDropdown from "./GuideDropdown";
import TouristDropdown from "./TouristDropdown";
import  logo from '../assets/Logo_TourConnect_blue.png';
import { useState } from 'react';

const NavigationBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {  i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <>
      {/* Основной навбар */}
      <div 
        className="w3-white w3-border-bottom w3-xlarge"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.5rem 1rem",
          position: 'relative'
        }}
      >
        {/* Логотип (центрируется на мобильных) */}
        <Link 
          to="/" 
          className="w3-button w3-text-red w3-hover-red"
          style={{
            flex: 1,
            // flex: mobileMenuOpen ? 'none' : 1,
            // textAlign: window.innerWidth < 768 ? 'center' : 'left',
            justifyContent: 'center'
          }}
        >
          <b style={{fontSize: window.innerWidth < 768 ? '0.9em' : 'inherit'}}>
            <img 
              src={logo} 
              alt="TourConnect Logo" 
              style={{ 
                height: '30px', 
                marginRight: '8px', 
                marginBottom: '4px',
                verticalAlign: 'middle'
              }} 
            />
            TourConnect
          </b>
        </Link>

        {/* Центральный блок (скрывается на мобильных) */}
        <div 
          className="w3-hide-small" 
          style={{ 
            display: "flex", 
            justifyContent: "center", 
            flex: 1 
          }}
        >
          <LanguageSelector changeLanguage={changeLanguage} />
        </div>

        {/* Правый блок (скрывается на мобильных) */}
        <div className="w3-hide-small">
          <TouristDropdown />
          <GuideDropdown />
        </div>

        {/* Гамбургер-меню (только на мобильных) */}
        <button 
          className="w3-button w3-xlarge w3-hide-medium w3-hide-large"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            position: 'absolute',
            left: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            paddingTop: '0px',
          }}
        >
          ☰
        </button>
      </div>

      {/* Мобильное меню (появляется при клике) */}
      {mobileMenuOpen && (
        <div 
          className="w3-white w3-border-bottom w3-hide-medium w3-hide-large"
          style={{
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <LanguageSelector changeLanguage={changeLanguage} />
          <TouristDropdown mobile />
          <GuideDropdown mobile />
        </div>
      )}
    </>
  );
};

export default NavigationBar;
