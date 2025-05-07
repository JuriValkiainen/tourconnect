import { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { t } = useTranslation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/admin/contact-us", formData);
      setSuccessMessage(t("contact_success"));
      setFormData({ firstName: "", lastName: "", email: "", message: "" });
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      console.error("Error sending message:", err);
      setErrorMessage(t("contact_error"));
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  return (
    <div className="w3-container">
      <h2>{t("contact_title")}</h2>
      <p>{t("contact_subtitle")}</p>
      <i className="fa fa-map-marker" style={{ width: "30px" }}></i> {t("contact_country")}
      <br />
      <i className="fa fa-phone" style={{ width: "30px" }}></i> {t("contact_phone")}
      <br />
      <i className="fa fa-envelope" style={{ width: "30px" }}></i> {t("contact_email")}
      <br />

      <form onSubmit={handleSubmit}>
        <p>
          <input
            className="w3-input w3-padding-16 w3-border"
            type="text"
            placeholder={t("contact_placeholder_firstName")}
            required
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </p>
        <p>
          <input
            className="w3-input w3-padding-16 w3-border"
            type="text"
            placeholder={t("contact_placeholder_lastName")}
            required
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </p>
        <p>
          <input
            className="w3-input w3-padding-16 w3-border"
            type="email"
            placeholder={t("contact_placeholder_email")}
            required
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </p>
        <p>
          <input
            className="w3-input w3-padding-16 w3-border"
            type="text"
            placeholder={t("contact_placeholder_message")}
            required
            name="message"
            value={formData.message}
            onChange={handleChange}
          />
        </p>

        {successMessage && (
          <p className="w3-text-green"><strong>{successMessage}</strong></p>
        )}
        {errorMessage && (
          <p className="w3-text-red"><strong>{errorMessage}</strong></p>
        )}

        <p>
          <button className="w3-button w3-black w3-padding-large" type="submit">
          {t("contact_button_send")}
          </button>
        </p>
      </form>
    </div>
  );
};

export default Contact;
