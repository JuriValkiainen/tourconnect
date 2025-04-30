import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

import Newsletter from "../components/Newsletter";
import Contact from "../components/Contact";
import HeroImage from "../components/HeroImage";

const GuideRegister = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    description: "",
    photo: "",
    languages: [],
  });

  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const { t } = useTranslation();

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const res = await axios.get("http://localhost:5001/languages");
        setAvailableLanguages(res.data);
      } catch (err) {
        console.error("Failed to load languages:", err);
      }
    };
    fetchLanguages();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleCheckboxChange = (lang) => {
    const updatedLanguages = formData.languages.includes(lang)
      ? formData.languages.filter((l) => l !== lang)
      : [...formData.languages, lang];

    setFormData({ ...formData, languages: updatedLanguages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccessMessage("");

    if (formData.password !== formData.confirmPassword) {
      setError(t("guideRegister_passwords_do_not_match."));
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5001/guides/register",
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          description: formData.description,
          photo: formData.photo,
          languages: formData.languages,
        }
      );

      setSuccessMessage(t("guiudeRegister_success"));
      setTimeout(() => {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
          description: "",
          photo: "",
          languages: [],
        });
      }, 2000);

      setTimeout(() => navigate("/guide-login"), 2000);

    } catch (err) {
      console.error(t("guideRegister_error_registering"), err);
      setError(
        err.response?.data?.error || t("guideRegister_error_server")
      );
    }
  };

  return (
    <>
      <HeroImage />

      <div className="w3-container w3-margin-top">
        <h2 className="w3-center w3-margin-top">{t('guideRegister_title')}</h2>
        <p className="w3-center">{t('guideRegister_subtitle')}</p>
      </div>

      <div className="w3-container" style={{ maxWidth: "700px", margin: "auto" }}>
        <div className="w3-card w3-white w3-padding-32 w3-round-large w3-margin-top w3-margin-bottom">
          <form onSubmit={handleSubmit}>
            <label className="w3-text-black">{t('guideRegister_firstName')}</label>
            <input
              className="w3-input w3-border w3-margin-bottom"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder={t('guideRegister_firstName')}
              required
            />

            <label className="w3-text-black">{t('guideRegister_lastName')}</label>
            <input
              className="w3-input w3-border w3-margin-bottom"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder={t('guideRegister_lastName')}
              required
            />

            <label className="w3-text-black">{t('guideRegister_languages')}</label>
            <div className="w3-row-padding w3-margin-top w3-margin-bottom">
              {availableLanguages.map((lang, index) => (
                <div key={lang} className="w3-third">
                  <div className="w3-margin-bottom" style={{ display: "flex", alignItems: "center" }}>
                    <input
                      type="checkbox"
                      className="w3-check"
                      value={lang}
                      checked={formData.languages.includes(lang)}
                      onChange={() => handleCheckboxChange(lang)}
                      style={{ marginRight: "8px" }}
                    />
                    <label className="w3-text-black" style={{ margin: 0 }}>{lang}</label>
                  </div>
                </div>
              ))}
            </div>

            <label className="w3-text-black">{t('guideRegister_email')}</label>
            <input
              className="w3-input w3-border w3-margin-bottom"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t('guideRegister_email')}
              required
            />

            <label className="w3-text-black">{t('guideRegister_phone')}</label>
            <input
              className="w3-input w3-border w3-margin-bottom"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder={t('guideRegister_phone')}
              required
            />

            <label className="w3-text-black">{t('guideRegister_password')}</label>
            <input
              className="w3-input w3-border w3-margin-bottom"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={t('guideRegister_password')}
              required
            />

            <label className="w3-text-black">{t('guideRegister_confirmPassword')}</label>
            <input
              className="w3-input w3-border w3-margin-bottom"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder={t('guideRegister_confirmPassword')}
              required
            />

            <label className="w3-text-black">{t('guideRegister_description_label')}</label>
            <textarea
              className="w3-input w3-border w3-margin-bottom"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={t('guideRegister_description_placeholder')}
              rows="4"
              required
            ></textarea>

            <label className="w3-text-black">{t('guideRegister_photo_label')}</label>
            <input
              className="w3-input w3-border w3-margin-bottom"
              type="url"
              name="photo"
              value={formData.photo}
              onChange={handleChange}
              placeholder={t('guideRegister_photo_placeholder')}
            />

            {error && (
              <div className="w3-text-red w3-margin-bottom">
                <strong>{error}</strong>
              </div>
            )}

            {successMessage && (
              <div className="w3-panel w3-blue w3-padding w3-margin-bottom">
                <strong>{successMessage}</strong>
              </div>
            )}

            <div className="w3-center" style={{ display: "flex", justifyContent: "center", gap: "16px"}}>
              <button
                type="submit"
                className="w3-button w3-green w3-round-large w3-padding"
              >
                {t('guideRegister_submit')}
              </button>

              <button
                type="button"
                className="w3-button w3-red w3-border w3-round-large"
                onClick={() => navigate("/")}
              >
                {t('guideRegister_cancel')}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Newsletter />
      <Contact />
    </>
  );
};

export default GuideRegister;
