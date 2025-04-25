import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import RegisterModal from "../components/RegisterModal";

const ExcursionDetail = () => {
  const location = useLocation();
  const passedDate = location.state?.date || new Date().toISOString().slice(0, 10); // Default to today's date
  const { id } = useParams();
  const [excursion, setExcursion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    axios(`http://localhost:5001/excursions/${id}`)
      .then((response) => {
        setExcursion(response.data);
        console.log("excursion on it's page: ",response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.response?.data?.message || "Error loading excursion");
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isModalOpen]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>❌ Error: {error}</p>;
  if (!excursion) return <p>Excursion not found.</p>;

  return (
    <div className="w3-content" style={{ maxWidth: "1100px", marginBottom: "15px" }}>
      <h2>{excursion.city} - {excursion.type}</h2>
      {excursion.picture && <img src={excursion.picture} alt={excursion.type} style={{ width: "100%" }} />}
      <p>{excursion.description}</p>
      {/* Other excursion details */}
      <div className="w3-row" style={{ alignItems: 'center' }}>
        <div className="w3-col l4 m6 s12 w3-padding-small">
          <p className="w3-margin-0">
            <strong>Max people:</strong> {excursion.maxPerson}</p>
        </div>
        <div className="w3-col l4 m6 s12 w3-padding-small">
          <p className="w3-margin-0">
            <strong>Price:</strong> {excursion.pricePerPerson} €</p>
        </div>
        <div className="w3-col l4 m12 s12 w3-padding-small">
          <p className="w3-margin-0">
            <strong>Guide: </strong> 
            {excursion.guide ? `${excursion.guide.firstName} ${excursion.guide.lastName}` : "Unknown"}
          </p>
        </div>
      </div>
      
      <button className="w3-button w3-round-large w3-padding w3-margin-top" 
        style={{background: "#FF6B35", color: "white", boxShadow: "0 2px 5px rgba(0,0,0,0.2)"}} onClick={() => setIsModalOpen(true)}>Book Now</button>

      <RegisterModal 
        isOpen={isModalOpen} 
        closeModal={() => setIsModalOpen(false)}
        excursion={excursion}
        selectedDate={passedDate}
      />
    </div>
  );
};

export default ExcursionDetail;