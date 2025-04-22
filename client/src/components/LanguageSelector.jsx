import React from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'fi', label: 'FIN', flag: 'https://flagcdn.com/32x24/fi.png' },
  { code: 'en', label: 'ENG', flag: 'https://flagcdn.com/32x24/gb.png' },
  { code: 'ru', label: 'RUS', flag: 'https://flagcdn.com/32x24/ru.png' },
];

const LanguageSelector = ({ changeLanguage }) => {
  const { i18n } = useTranslation();

  return (
    <div style={styles.wrapper}>
      {languages.map(({ code, flag }) => {
        const isActive = i18n.language.startsWith(code); // например: "fi-FI" → "fi"
        return (
          <button
            key={code}
            onClick={() => changeLanguage(code)}
            style={{
              ...styles.button,
              border: isActive ? '2px solid #f44336' : '2px solid transparent', // красная рамка активному
            }}
          >
            <img
              src={flag}
              alt={code}
              style={styles.flag}
            />
          </button>
        );
      })}
    </div>
  );
};

const size = 36;

const styles = {
  wrapper: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    overflow: 'hidden',
    padding: 0,
    background: 'transparent',
    cursor: 'pointer',
    transition: 'border 0.2s ease-in-out',
  },
  flag: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  }
};

export default LanguageSelector;