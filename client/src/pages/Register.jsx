import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaSignInAlt } from "react-icons/fa";
import HeroImage from "../components/HeroImage";
import Newsletter from "../components/Newsletter";
import { useTranslation } from "react-i18next";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5001/register",
        formData
      );

      // Set the token in local storage
      localStorage.setItem("token", response.data.token);

      setMessage("Registration successful! Redirecting...");

      // Redirect to the profile page after a short delay
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.error || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeroImage />
      <div className="w3-container w3-padding-32">
        <div
          className="w3-card-4 w3-round-large"
          style={{ maxWidth: "600px", margin: "0 auto" }}
        >
          <div className="w3-container w3-padding-16 w3-light-grey">
            <h2 className="w3-center">{t('register_title')}</h2>

            {message && (
              <div
                className={`w3-panel ${
                  message.includes("successful") ? "w3-green" : "w3-red"
                }`}
              >
                <p>{message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="w3-container">
              <div className="w3-row-padding">
                <div className="w3-half w3-margin-bottom">
                  <label>{t('register_form_firstName')}</label>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w3-input w3-border"
                  />
                </div>
                <div className="w3-half w3-margin-bottom">
                  <label>{t('register_form_lastName')}</label>
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w3-input w3-border"
                  />
                </div>
              </div>

              <label>{t('register_form_email')}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w3-input w3-border w3-margin-bottom"
              />

              <label>{t('register_form_phone')}</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w3-input w3-border w3-margin-bottom"
              />

              <label>{t('register_form_password')}</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                className="w3-input w3-border w3-margin-bottom"
              />

              <div className="w3-margin-top w3-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="w3-button w3-blue w3-round-large w3-block"
                  style={{ marginBottom: "16px" }}
                >
                  {loading ? t('register_form_btn_1') : t('register_form_btn_2')}
                </button>

                <Link
                  to="/login"
                  className="w3-button w3-border w3-light-grey w3-round-large w3-block"
                >
                  <FaSignInAlt
                    style={{
                      display: "inline-block",
                      verticalAlign: "middle",
                      marginRight: "8px",
                    }}
                  />
                  <span
                    style={{ display: "inline-block", verticalAlign: "middle" }}
                  >
                    {t('register_form_btn_link')}
                  </span>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Newsletter />
    </>
  );
};

export default Register;
