import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import MobileBottomNav from "../../components/MobileBottomNav/MobileBottomNav";
import styles from "./Settings.module.css";
import toast from "react-hot-toast";

import api from "../../services/api";


import {
  User,
  Bell,
  Clock,
  Users,
  Mail,Shield,
  ToggleLeft,
  ToggleRight,MoreVertical, X, Trash2,
  Save,
  Plus,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Settings = () => {
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);
  const [dailySummary, setDailySummary] = useState(true);
  const [threshold, setThreshold] = useState(3);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [user, setUser] = useState(null);


    // const toggleEmailNotifications = async () => {
    //     try {
    //         const newValue = !emailNotif;

    //         await api.put("/user/notification-settings", {
    //         emailNotifications: newValue,
    //         });

    //         setEmailNotif(newValue);

    //         alert(
    //         newValue
    //             ? "✅ Email notifications enabled successfully"
    //             : "❌ Email notifications disabled"
    //         );
    //     } catch (error) {
    //         console.error(error);
    //         alert("⚠️ Failed to update email notification setting");
    //     }
    // };

    const toggleEmailNotifications = async () => {
        try {
            const newValue = !emailNotif;

            await api.put("/user/notification-settings", {
            emailNotifications: newValue,
            });

            setEmailNotif(newValue);

            toast.success(
            newValue
                ? "Email notifications enabled 📧"
                : "Email notifications disabled ❌"
            );
        } catch (error) {
            console.error(error);
            toast.error("Failed to update notification settings");
        }
    };



  useEffect(() => {
    const fetchProfile = async () => {
        try {
        const res = await api.get("/auth/me");
        setUser(res.data);
        } catch (err) {
        console.error("Failed to fetch profile", err);
        }
    };

    fetchProfile();
    }, []);

    const updateSettings = async (updatedValues) => {
        try {
            await api.patch("/user/notification-settings", updatedValues);
        } catch (err) {
            console.error("Failed to update settings", err);
        }
    };


  return (
    <>
      <div className={styles.layout}>
        <Sidebar />

        <div className={styles.main}>
          <Topbar />

          <div className={styles.page}>
            {/* Header */}
            <motion.div
              className={styles.header}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <h1>Settings</h1>
              <p>Manage your account and preferences</p>
            </motion.div>

            {/* PROFILE */}
            <motion.div className={styles.card} variants={fadeUp} initial="hidden" animate="visible">
              <div className={styles.cardTitle}>
                <User size={18} className={styles.icon}/>
                <h3>Profile</h3>
              </div>

              <div className={styles.profileRow}>
                <div className={styles.avatar}>
                    {user?.name?.split(" ").map(w => w[0]).join("").toUpperCase()}
                    </div>

                    <div className={styles.profileInfo}>
                    <h4 className={styles.name}>{user?.name || "Loading..."}</h4>
                    <p className={styles.email}>{user?.email || ""}</p>

                    <span className={styles.role}>
                        <Shield size={12} />
                        {user?.role || "User"}
                    </span>
                    </div>

              </div>


              <div className={styles.formRow}>
                <input
                placeholder="Full Name"
                value={user?.name || ""}
                disabled
                />

                <input
                placeholder="Email"
                value={user?.email || ""}
                disabled
                />

              </div>
            </motion.div>

            {/* NOTIFICATIONS */}
            <motion.div
                className={styles.card}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                >
                <div className={styles.cardTitle}>
                    <Bell size={18} className={styles.icon} />
                    <h3>Notifications</h3>
                </div>

                {/* Email */}
                <div className={styles.toggleRow}>
                    <div>
                    <h4>Email Notifications</h4>
                    <p>Receive alerts via email</p>
                    </div>

                    <button
                    className={`${styles.switch} ${emailNotif ? styles.active : ""}`}
                    onClick={toggleEmailNotifications}
                    >
                    <span />
                    </button>



                </div>

                {/* Push */}
                <div className={styles.toggleRow}>
                    <div>
                    <h4>Push Notifications</h4>
                    <p>Browser push notifications</p>
                    </div>

                    <button
                        className={`${styles.switch} ${pushNotif ? styles.active : ""}`}
                        onClick={() => setPushNotif(!pushNotif)}
                    >
                    <span />
                    </button>
                </div>

                {/* Daily */}
                <div className={styles.toggleRow}>
                    <div>
                    <h4>Daily Summary</h4>
                    <p>Get a daily overview email</p>
                    </div>

                    <button
                    className={`${styles.switch} ${dailySummary ? styles.active : ""}`}
                    onClick={() => {
                        const value = !dailySummary;
                        setDailySummary(value);
                        updateSettings({ dailySummary: value });
                    }}
                    >
                        <span />
                    </button>


                </div>
                </motion.div>


            {/* EXPIRY SETTINGS */}
            <motion.div
                className={styles.card}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                >
                <div className={styles.cardTitle}>
                    <Clock size={18} className={styles.icon} />
                    <h3>
                    Expiry Settings{" "}
                    <span className={styles.adminOnly}>Admin Only</span>
                    </h3>
                </div>

                {/* Threshold */}
                <div className={styles.sliderRow}>
                    <div>
                    <h4>Near Expiry Threshold</h4>
                    <p>
                        Items within this many days are marked as
                        <strong> "Near Expiry"</strong>
                    </p>
                    </div>

                    <span className={styles.days}>
                    {threshold} days
                    </span>
                </div>

                <input
                    type="range"
                    min="1"
                    max="12"
                    value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    className={styles.slider}
                    style={{
                        background: `linear-gradient(
                        to right,
                        #ef4444 0%,
                        #ef4444 ${(threshold - 1) * (100 / 12)}%,
                        #fde2e2 ${(threshold - 1) * (100 / 11)}%,
                        #fde2e2 100%
                        )`,
                    }}
                />

                {/* Reminder */}
                <div className={styles.reminderBlock}>
                    <h4>Reminder Schedule</h4>
                    <p>Days before expiry to send reminders (comma-separated)</p>

                    <input
                    className={styles.reminderInput}
                    placeholder="7,3,1"
                    />
                </div>
            </motion.div>


            {/* STAFF MANAGEMENT */}
            <motion.div
                className={styles.card}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                >
                {/* Header */}
                <div className={styles.cardTitleRow}>
                    <div>
                    <div className={styles.cardTitle}>
                        <Users size={18} className={styles.icon} />
                        <h3>Staff Management</h3>
                    </div>
                    <p className={styles.subText}>3 team members</p>
                    </div>

                    <button className={styles.inviteBtn}>
                    <Plus size={16} /> Invite Member
                    </button>
                </div>

                {/* Search */}
                <input
                    className={styles.search}
                    placeholder="Search team members..."
                />

                {/* Member – Admin */}
                <div className={styles.member}>
                    <div className={styles.memberLeft}>
                    <div className={styles.avatarSmall}>PC</div>

                    <div className={styles.memberInfo}>
                        <h4>Pavani Choppa</h4>
                        <p>pavani@example.com</p>
                    </div>
                    </div>

                    <div className={styles.memberRight}>
                        <span className={styles.statusActive}>Active</span>

                        <div className={styles.menuWrapper}>
                            <button
                            className={styles.menuBtn}
                            onClick={() =>
                                setOpenMenuId(openMenuId === "pavani" ? null : "pavani")
                            }
                            >
                            <MoreVertical size={18} />
                            </button>

                            {openMenuId === "pavani" && (
                            <div className={styles.menuDropdown}>
                                <button className={styles.menuItemDanger}>
                                <X size={14} /> Remove Admin
                                </button>

                                <button className={styles.menuItem}>
                                <Trash2 size={14} /> Remove
                                </button>
                            </div>
                            )}
                        </div>
                        </div>

                </div>

                {/* Member – Staff */}
                <div className={styles.member}>
                    <div className={styles.memberLeft}>
                    <div className={styles.avatarSmall}>GC</div>

                    <div className={styles.memberInfo}>
                        <h4>Gayathri Choppa</h4>
                        <p>gayathri@example.com</p>
                    </div>
                    </div>

                    <div className={styles.memberRight}>
                        <span className={styles.statusActive}>Active</span>

                        <div className={styles.menuWrapper}>
                            <button
                            className={styles.menuBtn}
                            onClick={() =>
                                setOpenMenuId(openMenuId === "gaythri" ? null : "gayathri")
                            }
                            >
                            <MoreVertical size={18} />
                            </button>

                            {openMenuId === "gayathri" && (
                            <div className={styles.menuDropdown}>
                                <button className={styles.menuItemDanger}>
                                <X size={14} /> Remove Admin
                                </button>

                                <button className={styles.menuItem}>
                                <Trash2 size={14} /> Remove
                                </button>
                            </div>
                            )}
                        </div>
                        </div>

                </div>
            </motion.div>


            {/* ACTIONS */}
            <motion.div
              className={styles.actions}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              <button className={styles.cancel}>Cancel</button>
              <button className={styles.save}><Save size={18}/>Save Changes</button>
            </motion.div>
          </div>
        </div>
      </div>

      <MobileBottomNav />
    </>
  );
};

export default Settings;
