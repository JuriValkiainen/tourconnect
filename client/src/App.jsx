import { useLocation } from "react-router-dom"
// import { useTranslation } from 'react-i18next'
import NavigationBar from './components/NavigationBar.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import AppRoutes from "./routes.jsx"

import './App.css'

function App() {
  const location = useLocation();
  // const { i18n } = useTranslation()
  const showHeader = location.pathname === "/" || location.pathname.startsWith("/excursions");
  // const changeLanguage = (lang) => {
  //   i18n.changeLanguage(lang);
  // };
  return (
      <div className="w3-light-grey">
        <NavigationBar />
        {showHeader && <Header />}
        <main>
          <AppRoutes /> {/* Здесь рендерится текущая страница */}
        </main>
        <Footer />
      </div>
  )
}

export default App
