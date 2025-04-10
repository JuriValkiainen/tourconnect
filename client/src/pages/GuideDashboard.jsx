import { useState, useEffect } from "react";
import axios from "axios";
import HeroImage from "../components/HeroImage";
import Newsletter from "../components/Newsletter";
import Contact from "../components/Contact";

const GuideDashboard = () => {
  const [activeTab, setActiveTab] = useState("Profile");
  const [guide, setGuide] = useState(null);
  const [tours, setTours] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingTour, setIsAddingTour] = useState(false);
  const [editingTourId, setEditingTourId] = useState(null);

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
  });

  const [editTourForm, setEditTourForm] = useState({
    city: "",
    type: "",
    maxPerson: "",
    pricePerPerson: "",
    description: "",
    picture: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("guideToken");
        if (!token) return;

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const guideRes = await axios.get("/api/guides/me", config);
        const guideData = guideRes.data;
        const guideID = guideData.guideID || guideData.id;

        setGuide({
          firstName: guideData.Name,
          lastName: guideData.LastName,
          email: guideData.email,
          phone: guideData.Phone,
          description: guideData.description,
          photo: guideData.photo,
        });

        setEditForm({
          firstName: guideData.Name,
          lastName: guideData.LastName,
          email: guideData.email,
          phone: guideData.Phone,
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
      }
    };

    fetchData();
  }, []);

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
      alert("Error updating profile. Please try again.");
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

      const res = await axios.post("/api/tours", newTourForm, config);
      setTours([...tours, { ...newTourForm, tourID: res.data.id }]);

      setNewTourForm({
        city: "",
        type: "",
        maxPerson: "",
        pricePerPerson: "",
        description: "",
        picture: "",
      });

      setIsAddingTour(false);
    } catch (err) {
      console.error("Failed to add tour:", err);
      alert("Error creating tour. Please try again.");
    }
  };

  const handleEditTourClick = (tour) => {
    setEditingTourId(tour.tourID);
    setEditTourForm({ ...tour });
  };

  const handleEditTourChange = (e) => {
    setEditTourForm({ ...editTourForm, [e.target.name]: e.target.value });
  };

  const handleEditTourSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("guideToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.put(`/api/tours/${editingTourId}`, editTourForm, config);

      const updatedTours = tours.map((tour) =>
        tour.tourID === editingTourId ? { ...editTourForm, tourID: editingTourId } : tour
      );

      setTours(updatedTours);
      setEditingTourId(null);
    } catch (err) {
      console.error("Failed to update tour:", err);
      alert("Error updating tour. Please try again.");
    }
  };

  const handleDeleteTour = async (tourID) => {
    if (!window.confirm("Are you sure you want to delete this tour?")) return;
    try {
      const token = localStorage.getItem("guideToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.delete(`/api/tours/${tourID}`, config);
      setTours(tours.filter((tour) => tour.tourID !== tourID));
    } catch (err) {
      console.error("Failed to delete tour:", err);
      alert("Error deleting tour. Please try again.");
    }
  };

  const renderProfile = () => (
    <div className="w3-container">
      <h2>Profile</h2>
      {guide ? (
        !isEditingProfile ? (
          <div className="w3-row-padding">
            <div className="w3-col s12 m6">
              <img
                src={guide.photo || "https://via.placeholder.com/300"}
                alt="Guide"
                style={{ width: "50%", borderRadius: "8px" }}
              />
            </div>
            <div className="w3-col s12 m6 w3-left-align">
              <p><strong>Name:</strong> {guide.firstName} {guide.lastName}</p>
              <p><strong>Email:</strong> {guide.email}</p>
              <p><strong>Phone:</strong> {guide.phone}</p>
              <p><strong>Description:</strong></p>
              <p>{guide.description}</p>
              <button className="w3-button w3-blue w3-round-large w3-margin-top" onClick={() => setIsEditingProfile(true)}>
                Edit Profile
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleProfileUpdate} className="w3-container w3-padding">
            <label className="w3-text-black">First Name</label>
            <input className="w3-input w3-border w3-margin-bottom" type="text" name="firstName" value={editForm.firstName} onChange={handleProfileChange} required />
            <label className="w3-text-black">Last Name</label>
            <input className="w3-input w3-border w3-margin-bottom" type="text" name="lastName" value={editForm.lastName} onChange={handleProfileChange} required />
            <label className="w3-text-black">Email</label>
            <input className="w3-input w3-border w3-margin-bottom" type="email" name="email" value={editForm.email} onChange={handleProfileChange} required />
            <label className="w3-text-black">Phone</label>
            <input className="w3-input w3-border w3-margin-bottom" type="text" name="phone" value={editForm.phone} onChange={handleProfileChange} required />
            <label className="w3-text-black">Description</label>
            <textarea className="w3-input w3-border w3-margin-bottom" name="description" value={editForm.description} onChange={handleProfileChange} rows="4" required />
            <label className="w3-text-black">Photo URL</label>
            <input className="w3-input w3-border w3-margin-bottom" type="url" name="photo" value={editForm.photo} onChange={handleProfileChange} />
            <button type="submit" className="w3-button w3-green w3-round-large w3-margin-right">Save</button>
            <button type="button" className="w3-button w3-gray w3-round-large" onClick={() => setIsEditingProfile(false)}>Cancel</button>
          </form>
        )
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "Profile":
        return renderProfile();
      case "My Tours":
        return (
          <div className="w3-container">
            <h2>My Tours</h2>
            <button className="w3-button w3-green w3-round-large w3-margin-bottom" onClick={() => setIsAddingTour(!isAddingTour)}>
              {isAddingTour ? "Cancel" : "Add New Tour"}
            </button>

            {isAddingTour && (
              <form onSubmit={handleNewTourSubmit} className="w3-margin-bottom">
                <input className="w3-input w3-border w3-margin-bottom" name="city" value={newTourForm.city} onChange={handleNewTourChange} placeholder="City" required />
                <input className="w3-input w3-border w3-margin-bottom" name="type" value={newTourForm.type} onChange={handleNewTourChange} placeholder="Type" required />
                <input className="w3-input w3-border w3-margin-bottom" name="maxPerson" type="number" value={newTourForm.maxPerson} onChange={handleNewTourChange} placeholder="Max People" required />
                <input className="w3-input w3-border w3-margin-bottom" name="pricePerPerson" type="number" value={newTourForm.pricePerPerson} onChange={handleNewTourChange} placeholder="Price Per Person" required />
                <textarea className="w3-input w3-border w3-margin-bottom" name="description" value={newTourForm.description} onChange={handleNewTourChange} placeholder="Description" required />
                <input className="w3-input w3-border w3-margin-bottom" name="picture" type="url" value={newTourForm.picture} onChange={handleNewTourChange} placeholder="Picture URL" />
                <button type="submit" className="w3-button w3-blue w3-round-large">Submit Tour</button>
              </form>
            )}

            {tours.length > 0 ? (
              <div className="w3-row-padding">
                {tours.map((tour) => (
                  <div key={tour.tourID} className="w3-col s12 m6 l4 w3-margin-bottom">
                    <div className="w3-card-4">
                      <img src={tour.picture} alt={tour.city} style={{ width: "100%" }} />
                      <div className="w3-container">
                        {editingTourId === tour.tourID ? (
                          <form onSubmit={handleEditTourSubmit} className="w3-margin-top">
                            <input className="w3-input w3-border w3-margin-bottom" name="city" value={editTourForm.city} onChange={handleEditTourChange} required />
                            <input className="w3-input w3-border w3-margin-bottom" name="type" value={editTourForm.type} onChange={handleEditTourChange} required />
                            <input className="w3-input w3-border w3-margin-bottom" name="maxPerson" type="number" value={editTourForm.maxPerson} onChange={handleEditTourChange} required />
                            <input className="w3-input w3-border w3-margin-bottom" name="pricePerPerson" type="number" value={editTourForm.pricePerPerson} onChange={handleEditTourChange} required />
                            <textarea className="w3-input w3-border w3-margin-bottom" name="description" value={editTourForm.description} onChange={handleEditTourChange} required />
                            <input className="w3-input w3-border w3-margin-bottom" name="picture" type="url" value={editTourForm.picture} onChange={handleEditTourChange} />
                            <button type="submit" className="w3-button w3-blue w3-round-large w3-margin-right w3-margin-bottom">Save</button>
                            <button type="button" className="w3-button w3-gray w3-round-large w3-margin-bottom" onClick={() => setEditingTourId(null)}>Cancel</button>
                          </form>
                        ) : (
                          <>
                            <h4>{tour.city}</h4>
                            <p><strong>Type:</strong> {tour.type}</p>
                            <p><strong>Price:</strong> €{tour.pricePerPerson}</p>
                            <p><strong>Max People:</strong> {tour.maxPerson}</p>
                            <p>{tour.description.slice(0, 100)}...</p>
                            <button className="w3-button w3-yellow w3-small w3-round-large w3-margin-right w3-margin-bottom" onClick={() => handleEditTourClick(tour)}>Edit</button>
                            <button className="w3-button w3-red w3-small w3-round-large w3-margin-bottom" onClick={() => handleDeleteTour(tour.tourID)}>Delete</button>
                          </>
                        )}
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
        return <div className="w3-container"><h2>Bookings</h2></div>;
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
            {["Profile", "My Tours", "Bookings"].map((tab) => (
              <button
                key={tab}
                className={`w3-bar-item w3-button ${activeTab === tab ? "w3-border-bottom w3-border-red" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="w3-hide-medium w3-hide-large w3-margin-top">
            <select className="w3-select w3-border" value={activeTab} onChange={(e) => setActiveTab(e.target.value)}>
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
