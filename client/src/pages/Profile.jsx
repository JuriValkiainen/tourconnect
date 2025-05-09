import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import ExploreNature from "../components/ExploreNature";
import { FaSignOutAlt, FaExclamationTriangle } from "react-icons/fa";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [emailMessage, setEmailMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const { t } = useTranslation();
  const [sendingEmail, setSendingEmail] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [bookingToDelete, setBookingToDelete] = useState(null);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

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

        // Uploading bookings after receiving ID
        return axios.get(`http://localhost:5001/api/tourists/booking`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      })
      .then((response) => {
        // console.log("Response data as bookings in Profile:", response.data);
        setBookings(response.data);
      })
      .catch((error) => {
        setError(error.response?.data?.message || "Error loading profile");
        setLoading(false);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token"); // delete token from localStorage
    navigate("/"); // redirect to login page
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    setDeleteError("");

    try {
      const token = localStorage.getItem("token");

      await axios.delete("http://localhost:5001/api/tourists/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // After successful deletion, remove the token from localStorage and navigate to the home page
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.error("Delete account error:", error);
      setDeleteError(
        error.response?.data?.error ||
          "Failed to delete account. Please try again."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteBooking = async () => {
    setDeleteLoading(true);
    setDeleteError("");

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5001/api/bookings/me/${bookingToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // After successful deletion, remove the booking from the state
      setBookings((prev) =>
        prev.filter((booking) => booking.reservID !== bookingToDelete)
      );
      setBookingToDelete(null);
    } catch (error) {
      console.error("Delete booking error:", error);
      setDeleteError(
        error.response?.data?.error || t("profile_delete_tour_error")
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const sendVerificationEmail = async () => {
    setSendingEmail(true);
    setEmailMessage("");
    setEmailError("");

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://localhost:5001/verify-request",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("✅ Verification email sent successfully:", response.data);

      setEmailMessage("📧 Verification email sent! Check your inbox.");
      setCooldown(60); // 1 minute cooldown
    } catch (err) {
      console.error("❌ Error sending email:", err);
      setEmailError(
        err.response?.data?.message || "❌ Failed to send verification email"
      );
    } finally {
      setSendingEmail(false);
    }
  };

  if (loading) return <p>{t("profile_loading_text")}</p>;
  if (error)
    return (
      <p>
        {t("profile_error_text")} {error}
      </p>
    );
  if (!user) return <p>{t("profile_user_not_found")}</p>;

  return (
    <>
      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="w3-modal" style={{ display: "block" }}>
          <div
            className="w3-modal-content w3-card-4 w3-animate-zoom"
            style={{ maxWidth: "500px" }}
          >
            <div className="w3-container w3-padding-16">
              <span
                onClick={() => setShowDeleteModal(false)}
                className="w3-button w3-display-topright"
              >
                &times;
              </span>

              <div className="w3-center">
                <FaExclamationTriangle
                  className="w3-text-red"
                  style={{ fontSize: "48px", margin: "16px 0" }}
                />
              </div>

              <h3 className="w3-center">{t("profile_delete_account_title")}</h3>
              <p className="w3-center">{t("profile_delete_account_confirm")}</p>

              <div className="w3-row w3-margin-top">
                <div className="w3-half w3-padding">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="w3-button w3-light-grey w3-block w3-round-large"
                  >
                    {t("profile_delete_account_cancel")}
                  </button>
                </div>
                <div className="w3-half w3-padding">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading}
                    className="w3-button w3-red w3-block w3-round-large"
                  >
                    {deleteLoading
                      ? t("profile_delete_account_modalBtn_1")
                      : t("profile_delete_account_modalBtn_2")}
                  </button>
                </div>
              </div>

              {deleteError && (
                <p className="w3-text-red w3-center">{deleteError}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Basic Information Section */}
      <div
        className="w3-container"
        style={{
          background: "linear-gradient(to right, #f5f7fa, #e4e8f0)",
          minHeight: "100vh",
          paddingTop: "32px",
        }}
      >
        <div className="w3-content" style={{ maxWidth: "768px" }}>
          {/* Profile Card - Modern Airy Design */}
          <div
            className="w3-card-4"
            style={{
              width: "100%",
              margin: "0 auto 32px auto",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              background: "white",
            }}
          >
            <div
              className="w3-padding"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
              }}
            >
              <div className="w3-row">
                <div className="w3-col" style={{ maxWidth: "300px" }}>
                  <h3>
                    <i className="fa fa-user-circle"></i>{" "}
                    {t("profile_personalInfo_title")}
                  </h3>
                </div>
                <div className="w3-rest w3-right-align">
                  <button
                    onClick={handleLogout}
                    className="w3-button w3-round-large"
                    style={{
                      background: "rgba(255,255,255,0.2)",
                      border: "1px solid rgba(255,255,255,0.4)",
                    }}
                  >
                    <FaSignOutAlt style={{ marginTop: "8px" }} />{" "}
                    {t("profile_personalInfo_icon")}
                  </button>
                </div>
              </div>
            </div>

            <div className="w3-padding">
              <div
                className="w3-panel"
                style={{ borderLeft: "4px solid #667eea" }}
              >
                <p>
                  <b>{t("profile_personalInfo_fullName")} </b>
                  {user.firstName} {user.lastName}
                </p>
              </div>
              <div
                className="w3-panel"
                style={{ borderLeft: "4px solid #667eea" }}
              >
                <p>
                  <b>{t("profile_personalInfo_phone")} </b>
                  {user.phone}
                </p>
              </div>
              <div
                className="w3-panel"
                style={{ borderLeft: "4px solid #667eea" }}
              >
                <p>
                  <b>{t("profile_personalInfo_email")} </b>
                  {user.email}
                </p>
              </div>
              <div
                className="w3-panel"
                style={{ borderLeft: "4px solid #667eea" }}
              >
                <p>
                  <b>{t("profile_personalInfo_verified")} </b>
                  {user.isVerified ? (
                    <span className="w3-text-green">
                      {t("profile_personalInfo_verified_yes")}
                    </span>
                  ) : (
                    <span className="w3-text-orange">
                      {t("profile_personalInfo_verified_no")}
                    </span>
                  )}
                </p>
              </div>

              {!user.isVerified && (
                <div className="w3-margin-top w3-center">
                  <button
                    onClick={sendVerificationEmail}
                    className="w3-button w3-round"
                    style={{
                      background:
                        "linear-gradient(to right, #ff9a9e 0%, #fad0c4 100%)",
                      color: "white",
                    }}
                    disabled={sendingEmail || cooldown > 0}
                  >
                    {sendingEmail
                      ? t("profile_personalInfo_btn_send")
                      : cooldown > 0
                      ? `Try again in ${cooldown}s`
                      : t("profile_personalInfo_btn_verify")}
                  </button>
                  {emailMessage && (
                    <p className="w3-text-green">{emailMessage}</p>
                  )}
                  {emailError && <p className="w3-text-red">{emailError}</p>}
                </div>
              )}
            </div>
          </div>

          {/* Bookings Section - Card Layout */}
          {bookings && bookings.length > 0 && (
            <div
              className="w3-card-4"
              style={{
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                marginBottom: "32px",
              }}
            >
              <div
                className="w3-padding"
                style={{
                  background:
                    "linear-gradient(135deg, #5ee7df 0%, #66a6ff 100%)",
                  color: "white",
                }}
              >
                <h3>
                  <i className="fa fa-calendar-check"></i>{" "}
                  {t("profile_bookings_title")}
                </h3>
              </div>

              <div className="w3-padding">
                <div className="w3-row-padding">
                  {bookings.map((booking, index) => (
                    <div
                      key={booking.reservID}
                      className="w3-third w3-margin-bottom w3-hover-shadow "
                    >
                      <div
                        className="w3-card w3-padding-small"
                        style={{
                          borderRadius: "8px",
                          background: "white",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                          transition: "all 0.3s",
                          borderTop: "3px solid #66a6ff",
                        }}
                      >
                        <h4 style={{ color: "#3a7bd5" }}>
                          {booking.tourType} – {booking.city}
                        </h4>
                        <p>
                          <strong>{t("profile_bookings_date")}</strong>{" "}
                          {new Date(booking.date).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>{t("profile_bookings_guide")}</strong>{" "}
                          {booking.guideFirstName} {booking.guideLastName}
                        </p>
                        <div
                          className="w3-margin-top w3-margin-bottom"
                          style={{ display: "flex", gap: "8px" }}
                        >
                          <button
                            className="w3-button w3-round w3-padding-small"
                            style={{
                              flex: 1,
                              background: "rgba(58, 123, 213, 0.1)",
                              border: "1px solid rgba(58, 123, 213, 0.3)",
                            }}
                            onClick={() =>
                              (document.getElementById(
                                `modal${index}`
                              ).style.display = "block")
                            }
                          >
                            {t("profile_bookings_btn_details")}
                          </button>
                          <button
                            className="w3-button w3-round w3-padding-small"
                            style={{
                              flex: 1,
                              background: "rgba(244, 67, 54, 0.1)",
                              border: "1px solid rgba(244, 67, 54, 0.3)",
                            }}
                            onClick={() => setBookingToDelete(booking.reservID)}
                          >
                            {t("profile_bookings_btn_delete")}
                          </button>
                        </div>
                      </div>

                      {/* Modal */}
                      <div id={`modal${index}`} className="w3-modal">
                        <div
                          className="w3-modal-content"
                          style={{
                            borderRadius: "12px",
                            maxWidth: "600px",
                            overflow: "hidden",
                          }}
                        >
                          <header
                            className="w3-padding"
                            style={{
                              background:
                                "linear-gradient(135deg, #5ee7df 0%, #66a6ff 100%)",
                              color: "white",
                            }}
                          >
                            <span
                              onClick={() =>
                                (document.getElementById(
                                  `modal${index}`
                                ).style.display = "none")
                              }
                              className="w3-button"
                              style={{ background: "rgba(255,255,255,0.2)" }}
                            >
                              &times;
                            </span>
                            <h4>{t("profile_bookings_modal_title")}</h4>
                          </header>
                          <div className="w3-padding">
                            {/* modal content */}
                            <p>
                              <strong>
                                {t("profile_bookings_modal_tourType")}
                              </strong>{" "}
                              {booking.tourType}
                            </p>
                            <p>
                              <strong>
                                {t("profile_bookings_modal_city")}
                              </strong>{" "}
                              {booking.city}
                            </p>
                            <p>
                              <strong>
                                {t("profile_bookings_modal_date")}
                              </strong>{" "}
                              {new Date(booking.date).toLocaleString()}
                            </p>
                            <p>
                              <strong>
                                {t("profile_bookings_modal_guide")}
                              </strong>{" "}
                              {booking.guideFirstName} {booking.guideLastName}
                            </p>
                            <p>
                              <strong>
                                {t("profile_bookings_modal_people")}
                              </strong>{" "}
                              {booking.numberOfPeople}
                            </p>
                            <p>
                              <strong>
                                {t("profile_bookings_modal_price")}
                              </strong>{" "}
                              €{booking.summa}
                            </p>
                            <p>
                              <strong>
                                {t("profile_bookings_modal_resID")}
                              </strong>{" "}
                              {booking.reservID}
                            </p>
                          </div>
                          <footer className="w3-padding w3-light-grey">
                            <button
                              className="w3-button w3-round"
                              style={{
                                background:
                                  "linear-gradient(135deg, #5ee7df 0%, #66a6ff 100%)",
                                color: "white",
                              }}
                              onClick={() =>
                                (document.getElementById(
                                  `modal${index}`
                                ).style.display = "none")
                              }
                            >
                              {t("profile_bookings_modal_btn_close")}
                            </button>
                          </footer>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Delete Booking Modal */}
          {bookingToDelete && (
            <div className="w3-modal" style={{ display: "block" }}>
              <div
                className="w3-modal-content w3-card-4 w3-animate-zoom"
                style={{ maxWidth: "500px" }}
              >
                <div className="w3-container w3-padding-16">
                  <span
                    onClick={() => setBookingToDelete(null)}
                    className="w3-button w3-display-topright"
                  >
                    &times;
                  </span>

                  <div className="w3-center">
                    <FaExclamationTriangle
                      className="w3-text-red"
                      style={{ fontSize: "48px", margin: "16px 0" }}
                    />
                  </div>

                  <h3 className="w3-center">
                    {t("profile_delete_tour_confirmation_title")}
                  </h3>
                  <p className="w3-center">
                    {t("profile_delete_tour_confirmation_message")}
                  </p>

                  <div className="w3-row w3-margin-top">
                    <div className="w3-half w3-padding">
                      <button
                        onClick={() => setBookingToDelete(null)}
                        className="w3-button w3-light-grey w3-block w3-round-large"
                      >
                        {t("profile_btn_cancel")}
                      </button>
                    </div>
                    <div className="w3-half w3-padding">
                      <button
                        onClick={handleDeleteBooking}
                        disabled={deleteLoading}
                        className="w3-button w3-red w3-block w3-round-large"
                      >
                        {deleteLoading
                          ? t("profile_btn_delete_deleting")
                          : t("profile_btn_delete_delete")}
                      </button>
                    </div>
                  </div>

                  {deleteError && (
                    <p className="w3-text-red w3-center">{deleteError}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Delete Account Button */}
          <div className="w3-padding w3-center w3-margin-bottom">
            <button
              onClick={() => setShowDeleteModal(true)}
              className="w3-button w3-round-large"
              style={{
                background: "linear-gradient(to right, #ff5f6d, #ffc371)",
                color: "white",
              }}
            >
              <FaExclamationTriangle style={{ marginRight: "8px" }} />
              {t("profile_delete_account_button")}
            </button>
          </div>
        </div>
      </div>
      <ExploreNature />
    </>
  );
};

export default Profile;
