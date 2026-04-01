import React from "react";
import styles from "./Sidebar.module.css";
import {
  LayoutGrid,
  Box,
  PlusCircle,
  ScanLine,
  BarChart3,
  Bell,
  Settings,LogOut,
} from "lucide-react";
import tomatoIcon from "../../assets/icons/tomato.png";
import { NavLink,useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";


const Sidebar = () => {

    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return; // ⛔ don't call API without token

    const fetchUser = async () => {
        try {
        const res = await api.get("/auth/me");
        setUser(res.data);
        } catch (err) {
        console.error("Failed to fetch user", err);
        }
    };

    fetchUser();
    }, []);




    const handleLogout = () => {
    // clear auth data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // redirect to login
    navigate("/");
    };

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.brand}>
        <div className={styles.brandIcon}>
            <img src={tomatoIcon} alt="Food Expiry Vision" />
        </div>

        <div>
            <h3>Food Expiry</h3>
            <span>Vision</span>
        </div>
       </div>
       <div className={styles.navDivider}></div>


      {/* Menu */}
      <nav className={styles.menu}>
            <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                `${styles.item} ${isActive ? styles.active : ""}`
                }
            >
                <LayoutGrid size={18} />
                Dashboard
            </NavLink>

            <NavLink
                to="/inventory"
                className={({ isActive }) =>
                `${styles.item} ${isActive ? styles.active : ""}`
                }
            >
                <Box size={18} />
                Inventory
            </NavLink>

            <NavLink
                to="/add-item"
                className={({ isActive }) =>
                `${styles.item} ${isActive ? styles.active : ""}`
                }
            >
                <PlusCircle size={18} />
                Add Item
            </NavLink>

            <NavLink
                to="/scan-expiry"
                className={({ isActive }) =>
                `${styles.item} ${isActive ? styles.active : ""}`
                }
            >
                <ScanLine size={18} />
                Scan Expiry
            </NavLink>

            <NavLink
                to="/analytics"
                className={({ isActive }) =>
                `${styles.item} ${isActive ? styles.active : ""}`
                }
            >
                <BarChart3 size={18} />
                Analytics
            </NavLink>

            <NavLink
                to="/notifications"
                className={({ isActive }) =>
                `${styles.item} ${isActive ? styles.active : ""}`
                }
            >
                <Bell size={18} />
                Notifications
            </NavLink>

            {/* <NavLink
                to="/settings"
                className={({ isActive }) =>
                `${styles.item} ${isActive ? styles.active : ""}`
                }
            >
                <Settings size={18} />
                Settings
            </NavLink> */}
       </nav>


      {/* User */}
        <div className={styles.user}>
            <div className={styles.userLeft} onClick={() => navigate("/profile")}>
                <div className={styles.avatar}>
                {user?.name
                    ? user.name
                        .split(" ")
                        .map(w => w[0])
                        .join("")
                        .toUpperCase()
                    : "?"}

                </div>

                <div>
                <p>{user?.name || "Loading..."}</p>
                 <span>{user?.role || "User"}</span>

                </div>
            </div>

            <button
                className={styles.logoutBtn}
                onClick={handleLogout}
                title="Logout"
            >
                <LogOut size={18} />
            </button>
        </div>


    </aside>
  );
};

export default Sidebar;
