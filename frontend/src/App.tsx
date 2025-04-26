import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import Profile from "./components/profile/Profile"
import Auth from "./components/auth/Auth"
import Fb from "./components/callbacks/Fb"

function App() {
  return (
    <>
     <div className="bg">
      <Router>
         <Routes>
            <Route element={<Profile />} path="/profile" />
            <Route element={<Auth />} path="/auth" />
            <Route element={<Fb />} path="/facebook/callback" />
         </Routes>
      </Router>
     </div> 
    </>
  )
}

export default App
