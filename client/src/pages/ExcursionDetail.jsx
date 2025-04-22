import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import RegisterModal from "../components/RegisterModal";

const ExcursionDetail = () => {
  const location = useLocation();
  const passedDate = location.state?.date || new Date().toISOString().slice(0, 10); // ← вот она, выбранная дата или текущая дата если попал напрямую (вручную введя URL или перезагрузив страницу)
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
      <p>Max people: {excursion.maxPerson}</p>
      <p>Price: {excursion.pricePerPerson} €</p>
      <p><strong>Guide:</strong> {excursion.guide ? excursion.guide.firstName : "Unknown"}</p>
      
      <button className="w3-button w3-green w3-margin-top" onClick={() => setIsModalOpen(true)}>Book Now</button>

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