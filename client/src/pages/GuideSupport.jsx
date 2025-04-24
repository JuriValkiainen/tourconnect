import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const GuideSupportPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('faq');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // Example FAQ items
//   const faqItems = [
//     {
//       question: "Как забронировать тур?",
//       answer: "Вы можете забронировать тур непосредственно на нашем сайте через форму бронирования или связаться с нами по телефону/email для индивидуального подбора."
//     },
//     {
//       question: "Какие документы нужны для поездки?",
//       answer: "Для большинства туров требуется только паспорт. В некоторые страны может понадобиться виза. Мы предоставляем полный список необходимых документов после бронирования."
//     },
//     {
//       question: "Можно ли изменить даты поездки после бронирования?",
//       answer: "Да, в большинстве случаев это возможно. Пожалуйста, свяжитесь с нами как можно раньше для внесения изменений."
//     },
//     {
//       question: "Есть ли скидки для групп?",
//       answer: "Да, мы предоставляем специальные условия для групповых бронирований от 5 человек. Свяжитесь с нами для уточнения деталей."
//     }
//   ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can send the form data to your backend or perform any other actions
    alert('Your form has been submitted!');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="w3-container w3-padding-32">
      <h1 className="w3-center w3-text-red">{t('guideSupport_title')}</h1>
      <p className="w3-center w3-large">{t('guideSupport_description')}</p>
      
      {/* Tabs */}
      <div className="w3-bar w3-light-grey w3-card">
        <button 
          className={`w3-bar-item w3-button ${activeTab === 'faq' ? 'w3-red' : ''}`} 
          onClick={() => setActiveTab('faq')}
        >
          {t('guideSupport_tabs_1')}
        </button>
        <button 
          className={`w3-bar-item w3-button ${activeTab === 'contacts' ? 'w3-red' : ''}`} 
          onClick={() => setActiveTab('contacts')}
        >
          {t('guideSupport_tabs_2')}
        </button>
        <button 
          className={`w3-bar-item w3-button ${activeTab === 'support' ? 'w3-red' : ''}`} 
          onClick={() => setActiveTab('support')}
        >
          {t('guideSupport_tabs_3')}
        </button>
      </div>
      
      {/* Tabs Content */}
      <div className="w3-container w3-card w3-white w3-padding-16 w3-margin-top">
        {/* Tab FAQ */}
        {activeTab === 'faq' && (
          <div className="w3-container">
            <h2 className="w3-text-red">{t('guideSupport_faqItems_title')}</h2>
            <div className="w3-panel w3-border-bottom">
                <h4>{t('guideSupport_faqItems_q1')}</h4>
                <p>{t('guideSupport_faqItems_a1')}</p>
            </div>
            <div className="w3-panel w3-border-bottom">
                <h4>{t('guideSupport_faqItems_q2')}</h4>
                <p>{t('guideSupport_faqItems_a2')}</p>
            </div>
            <div className="w3-panel w3-border-bottom">
                <h4>{t('guideSupport_faqItems_q3')}</h4>
                <p>{t('guideSupport_faqItems_a3')}</p>
            </div>
            <div className="w3-panel w3-border-bottom">
                <h4>{t('guideSupport_faqItems_q4')}</h4>
                <p>{t('guideSupport_faqItems_a4')}</p>
            </div>
            {/* {faqItems.map((item, index) => (
              <div key={index} className="w3-panel w3-border-bottom">
                <h4>{item.question}</h4>
                <p>{item.answer}</p>
              </div>
            ))} */}
          </div>
        )}
        
        {/* Tab Contacts */}
        {activeTab === 'contacts' && (
        <div className="w3-container">
            <h2 className="w3-text-red">{t('guideSupport_tabContacts_title')}</h2>
            <div className="w3-row-padding">
            <div className="w3-half">
                <h4>{t('guideSupport_tabContacts_phones')}</h4>
                <p><i className="fa fa-phone w3-text-red"></i> +358 40 123 4567</p>
                <p><i className="fa fa-phone w3-text-red"></i> +358 50 987 6543</p>
                
                <h4 className="w3-margin-top">{t('guideSupport_tabContacts_email')}</h4>
                <p><i className="fa fa-envelope w3-text-red"></i> tourconnectweb@gmail.com</p>
            </div>
            <div className="w3-half">
                <h4>{t('guideSupport_tabContacts_openHours')}</h4>
                <p>{t('guideSupport_tabContacts_openHours_mo')} 9:00 - 20:00</p>
                <p>{t('guideSupport_tabContacts_openHours_sat')} 10:00 - 18:00</p>
                
                <h4 className="w3-margin-top">{t('guideSupport_tabContacts_office')}</h4>
                <p><i className="fa fa-map-marker w3-text-red"></i> Hevosenkengänkatu 2, Porvoo, Suomi</p>
            </div>
            </div>
            <div className="w3-margin-top">
            <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1960.847858925458!2d25.6581433159294!3d60.39366098204486!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4691f5d5182ac701%3A0x4d708dd7d7d60249!2sHevosenkeng%C3%A4nkatu%202%2C%2006100%20Porvoo!5e0!3m2!1sen!2sfi!4v1650000000000!5m2!1sen!2sfi" 
                width="100%" 
                height="300" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy"
                title="Kartta"
            ></iframe>
            </div>
        </div>
        )}
        
        {/* Tab Support */}
        {activeTab === 'support' && (
          <div className="w3-container">
            <h2 className="w3-text-red">{t('guideSupport_tabSupport_title')}</h2>
            <form onSubmit={handleSubmit}>
              <div className="w3-row-padding w3-margin-bottom">
                <div className="w3-half">
                  <label>{t('guideSupport_tabSupport_name')}</label>
                  <input 
                    className="w3-input w3-border" 
                    type="text" 
                    name="name" 
                    value={formData.name}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="w3-half">
                  <label>{t('guideSupport_tabSupport_email')}</label>
                  <input 
                    className="w3-input w3-border" 
                    type="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>
              <div className="w3-margin-bottom">
                <label>{t('guideSupport_tabSupport_subject')}</label>
                <input 
                  className="w3-input w3-border" 
                  type="text" 
                  name="subject" 
                  value={formData.subject}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div className="w3-margin-bottom">
                <label>{t('guideSupport_tabSupport_message')}</label>
                <textarea 
                  className="w3-input w3-border" 
                  name="message" 
                  rows="5" 
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
              <button type="submit" className="w3-button w3-red w3-round-large">
              {t('guideSupport_tabSupport_btn')}
              </button>
            </form>
          </div>
        )}
      </div>
      
      {/* Emergency Support */}
      <div className="w3-panel w3-red w3-card w3-padding-16 w3-margin-top">
        <h3>{t('guideSupport_emergency_support')}</h3>
        <p>{t('guideSupport_emergency_support_text')}</p>
        <p className="w3-large"><i className="fa fa-phone"></i> +7 (800) 123-45-67</p>
      </div>
    </div>
  );
};

export default GuideSupportPage;