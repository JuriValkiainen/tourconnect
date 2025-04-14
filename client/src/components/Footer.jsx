const Footer = () => {
  return (
    <footer className="w3-container w3-center w3-opacity w3-margin-bottom">
      <h5>Find Us On</h5>
      <div className="w3-xlarge w3-padding-16">
      <i className="fab fa-facebook"></i>
      <i className="fab fa-instagram"></i>
      <i className="fab fa-snapchat"></i>
      <i className="fab fa-pinterest"></i>
      <i className="fab fa-twitter"></i>
      <i className="fab fa-linkedin"></i>
      </div>
      <p>
        Powered by{" "}
        <a
          href="https://www.w3schools.com/w3css/default.asp"
          target="_blank"
          className="w3-hover-text-green"
        >
          w3.css
        </a>
      </p>
    </footer>
  );
};
export default Footer;
