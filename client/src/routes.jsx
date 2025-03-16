import { Route, Routes } from 'react-router-dom';
import Home from "./pages/Home";
import Booking from "./pages/BookingForm";
import ExcursionList from "./pages/ExcursionList";
import Register from "./pages/Register";
import GuideRegister from "./pages/GuideRegister";
import GuideDashboard from "./pages/GuideDashboard";
// import CitySelection from "./pages/CitySelection";
// import ExcursionTypes from "./pages/ExcursionTypes";

const AppRoutes = () => {
    return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/excursions" element={<ExcursionList />} />
        <Route path="/guide-dashboard" element={<GuideDashboard />} />
        <Route path="/guide-register" element={<GuideRegister />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/city-selection" element={<CitySelection />} />
        <Route path="/excursion-types" element={<ExcursionTypes />} /> */}
      </Routes>
    );
  };

export default AppRoutes;