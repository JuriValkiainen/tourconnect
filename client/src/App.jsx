import NavigationBar from './components/NavigationBar.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import AppRoutes from "./routes.jsx";
import './App.css'


function App() {

  return (
      <div className="w3-light-grey">
        <NavigationBar />
        {location.pathname === "/" && <Header />}
        <main>
          <AppRoutes /> {/* Здесь рендерится текущая страница */}
        </main>
        <Footer />
      </div>
  )
}

export default App
