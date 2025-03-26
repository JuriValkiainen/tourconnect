import { useState } from "react";
import { Dialog } from "@headlessui/react";
import axios from "axios";

const RegisterModal = ({ isOpen, closeModal }) => {
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
      const response = await axios.post("http://localhost:5001/register", formData);
      console.log(response.data);
      setMessage("Check your email to confirm registration.");
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
    // <Dialog open={isOpen} onClose={closeModal} className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
    //   <div className="bg-white p-6 rounded-lg w-96">
    //     <h2 className="text-lg font-bold mb-4">Register</h2>
    //     {message && <p className="text-sm text-green-600">{message}</p>}
    //     <form onSubmit={handleSubmit} className="space-y-3">
    //       <input name="firstName" placeholder="First Name" onChange={handleChange} required className="w-full p-2 border rounded" />
    //       <input name="lastName" placeholder="Last Name" onChange={handleChange} required className="w-full p-2 border rounded" />
    //       <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full p-2 border rounded" />
    //       <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full p-2 border rounded" />
    //       <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded">
    //         {loading ? "Registering..." : "Register"}
    //       </button>
    //     </form>
    //     <button onClick={closeModal} className="mt-2 text-sm text-gray-500">Close</button>
    //   </div>
    // </Dialog>
  );
};

export default RegisterModal;
