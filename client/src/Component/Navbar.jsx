import React, { useState } from 'react';
import {
    FaTh,
    FaBars,
    FaUserAlt,
    FaCog,
    FaThList,
    FaFileMedical ,
    FaHome,
    FaSignOutAlt
} from "react-icons/fa";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { FcAbout, FcSupport } from "react-icons/fc";
import { MdContactPhone } from "react-icons/md";
import toast from 'react-hot-toast';
import { NavLink } from 'react-router-dom';

const Navbar = ({ children, setToken }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    const token = localStorage.getItem('token');

    // Define menu items with updated icons
    const menuItem = [
        {path:"/",name:"Home",icon:<FaHome/>},
        { path: "/dashboard", name: "Dashboard", icon: <FaTh /> },
        { path: "/invoices", name: "Invoices", icon: <FaThList /> },
        { path: "/new-invoice", name: "New Invoice", icon: <FaFileMedical /> },
        { path: "/profile", name: "Settings", icon: <FaCog /> },
        { path: "/about", name: "About", icon: <FcAbout /> },
        { path: "/contact", name: "Contact", icon: <MdContactPhone /> },
        { path: "/login", name: "Login", icon: <FaUserAlt /> },
        { path: "/payment-details", name: "Payment Details", icon: <FaThList /> },
        { path: "/support", name: "Support", icon: <FcSupport /> }
    ];

    // Filter menu items based on authentication status
    const filteredMenu = token
    ? menuItem.filter(item => !["/", "/login", "/about", "/contact"].includes(item.path)) // Exclude "Home", "About", and "Contact" if token is present
    : menuItem.filter(item =>
        !["/dashboard", "/invoices", "/new-invoice", "/profile", "/support","/payment-details"].includes(item.path) // Hide restricted items if no token
    );

    const logOut = () => {
        localStorage.clear();
        toast.success("Logout successful", { position: "top-center" });
        setToken(null); // Update token state to null
    };

    return (
        <div className="container">
            <div style={{ width: isOpen ? "250px" : "50px" }} className="sidebar">
                <div className="top_section">
                    <h1 style={{ display: isOpen ? "block" : "none" }} className="logo">AIMS</h1>
                    <div style={{ marginLeft: isOpen ? "0px" : "0px" }} className="bars">
                        <FaBars onClick={toggle} />
                    </div>
                </div>
                {/* Render filtered menu items */}
                {filteredMenu.map((item, index) => (
                    <NavLink to={item.path} key={index} className="link" activeclassname="active">
                        <div className="icon">{item.icon}</div>
                        <div style={{ display: isOpen ? "block" : "none" }} className="link_text">{item.name}</div>
                    </NavLink>
                ))}
                {/* Show Logout only if user is authenticated */}
                {token && (
                    <div className="logout-main">
                        <div className="logout-icon" onClick={logOut}><RiLogoutBoxRLine /></div>
                        <div style={{ display: isOpen ? "block" : "none" }}>
                            <button onClick={logOut} className="logout">Logout <FaSignOutAlt /></button>
                        </div>
                    </div>
                )}
            </div>
            <main>{children}</main>
        </div>
    );
};

export default Navbar;
