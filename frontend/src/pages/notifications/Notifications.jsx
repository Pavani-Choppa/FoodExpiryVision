import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  XCircle,
  Bell,
  CheckCheck,
  Check,
} from "lucide-react";

import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import MobileBottomNav from "../../components/MobileBottomNav/MobileBottomNav";
import styles from "./Notifications.module.css";
import api from "../../services/api";

const Notifications = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  // const unreadCount = notifications.filter(n => !n.read).length;

  /* ===============================
     FETCH NOTIFICATIONS
     =============================== */
  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    if (seconds < 60) return `${seconds}s ago`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;

    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;

    const months = Math.floor(days / 30);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  };



  /* ===============================
     FILTER
     =============================== */
  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((n) => !n.read)
      : notifications;

  /* ===============================
     MARK ALL AS READ
     =============================== */
  const markAllRead = async () => {
    try {
      await api.patch("/notifications/mark-all-read");
      fetchNotifications();
      await api.get("/notifications/unread-count"); // 🔔 refresh
    } catch (err) {
      console.error("Failed to mark all read", err);
    }
  };


  /* ===============================
     MARK SINGLE AS READ
     =============================== */
  const markOneRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, read: true } : n
        )
      );

      // 🔔 refresh bell count
      await api.get("/notifications/unread-count");

    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };




  const unreadCount = notifications.filter((n) => !n.read).length;


  return (
    <>
      <div className={styles.layout}>
        <Sidebar />

        <div className={styles.main}>
          <Topbar />

          <div className={styles.page}>
            {/* ================= HEADER ================= */}
            <div className={styles.header}>
              <div>
                <h1>Notifications</h1>
                <p>{unreadCount} unread notifications</p>
              </div>

              <div className={styles.headerActions}>
                <div className={styles.filterGroup}>
                  <button
                    className={`${styles.filterBtn} ${
                      filter === "all" ? styles.active : ""
                    }`}
                    onClick={() => setFilter("all")}
                  >
                    All
                  </button>

                  <button
                    className={`${styles.filterBtn} ${
                      filter === "unread" ? styles.active : ""
                    }`}
                    onClick={() => setFilter("unread")}
                  >
                    Unread
                  </button>
                </div>

                <button
                  onClick={markAllRead}
                  className={styles.markAll}
                  disabled={unreadCount === 0}
                >
                  <CheckCheck size={16} />
                  Mark all read
                </button>
              </div>
            </div>

            {/* ================= LIST ================= */}
            {filteredNotifications.length > 0 ? (
              <div className={styles.list}>
                {filteredNotifications.map((n, i) => (
                  <motion.div
                    key={n._id}
                    className={`${styles.card} ${!n.read ? styles.unread : ""}`}
                    onClick={async () => {
                      // 1️⃣ mark as read (if not already)
                      if (!n.read) {
                        await markOneRead(n._id);
                      }

                      // 2️⃣ redirect to inventory with focus ID
                      if (n.foodItemId) {
                        navigate("/inventory", {
                          state: {
                            focusItemId: n.foodItemId,
                          },
                        });
                      }
                    }}
                  >


                    {/* LEFT SIDE */}
                    <div className={styles.left}>
                      <div className={styles.icon}>
                        {n.type === "expired" && <XCircle className={styles.expired} />}
                        {n.type === "warning" && <AlertTriangle className={styles.warning} />}
                        {n.type === "info" && <Bell className={styles.info} />}
                      </div>

                      <div className={styles.content}>
                        <h4>{n.title}</h4>
                        <p>{n.message}</p>
                        <span title={new Date(n.createdAt).toLocaleString()}>
                          {timeAgo(n.createdAt)}
                        </span>

                      </div>
                    </div>

                    {/* ✅ RIGHT END TICK */}
                    {!n.read && (
                      <button
                        className={styles.tickBtn}
                        onClick={(e) => {
                          e.stopPropagation();   // 🛑 IMPORTANT
                          markOneRead(n._id);
                        }}
                      >
                        ✓
                      </button>

                    )}
                  </motion.div>


                ))}
              </div>
            ) : (
              /* ================= EMPTY ================= */
              <motion.div
                className={styles.empty}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Bell size={40} />
                <h3>No notifications</h3>
                <p>You’ve read all your notifications!</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <MobileBottomNav />
    </>
  );
};

export default Notifications;
