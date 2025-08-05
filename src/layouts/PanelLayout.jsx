import { Link, useLocation } from "react-router";

import DashboardIcon from "../components/icons/DashboardIcon";
import CameraIcon from "../components/icons/CameraIcon";
import UsersIcon from "../components/icons/UsersIcon";
import SectionIcon from "../components/icons/SectionIcon";
import CalendarIcon from "../components/icons/CalendarIcon";
import TimeIcon from "../components/icons/TimeIcon";
import CustomSearchInput from "../components/shared/CustomSearchInput";
import { formatJalaliDate, getTime } from "../utils/helper";
import GateIcon from '../components/icons/GateIcon';
import SettingsIcon from '../components/icons/SettingsIcon';

const PanelLayout = ({children}) => {
  const location = useLocation();
  return (
    <div className="panel-layout">
      <div className="panel-layout-sidebar">
        <Link to="/" className={location.pathname === "/" ? "panel-layout-button active" : "panel-layout-button"}>
          <DashboardIcon color={location.pathname === "/" ? "#E9F3FB" : "#1D1D1D"} />
           <span>داشبورد</span>
        </Link>
        <Link to="/cameras/display" className={location.pathname.startsWith("/cameras") ? "panel-layout-button active" : "panel-layout-button"}>
          <CameraIcon color={location.pathname.startsWith("/cameras") ? "#E9F3FB" : "#1D1D1D"}  />
           <span>دوربین ها</span>
        </Link>
        <Link to="/persons" className={location.pathname.startsWith("/persons") ? "panel-layout-button active" : "panel-layout-button"}>
          <UsersIcon color={location.pathname.startsWith("/persons") ? "#E9F3FB" : "#1D1D1D"}  />
           <span>کارمندان</span>
        </Link>
        <Link to="/managers" className={location.pathname.startsWith("/managers") ? "panel-layout-button active" : "panel-layout-button"}>
          <UsersIcon color={location.pathname.startsWith("/managers") ? "#E9F3FB" : "#1D1D1D"}  />
           <span>مدیرعامل ها</span>
        </Link>
        <Link to="/gates" className={location.pathname.startsWith("/gates") ? "panel-layout-button active" : "panel-layout-button"}>
          <GateIcon color={location.pathname.startsWith("/gates") ? "#E9F3FB" : "#1D1D1D"}  />
           <span>گیت ها</span>
        </Link>
        <Link to="/departments" className={location.pathname.startsWith("/departments") ? "panel-layout-button active" : "panel-layout-button"}>
          <SectionIcon color={location.pathname.startsWith("/departments") ? "#E9F3FB" : "#1D1D1D"}  />
           <span>بخش ها</span>
        </Link>
        <Link to="/settings" className={location.pathname.startsWith("/settings") ? "panel-layout-button active" : "panel-layout-button"}>
          <SettingsIcon color={location.pathname.startsWith("/settings") ? "#E9F3FB" : "#1D1D1D"}  />
           <span>تنظیمات</span>
        </Link>
        <div className="our-product">
          <img src="/logo_transparent.png" />
          <div>SMART CHECK</div>
        </div>
      </div>
      <div className="panel-layout-body">
        <div className="panel-layout-header">
          <div className="panel-header-section">
            <CalendarIcon />
            <span>{formatJalaliDate(new Date())}</span>
          </div>
          <div className="panel-header-section" style={{flex: 1}}>
            <TimeIcon />
            <span>{getTime(new Date())}</span>
          </div>
          {location.pathname === "/" && <CustomSearchInput placeholder="جستجو ..." />}
        </div>
        <div className="panel-layout-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PanelLayout;
