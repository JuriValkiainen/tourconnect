import { useState, useEffect } from "react";
import HeroImage from "../components/HeroImage";
import Newsletter from "../components/Newsletter";
import Contact from "../components/Contact";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

const GuideDashboard = () => {
  const [activeTab, setActiveTab] = useState("Profile");
  const [guide, setGuide] = useState(null);
  const [tours, setTours] = useState([]);
  const [bookings, setBookings] = useState([]);

  // const navigate = useNavigate();
  // const token = localStorage.getItem("token");

  useEffect(() => {
    setGuide({
      firstName: "Test",
      lastName: "Guide",
      email: "test@guide.com",
      phone: 123456789,
      description: "This is a test guide used for UI preview.",
      photo: "https://cdn.pixabay.com/photo/2025/03/05/14/35/cat-9448800_1280.jpg",
    });

    setTours([
      {
        tourID: 1,
        city: "Helsinki",
        type: "City walk",
        prisePerPerson: 30,
        maxPerson: 5,
        description: "Discover the beauty of Helsinki on foot.",
        picture: "https://cdn.pixabay.com/photo/2016/10/30/05/45/architecture-1781599_960_720.jpg",
      },
    ]);

    setBookings([
      {
        reservID: 1,
        date: "2025-05-01",
        numberOfPeople: 2,
        summa: 60,
        tourist: {
          firstName: "Anna",
          lastName: "Virtanen",
          email: "anna@example.com",
          phone: 456789123,
        },
        tours: {
          city: "Helsinki",
        },
      },
    ]);
  }, []);

  const handleEditTour = (tourID) => {
    alert(`Edit tour ${tourID} (TODO)`);
  };

  const handleDeleteTour = async (tourID) => {
    const confirm = window.confirm("Are you sure you want to delete this tour?");
    if (!confirm) return;

    try {
      setTours(tours.filter((t) => t.tourID !== tourID));
    } catch (err) {
      console.error("Failed to delete tour:", err);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Profile":
        return (
          <div className="w3-container">
            <h2>Profile</h2>
            {guide ? (
              <div className="w3-row-padding">
                <div className="w3-col s12 m6">
                  <img
                    src={guide.photo}
                    alt="Guide"
                    style={{ width: "100%", borderRadius: "8px" }}
                  />
                </div>
                <div className="w3-col s12 m6 w3-left-align">
                  <p><strong>Name:</strong> {guide.firstName} {guide.lastName}</p>
                  <p><strong>Email:</strong> {guide.email}</p>
                  <p><strong>Phone:</strong> {guide.phone}</p>
                  <p><strong>Description:</strong></p>
                  <p>{guide.description}</p>
                </div>
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        );

      case "My Tours":
        return (
          <div className="w3-container">
            <h2>My Tours</h2>
            {tours.length > 0 ? (
              <div className="w3-row-padding">
                {tours.map((tour) => (
                  <div key={tour.tourID} className="w3-col s12 m6 l4 w3-margin-bottom">
                    <div className="w3-card-4">
                      <img src={tour.picture} alt={tour.city} style={{ width: "100%" }} />
                      <div className="w3-container">
                        <h4>{tour.city}</h4>
                        <p><strong>Type:</strong> {tour.type}</p>
                        <p><strong>Price:</strong> €{tour.prisePerPerson}</p>
                        <p><strong>Max People:</strong> {tour.maxPerson}</p>
                        <p>{tour.description.slice(0, 100)}...</p>
                        <button className="w3-button w3-blue w3-small w3-margin-right" onClick={() => handleEditTour(tour.tourID)}>
                          Edit
                        </button>
                        <button className="w3-button w3-red w3-small" onClick={() => handleDeleteTour(tour.tourID)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No tours found.</p>
            )}
          </div>
        );

      case "Bookings":
        return (
          <div className="w3-container">
            <h2>Bookings</h2>
            {bookings.length > 0 ? (
              <>
                <div className="w3-responsive w3-hide-small">
                  <table className="w3-table-all w3-hoverable w3-small">
                    <thead>
                      <tr className="w3-light-grey">
                        <th>Tour</th>
                        <th>Date</th>
                        <th>Tourist</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>People</th>
                        <th>Summa (€)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b) => (
                        <tr key={b.reservID}>
                          <td>{b.tours?.city}</td>
                          <td>{b.date}</td>
                          <td>{b.tourist?.firstName} {b.tourist?.lastName}</td>
                          <td>{b.tourist?.email}</td>
                          <td>{b.tourist?.phone}</td>
                          <td>{b.numberOfPeople}</td>
                          <td>{b.summa}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="w3-hide-medium w3-hide-large">
                  {bookings.map((b) => (
                    <div key={b.reservID} className="w3-card w3-white w3-margin-bottom w3-padding w3-round-large">
                      <p><strong>Tour:</strong> {b.tours?.city}</p>
                      <p><strong>Date:</strong> {b.date}</p>
                      <p><strong>Tourist:</strong> {b.tourist?.firstName} {b.tourist?.lastName}</p>
                      <p><strong>Email:</strong> {b.tourist?.email}</p>
                      <p><strong>Phone:</strong> {b.tourist?.phone}</p>
                      <p><strong>People:</strong> {b.numberOfPeople}</p>
                      <p><strong>Summa:</strong> €{b.summa}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p>No bookings yet.</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <HeroImage />

      <div className="w3-content" style={{ maxWidth: "1100px" }}>
        <div className="w3-container w3-padding-32">
          <h1 className="w3-center" style={{ fontSize: "calc(24px + 2vw)" }}>Guide Dashboard</h1>

          <div className="w3-hide-small w3-bar w3-border-bottom w3-margin-top">
            <button
              className={`w3-bar-item w3-button ${activeTab === "Profile" ? "w3-border-bottom w3-border-red" : ""}`}
              onClick={() => setActiveTab("Profile")}
            >
              Profile
            </button>
            <button
              className={`w3-bar-item w3-button ${activeTab === "My Tours" ? "w3-border-bottom w3-border-red" : ""}`}
              onClick={() => setActiveTab("My Tours")}
            >
              My Tours
            </button>
            <button
              className={`w3-bar-item w3-button ${activeTab === "Bookings" ? "w3-border-bottom w3-border-red" : ""}`}
              onClick={() => setActiveTab("Bookings")}
            >
              Bookings
            </button>
          </div>

          <div className="w3-hide-medium w3-hide-large w3-margin-top">
            <select
              className="w3-select w3-border"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
            >
              <option value="Profile">Profile</option>
              <option value="My Tours">My Tours</option>
              <option value="Bookings">Bookings</option>
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
