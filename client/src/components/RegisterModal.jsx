import { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { FaSignInAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const RegisterModal = ({ isOpen, closeModal, excursion, selectedDate }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
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
      // 1. User registration
      const registerResponse = await axios.post(
        "http://localhost:5001/register",
        formData
      );
      console.log(
        "Новый зарегистрированный пользователь: ",
        registerResponse.data
      );
      const { token } = registerResponse.data;

      if (!token) {
        throw new Error("No token received from registration.");
      }
      // 2. Decrypt the token to get the touristID
      let touristID;
      if (token) {
        const decodedToken = jwtDecode(token);
        touristID = decodedToken.id;
      }

      // 3. Booking creation
      const bookingData = {
        tourID: excursion.tourID,
        touristID: touristID,
        date: selectedDate,
        numberOfPeople: 1, // number of people here is 1
        summa: excursion.pricePerPerson * 1, // price per person * 1
      };

      await axios.post("http://localhost:5001/bookings", bookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage("Registration and booking were successful!");

      // 4. Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error(error);
      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Registration failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`w3-modal ${isOpen ? "w3-show" : ""}`}
      style={{ display: isOpen ? "block" : "none" }}
    >
      <div
        className="w3-modal-content w3-card-4 w3-animate-zoom"
        style={{ maxWidth: "600px" }}
      >
        <div className="w3-container w3-padding-16">
          <span onClick={closeModal} className="w3-button w3-display-topright">
            &times;
          </span>
          <h2>{t("register_title")}</h2>

          {message && <p className="w3-text-green">{message}</p>}

          <form onSubmit={handleSubmit} className="w3-container">
            <input
              name="firstName"
              placeholder={t("register_form_firstName")}
              onChange={handleChange}
              required
              className="w3-input w3-border w3-margin-bottom"
            />
            <input
              name="lastName"
              placeholder={t("register_form_lastName")}
              onChange={handleChange}
              required
              className="w3-input w3-border w3-margin-bottom"
            />
            <input
              type="email"
              name="email"
              pattern="^[^@\s]+@[^@\s]+\.[^@\s]+$"
              title="Enter a valid email"
              placeholder={t("register_form_email")}
              onChange={handleChange}
              required
              className="w3-input w3-border w3-margin-bottom"
            />
            <input
              type="tel"
              name="phone"
              pattern="^[0-9]{10}$"
              title="Enter a valid phone number (10 digits)"
              placeholder={t("register_form_phone")}
              onChange={handleChange}
              required
              className="w3-input w3-border w3-margin-bottom"
            />
            <input
              type="password"
              name="password"
              // pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              // title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
              placeholder={t("register_form_password")}
              onChange={handleChange}
              required
              className="w3-input w3-border w3-margin-bottom"
            />
            <div className="w3-margin-top  w3-center w3-row">
              <div className="w3-col s12 m6 w3-padding-small">
                <button
                  type="submit"
                  disabled={loading}
                  className="w3-button w3-blue w3-round-large w3-block"
                >
                  {loading
                    ? t("register_form_btn_1")
                    : t("register_form_btn_2")}
                </button>
              </div>

              <div className="w3-col s12 m6 w3-padding-small">
                <button
                  onClick={() =>
                    navigate("/login", { state: { excursion, selectedDate } })
                  }
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
                  />
                  {t("register_form_btn_link_mod")}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
