import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    axios
      .get("http://localhost:5001/api/tourists/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUser(response.data);
        setLoading(false);

        // Загружаем бронирования после получения ID
      return axios.get(`http://localhost:5001/api/tourists/${response.data.touristID}/booking`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    })
    .then((response) => {
      setBookings(response.data);
      })
      .catch((error) => {
        setError(error.response?.data?.message || "Error loading profile");
        setLoading(false);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token"); // удаляем токен
    navigate("/"); // переадресация на главную
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>❌ Error: {error}</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <div className="w3-container" >
    <div className="w3-content" style={{ maxWidth: "1100px" }}>
      <h2>🗂️ Profile Info:</h2>
      <p>First Name: {user.firstName} </p>
      <p>Last Name: {user.lastName} </p>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>
      <hr />
      {bookings && bookings.length > 0 && (
        <div className="w3-margin-top">
            <h3 className="w3-text-teal">📅 Bookings:</h3>
            <div className="w3-row-padding">
            {bookings.map((booking, index) => (
                <div key={booking.reservID} className="w3-third w3-margin-bottom">
                <div className="w3-card w3-white w3-padding-large w3-hover-shadow">
                    <h4 className="w3-text-indigo">{booking.tourType} – {booking.city}</h4>
                    <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                    <p><strong>Guide:</strong> {booking.guideFirstName} {booking.guideLastName}</p>
                    <p><strong>People:</strong> {booking.numberOfPeople}</p>
                    <p><strong>Summa:</strong> €{booking.summa}</p>
                    
                    <div className="w3-margin-top ">
                    <button 
                        className="w3-button w3-white w3-border w3-border-teal w3-round-large w3-small"
                        onClick={() => document.getElementById(`modal${index}`).style.display = 'block'}
                    >
                        🔍 Подробнее
                    </button>
                    <button 
                        className="w3-button w3-white w3-border w3-border-red w3-round-large w3-small "
                        onClick={() => console.log('Удалить бронь', booking.reservID)} // сюда можно вставить delete-запрос
                    >
                        🗑️ Удалить
                    </button>
                    </div>
                </div>

                {/* Modal */}
                <div id={`modal${index}`} className="w3-modal" onClick={() => document.getElementById(`modal${index}`).style.display = 'none'}>
                    <div className="w3-modal-content w3-animate-top w3-card-4" onClick={(e) => e.stopPropagation()}>
                    <header className="w3-container w3-teal">
                        <span 
                        onClick={() => document.getElementById(`modal${index}`).style.display = 'none'}
                        className="w3-button w3-display-topright"
                        >
                        &times;
                        </span>
                        <h4>Booking Details</h4>
                    </header>
                    <div className="w3-container">
                        <p><strong>Tour Type:</strong> {booking.tourType}</p>
                        <p><strong>City:</strong> {booking.city}</p>
                        <p><strong>Date:</strong> {new Date(booking.date).toLocaleString()}</p>
                        <p><strong>Guide:</strong> {booking.guideFirstName} {booking.guideLastName}</p>
                        <p><strong>Number of People:</strong> {booking.numberOfPeople}</p>
                        <p><strong>Total Price:</strong> €{booking.summa}</p>
                        <p><strong>Reservation ID:</strong> {booking.reservID}</p>
                    </div>
                    <footer className="w3-container w3-light-grey">
                        <button 
                        className="w3-button w3-right w3-teal w3-margin"
                        onClick={() => document.getElementById(`modal${index}`).style.display = 'none'}
                        >
                        Закрыть
                        </button>
                    </footer>
                    </div>
                </div>
                </div>
            ))}
            </div>
        </div>
        )}
        <button onClick={handleLogout} className="w3-button w3-gray w3-margin-bottom">
        Logout
        </button>
    </div>
    </div>
  );
};

export default Profile;
