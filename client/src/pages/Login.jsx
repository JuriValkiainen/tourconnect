import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await axios.post("http://localhost:5001/tourists/login", { 
        email, 
        password 
        });
        const { token } = response.data;

        // Сохраняем токен в localStorage
        localStorage.setItem("token", token);
      
      setMessage("Login successful!");

      // 4. Редирект на страницу профиля через пару секунд
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
        <h3>Login</h3>
        <p>Log in to your account.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {message && <p>{message}</p>}
      </>
    );
  };

  export default Login;




