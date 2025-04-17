import { useNavigate } from 'react-router-dom';

const RouterLink = ({ to, children, className }) => {
    const navigate = useNavigate();
  
    return (
      <span 
        onClick={() => navigate(to)} 
        className={className}
        style={{ cursor: "pointer" }}
      >
        {children}
      </span>
    );
  };

  export default RouterLink;