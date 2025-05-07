import { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

const Newsletter = () => {
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/admin/subscribers", { email });
      setSuccessMessage(t("newsletter_success"));
      setEmail("");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      console.error("Subscription error:", err);
      setErrorMessage(t("newsletter_error"));
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  return (
    <div className="w3-container">
      <div className="w3-panel w3-padding-16 w3-black w3-opacity w3-card w3-hover-opacity-off">
        <h2>{t("newsletter_title")}</h2>
        <p>{t("newsletter_subtitle")}</p>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ marginBottom: "14px", display: "block" }}>
              {t("newsletter_label_email")}
            </label>
            <input
              className="w3-input w3-border"
              type="email"
              placeholder={t("newsletter_placeholder_email")}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setSuccessMessage("");
                setErrorMessage("");
              }}
              required
            />
          </div>

          {successMessage && (
            <p className="w3-text-green"><strong>{successMessage}</strong></p>
          )}
          {errorMessage && (
            <p className="w3-text-red"><strong>{errorMessage}</strong></p>
          )}
          <button type="submit" className="w3-button w3-red w3-margin-top">
            {t("newsletter_button")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Newsletter;