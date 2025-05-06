import React, { useState } from "react";
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom";
import CitySelection from "./CitySelection";

const Header = () => {
    const { t } = useTranslation();

    const [activeTab, setActiveTab] = useState("City");
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const navigate = useNavigate();

    const showAlert = (message) => {
        alert(message);
    };

    const handleSearch = () => {
        if (selectedCity && selectedDate) {
            navigate(`/excursions?city=${encodeURIComponent(selectedCity)}&date=${selectedDate}`);
        } else {
            showAlert(t('header_alert'));
        }
    };

    return (
        <header className="w3-display-container w3-content w3-hide-small" style={{ maxWidth: "1500px" }}>
            <img className="w3-image" src="https://www.w3schools.com/w3images/london2.jpg" alt="London" width="1500" height="700" />
            <div className="w3-display-middle" style={{ width: "65%" }}>
                <div className="w3-bar w3-black">
                    <button
                        className={`w3-bar-item w3-button tablink ${activeTab === "City" ? "w3-red" : ""}`}
                        onClick={() => setActiveTab("City")}
                    >
                        <i className="fa fa-city w3-margin-right"></i>{t('header_selectCity_panel')}
                    </button>
                    {/*<button
                        className={`w3-bar-item w3-button tablink ${activeTab === "Hotel" ? "w3-red" : ""}`}
                        onClick={() => setActiveTab("Hotel")}
                    >
                        <i className="fa fa-bed w3-margin-right"></i>Hotel
                    </button>
                    <button
                        className={`w3-bar-item w3-button tablink ${activeTab === "Car" ? "w3-red" : ""}`}
                        onClick={() => setActiveTab("Car")}
                    >
                        <i className="fa fa-car w3-margin-right"></i>Rental
                    </button>*/}
                </div>

                    <div id="City" className="w3-container w3-white w3-padding-16 myLink" style={{ display: activeTab === "City" ? "block" : "none" }}>
                        <h3>{t('select_date_city')}</h3>
                        <div className="w3-row-padding" style={{ margin: "0 -16px" }}>
                            <div className="w3-half">
                                <label>{t('header_selectCity_date')}</label>
                                <input
                                    className="w3-input w3-border"
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                />
                            </div>

                            <div className="w3-half">
                                <label>{t('header_selectCity_city')}</label>
                                <CitySelection
                                    selectedCity={selectedCity}
                                    onCitySelect={(city) => setSelectedCity(city)}
                                />
                            </div>
                        </div>

                        <p>
                            <button className="w3-button w3-dark-grey" onClick={handleSearch}>
                                {t('header_selectCity_btn')}
                            </button>
                        </p>
                    </div>

                    {/*<div id="Hotel" className="w3-container w3-white w3-padding-16 myLink" style={{ display: activeTab === "Hotel" ? "block" : "none" }}>
                    <h3>Find the best hotels</h3>
                    <p>Book a hotel with us and get the best fares and promotions.</p>
                    <p>We know hotels - we know comfort.</p>
                    <p>
                        <button className="w3-button w3-dark-grey">Search Hotels</button>
                    </p>
                </div>

                <div id="Car" className="w3-container w3-white w3-padding-16 myLink" style={{ display: activeTab === "Car" ? "block" : "none" }}>
                    <h3>Best car rental in the world!</h3>
                    <p>
                        <span className="w3-tag w3-deep-orange">DISCOUNT!</span> Special offer if you book today: 25% off anywhere in the world with CarServiceRentalRUs
                    </p>
                    <input className="w3-input w3-border" type="text" placeholder="Pick-up point" />
                    <p>
                        <button className="w3-button w3-dark-grey">Search Availability</button>
                    </p>
                </div>*/}
                </div>
        </header>
    );
};

export default Header;
