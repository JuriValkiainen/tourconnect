import { Link, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next'




const NavigationBar = () => {
  const {t, i18n } = useTranslation();
  const location = useLocation();
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang)
    console.log(`Language changed to: ${lang}`)
  }
  return (
    <div className="w3-bar w3-white w3-border-bottom w3-xlarge">
      <Link to="/" className="w3-bar-item w3-button w3-text-red w3-hover-red">
        <b>
          <i className="fa fa-map-marker w3-margin-right"></i>TourConnect
        </b>
      </Link>

      <button className="w3-button" onClick={() => changeLanguage('fi')}>
      FIN
        </button>
      <button className="w3-button" onClick={() => changeLanguage('en')}>
        ENG
      </button>
      <button className="w3-button" onClick={() => changeLanguage('ru')}>
        RUS
      </button>

      {location.pathname === "/" && (    
        <Link
          to="/guide-register"
          className="w3-bar-item w3-button w3-right w3-text-red w3-hover-red"
        >
        <b>{t('become_guide')}</b>
        </Link>
      )}

      <a href="#" className="w3-bar-item w3-button w3-right w3-hover-red w3-text-grey">
        <i className="fa fa-search"></i>
      </a>
    </div>
  );
};
export default NavigationBar;
