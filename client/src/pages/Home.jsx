import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Contact from "../components/Contact";
import Newsletter from "../components/Newsletter";

const Home = () => {
  const [picTour, setPicTour] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleImageClick = (tour) => {
    navigate(`/excursions/${tour.tourID}`, {
      state: { date: new Date().toISOString().slice(0, 10) },
    });
  };

  useEffect(() => {
    axios
      .get("http://localhost:5001/randomtours")
      .then((response) => {
        const tours = [...new Set(response.data)];
        setPicTour(tours);
      })
      .catch((error) => console.error("Error fetching pictures:", error));
  }, []);

  const [outdoorTours, setOutdoorTours] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:5001/outdoortours")
      .then((response) => {
        const uniqueOutdoorTours = [...new Set(response.data)];
        setOutdoorTours(uniqueOutdoorTours);
      })
      .catch((error) => console.error("Error fetching pictures:", error));
  }, []);

  return (
    <div className="w3-content" style={{ maxWidth: "1100px" }}>
      {/* <!-- Good offers --> */}
      <div className="w3-container w3-margin-top">
        <h3>{t("home_randomtours_title")}</h3>
        <h5>{t("home_randomtours_text")}</h5>
      </div>
      <div className="w3-row-padding w3-text-white w3-large">
        {picTour[0] && (
          <div
            className="w3-half w3-margin-bottom"
            onClick={() => handleImageClick(picTour[0])}
            style={{ cursor: "pointer" }}
          >
            <div
              className="img-wrapper tall-img"
              style={{
                height: "456px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <img
                src={picTour[0].picture}
                alt={picTour[0].city}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  transition: "transform 0.3s ease",
                  transform: "scale(1)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              />
              <span className="w3-display-bottomleft w3-padding">
                {picTour[0].city}
              </span>
            </div>
          </div>
        )}
        <div className="w3-half">
          <div className="w3-row-padding" style={{ margin: "0 -16px" }}>
            {[1, 2].map(
              (i) =>
                picTour[i] && (
                  <div
                    key={picTour[i].tourID}
                    className="w3-half w3-margin-bottom"
                    onClick={() => handleImageClick(picTour[i])}
                    style={{ cursor: "pointer" }}
                  >
                    <div
                      style={{
                        height: "220px",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <img
                        src={picTour[i].picture}
                        alt={picTour[i].city}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                          transition: "transform 0.3s ease",
                          transform: "scale(1)",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.transform = "scale(1.05)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.transform = "scale(1)")
                        }
                      />
                      <span className="w3-display-bottomleft w3-padding">
                        {picTour[i].city}
                      </span>
                    </div>
                  </div>
                )
            )}
          </div>
          <div className="w3-row-padding" style={{ margin: "0 -16px" }}>
            {[3, 4].map(
              (i) =>
                picTour[i] && (
                  <div
                    key={picTour[i].tourID}
                    className="w3-half w3-margin-bottom"
                    onClick={() => handleImageClick(picTour[i])}
                    style={{ cursor: "pointer" }}
                  >
                    <div
                      style={{
                        height: "220px",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <img
                        src={picTour[i].picture}
                        alt={picTour[i].city}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                          transition: "transform 0.3s ease",
                          transform: "scale(1)",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.transform = "scale(1.05)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.transform = "scale(1)")
                        }
                      />
                      <span className="w3-display-bottomleft w3-padding">
                        {picTour[i].city}
                      </span>
                    </div>
                  </div>
                )
            )}
          </div>
        </div>
      </div>

      {/* <!-- Explore Nature --> */}
      <div className="w3-container">
        <h3>{t("home_nature_title")}</h3>
        <p>{t("home_nature_text")}</p>
      </div>

      <div className="w3-row-padding">
        {outdoorTours.slice(0, 2).map((tour) => (
          <div
            key={tour.tourID}
            className="w3-half w3-margin-bottom"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <div style={{ width: "100%", height: "270px", overflow: "hidden" }}>
              <img
                src={tour.picture}
                alt={tour.city}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
            <div className="w3-container w3-white">
              <h3>{tour.city}</h3>
              <p className="w3-opacity">Outdoor tour</p>
              <p>
                {t("home_nature_text_card")} {tour.city}
              </p>
              <button
                className="w3-button w3-dark-grey w3-margin-bottom"
                onClick={() => handleImageClick(tour)}
              >
                {t("home_nature_button")}
              </button>
            </div>
          </div>
        ))}
      </div>

      <Newsletter />

      <Contact />

      {/* <!-- End page content --> */}
    </div>
  );
};
export default Home;
