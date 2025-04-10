import { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { FaSignInAlt } from "react-icons/fa";

const RegisterModal = ({ isOpen, closeModal, excursion, selectedDate }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // 1. Регистрация пользователя
      const registerResponse = await axios.post(
        "http://localhost:5001/register",
        formData
      );
      console.log(
        "Новый зарегистрированный пользователь: ",
        registerResponse.data
      );
      const { token } = registerResponse.data;

      // 2. Расшифровываем токен, чтобы получить touristID
      let touristID;
      if (token) {
        const decodedToken = jwtDecode(token);
        touristID = decodedToken.id;
      }
      console.log("Получили touristID из токена пользователя: ", touristID);
      // 3. Создание брони
      const bookingData = {
        tourID: excursion.tourID,
        touristID: touristID,
        date: selectedDate,
        numberOfPeople: 1, // или укажи как хочешь
        summa: excursion.pricePerPerson * 1, // сумма за одного
      };

      await axios.post("http://localhost:5001/bookings", bookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage("Registration and booking were successful!");

      // 4. Редирект на страницу логина через пару секунд
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error(error);
      setMessage("Registration failed. Try again.");
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
        <div className="w3-container">
          <span onClick={closeModal} className="w3-button w3-display-topright">
            &times;
          </span>
          <h2>Register</h2>

          {message && <p className="w3-text-green">{message}</p>}

          <form onSubmit={handleSubmit} className="w3-container">
            <input
              name="firstName"
              placeholder="First Name"
              onChange={handleChange}
              required
              className="w3-input w3-border w3-margin-bottom"
            />
            <input
              name="lastName"
              placeholder="Last Name"
              onChange={handleChange}
              required
              className="w3-input w3-border w3-margin-bottom"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="w3-input w3-border w3-margin-bottom"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              onChange={handleChange}
              required
              className="w3-input w3-border w3-margin-bottom"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
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
                  {loading ? "Registering..." : "Register"}
                </button>
              </div>

              <div className="w3-col s12 m6 w3-padding-small">
                <button
                  onClick={() => navigate("/login")}
                  className="w3-button w3-border w3-light-grey w3-round-large w3-block"
                >
                  <FaSignInAlt /> Already registered?
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
