import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import Newsletter from "../components/Newsletter";
import Contact from "../components/Contact";
import HeroImage from "../components/HeroImage";

const GuideRegister = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    description: "",
    photo: "",
    languages: [],
  });

  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const res = await axios.get("http://localhost:5001/languages");
        setAvailableLanguages(res.data);
      } catch (err) {
        console.error("Failed to load languages:", err);
      }
    };
    fetchLanguages();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleCheckboxChange = (lang) => {
    const updatedLanguages = formData.languages.includes(lang)
      ? formData.languages.filter((l) => l !== lang)
      : [...formData.languages, lang];

    setFormData({ ...formData, languages: updatedLanguages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccessMessage("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5001/guides/register",
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          description: formData.description,
          photo: formData.photo,
          languages: formData.languages,
        }
      );

      setSuccessMessage("Registration successful!");
      setTimeout(() => {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
          description: "",
          photo: "",
          languages: [],
        });
      }, 2000);

      setTimeout(() => navigate("/guide-login"), 2000);

    } catch (err) {
      console.error("Error registering guide:", err);
      setError(
        err.response?.data?.error || "Server error. Please try again later."
      );
    }
  };

  return (
    <>
      <HeroImage />

      <div className="w3-container w3-margin-top">
        <h2 className="w3-center w3-margin-top">Register as a guide</h2>
        <p className="w3-center">Join our platform and start offering your own excursions</p>
      </div>

      <div className="w3-container" style={{ maxWidth: "700px", margin: "auto" }}>
        <div className="w3-card w3-white w3-padding-32 w3-round-large w3-margin-top w3-margin-bottom">
          <form onSubmit={handleSubmit}>
            <label className="w3-text-black">First Name</label>
            <input
              className="w3-input w3-border w3-margin-bottom"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First name"
              required
            />

            <label className="w3-text-black">Last Name</label>
            <input
              className="w3-input w3-border w3-margin-bottom"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last name"
              required
            />

            <label className="w3-text-black">Languages You Speak</label>
            <div className="w3-row-padding w3-margin-top w3-margin-bottom">
              {availableLanguages.map((lang, index) => (
                <div key={lang} className="w3-third">
                  <div className="w3-margin-bottom" style={{ display: "flex", alignItems: "center" }}>
                    <input
                      type="checkbox"
                      className="w3-check"
                      value={lang}
                      checked={formData.languages.includes(lang)}
                      onChange={() => handleCheckboxChange(lang)}
                      style={{ marginRight: "8px" }}
                    />
                    <label className="w3-text-black" style={{ margin: 0 }}>{lang}</label>
                  </div>
                </div>
              ))}
            </div>

            <label className="w3-text-black">Email</label>
            <input
              className="w3-input w3-border w3-margin-bottom"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your email"
              required
            />

            <label className="w3-text-black">Phone</label>
            <input
              className="w3-input w3-border w3-margin-bottom"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone number"
              required
            />

            <label className="w3-text-black">Password</label>
            <input
              className="w3-input w3-border w3-margin-bottom"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Choose a password"
              required
            />

            <label className="w3-text-black">Confirm Password</label>
            <input
              className="w3-input w3-border w3-margin-bottom"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat your password"
              required
            />

            <label className="w3-text-black">Short Description</label>
            <textarea
              className="w3-input w3-border w3-margin-bottom"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell something about yourself"
              rows="4"
              required
            ></textarea>

            <label className="w3-text-black">Photo URL</label>
            <input
              className="w3-input w3-border w3-margin-bottom"
              type="url"
              name="photo"
              value={formData.photo}
              onChange={handleChange}
              placeholder="Link to your photo"
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
                Register
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

export default GuideRegister;
