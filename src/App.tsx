import { Routes, Route } from "react-router-dom";
import Dashboard from "./core/Dashboard";
import NotFound from "./core/NotFound";
import AppBar from "./core/Appbar";
import Profile from "./core/Profile";
import Project from "./core/project/index";
import { Login } from "./core/Login";
import { Toaster } from "./components/ui/sonner";
import ConfigSection from "./core/project/Config";
import { Workflow } from "./core/project/Workflow";
import DeviceAuthorizationPage from "./core/cli/DeviceAuth";
import DeviceApprovalPage from "./core/cli/ApprovePage";




function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<><AppBar /><Dashboard /></>} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/project" element={<><AppBar /><Project /></>} />
                <Route path="/login" element={<Login />} />
                <Route path="/configure" element={< ConfigSection />} />
                <Route path="/workflow" element={<Workflow />} />
                <Route path="/device" element={<DeviceAuthorizationPage />} />
                <Route path="/device/approve" element={<DeviceApprovalPage />} />

                <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
        </div>

    );
}


export default App
