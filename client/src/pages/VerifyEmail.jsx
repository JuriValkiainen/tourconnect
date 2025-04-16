import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [verificationStatus, setVerificationStatus] = useState('Проверка...');
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const verifyToken = async () => {
        try {
          const response = await fetch(`/api/auth/verify-email?token=${token}`);
          const data = await response.json();

          if (response.ok) {
            setVerificationStatus('Электронная почта успешно подтверждена!');
            // Опционально: перенаправить пользователя через несколько секунд
            setTimeout(() => {
              navigate('/login'); // Или на другую страницу, например, '/profile'
            }, 3000);
          } else {
            setVerificationStatus(`Ошибка подтверждения: ${data.error || 'Неверный токен'}`);
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