
const Button = ({ children, onClick  }) => {
    return <button className="w3-bar-item w3-red"onClick={onClick}>
      {children}
    </button>
  };

export default Button;
