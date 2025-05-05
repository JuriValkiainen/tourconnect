import { useState } from "react";
import axios from "axios";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMesssage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccessMessage("");
    setErrorMesssage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/messages", formData);
      setSuccessMessage("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("Error sending message:", err);
      setErrorMesssage("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="w3-container">
      <h2>Contact</h2>
      <p>Let us book your next trip!</p>
      <i className="fa fa-map-marker" style={{ width: "30px" }}></i> Finland
      <br />
      <i className="fa fa-phone" style={{ width: "30px" }}></i> Phone: +358 40 123 4567
      <br />
      <i className="fa fa-envelope" style={{ width: "30px" }}></i> Email: tourconnectweb@gmail.com
      <br />

      <form onSubmit={handleSubmit}>
        <p>
          <input
            className="w3-input w3-padding-16 w3-border"
            type="text"
            placeholder="Name"
            required
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </p>
        <p>
          <input
            className="w3-input w3-padding-16 w3-border"
            type="email"
            placeholder="Email"
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
            placeholder="Message"
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
            SEND MESSAGE
          </button>
        </p>
      </form>
    </div>
  );
};

export default Contact;