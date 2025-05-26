import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import Profile from "./components/profile/Profile"
import Auth from "./components/auth/Auth"
import Fb from "./components/callbacks/Fb"
import { Yt } from "./components/callbacks/Yt"
import X from "./components/callbacks/X"

function App() {
  return (
    <>
     <div className="bg">
      <Router>
         <Routes>
            <Route element={<Profile />} path="/profile" />
            <Route element={<Auth />} path="/auth" />
            <Route element={<Fb />} path="/facebook/callback" />
            <Route element={<Yt />} path="/youtube/callback" />
            <Route element={<X />} path="/x/callback" />
         </Routes>
      </Router>
     </div> 
    </>
  )
}

export default App
