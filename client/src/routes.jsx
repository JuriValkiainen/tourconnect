import { Route, Routes } from 'react-router-dom';
import Home from "./pages/Home";
import Booking from "./pages/BookingForm";
import ExcursionList from "./pages/ExcursionList";
import Register from "./pages/Register";
import GuideRegister from "./pages/GuideRegister";
import GuideDashboard from "./pages/GuideDashboard";
import ExcursionDetail from "./pages/ExcursionDetail";
import Login from "./pages/Login";


const AppRoutes = () => {
    return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/excursions" element={<ExcursionList />} />
        <Route path="/excursions/:id" element={<ExcursionDetail />} />
        <Route path="/guide-dashboard" element={<GuideDashboard />} />
        <Route path="/guide-register" element={<GuideRegister />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    );
  };

export default AppRoutes;