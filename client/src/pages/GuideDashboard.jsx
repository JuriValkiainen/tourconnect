import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import axios from "axios";
import HeroImage from "../components/HeroImage";
import Newsletter from "../components/Newsletter";
import Contact from "../components/Contact";
import { useTranslation } from "react-i18next";

const GuideDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [guide, setGuide] = useState(null);
  const [tours, setTours] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [tourTypes, setTourTypes] = useState([]);
  const [guideLanguages, setGuideLanguages] = useState([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingTour, setIsAddingTour] = useState(false);
  const [editingTourId, setEditingTourId] = useState(null);
  const { t } = useTranslation();
  const tabOptions = [
    { key: "profile", label: t("guideDashboard_tab_profile") },
    { key: "tours", label: t("guideDashboard_tab_tours") },
    { key: "bookings", label: t("guideDashboard_tab_bookings") },
  ];

  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    description: "",
    photo: "",
  });

  const [newTourForm, setNewTourForm] = useState({
    city: "",
    type: "",
    maxPerson: "",
    pricePerPerson: "",
    description: "",
    picture: "",
    tourlanguages: [],
  });

  const [editTourForm, setEditTourForm] = useState({
    city: "",
    type: "",
    maxPerson: "",
    pricePerPerson: "",
    description: "",
    picture: "",
    language: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("guideToken");
    if (!token) {
      navigate("/guide-login");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const fetchData = async () => {
      try {
        const guideRes = await axios.get("/api/guides/me", config);
        setGuideLanguages(Array.isArray(guideRes.data.languages) ? guideRes.data.languages : []);

        const typesRes = await axios.get("/tourtypes");
        setTourTypes(Array.isArray(typesRes.data) ? typesRes.data : []);
        const guideData = guideRes.data;
        const guideID = guideData.guideID || guideData.id;

        setGuide({
          firstName: guideData.name,
          lastName: guideData.lastName,
          email: guideData.email,
          phone: guideData.phone,
          description: guideData.description,
          photo: guideData.photo,
        });

        setEditForm({
          firstName: guideData.name,
          lastName: guideData.lastName,
          email: guideData.email,
          phone: guideData.phone,
          description: guideData.description,
          photo: guideData.photo,
        });

        const toursRes = await axios.get(`/api/guides/${guideID}/tours`, config);
        setTours(toursRes.data);

        const bookingsRes = await axios.get(`/api/guides/${guideID}/bookings`, config);
        const adaptedBookings = bookingsRes.data.map((b, i) => ({
          reservID: i + 1,
          date: b.reservationDate,
          numberOfPeople: b.numberOfPeople,
          summa: b.summa,
          tourist: {
            firstName: b.touristsfirstName,
            lastName: b.touristslastName,
            email: b.touristsEmail,
            phone: b.touristsPhone,
          },
          tours: {
            city: b.tourName,
          },
        }));

        setBookings(adaptedBookings);
      } catch (err) {
        console.error("Failed to load dashboard:", err);

        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("guideToken");
          navigate("/guide-login");
        }
      }
    };

    fetchData();
  }, []);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("guideToken");
    navigate("/");
  };

  const handleProfileChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("guideToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.put("/api/guides/me", editForm, config);
      setGuide({ ...editForm });
      setIsEditingProfile(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert(t("guideDashboard_update_profile_fail"));
    }
  };

  const handleDeleteProfile = async () => {
    const confirmed = window.confirm(t("guideDashboard_delete_profile_confirm"));
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("guideToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.delete("/api/guides/me", config);
      localStorage.removeItem("guideToken");
      alert(t("guideDashboard_delete_profile_success"));
      navigate("/");
    } catch (err) {
      console.error(t("guideDashboard_delete_profile_fail"));
      alert("Failed to delete profile. This feature may not be implemented yet.");
    }
  };

  const handleNewTourChange = (e) => {
    setNewTourForm({ ...newTourForm, [e.target.name]: e.target.value });
  };

  const handleNewTourSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("guideToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      console.log("Отправляем данные на сервер:", {
        ...newTourForm,
        tourlanguages: newTourForm.tourlanguages,
      });

      await axios.post("/api/tours", {
        ...newTourForm,
        tourlanguages: newTourForm.tourlanguages,
      }, config);

      const guideID = guide.guideID || guide.id;
      const toursRes = await axios.get(`/api/guides/${guideID}/tours`, config);
      setTours(toursRes.data);

      setNewTourForm({
        city: "",
        type: "",
        maxPerson: "",
        pricePerPerson: "",
        description: "",
        picture: "",
        tourlanguages: [],
      });

      setIsAddingTour(false);
    } catch (err) {
      console.error("Failed to add tour:", err.response?.data || err.message || err);
      alert(t("guideDashboard_tours_create_fail"));
    }
  };

  const handleEditTourClick = (tour) => {
    setEditingTourId(tour.tourID);
    setEditTourForm({
      city: tour.city,
      type: tour.type,
      maxPerson: tour.maxPerson,
      pricePerPerson: tour.pricePerPerson,
      description: tour.description,
      picture: tour.picture,
      tourlanguages: Array.isArray(tour.tourlang) ? tour.tourlang.map((l) => l.tourlanguage) : [],
    });
  };

  const handleEditTourChange = (e) => {
    setEditTourForm({ ...editTourForm, [e.target.name]: e.target.value });
  };

  const handleEditTourSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("guideToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.put(`/api/tours/${editingTourId}`, {
        ...editTourForm,
        tourlanguages: editTourForm.tourlanguages,
      }, config);

      const guideID = guide.guideID || guide.id;
      const toursRes = await axios.get(`/api/guides/${guideID}/tours`, config);
      setTours(toursRes.data);

      setEditingTourId(null);
    } catch (err) {
      console.error("Failed to update tour:", err);
      alert(t("guideDashboard_tours_update_fail"));
    }
  };

  const handleDeleteTour = async (tourID) => {
    if (!window.confirm(t("guideDashboard_tours_delete_confirm"))) return;
    try {
      const token = localStorage.getItem("guideToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.delete(`/api/tours/${tourID}`, config);
      setTours(tours.filter((tour) => tour.tourID !== tourID));
    } catch (err) {
      console.error("Failed to delete tour:", err);
      alert(t("guideDashboard_tours_delete_fail"));
    }
  };

  const renderProfile = () => (
    <div className="w3-container">
      <h2>{t("guideDashboard_tab_profile")}</h2>
      {guide ? (
        !isEditingProfile ? (
          <div className="w3-row-padding">
            <div className="w3-col s12 m6">
              <img
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${guide.firstName}%20${guide.lastName}`}
                alt="Guide"
                style={{ width: "50%", borderRadius: "8px" }}
              />
            </div>
            <div className="w3-col s12 m6 w3-left-align">
              <p><strong>{t("guideDashboard_profile_nameLabel")}:</strong> {guide.firstName} {guide.lastName}</p>
              <p><strong>{t("guideDashboard_profile_emailLabel")}:</strong> {guide.email}</p>
              <p><strong>{t("guideDashboard_profile_phoneLabel")}:</strong> {guide.phone}</p>
              <p><strong>{t("guideDashboard_profile_descriptionLabel")}:</strong></p>
              <p>{guide.description}</p>
              <div className="w3-margin-top">
                <button className="w3-button w3-blue w3-round-large w3-margin-right" onClick={() => setIsEditingProfile(true)}>
                  {t("guideDashboard_profile_edit")}
                </button>
                <button className="w3-button w3-red w3-round-large" onClick={handleDeleteProfile}>
                  {t("guideDashboard_profile_delete")}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleProfileUpdate} className="w3-container w3-padding">
            <label className="w3-text-black">{t("guideDashboard_profile_firstName")}</label>
            <input className="w3-input w3-border w3-margin-bottom" type="text" name="firstName" value={editForm.firstName} onChange={handleProfileChange} required />
            <label className="w3-text-black">{t("guideDashboard_profile_lastName")}</label>
            <input className="w3-input w3-border w3-margin-bottom" type="text" name="lastName" value={editForm.lastName} onChange={handleProfileChange} required />
            <label className="w3-text-black">{t("guideDashboard_profile_email")}</label>
            <input className="w3-input w3-border w3-margin-bottom" type="email" name="email" value={editForm.email} onChange={handleProfileChange} required />
            <label className="w3-text-black">{t("guideDashboard_profile_phone")}</label>
            <input className="w3-input w3-border w3-margin-bottom" type="text" name="phone" value={editForm.phone} onChange={handleProfileChange} required />
            <label className="w3-text-black">{t("guideDashboard_profile_description")}</label>
            <textarea className="w3-input w3-border w3-margin-bottom" name="description" value={editForm.description} onChange={handleProfileChange} rows="4" required />
            <label className="w3-text-black">{t("guideDashboard_profile_photo")}</label>
            <input className="w3-input w3-border w3-margin-bottom" type="url" name="photo" value={editForm.photo} onChange={handleProfileChange} />
            <button type="submit" className="w3-button w3-green w3-round-large w3-margin-right">{t("guideDashboard_profile_save")}</button>
            <button type="button" className="w3-button w3-gray w3-round-large" onClick={() => setIsEditingProfile(false)}>{t("guideDashboard_profile_cancel")}</button>
          </form>
        )
      ) : (
        <p>{t("guideDashboard_profile_loading")}</p>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfile();
      case "tours":
        return (
          <div className="w3-container">
            <h2>{t("guideDashboard_tours_heading")}</h2>
            {!isAddingTour && (
              <button
                className="w3-button w3-green w3-round-large w3-margin-bottom"
                onClick={() => setIsAddingTour(true)}
              >
                {t("guideDashboard_tours_add")}
              </button>
            )}

            {isAddingTour && (
              <form onSubmit={handleNewTourSubmit} className="w3-margin-bottom">
                <input className="w3-input w3-border w3-margin-bottom" name="city" value={newTourForm.city} onChange={handleNewTourChange} placeholder="City" required />
                <select
                  className="w3-select w3-border w3-margin-bottom"
                  name="type"
                  value={newTourForm.type}
                  onChange={handleNewTourChange}
                  required
                >
                  <option value="" disabled>{t("guideDashboard_tours_type")}</option>
                  {tourTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>

                <label className="w3-text-black">{t("guideDashboard_tours_language")}</label>
                <div className="w3-margin-bottom">
                  {guideLanguages.map((lang) => (
                    <label key={lang} className="w3-margin-right w3-small">
                      <input
                        type="checkbox"
                        value={lang}
                        checked={newTourForm.tourlanguages.includes(lang)}
                        onChange={(e) => {
                          const { value, checked } = e.target;
                          setNewTourForm((prev) => ({
                            ...prev,
                            tourlanguages: checked
                              ? [...prev.tourlanguages, value]
                              : prev.tourlanguages.filter((l) => l !== value),
                          }));
                        }}
                      />{" "}
                      {lang}
                    </label>
                  ))}
                </div>
                <input className="w3-input w3-border w3-margin-bottom" name="maxPerson" type="number" value={newTourForm.maxPerson} onChange={handleNewTourChange} placeholder={t("guideDashboard_tours_maxPerson")} required />
                <input className="w3-input w3-border w3-margin-bottom" name="pricePerPerson" type="number" value={newTourForm.pricePerPerson} onChange={handleNewTourChange} placeholder={t("guideDashboard_tours_pricePerPerson")} required />
                <textarea className="w3-input w3-border w3-margin-bottom" name="description" value={newTourForm.description} onChange={handleNewTourChange} placeholder={t("guideDashboard_tours_description")} required />
                <input className="w3-input w3-border w3-margin-bottom" name="picture" type="url" value={newTourForm.picture} onChange={handleNewTourChange} placeholder={t("guideDashboard_tours_picture")} />
                <div className="w3-margin-top w3-center">
                  <button
                    type="submit"
                    className="w3-button w3-blue w3-round-large"
                    style={{ marginRight: '24px' }}
                  >
                    {t("guideDashboard_tours_submit")}
                  </button>
                  <button
                    type="button"
                    className="w3-button w3-red w3-round-large"
                    onClick={() => setIsAddingTour(false)}
                  >
                    {t("guideDashboard_tours_cancel")}
                  </button>
                </div>
              </form>
            )}

            {tours.length > 0 ? (
              <div className="w3-row-padding">
                {tours.map((tour) => {
                  return (
                    <div key={tour.tourID} className="w3-col s12 m6 l4 w3-margin-bottom">
                      <div className="w3-card-4">
                        <img
                          src={tour.picture}
                          alt={tour.city}
                          style={{
                            width: "100%",
                            height: "200px",
                            objectFit: "cover",
                            borderTopLeftRadius: "4px",
                            borderTopRightRadius: "4px"
                          }}
                        />
                        <div className="w3-container">
                          {editingTourId === tour.tourID ? (
                            <form onSubmit={handleEditTourSubmit} className="w3-margin-top">
                              <label className="w3-text-black">{t("guideDashboard_tours_city")}</label>
                              <input className="w3-input w3-border w3-margin-bottom" name="city" value={editTourForm.city} onChange={handleEditTourChange} required />

                              <label className="w3-text-black">{t("guideDashboard_tours_type")}</label>
                              <select className="w3-select w3-border w3-margin-bottom" name="type" value={editTourForm.type} onChange={handleEditTourChange} required>
                                <option value="" disabled>{t("guideDashboard_tours_type")}</option>
                                {tourTypes.map((type) => (
                                  <option key={type} value={type}>{type}</option>
                                ))}
                              </select>

                              <label className="w3-text-black">{t("guideDashboard_tours_language")}</label>
                              <div className="w3-margin-bottom">
                                {guideLanguages.map((lang) => (
                                  <label key={lang} className="w3-margin-right w3-small">
                                    <input
                                      type="checkbox"
                                      value={lang}
                                      checked={editTourForm.tourlanguages.includes(lang)}
                                      onChange={(e) => {
                                        const { value, checked } = e.target;
                                        setEditTourForm((prev) => ({
                                          ...prev,
                                          tourlanguages: checked
                                            ? [...prev.tourlanguages, value]
                                            : prev.tourlanguages.filter((l) => l !== value),
                                        }));
                                      }}
                                    />{" "}
                                    {lang}
                                  </label>
                                ))}
                              </div>

                              <label className="w3-text-black">{t("guideDashboard_tours_maxPerson")}</label>
                              <input className="w3-input w3-border w3-margin-bottom" name="maxPerson" type="number" value={editTourForm.maxPerson} onChange={handleEditTourChange} required />

                              <label className="w3-text-black">{t("guideDashboard_tours_pricePerPerson")}</label>
                              <input className="w3-input w3-border w3-margin-bottom" name="pricePerPerson" type="number" value={editTourForm.pricePerPerson} onChange={handleEditTourChange} required />

                              <label className="w3-text-black">{t("guideDashboard_tours_description")}</label>
                              <textarea className="w3-input w3-border w3-margin-bottom" name="description" value={editTourForm.description} onChange={handleEditTourChange} required />

                              <label className="w3-text-black">{t("guideDashboard_tours_picture")}</label>
                              <input className="w3-input w3-border w3-margin-bottom" name="picture" type="url" value={editTourForm.picture} onChange={handleEditTourChange} />

                              <div className="w3-margin-top">
                                <button type="submit" className="w3-button w3-blue w3-round-large w3-margin-right w3-margin-bottom">
                                  {t("guideDashboard_tours_save")}
                                </button>
                                <button type="button" className="w3-button w3-gray w3-round-large w3-margin-bottom" onClick={() => setEditingTourId(null)}>
                                  {t("guideDashboard_tours_cancel")}
                                </button>
                              </div>
                            </form>
                          ) : (
                            <>
                              <h4>{tour.city}</h4>
                              <p><strong>{t("guideDashboard_tours_card_type")}:</strong> {tour.type}</p>
                              <p><strong>{t("guideDashboard_tours_card_language")}:</strong>
                                {Array.isArray(tour.tourlang) && tour.tourlang.length > 0
                                  ? tour.tourlang.map((l) => l.tourlanguage).join(", ")
                                  : t("guideDashboard_tours_card_language_none")}
                              </p>
                              <p><strong>{t("guideDashboard_tours_card_price")}:</strong> €{tour.pricePerPerson}</p>
                              <p><strong>{t("guideDashboard_tours_card_people")}:</strong> {tour.maxPerson}</p>
                              {(() => {
                                const maxLength = 100;
                                const description = tour.description || "";
                                const preview =
                                  description.length > maxLength
                                    ? description.slice(0, description.lastIndexOf(" ", maxLength)) + "..."
                                    : description;
                                return <p>{preview}</p>;
                              })()}
                              <button className="w3-button w3-yellow w3-small w3-round-large w3-margin-right w3-margin-bottom" onClick={() => handleEditTourClick(tour)}>{t("guideDashboard_tours_edit")}</button>
                              <button className="w3-button w3-red w3-small w3-round-large w3-margin-bottom" onClick={() => handleDeleteTour(tour.tourID)}>{t("guideDashboard_tours_delete")}</button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p>{t("guideDashboard_tours_no_tours")}</p>
            )}
          </div>
        );
      case "bookings":
        return (
          <div className="w3-container">
            <h2>{t("guideDashboard_bookings_heading")}</h2>

            {bookings.length > 0 ? (
              <div className="w3-row-padding">
                {bookings.map((booking) => (
                  <div key={booking.reservID} className="w3-col s12 m6 l4 w3-margin-bottom">
                    <div className="w3-card w3-padding w3-white w3-round-large">
                      <h4 className="w3-text-dark-grey">
                        {booking.tours.city}
                      </h4>
                      <p><strong>{t("guideDashboard_bookings_date")}:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                      <p><strong>{t("guideDashboard_bookings_tourist")}:</strong> {booking.tourist.firstName} {booking.touristlastName}</p>
                      <p><strong>{t("guideDashboard_bookings_email")}:</strong> {booking.tourist.email}</p>
                      <p><strong>{t("guideDashboard_bookings_phone")}:</strong> {booking.tourist.phone}</p>
                      <p><strong>{t("guideDashboard_bookings_people")}:</strong> {booking.numberOfPeople}</p>
                      <p><strong>{t("guideDashboard_bookings_sum")}:</strong> €{booking.summa}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>{t("guideDashboard_bookings_no_bookings")}</p>
            )}
          </div>
        );
    }
  };

  return (
    <>
      <HeroImage />
      <div className="w3-content" style={{ maxWidth: "1100px" }}>
        <div className="w3-container w3-padding-32">
          <h1 className="w3-center" style={{ fontSize: "calc(24px + 2vw)" }}>
            {t("guideDashboard_title")}
          </h1>

          <div className="w3-hide-small w3-bar w3-border-bottom w3-margin-top" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingLeft: 0, paddingRight: 0 }}>
            <div className="w3-bar" style={{ display: "flex", gap: 0 }}>
              {tabOptions.map(({ key, label }) => (
                <button
                  key={key}
                  className={`w3-bar-item w3-button ${activeTab === key ? "w3-border-bottom w3-border-red" : ""}`}
                  onClick={() => setActiveTab(key)}
                >
                  {label}
                </button>
              ))}
            </div>
            <div>
              <button
                className="w3-button w3-red w3-round-large"
                style={{ whiteSpace: "nowrap", display: "inline-block", width: "auto" }}
                onClick={handleLogout}
              >
                {t("guideDashboard_logout")}
              </button>
            </div>
          </div>

          <div className="w3-hide-medium w3-hide-large w3-margin-top">
            <select
              className="w3-select w3-border w3-round-large"
              style={{ width: "100%", maxWidth: "400px", margin: "0 auto", display: "block" }}
              value={activeTab}
              onChange={(e) => {
                if (e.target.value === "logout") {
                  handleLogout();
                } else {
                  setActiveTab(e.target.value);
                }
              }}
            >
              <option value="profile">{t("guideDashboard_tab_profile")}</option>
              <option value="tours">{t("guideDashboard_tab_tours")}</option>
              <option value="bookings">{t("guideDashboard_tab_bookings")}</option>
              <option value="logout">{t("guideDashboard_logout")}</option>
            </select>
          </div>

          <div className="w3-padding w3-white w3-card w3-round-large w3-margin-top">
            {renderTabContent()}
          </div>
        </div>
      </div>
      <Newsletter />
      <Contact />
    </>
  );
};

export default GuideDashboard;
