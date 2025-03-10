import NavigationBar  from './components/NavigationBar.jsx'
import Header from './components/Header.jsx'
import PageContent from './components/PageContent.jsx'
import Footer from './components/Footer.jsx'
import './App.css'

function App() {

  return (
    <>
      <div className='w3-light-grey'>
        <NavigationBar />
        <Header />
        <PageContent />
        <Footer />
      </div>
    </>
  )
}

export default App
