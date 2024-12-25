import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaUsers, FaEnvelope, FaTachometerAlt } from "react-icons/fa";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    // Toggle collapsed class on page content to adjust width
    document
      .querySelector(".page-content")
      .classList.toggle("collapsed-content", !isCollapsed);
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <h2 className="logo">{!isCollapsed && "AIMS"}</h2>
        <FaBars className="toggle-btn" onClick={toggleSidebar} />
      </div>
      <ul className="menu-items">
        <li>
          <Link to="/dashboard">
            <FaTachometerAlt className="icon" />
            {!isCollapsed && <span>Dashboard</span>}
          </Link>
        </li>
        <li>
          <Link to="/users">
            <FaUsers className="icon" />
            {!isCollapsed && <span>Users</span>}
          </Link>
        </li>
        <li>
          <Link to="/message">
            <FaEnvelope className="icon" />
            {!isCollapsed && <span>Message</span>}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
