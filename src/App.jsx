import { Routes, Route } from "react-router-dom"
import CreateApartment from "./components/pages/CreateApartment"
import Home from "./components/pages/Home"
import Profile from "./components/pages/Profile"
import About from "./components/pages/About"
import Feedback from "./components/pages/Feedback"
import ApartmentDetails from "./components/pages/ApartmentDetails"
function App() {

  return (
    <> 
      <Routes>
        <Route index element={<Home />} />
        <Route path="/create" element={<CreateApartment />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/apartment/:id" element={<ApartmentDetails />} />
      </Routes>
    </>
  )
}

export default App
