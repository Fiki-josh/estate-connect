import { Routes, Route } from "react-router-dom"
import CreateApartment from "./components/pages/CreateApartment"
import Home from "./components/pages/Home"
import Profile from "./components/pages/Profile"
function App() {

  return (
    <> 
      <Routes>
        <Route index element={<Home />} />
        <Route path="/create" element={<CreateApartment />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  )
}

export default App
