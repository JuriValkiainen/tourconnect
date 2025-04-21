import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [verificationStatus, setVerificationStatus] = useState('Проверка...');
  const navigate = useNavigate();

  useEffect(() => {
    console.log("URL с токеном:", window.location.href);
  }, []);

  useEffect(() => {
    if (token) {
      const verifyToken = async () => {
        try {
          console.log("Проверяем токен в ф-ии VerifyEmail:", token);
          const response = await axios.get('http://localhost:5001/verify-email', {
            params: { token }
          });
      
          if (response.status === 200) {
            setVerificationStatus('Электронная почта успешно подтверждена!');
            setTimeout(() => {
              navigate('/profile');
            }, 3000);
          } else {
            setVerificationStatus(`Ошибка подтверждения: ${response.data.error || 'Неверный токен'}`);
          }
        } catch (error) {
          console.error('Ошибка при верификации email:', error);
          setVerificationStatus('Произошла ошибка при верификации.');
        }
      };

      verifyToken();
    } else {
      setVerificationStatus('Неверная ссылка верификации.');
    }
  }, [token, navigate]);

  return (
    <div className="w3-container w3-padding-64 w3-center">
      <h1>Подтверждение электронной почты</h1>
      <p>{verificationStatus}</p>
    </div>
  );
};

export default VerifyEmail;