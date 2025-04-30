// import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
// import axios from "axios";
import ExploreNature from "../components/ExploreNature";

const AdminPanel = () => {
    // const [admin, setAdmin] = useState([]);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState("");
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleLogout = () => {
        localStorage.removeItem("a-token"); // delete token from localStorage
        navigate("/"); // redirect to login page
    };
    // useEffect(() => {
    //     const fetchAdmin = async () => {
    //         try {
    //             const token = localStorage.getItem("a-token");
    //             if (!token) {
    //                 navigate("/admin-login");
    //                 return;
    //             }
    //             const response = await axios.get(
    //                 "http://localhost:5001/admin",
    //                 {
    //                     headers: {
    //                         Authorization: `Bearer ${token}`,
    //                     },
    //                 }
    //             );
    //             setAdmin(response.data);
    //             setLoading(false);
    //         } catch (error) {
    //             setError(error.message);
    //             setLoading(false);
    //         }
    //     };
    //     fetchAdmin();
    // }, [navigate]);

  return (
    <>
      <h1>Admin Panel</h1>
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
                    <i className="fa fa-user-circle"></i> {t("admin-profile_title")}
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
                    <FaSignOutAlt style={{marginTop: "8px"}}/> {t("admin-profile_info_icon")}
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
                  <b>{t("admin-profile_email")} </b>
                  tourconnectweb@gmail.com
                  {/* {admin.email} */}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
      <ExploreNature />
    </>
  )
}

export default AdminPanel