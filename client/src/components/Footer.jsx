import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import  logo from '../assets/Logo_TourConnect_blue.png';
import RouterLink from "./RouterLink";

const Footer = () => {
  const {t} = useTranslation();

  return (
    <footer className="w3-container" style={{ 
      background: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)", 
      color: "#fff",
      padding: "16px 16px",
    }}>
      <div className="w3-row-padding">
        
        {/* Logo and Slogan */}
        <div className="w3-third w3-margin-bottom">
          <Link to="/" className="w3-text-white" style={{ textDecoration: "none" }}>
            <h3>
              <b>
              <img 
                src={logo} 
                alt="TourConnect Logo" 
                style={{ height: '30px', marginRight: '8px', verticalAlign: 'middle', borderRadius: '50%' }} 
              />
              <span style={{ color: "#ff5252", verticalAlign: 'middle' }}>TourConnect</span> {/* Brand color */}
              </b>
            </h3>
          </Link>
          <h5><b><i>{t('footer_slogan')}</i></b></h5>
          <div className="w3-xlarge">
            <a href="#" className="w3-hover-opacity" style={{ marginRight: "12px" }}><i className="fab fa-facebook"></i></a>
            <a href="#" className="w3-hover-opacity" style={{ marginRight: "12px" }}><i className="fab fa-vk"></i></a>
            <a href="#" className="w3-hover-opacity" style={{ marginRight: "12px" }}><i className="fab fa-telegram"></i></a>
            <a href="#" className="w3-hover-opacity"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
    
        {/* For travelers */}
        <div className="w3-third w3-margin-bottom">
          <h4><b>{t('footer_tourists_title')}</b></h4>
          <ul className="w3-ul" style={{ border: "none" }}>
            <li>
            <RouterLink 
              to="/" 
              className="w3-hover-text-red" 
              style={{ color: "white" }}
            >
              {t('footer_tourists_search')}
            </RouterLink>
            </li>
            <li><RouterLink 
              to="/reviews" 
              className="w3-hover-text-red" 
              style={{ color: "white" }}
            >
              {t('footer_tourists_reviews')}
            </RouterLink></li>
            <li><RouterLink 
              to="/blog" 
              className="w3-hover-text-red" 
              style={{ color: "white" }}
            >
              {t('footer_tourists_blog')}
            </RouterLink></li>
          </ul>
        </div>
    
        {/* For guides */}
        <div className="w3-third">
          <h4><b>{t('footer_guides_title')}</b></h4>
          <ul className="w3-ul" style={{ border: "none" }}>
            <li><RouterLink 
              to="/guide-register" 
              className="w3-hover-text-red" 
              style={{ color: "white" }}
            >
              {t('footer_guides_become')}
            </RouterLink></li>
            <li><RouterLink 
              to="/guide-dashboard" 
              className="w3-hover-text-red" 
              style={{ color: "white" }}
            >
              {t('footer_guides_profile')}
            </RouterLink></li>
            <li><RouterLink 
              to="/guide-support" 
              className="w3-hover-text-red" 
              style={{ color: "white" }}
            >
              {t('footer_guides_support')}
            </RouterLink></li>
          </ul>
        </div>
      </div>
    
      {/* Bottom */}
      <div className="w3-border-top " style={{ borderColor: "rgba(255, 255, 255, 0.2) !important" }}>
        <p className="w3-center">
          © 2025 TourConnect | 
          <a href="/privacy" className="w3-hover-text-red" style={{ color: "white", marginLeft: "8px" }}>{t('footer_bottom')}</a>
        </p>
      </div>
    </footer>
    // <footer className="w3-container w3-center w3-opacity w3-margin-bottom">
    //   <h5>Find Us On</h5>
    //   <div className="w3-xlarge w3-padding-16">
    //   <i className="fab fa-facebook"></i>
    //   <i className="fab fa-instagram"></i>
    //   <i className="fab fa-snapchat"></i>
    //   <i className="fab fa-pinterest"></i>
    //   <i className="fab fa-twitter"></i>
    //   <i className="fab fa-linkedin"></i>
    //   </div>
    //   <p>
    //     Powered by{" "}
    //     <a
    //       href="https://www.w3schools.com/w3css/default.asp"
    //       target="_blank"
    //       className="w3-hover-text-green"
    //     >
    //       w3.css
    //     </a>
    //   </p>
    // </footer>
  );
};

export default Footer;
