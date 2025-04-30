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
import Blog from "./pages/Blog";
import Reviews from "./pages/Reviews";
import GuideSupport from "./pages/GuideSupport";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";


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
      <Route path="/blog" element={<Blog />} />
      <Route path="/reviews" element={<Reviews />} />
      <Route path="/guide-support" element={<GuideSupport />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-panel" element={<AdminPanel />} />
    </Routes>
  );
};

export default AppRoutes;