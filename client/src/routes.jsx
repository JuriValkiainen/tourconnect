import { Route, Routes } from 'react-router-dom';
import Home from "./pages/Home";
// import CitySelection from "./pages/CitySelection";
// import ExcursionTypes from "./pages/ExcursionTypes";
// import ExcursionList from "./pages/ExcursionList";
// import Booking from "./pages/Booking";
// import Register from "./pages/Register";
// import GuideRegister from "./pages/GuideRegister";
// import GuideDashboard from "./pages/GuideDashboard";

const AppRoutes = () => {
    return (
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/city-selection" element={<CitySelection />} />
        <Route path="/excursion-types" element={<ExcursionTypes />} />
        <Route path="/excursions" element={<ExcursionList />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/register" element={<Register />} />
        <Route path="/guide-register" element={<GuideRegister />} />
        <Route path="/guide-dashboard" element={<GuideDashboard />} /> */}
      </Routes>
    );
  };

export default AppRoutes;