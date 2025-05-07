import React from "react";
import { useState, useEffect  } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

  const ExploreNature = () => {
  const [picTour, setPicTour] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation();

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

  const handleImageClick = (tour) => {
    navigate(`/excursions/${tour.tourID}`, {
    state: { date: new Date().toISOString().slice(0, 10) },
    });
    };
  return (
    <>
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
    </>
  );
};

export default ExploreNature;
