import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ExcursionDetail = () => {
  const { id } = useParams();
  const [excursion, setExcursion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios(`http://localhost:5001/excursions/${id}`)
      .then((response) => {
        setExcursion(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.response?.data?.message || "Error loading excursion");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>❌ Error: {error}</p>;
  if (!excursion) return <p>Excursion not found.</p>;

  return (
    <div className="w3-content" style={{ maxWidth: "1100px" }}>
      <h2>{excursion.city} - {excursion.type}</h2>
      {excursion.picture && <img src={excursion.picture} alt={excursion.type} style={{ width: "100%" }} />}
      <p>{excursion.description}</p>
      <p>Max people: {excursion.maxPerson}</p>
      <p>Price: {excursion.prisePerPerson} €</p>
      <p><strong>Guide:</strong> {excursion.guide ? excursion.guide.name : "Unknown"}</p>
      
      <button className="w3-button w3-green w3-margin-top">Book Now</button>
    </div>
  );
};

export default ExcursionDetail;