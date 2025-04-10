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
        <div className="w3-row-padding">
          {excursions.length > 0 ? (
            excursions.map((tour) => (
              <div key={tour.tourID} className="w3-half w3-margin-bottom">
                {tour.picture && <img src={tour.picture} alt={tour.type} style={{ width: "100%" }} />}
                <div className="w3-container w3-white">
                  <h4>Type of excursion: {tour.type}</h4>
                  <p>{tour.description.split(" ").slice(0, 20).join(" ")}...</p>
                  <p>Maximum people: {tour.maxPerson}</p>
                  
                  <Link 
                  to={`/excursions/${tour.tourID}`}
                  state={{ date }} className="w3-button w3-margin-bottom">Find out more</Link>
                </div>
              </div>
            ))
          ) : (
            <p>No excursions available for {city} on {date}.</p>
          )}
        </div>

        <Newsletter />
        <Contact />
      </div>
    );
  };
  
  export default ExcursionList;
  