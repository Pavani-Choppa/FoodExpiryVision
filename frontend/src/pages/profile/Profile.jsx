import {useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Pencil,
  X,
  Save,
} from "lucide-react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import MobileBottomNav from "../../components/MobileBottomNav/MobileBottomNav";
import styles from "./Profile.module.css";
import api from "../../services/api";


const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};


const Profile = () => {
  const [user, setUser] = useState(null);
  const [originalUser, setOriginalUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const avatarColors = ["#6366f1", "#22c55e", "#f97316", "#ec4899"];

const getAvatarColor = (name) => {
  if (!name) return avatarColors[0];
  return avatarColors[name.length % avatarColors.length];
};


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
        setOriginalUser(res.data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <p style={{ padding: 20 }}>Loading profile...</p>;
  }

  if (!user) {
    return <p style={{ padding: 20 }}>No user data found</p>;
  }


  const handleSave = async () => {
    try {
      const res = await api.put("/auth/profile", {
        name: user.name,
        email: user.email,
        bio: user.bio,
        phone: user.phone,
        location: user.location,
      });

      setUser(res.data);
      setOriginalUser(res.data);
      setEditMode(false);
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  const handleCancel = () => {
    setUser(originalUser);
    setEditMode(false);
  };

  const getInitials = (name) => {
    if (!name) return "U";

    const words = name.trim().split(" ");
    if (words.length === 1) {
      return words[0][0].toUpperCase();
    }

    return (
      words[0][0].toUpperCase() +
      words[words.length - 1][0].toUpperCase()
    );
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
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              <div>
                <h1>Profile</h1>
                <p>Manage your personal information</p>
              </div>
              

              {!editMode ? (
                <button
                  className={styles.editBtn}
                  onClick={() => setEditMode(true)}
                >
                  <Pencil size={16} />
                  Edit Profile
                </button>
              ) : (

                
                <div className={styles.editActions}>
                  <button className={styles.cancel} onClick={handleCancel}>
                    <X size={16} /> Cancel
                  </button>

                  <button className={styles.save} onClick={handleSave}>
                    <Save size={16} /> Save
                  </button>

                </div>
              )}
            </motion.div>

            {/* Profile Card */}
            <motion.div
              className={styles.profileCard}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
            <div
              className={styles.avatar}
              style={{ backgroundColor: getAvatarColor(user.name) }}
            >
              {getInitials(user.name)}
            </div>



              <div className={styles.profileInfo}>
                {editMode ? (
                  <input className={styles.in}
                    value={user.name}
                    onChange={(e) =>
                      setUser({ ...user, name: e.target.value })
                    }
                  />
                ) : (
                  <h2>{user.name}</h2>
                )}

                <span className={styles.role}>{user.role}</span>

                {editMode ? (
                  <textarea
                    value={user.bio || "Enter Your Bio...."}
                    onChange={(e) =>
                      setUser({ ...user, bio: e.target.value })
                    }
                  />
                ) : (
                  <p>{user.bio}</p>
                )}
              </div>
            </motion.div>

            {/* Stats */}
            {/* Stats */}
            <div className={styles.statsGrid}>
              {[
                {
                  label: "Items Tracked",
                  value: user?.stats?.itemsTracked ?? 0,
                },
                {
                  label: "Waste Prevented",
                  value: user?.stats?.wastePrevented ?? "0%",
                },
                {
                  label: "Days Active",
                  value: user?.stats?.daysActive ?? 0,
                },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  className={styles.statCard}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: i * 0.1 }}
                >
                  <h3>{s.value}</h3>
                  <p>{s.label}</p>
                </motion.div>
              ))}
            </div>


            {/* Contact Info */}
            <motion.div 
              className={styles.contactCard}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              <h3>Contact Information</h3>

              <div className={styles.contactGrid}>
                <div>
                  <Mail size={16} />
                  {editMode ? (
                    <input className={styles.in}
                      value={user.email}
                      onChange={(e) =>
                        setUser({ ...user, email: e.target.value })
                      }
                    />
                  ) : (
                    <span>{user.email}</span>
                  )}
                </div>

                <div>
                  <Phone size={16} />
                  {editMode ? (
                    <input className={styles.in}
                      value={user.phone || "Enter Your Phone Number..."}
                      onChange={(e) =>
                        setUser({ ...user, phone: e.target.value })
                      }
                    />
                  ) : (
                    <span>{user.phone}</span>
                  )}
                </div>

                <div>
                  <MapPin size={16} />
                  {editMode ? (
                    <input className={styles.in}
                      value={user.location || "Enter Your Location..."}
                      onChange={(e) =>
                        setUser({ ...user, location: e.target.value })
                      }
                    />
                  ) : (
                    <span>{user.location}</span>
                  )}
                </div>

                <div>
                  <Calendar size={16} />
                  <span>
                    User since{" "}
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "—"}
                  </span>


                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <MobileBottomNav />
    </>
  );
};

export default Profile;
