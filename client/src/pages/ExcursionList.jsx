import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Newsletter from "../components/Newsletter.jsx";
import Contact from "../components/Contact.jsx";

const ExcursionList = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const city = searchParams.get("city"); // Get the "city" parameter from the URL

  const [excursions, setExcursions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (city) {
      fetch(`http://localhost:5000/api/excursions?city=${city}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setExcursions(data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
      }
       }, [city]);

    if (loading) {
        return <p><i class="fa fa-refresh"></i>Loading...</p>;
      }
      if (error) {
        return <p>Error: {error}</p>;
      }

    return (
      <div className="w3-content" style={{ maxWidth: "1100px" }}>
        {/* <!-- Explore City --> */}
        <div className="w3-container">
        <h3>Places to Visit in {city}</h3>
        <p>Travel with us and see city at its finest.</p>
        </div>
        {/* <!-- Excursion Cards --> */}
        <div className="w3-row-padding">
          {excursions.length > 0 ? (
            excursions.map((tour) => (
              <div key={tour.tourID} className="w3-half w3-margin-bottom">
                {tour.picture && <img src={tour.picture} alt={tour.type} style={{ width: "100%" }} />}
                <div className="w3-container w3-white">
                  <h4>Type of excursion: {tour.type}</h4>
                  <p>{tour.description}</p>
                  <p>Maximum people: {tour.maxPerson}</p>
                  <p>Price per person: {tour.prisePerPerson} €</p>
                  <p><strong>Guide:</strong> {tour.guide ? tour.guide.name : "Unknown"}</p>
                  <button className="w3-button w3-margin-bottom">Find out more</button>
                </div>
              </div>
            ))
          ) : (
            <p>There are no excursions in this city.</p>
          )}
        </div>
        <Newsletter />
        <Contact />
      </div>

    );
  };
  
  export default ExcursionList;
  