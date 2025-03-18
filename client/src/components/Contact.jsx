const Contact = () => {
  return (
    <div className="w3-container">
        <h2>Contact</h2>
        <p>Let us book your next trip!</p>
        <i className="fa fa-map-marker" style={{ width: "30px" }}></i> Chicago,
        US
        <br />
        <i className="fa fa-phone" style={{ width: "30px" }}></i> Phone: +00
        151515
        <br />
        <i className="fa fa-envelope" style={{ width: "30px" }}>
          {" "}
        </i>{" "}
        Email: mail@mail.com
        <br />
        <form action="/action_page.php" target="_blank">
          <p>
            <input
              className="w3-input w3-padding-16 w3-border"
              type="text"
              placeholder="Name"
              required
              name="Name"
            />
          </p>
          <p>
            <input
              className="w3-input w3-padding-16 w3-border"
              type="text"
              placeholder="Email"
              required
              name="Email"
            />
          </p>
          <p>
            <input
              className="w3-input w3-padding-16 w3-border"
              type="text"
              placeholder="Message"
              required
              name="Message"
            />
          </p>
          <p>
            <button
              className="w3-button w3-black w3-padding-large"
              type="submit"
            >
              SEND MESSAGE
            </button>
          </p>
        </form>
      </div>
  )}
  export default Contact;