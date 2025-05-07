import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { FaSignOutAlt } from "react-icons/fa";
import HeroImage from "../components/HeroImage";

const AdminPanel = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState("admin");
  const [adminEmail, setAdminEmail] = useState("");
  const [subscribers, setSubscribers] = useState([]);
  const [messages, setMessages] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("a-token");
    navigate("/");
  };

  const token = localStorage.getItem("a-token");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    // Decode token to get admin data
    const payload = JSON.parse(atob(token.split(".")[1]));
    setAdminEmail(payload.email);

    // Fetch data for subscribers and messages
    const fetchData = async () => {
      try {
        const [subsRes, msgRes] = await Promise.all([
          axios.get("/api/admin/subscribers", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/api/admin/messages", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setSubscribers(subsRes.data);
        setMessages(msgRes.data);
      } catch (error) {
        console.error("Error while retrieving data:", error);
      }
    };

    fetchData();
  }, [token, navigate]);

  return (
    <>
      <div
        className="w3-container"
        style={{
          background: "#f2f2f2",
          minHeight: "100vh",
          paddingTop: "32px",
        }}
      >
        <h2 className="w3-center">{t("admin-profile_title")}</h2>

        {/* Tab Links */}
        <div className="w3-row w3-margin-top">
          <div
            onClick={() => setActiveTab("admin")}
            className={`w3-third tablink w3-bottombar w3-hover-light-grey w3-padding ${
              activeTab === "admin" ? "w3-border-blue" : ""
            }`}
          >
            {t("admin-profile_admin-tab")}
          </div>
          <div
            onClick={() => setActiveTab("subscribers")}
            className={`w3-third tablink w3-bottombar w3-hover-light-grey w3-padding ${
              activeTab === "subscribers" ? "w3-border-blue" : ""
            }`}
          >
            {t("admin-profile_subscribers-tab")}
          </div>
          <div
            onClick={() => setActiveTab("messages")}
            className={`w3-third tablink w3-bottombar w3-hover-light-grey w3-padding ${
              activeTab === "messages" ? "w3-border-blue" : ""
            }`}
          >
            {t("admin-profile_messages-tab")}
          </div>
        </div>

        {/* Tab Contents */}
        <div className="w3-container w3-white w3-padding w3-round-large w3-margin-top">
          {activeTab === "admin" && (
            <div>
              <h3>{t("admin-profile_admin-tab")}</h3>
              <p>
                <strong>{t("admin-profile_email")}:</strong>{" "}
                {adminEmail}
              </p>
              <br/>
              <button
                onClick={handleLogout}
                className="w3-btn w3-white w3-border w3-border-red w3-round-large"
              >
                <FaSignOutAlt /> {t("admin-profile_info_icon")}
              </button>
              <br/><br/>
            </div>
          )}

          {activeTab === "subscribers" && (
            <div>
              <h3>{t("admin-profile_subscribers-tab")}</h3>
              {subscribers.length === 0 ? (
                <p>{t("admin-profile_subscribers-tab_no-subscrb")}</p>
              ) : (
                <table className="w3-table-all w3-hoverable">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((sub) => (
                      <tr key={sub.subscribID}>
                        <td>{sub.subscribID}</td>
                        <td>{sub.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === "messages" && (
            <div>
              <h3 className="w3-text-indigo">{t("admin-profile_messages-tab")}</h3>

              {messages.length === 0 ? (
                <p>{t("admin-profile_messages-tab_no-msg")}</p>
              ) : (
                <div
                  className="w3-white w3-round-large w3-padding"
                  style={{
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    maxHeight: "400px",
                    overflowY: "auto",
                  }}
                >
                  <table className="w3-table-all w3-hoverable w3-small w3-striped">
                    <thead>
                      <tr className="w3-light-grey">
                        <th style={{ width: "5%" }}>ID</th>
                        <th style={{ width: "20%" }}>Email</th>
                        <th style={{ width: "20%" }}>Full Name</th>
                        <th style={{ width: "55%" }}>{t("admin-profile_messages-table_msg")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {messages.map((msg) => (
                        <tr key={msg.contactID}>
                          <td>{msg.contactID}</td>
                          <td>{msg.email}</td>
                          <td>
                            {msg.firstName} {msg.lastName}
                          </td>
                          <td style={{ wordBreak: "break-word" }}>{msg.message}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <HeroImage />
    </>
  );
};

export default AdminPanel;
