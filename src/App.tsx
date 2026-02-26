import { Routes, Route } from "react-router-dom";
import Dashboard from "./core/Dashboard";
import NotFound from "./core/NotFound";
import AppBar from "./core/Appbar";
import Profile from "./core/Profile";
import Project from "./core/project/index";

function App() {
    return (
        <div>
            <Routes>
                <Route path="/dashboard" element={<><AppBar /><Dashboard /></>} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/project" element={<><AppBar /><Project /></>} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
}


export default App
