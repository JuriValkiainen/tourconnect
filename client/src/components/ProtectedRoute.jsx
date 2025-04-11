import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("guideToken");

    if (!token) {
        return <Navigate to="/guide-login" replace />;
    }

    return children;
};

export default ProtectedRoute;
