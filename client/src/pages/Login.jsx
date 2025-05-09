import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import Newsletter from "../components/Newsletter";
import HeroImage from "../components/HeroImage";
import jwtDecode from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const { excursion, selectedDate } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await axios.post(
        "http://localhost:5001/tourists/login",
        {
          email,
          password,
        }
      );
      const { token } = response.data;

      // Save the token in local storage
      localStorage.setItem("token", token);

      setMessage("Login successful!");

      const decodedToken = jwtDecode(token);
      const touristID = decodedToken.id;
      // Check if excursion and selectedDate are defined
      if (excursion && selectedDate) {
        const bookingData = {
          tourID: excursion.tourID,
          touristID: touristID,
          date: selectedDate,
          numberOfPeople: 1,
          summa: excursion.pricePerPerson * 1,
        };

        await axios.post("http://localhost:5001/bookings", bookingData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Бронирование выполнено после логина зарегистрированного пользователя.");
      }

      // Redirect to the profile page after a short delay
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (error) {
      console.error(error);
      setMessage("Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <HeroImage />

      {/* <!-- Page Title --> */}
      <div className="w3-container w3-margin-top">
        <h2 className="w3-center w3-margin-top">{t("login_title")}</h2>
        <p>{t("login_text")}</p>
      </div>
      {/* <!-- Login Form --> */}
      <div
        className="w3-container"
        style={{ maxWidth: "700px", margin: "auto" }}
      >
        <div className="w3-card w3-white w3-padding-large w3-round-large w3-margin-top w3-margin-bottom w3-pad">
          <form onSubmit={handleSubmit}>
            <label className="w3-text-black">{t("login_email")}</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w3-input w3-border w3-round"
            />
            <label className="w3-text-black">{t("login_password")}</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w3-input w3-border w3-round"
            />
            <div className="w3-center w3-margin-top">
              <button
                type="submit"
                className="w3-button w3-blue w3-round w3-margin-top"
                disabled={loading}
              >
                {loading ? t("login_btn_loading") : t("login_btn_login")}
              </button>
            </div>
          </form>
          {message && <p>{message}</p>}
        </div>
      </div>
      <Newsletter />
    </>
  );
};

export default Login;
