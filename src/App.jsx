import { BrowserRouter, Route, Routes } from "react-router";

import DashboardPage from "./pages/DashboardPage";
import CamerasPage from "./pages/Camera/CamerasPage";
import PersonsPage from "./pages/Person/PersonsPage";
import AddPersonPage from "./pages/Person/AddPersonPage";
import DepartmentsPage from "./pages/Department/DepartmentsPage";
import PanelLayout from "./layouts/PanelLayout";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "./reducers/userReducer";
import { decode_token } from "./utils/auth";
import { ToastContainer } from "react-toastify";
import GatesPage from "./pages/Gate/GatesPage";
import AddDepartmentPage from "./pages/Department/AddDepartmentPage";
import AddCameraPage from "./pages/Camera/AddCameraPage";
import AddGatePage from './pages/Gate/AddGatePage';
import EditGatePage from "./pages/Gate/EditGatePage";
import EditDepartmentPage from "./pages/Department/EditDepartmentPage";
import DisplayCamerasPage from './pages/Camera/DisplayCamerasPage';
import EditCameraPage from "./pages/Camera/EditCameraPage";
import EditPersonPage from './pages/Person/EditPersonPage';
import SettingsPage from "./pages/Settings/SettingsPage";
import ManagersPage from './pages/Manager/ManagersPage';
import AddManagerPage from './pages/Manager/AddManagerPage';
import EditManagerPage from './pages/Manager/EditManagerPage';
import AlarmsPage from "./pages/Alarm/AlarmsPage";

const App = () => {
  const [isReady, setIsReady] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) dispatch(addUser(decode_token(token)));
    setIsReady(true);
  }, []);

  if (!isReady) return null;

  return (
    <BrowserRouter>
      <PanelLayout>
        <Routes>
          <Route path="/" Component={DashboardPage} />
          {/* Alarm */}
          <Route path="/alarms" Component={AlarmsPage} />
          {/* Camera */}
          <Route path="/cameras/display" Component={DisplayCamerasPage} />
          <Route path="/cameras" Component={CamerasPage} />
          <Route path="/cameras/add" Component={AddCameraPage} />
          <Route path="/cameras/edit/:cameraId" Component={EditCameraPage} />
          {/* Department */}
          <Route path="/departments" Component={DepartmentsPage} />
          <Route path="/departments/add" Component={AddDepartmentPage} />
          <Route path="/departments/edit/:departmentId" Component={EditDepartmentPage} />
          {/* Person */}
          <Route path="/persons" Component={PersonsPage} />
          <Route path="/persons/add" Component={AddPersonPage} />
          <Route path="/persons/edit/:personId" Component={EditPersonPage} />
          {/* Manager */}
          <Route path="/managers" Component={ManagersPage} />
          <Route path="/managers/add" Component={AddManagerPage} />
          <Route path="/managers/edit/:personId" Component={EditManagerPage} />
          {/* Gate */}
          <Route path="/gates" Component={GatesPage} />
          <Route path="/gates/add" Component={AddGatePage} />
          <Route path="/gates/edit/:gateId" Component={EditGatePage} />
          {/* Settings */}
          <Route path="/settings" Component={SettingsPage} />
        </Routes>
        <ToastContainer />
      </PanelLayout>
    </BrowserRouter>
  );
};

export default App;
