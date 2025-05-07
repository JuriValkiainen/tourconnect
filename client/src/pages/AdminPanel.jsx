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
        console.error("Ошибка при получении данных:", error);
      }
    };

    fetchData();
  }, [token, navigate]);

  return (
    <>
    <div className="w3-container" style={{ background: "#f2f2f2", minHeight: "100vh", paddingTop: "32px" }}>
      <h1 className="w3-center">{t("admin-panel_title") || "Admin Panel"}</h1>

      {/* Tab Links */}
      <div className="w3-row w3-margin-top">
        <div onClick={() => setActiveTab("admin")} className={`w3-third tablink w3-bottombar w3-hover-light-grey w3-padding ${activeTab === "admin" ? "w3-border-blue" : ""}`}>
          {t("admin-tab") || "Админ"}
        </div>
        <div onClick={() => setActiveTab("subscribers")} className={`w3-third tablink w3-bottombar w3-hover-light-grey w3-padding ${activeTab === "subscribers" ? "w3-border-blue" : ""}`}>
          {t("subscribers-tab") || "Подписчики"}
        </div>
        <div onClick={() => setActiveTab("messages")} className={`w3-third tablink w3-bottombar w3-hover-light-grey w3-padding ${activeTab === "messages" ? "w3-border-blue" : ""}`}>
          {t("messages-tab") || "Обращения"}
        </div>
      </div>

      {/* Tab Contents */}
      <div className="w3-container w3-white w3-padding w3-round-large w3-margin-top">
        {activeTab === "admin" && (
          <div>
            <h3>{t("admin-profile_title") || "Профиль администратора"}</h3>
            <p><strong>{t("admin-profile_email") || "Email"}:</strong> {adminEmail}</p>
            <button onClick={handleLogout} className="w3-button w3-red w3-margin-top">
              <FaSignOutAlt /> {t("logout") || "Выход"}
            </button>
          </div>
        )}

        {activeTab === "subscribers" && (
          <div>
            <h3>{t("subscribers-tab") || "Подписчики"}</h3>
            {subscribers.length === 0 ? (
              <p>{t("no-subscribers") || "Нет подписчиков."}</p>
            ) : (
              <table className="w3-table-all w3-hoverable">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>{t("first-name") || "Имя"}</th>
                    <th>{t("last-name") || "Фамилия"}</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((sub) => (
                    <tr key={sub.subscribID}>
                      <td>{sub.subscribID}</td>
                      <td>{sub.email}</td>
                      <td>{sub.firstName}</td>
                      <td>{sub.lastName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === "messages" && (
          <div>
            <h3>{t("messages-tab") || "Обращения"}</h3>
            {messages.length === 0 ? (
              <p>{t("no-messages") || "Нет сообщений."}</p>
            ) : (
              <table className="w3-table-all w3-hoverable">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>{t("first-name") || "Имя"}</th>
                    <th>{t("last-name") || "Фамилия"}</th>
                    <th>{t("message") || "Сообщение"}</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((msg) => (
                    <tr key={msg.contactID}>
                      <td>{msg.contactID}</td>
                      <td>{msg.email}</td>
                      <td>{msg.firstName}</td>
                      <td>{msg.lastName}</td>
                      <td>{msg.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
    <HeroImage/>
    </>
  );
};

export default AdminPanel;



// // import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// // import axios from "axios";
// import { FaSignOutAlt } from "react-icons/fa";
// import ExploreNature from "../components/ExploreNature";

// const AdminPanel = () => {
//     // const [admin, setAdmin] = useState([]);
//     // const [loading, setLoading] = useState(true);
//     // const [error, setError] = useState("");
//     const navigate = useNavigate();
//     const { t } = useTranslation();

//     const handleLogout = () => {
//         localStorage.removeItem("a-token"); // delete token from localStorage
//         navigate("/"); // redirect to login page
//     };
//     // useEffect(() => {
//     //     const fetchAdmin = async () => {
//     //         try {
//     //             const token = localStorage.getItem("a-token");
//     //             if (!token) {
//     //                 navigate("/admin-login");
//     //                 return;
//     //             }
//     //             const response = await axios.get(
//     //                 "http://localhost:5001/admin",
//     //                 {
//     //                     headers: {
//     //                         Authorization: `Bearer ${token}`,
//     //                     },
//     //                 }
//     //             );
//     //             setAdmin(response.data);
//     //             setLoading(false);
//     //         } catch (error) {
//     //             setError(error.message);
//     //             setLoading(false);
//     //         }
//     //     };
//     //     fetchAdmin();
//     // }, [navigate]);

//   return (
//     <>
//       <h1>Admin Panel</h1>
//       {/* Basic Information Section */}
//       <div
//         className="w3-container"
//         style={{
//           background: "linear-gradient(to right, #f5f7fa, #e4e8f0)",
//           minHeight: "100vh",
//           paddingTop: "32px",
//         }}
//       >
//         <div className="w3-content" style={{ maxWidth: "768px" }}>
//           {/* Profile Card - Modern Airy Design */}
//           <div
//             className="w3-card-4"
//             style={{
//               width: "100%",
//               margin: "0 auto 32px auto",
//               borderRadius: "12px",
//               overflow: "hidden",
//               boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
//               background: "white",
//             }}
//           >
//             <div
//               className="w3-padding"
//               style={{
//                 background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                 color: "white",
//               }}
//             >
//               <div className="w3-row">
//                 <div className="w3-col" style={{ maxWidth: "300px" }}>
//                   <h3>
//                     <i className="fa fa-user-circle"></i> {t("admin-profile_title")}
//                   </h3>
//                 </div>
//                 <div className="w3-rest w3-right-align">
//                   <button
//                     onClick={handleLogout}
//                     className="w3-button w3-round-large"
//                     style={{
//                       background: "rgba(255,255,255,0.2)",
//                       border: "1px solid rgba(255,255,255,0.4)",
//                     }}
//                   >
//                     <FaSignOutAlt style={{marginTop: "8px"}}/> {t("admin-profile_info_icon")}
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <div className="w3-padding">
//               <div
//                 className="w3-panel"
//                 style={{ borderLeft: "4px solid #667eea" }}
//               >
//                 <p>
//                   <b>{t("admin-profile_email")} </b>
//                   tourconnectweb@gmail.com
//                   {/* {admin.email} */}
//                 </p>
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>
//       <ExploreNature />
//     </>
//   )
// }

// export default AdminPanel