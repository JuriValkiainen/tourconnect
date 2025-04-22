import { useLocation } from "react-router-dom"
import NavigationBar from './components/NavigationBar.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import AppRoutes from "./routes.jsx"

import './App.css'

function App() {
  const location = useLocation();
  const showHeader = location.pathname === "/" || location.pathname.startsWith("/excursions");

  return (
      <div className="w3-light-grey">
        <NavigationBar />
        {showHeader && <Header />}
        <main>
          <AppRoutes /> {/* The current page is rendered here */}
        </main>
        <Footer />
      </div>
  )
}

export default App
