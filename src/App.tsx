import { Routes, Route } from "react-router-dom";
import Dashboard from "./core/Dashboard";
import NotFound from "./core/NotFound";
import AppBar from "./core/Appbar";
import Profile from "./core/Profile";
import Project from "./core/project/index";
import { Login } from "./core/Login";
import { Toaster } from "./components/ui/sonner";
import { LiveDeployTerminal } from "./Deploy";

function App() {
    return (
        <div>
            <Routes>
                <Route path="/dashboard" element={<><AppBar /><Dashboard /></>} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/project" element={<><AppBar /><Project /></>} />
                <Route path="/" element={<Login />} />
                <Route path="/deploy" element={
                    <LiveDeployTerminal
                        repo="Mahadi-rsio/minicloud_app"
                        branch="master"

                    />
                }
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
        </div>

    );
}


export default App
