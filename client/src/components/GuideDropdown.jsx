import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const GuideDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="w3-dropdown-hover w3-right">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w3-button w3-text-red w3-hover-red"
        style={{ borderRadius: "0", fontSize: "18px", padding: "14px 16px" }}
      >
        <b>{t('navBtn_guide')}</b>
      </button>

      {isOpen && (
        <div className="w3-dropdown-content w3-bar-block w3-border w3-light-grey w3-right">
          <Link
            to="/guide-register"
            className="w3-bar-item w3-button"
            style={{ fontSize: "14px", padding: "4px 16px" }}
          >
            {t('dropdownGuide_register')}
          </Link>
          <Link
            to="/guide-login"
            className="w3-bar-item w3-button"
            style={{ fontSize: "14px", padding: "4px 16px" }}
          >
            {t('dropdownGuide_login')}
          </Link>
          <Link
            to="/guide-dashboard"
            className="w3-bar-item w3-button"
            style={{ fontSize: "14px", padding: "4px 16px" }}
          >
            {t('dropdownGuide_dashboard')}
          </Link>
        </div>
      )}
    </div>
  );
};

export default GuideDropdown;
