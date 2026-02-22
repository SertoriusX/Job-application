
import Navbar from './components/navbar'
import { Outlet } from 'react-router-dom'
import Footer from './components/Footer'
import MainContent from './components/MainContent'
function App() {

  return (
    <>
     <Navbar/>
     <Outlet />
     <MainContent/>
     <Footer/>
    </>
  )
}

export default App
