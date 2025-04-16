import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Booking from "./pages/BookingForm";
import ExcursionList from "./pages/ExcursionList";
import Register from "./pages/Register";
import GuideRegister from "./pages/GuideRegister";
import GuideLogin from "./pages/GuideLogin";
import GuideDashboard from "./pages/GuideDashboard";
import ExcursionDetail from "./pages/ExcursionDetail";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import VerifyEmail from "./pages/VerifyEmail";


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/excursions" element={<ExcursionList />} />
      <Route path="/excursions/:id" element={<ExcursionDetail />} />
      <Route path="/guide-register" element={<GuideRegister />} />
      <Route path="/guide-login" element={<GuideLogin />} />
      <Route
        path="/guide-dashboard"
        element={
          <ProtectedRoute>
            <GuideDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
    </Routes>
  );
};

export default AppRoutes;