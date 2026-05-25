import { NavLink } from "react-router-dom";
import {
  Sprout,
  Database,
  Settings,
  Home as HomeIcon,
  Info,
  LayoutDashboard,
  FileText,
  BarChart3,
} from "lucide-react";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="brand">
        <div className="brand-icon-wrap">
          <Sprout size={22} />
        </div>
        <span>SmartFarm</span>
      </div>

      <div className="nav-links">
        <NavLink to="/">
          <HomeIcon size={16} />
          Home
        </NavLink>

        <NavLink to="/dashboard">
          <LayoutDashboard size={16} />
          Dashboard
        </NavLink>

        <NavLink to="/data-sensor">
          <Database size={16} />
          Data Sensor
        </NavLink>

        <NavLink to="/control">
          <Settings size={16} />
          Control Panel
        </NavLink>

        <NavLink to="/report">
          <FileText size={16} />
          Report
        </NavLink>

        <NavLink to="/comparison">
          <BarChart3 size={16} />
          Comparison
        </NavLink>

        <NavLink to="/about">
          <Info size={16} />
          About
        </NavLink>
      </div>

      <div className="nav-live">
        <span className="nav-live-dot" />
        <span className="nav-live-txt">Live</span>
      </div>
    </nav>
  );
}

export default Navbar;