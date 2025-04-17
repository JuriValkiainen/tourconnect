import React from "react";

const ExploreNature = () => {
  return (
    <>
      <div className="w3-container">
        <h3>Explore Nature</h3>
        <p>Travel with us and see nature at its finest.</p>
      </div>
      <div className="w3-row-padding">
        <div className="w3-half w3-margin-bottom">
          <img
            src="https://www.w3schools.com/w3images/ocean2.jpg"
            alt="Norway"
            style={{ width: "100%" }}
          />
          <div className="w3-container w3-white">
            <h3>West Coast, Norway</h3>
            <p className="w3-opacity">Roundtrip from $79</p>
            <p>Praesent tincidunt sed tellus ut rutrum sed vitae justo.</p>
            <button className="w3-button w3-margin-bottom">Buy Tickets</button>
          </div>
        </div>
        <div className="w3-half w3-margin-bottom">
          <img
            src="https://www.w3schools.com/w3images/mountains2.jpg"
            alt="Austria"
            style={{ width: "100%" }}
          />
          <div className="w3-container w3-white">
            <h3>Mountains, Austria</h3>
            <p className="w3-opacity">One-way from $39</p>
            <p>Praesent tincidunt sed tellus ut rutrum sed vitae justo.</p>
            <button className="w3-button w3-margin-bottom">Buy Tickets</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExploreNature;
