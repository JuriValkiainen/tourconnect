import React from 'react';
import { useTranslation } from 'react-i18next';

const ReviewsPage = () => {
  const { t } = useTranslation();
  
  return (
    <div className="w3-container w3-padding-32">
      <h1 className="w3-center w3-text-red">{t('reviews_title')}</h1>
      
      <div className="w3-row-padding w3-margin-top">
        {/* Review 1 */}
        <div className="w3-col m6 w3-margin-bottom">
          <div className="w3-card w3-white w3-padding">
            <div className="w3-container w3-padding">
              <div className="w3-left w3-margin-right">
                <img 
                  src="https://th.bing.com/th/id/OIP.P1Y8gdcyGOxsFdIMgsngowHaHa?w=171&h=180&c=7&r=0&o=5&dpr=2.5&pid=1.7" 
                  alt="Emily traveler" 
                  className="w3-circle"
                  style={{ width: "80px" }}
                />
              </div>
              <h4>Emily Johnson</h4>
              <p className="w3-opacity">04 April 2024</p>
              <div className="w3-row">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="w3-text-red">★</span>
                ))}
              </div>
            </div>
            <div className="w3-container">
            <p>Perfect vacation! Everything was well organized, the sights were breathtaking. 
            Special thanks to our guide Maria for making the trip so memorable. Can't wait to come back!</p>
            </div>
          </div>
        </div>
        {/* Review 2 */}
        <div className="w3-col m6 w3-margin-bottom">
          <div className="w3-card w3-white w3-padding">
            <div className="w3-container w3-padding">
              <div className="w3-left w3-margin-right">
                <img 
                  src="https://th.bing.com/th/id/OIP.zCuMlQBgjsvzOSWpqg6GDAHaHa?w=188&h=188&c=7&r=0&o=5&dpr=2.5&pid=1.7" 
                  alt="Anna traveler" 
                  className="w3-circle"
                  style={{ width: "80px" }}
                />
              </div>
              <h4>Анна Петрова</h4>
              <p className="w3-opacity">15 мая 2023</p>
              <div className="w3-row">
                {[...Array(4)].map((_, i) => (
                  <span key={i} className="w3-text-red">★</span>
                ))}
              </div>
            </div>
            <div className="w3-container">
              <p>Отличный тур! Гид был очень знающим, показал нам все самые интересные места. 
              Отель превзошел все ожидания. Обязательно порекомендую друзьям!</p>
            </div>
          </div>
        </div>
        
        {/* Review 3 */}
        <div className="w3-col m6 w3-margin-bottom">
          <div className="w3-card w3-white w3-padding">
            <div className="w3-container w3-padding">
              <div className="w3-left w3-margin-right">
                <img 
                  src="https://sneg.top/uploads/posts/2023-06/1687526204_sneg-top-p-avatarki-dlya-tg-muzhskie-instagram-3.jpg" 
                  alt="Mikko traveler" 
                  className="w3-circle"
                  style={{ width: "80px" }}
                />
              </div>
              <h4>Mikko Korhonen </h4>
              <p className="w3-opacity">9 marraskuuta 2024</p>
              <div className="w3-row">
                {[...Array(4)].map((_, i) => (
                  <span key={i} className="w3-text-red">★</span>
                ))}
                <span className="w3-text-grey">★</span>
              </div>
            </div>
            <div className="w3-container">
            <p>Erinomainen loma! Kaikki oli hyvin organisoitu, nähtävyydet olivat henkeäsalpaavia. 
            Erityinen kiitos oppaallemme Liisalle, joka teki matkasta niin muistettavan. En malta odottaa seuraavaa matkaa!</p>
            </div>
          </div>
        </div>

        {/* Review 4 */}
        <div className="w3-col m6 w3-margin-bottom">
          <div className="w3-card w3-white w3-padding">
            <div className="w3-container w3-padding">
              <div className="w3-left w3-margin-right">
                <img 
                  src="https://th.bing.com/th/id/OIP.9-PWZZaIdXGtJBR2GY9PvQHaHa?w=203&h=204&c=7&r=0&o=5&dpr=2.5&pid=1.7" 
                  alt="Ivan traveler" 
                  className="w3-circle"
                  style={{ width: "80px" }}
                />
              </div>
              <h4>Иван Сидоров</h4>
              <p className="w3-opacity">2 июня 2023</p>
              <div className="w3-row">
                {[...Array(4)].map((_, i) => (
                  <span key={i} className="w3-text-red">★</span>
                ))}
                <span className="w3-text-grey">★</span>
              </div>
            </div>
            <div className="w3-container">
              <p>Хорошая организация, но питание могло бы быть разнообразнее. 
              Экскурсии были познавательными, гид отвечал на все вопросы.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="w3-center w3-margin-top">
        <button className="w3-button w3-red w3-round-large">
          {t('reviews_btn_leave_review')}
        </button>
      </div>
    </div>
  );
};

export default ReviewsPage;