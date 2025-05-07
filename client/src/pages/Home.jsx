import React from "react";
import axios from "axios";
import Contact from "../components/Contact";
import Newsletter from "../components/Newsletter";
import GoodOffers from "../components/GoodOffers";
import ExploreNature from "../components/ExploreNature";

const Home = () => {

  return (
    <div className="w3-content" style={{ maxWidth: "1100px" }}>

      <GoodOffers />

      <ExploreNature />

      <Newsletter />

      <Contact />

      {/* <!-- End page content --> */}
    </div>
  );
};
export default Home;
