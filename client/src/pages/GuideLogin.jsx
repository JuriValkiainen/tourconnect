import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

import Newsletter from "../components/Newsletter";
import Contact from "../components/Contact";
import HeroImage from "../components/HeroImage";

const GuideLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccessMessage("");

    try {
      const response = await axios.post("/guides/login", formData);

      localStorage.setItem("guideToken", response.data.token);

      setSuccessMessage(t("guideLogin_success"));

      setTimeout(() => {
        setFormData({ email: "", password: "" });
        navigate("/guide-dashboard");
      }, 2000);

    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.error || t("guideLogin_fail"));
    }
  };

  return (
    <>
      <HeroImage />

      <div className="w3-container w3-margin-top">
        <h2 className="w3-center w3-margin-top">{t('guideLogin_title')}</h2>
        <p>{t("guideLogin_subtitle")}</p>
      </div>

      <div className="w3-container" style={{ maxWidth: "700px", margin: "auto" }}>
        <div className="w3-card w3-white w3-padding-32 w3-round-large w3-margin-top w3-margin-bottom">
          <form onSubmit={handleSubmit}>
            <label className="w3-text-black">{t("guideLogin_email")}</label>
            <input
              className="w3-input w3-border w3-margin-bottom"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t("guideLogin_placeholder_email")}
              required
            />

            <label className="w3-text-black">{t("guideLogin_password")}</label>
            <input
              className="w3-input w3-border w3-margin-bottom"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={t("guideLogin_placeholder_password")}
              required
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

            <div className="w3-center">
              <button
                type="submit"
                className="w3-button w3-red w3-round-large"
                style={{ width: "150px" }}
              >
                {t("guideLogin_button")}
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

export default GuideLogin;
