import React, { useEffect, useRef, useState } from "react";
import styles from "./Topbar.module.css";
import { Search, Bell, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const Topbar = ({ onSearch }) => {   // 👈 receive function from parent
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await api.get("/notifications/unread-count");
        setUnreadCount(res.data.unreadCount);
      } catch (err) {
        console.error("Failed to fetch unread count");
      }
    };

    fetchUnreadCount();

    // 🔁 optional auto refresh every 30s
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

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




  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase();
  };

  const userEmail = user?.email || "Loading...";


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className={styles.topbar}>
      {/* 🔍 Search */}
      <div className={styles.search}>
        <Search size={16} />
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            onSearch(e.target.value);   // 👈 send to parent
          }}
        />
      </div>

      {/* Right */}
      <div className={styles.actions}>
        <div className={styles.bell} onClick={() => navigate("/notifications")}>
          <Bell size={18} />

          {unreadCount > 0 && (
            <span className={styles.badge}>
              {unreadCount}
            </span>
          )}
        </div>


        <div className={styles.profileWrapper} ref={dropdownRef}>
          <div
            className={styles.profile}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(prev => !prev);
            }}
          >
            <div className={styles.avatar}>
              {user ? getInitials(user.name) : "?"}
            </div>

            <ChevronDown size={16} />
          </div>

          {open && (
            <div
              className={styles.dropdown}
              onClick={(e) => e.stopPropagation()}
            >
              <p className={styles.email}>{userEmail}</p>

              <button onClick={() => navigate("/profile")}>
                <User size={16} />
                Profile
              </button>

              {/* <button onClick={() => navigate("/settings")}>
                <Settings size={16} />
                Settings
              </button> */}

              {/* <div className={styles.divider}></div> */}

              <button className={styles.logout} onClick={handleLogout}>
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
