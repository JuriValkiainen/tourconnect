import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Newsletter from "../components/Newsletter.jsx";
import Contact from "../components/Contact.jsx";
import { Link } from "react-router-dom";

const ExcursionList = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const city = searchParams.get("city"); // Get the "city" parameter from the URL
  const date = searchParams.get("date"); // Get the "date" parameter from the URL

  const [excursions, setExcursions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (city) {
      axios(`http://localhost:5001/excursions`, {
        params: { city, date }, // Pass the parameters to the API
      })
      .then((response) => {
        setExcursions(response.data);
        setLoading(false);
      })
        .catch((error) => {
          setError(error.response?.data?.message || "Error loading data");
          setLoading(false);
        });
      }
       }, [city, date]);

    if (loading) {
        return <p><i className="fa fa-refresh"></i> Loading...</p>;
      }
      if (error) {
        return <p>❌ Error: {error}</p>;
      }

    return (
      <div className="w3-content" style={{ maxWidth: "1100px" }}>
        {/* <!-- Page Title --> */}
        <div className="w3-container">
        <h3>Places to Visit in {city}</h3>
        <p>Travel with us and see city at its finest.</p>
        </div>
        {/* <!-- Excursion Cards --> */}
        <div className="excursions-grid">
          {excursions.length > 0 ? (
            excursions.map((tour) => (
              <div key={tour.tourID} className="excursion-card">
                {tour.picture && (
                  <img 
                    src={tour.picture} 
                    alt={tour.type} 
                    className="excursion-image"
                  />
                )}
                <div className="excursion-content">
                  <h4>Type of excursion: {tour.type}</h4>
                  <p>{tour.description.split(" ").slice(0, 30).join(" ")}...</p>
                  {/* <p>Maximum people: {tour.maxPerson}</p> */}
                  
                  <Link 
                    to={`/excursions/${tour.tourID}`}
                    state={{ date }} 
                    className="excursion-button"
                  >
                    Find out more
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="no-excursions-message">
              No excursions available for {city} on {date}.
            </div>
          )}
        </div>

        <Newsletter />
        <Contact />
      </div>
    );
  };
  
  export default ExcursionList;
  