import { useState } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";

const RegisterModal = ({ isOpen, closeModal, excursion, selectedDate }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // 1. Регистрация пользователя
      const registerResponse = await axios.post("http://localhost:5001/register", formData);
      console.log("Новый зарегистрированный пользователь: ",registerResponse.data);
      const { token } = registerResponse.data;
      
      // 2. Расшифровываем токен, чтобы получить touristID
      let touristID;
      if (token) {
        const decodedToken = jwt_decode(token);
        touristID = decodedToken.id;
      }
      console.log("Получили touristID из токена пользователя: ", touristID);
      // 3. Создание брони
      const bookingData = {
        tourID: excursion.tourID,
        touristID: touristID,
        date: selectedDate,
        numberOfPeople: 1, // или укажи как хочешь
        summa: excursion.pricePerPerson * 1 // сумма за одного
      };
      
      await axios.post("http://localhost:5001/bookings", bookingData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMessage("Registration and booking were successful!");

      // 4. Редирект на страницу логина через пару секунд
      setTimeout(() => {
        window.location.href = "/login";
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
    className={`w3-modal ${isOpen ? 'w3-show' : ''}`}
    style={{ display: isOpen ? 'block' : 'none' }}
  >
    <div 
      className="w3-modal-content w3-card-4 w3-animate-zoom" 
      style={{ maxWidth: '600px' }}
    >
      <div className="w3-container">
        <span 
          onClick={closeModal} 
          className="w3-button w3-display-topright"
        >
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
            <button 
              type="submit" 
              disabled={loading}
              className="w3-button w3-blue w3-margin-bottom"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
