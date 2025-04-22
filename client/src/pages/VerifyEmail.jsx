import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [verificationStatus, setVerificationStatus] = useState('Проверка...');
  const navigate = useNavigate();

  useEffect(() => {
    console.log("URL with token:", window.location.href);
  }, []);

  useEffect(() => {
    if (token) {
      const verifyToken = async () => {
        try {
          console.log("We check the token in the VerifyEmail function:", token);
          const response = await axios.get('http://localhost:5001/verify-email', {
            params: { token }
          });
      
          if (response.status === 200) {
            setVerificationStatus('Email successfully verified!');
            setTimeout(() => {
              navigate('/profile');
            }, 3000);
          } else {
            setVerificationStatus(`Assertion error: ${response.data.error || 'Invalid token'}`);
          }
        } catch (error) {
          console.error('Error verifying email:', error);
          setVerificationStatus('An error occurred during verification.');
        }
      };

      verifyToken();
    } else {
      setVerificationStatus('Invalid verification link.');
    }
  }, [token, navigate]);

  return (
    <div className="w3-container w3-padding-64 w3-center">
      <h1>Email confirmation</h1>
      <p>{verificationStatus}</p>
    </div>
  );
};

export default VerifyEmail;