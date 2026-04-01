import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import MobileBottomNav from "../../components/MobileBottomNav/MobileBottomNav";
import CategoryDistribution from "../../components/dashboard/CategoryDistribution/CategoryDistribution";
import styles from "./Dashboard.module.css";
import {
  Box,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ChevronRight,
  Plus,
  ScanLine,
  TrendingDown,Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";



// (Optional – used only for preview text, NOT required for backend)
const getExpiryLabel = (date) => {
  if (!date) return "—";
  const today = new Date();
  const expiry = new Date(date);
  const diff = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

  if (diff < 0) return `${Math.abs(diff)} days overdue`;
  if (diff === 0) return "Expires today";
  return `${diff} days left`;
};


const Dashboard = ({ children }) => {

        
        const navigate = useNavigate();
        const [items, setItems] = useState([]);
        const [loading, setLoading] = useState(true);
        const totalItems = items.length;
        const safeItems = items.filter(i => i.status === "safe").length;
        const nearItems = items.filter(i => i.status === "near").length;
        const expiredItems = items.filter(i => i.status === "expired").length;
        const [activities, setActivities] = useState([]);
        const [wasteReduction, setWasteReduction] = useState(0);



        useEffect(() => {
          const fetchWasteReduction = async () => {
            try {
              const res = await api.get("/analytics/waste-reduction");
              setWasteReduction(res.data.reduction);
            } catch (err) {
              console.error("Failed to fetch waste reduction", err);
            }
          };

          fetchWasteReduction();
        }, []);


        useEffect(() => {
          const fetchDashboardData = async () => {
            try {
              const res = await api.get("/food");
              setItems(res.data);
            } catch (err) {
              console.error("Failed to fetch dashboard data", err);
            } finally {
              setLoading(false);
            }
          };

          fetchDashboardData();
        }, []);

       


        useEffect(() => {
          const fetchActivities = async () => {
            try {
              const res = await api.get("/activity");
              setActivities(res.data);
            } catch (err) {
              console.error("Failed to fetch activities", err);
            }
          };

          fetchActivities();
        }, []);




        const consumeFirstItems = items
        .filter(i =>
          i.status === "near" ||
          i.status === "expired" ||
          i.status === "consumed"
        )
        .slice(0, 5);


      if (loading) {
        return <p style={{ padding: 20 }}>Loading dashboard...</p>;
      }


      const activityMeta = {
        added: {
          label: "Added",
          icon: Plus,
          bg: "greenBg",
        },
        consumed: {
          label: "Consumed",
          icon: CheckCircle,
          bg: "greenBg",
        },
        deleted: {
          label: "Deleted",
          icon: Trash2,
          bg: "redBg",
        },
        wasted: {
          label: "Wasted",
          icon: Trash2,
          bg: "redBg",
        },
      };



        const getStatusStyles = (status) => {
        switch (status) {
          case "near":
            return {
              row: styles.expiring,
              iconBg: styles.orangeBg,
              text: styles.warning,
              label: "Consume Soon",
            };

          case "expired":
            return {
              row: styles.expired,
              iconBg: styles.redBg,
              text: styles.danger,
              label: "Expired",
            };

          case "consumed":
            return {
              row: styles.consumed,
              iconBg: styles.greenBg,
              text: styles.success,
              label: "Consumed",
            };

          default:
            return {};
        }
      };


      const getExpiryIcon = (status) => {
        if (status === "expired") return <XCircle size={16} />;
        if (status === "consumed") return <CheckCircle size={16} />;
        return <AlertTriangle size={16} />; // near
      };

  return (
    <>
      <div className={styles.layout}>
        <Sidebar />

        <div className={styles.main}>
          <Topbar />

          <div className={styles.page}>

            {/* ================= HEADER ================= */}
            <div className={styles.header}>
              <h1>Dashboard</h1>
              <p>Track your food inventory at a glance</p>
            </div>

            {/* ================= STATS ================= */}
            {/* Total Items */}
           
            <div className={styles.statsGrid}>

              <div className={styles.statCard}>
                <div>
                  <span className={styles.statLabel}>Total Items</span>
                  <h2 className={styles.red}>{totalItems}</h2>
                  <p className={styles.statSub}>In your inventory</p>
                </div>
                <div className={`${styles.iconBox} ${styles.redBg}`}>
                  <Box size={20} className={styles.red} />
                </div>
              </div>

              <div className={styles.statCard}>
                <div>
                  <span className={styles.statLabel}>Safe</span>
                  <h2 className={styles.green}>{safeItems}</h2>
                  <p className={styles.statSub}>No action needed</p>
                </div>
                <div className={`${styles.iconBox} ${styles.greenBg}`}>
                  <CheckCircle size={20} className={styles.green} />
                </div>
              </div>

              <div className={styles.statCard}>
                <div>
                  <span className={styles.statLabel}>Near Expiry</span>
                  <h2 className={styles.orange}>{nearItems}</h2>
                  <p className={styles.statSub}>Consume soon</p>
                </div>
                <div className={`${styles.iconBox} ${styles.orangeBg}`}>
                  <AlertTriangle size={20} className={styles.orange} />
                </div>
              </div>

              <div className={styles.statCard}>
                <div>
                  <span className={styles.statLabel}>Expired</span>
                  <h2 className={styles.red}>{expiredItems}</h2>
                  <p className={styles.statSub}>Take action</p>
                </div>
                <div className={`${styles.iconBox} ${styles.redBg}`}>
                  <XCircle size={20} className={styles.red} />
                </div>
              </div>

            </div>



            {/* ================= MAIN GRID ================= */}
            <div className={styles.mainGrid}>
              {/* Consume First */}
              <div className={styles.consumeCard}>
                <div className={styles.consumeHeader}>
                  <div className={styles.consumeTitle}>
                    <AlertTriangle className={styles.try} size={20} />
                    <h3>Consume First</h3>
                  </div>

                  <button className={styles.viewAll} onClick={() => navigate("/inventory")}>
                    View all <ChevronRight size={16} />
                  </button>
                </div>

                <div className={styles.list}>
                    {consumeFirstItems.map((item) => {
                      const statusStyle = getStatusStyles(item.status);

                      return (
                        <div
                          key={item._id}
                          className={`${styles.consumeItem} ${statusStyle.row}`}
                          onClick={() =>
                            navigate("/inventory", {
                              state: {
                                focusItemId: item._id,
                              },
                            })
                          }
                          style={{ cursor: "pointer" }}
                        >
                          <div className={styles.left}>
                            <div className={styles.iconWrap}>
                              {getExpiryIcon(item.status)}
                            </div>

                            <div>
                              <h4>{item.name}</h4>
                              <span>{item.category}</span>
                            </div>
                          </div>

                          <span className={`${styles.expiryText} ${statusStyle.text}`}>
                            {item.status === "consumed"
                              ? "Consumed"
                              : getExpiryLabel(item.expiryDate)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
  
              </div>


              {/* Quick Actions */}
              <div className={styles.actionsCard}>
                <h3 className={styles.actionsTitle}>Quick Actions</h3>

                <button className={styles.primaryBtn} onClick={() => navigate("/add-item")}>
                  <Plus size={18} />
                  Add New Item
                </button>

                <button className={styles.secondaryBtn} onClick={() => navigate("/scan-expiry")}>
                  <ScanLine size={18} />
                  Scan Expiry Date
                </button>

                <button className={styles.secondaryBtn} onClick={() => navigate("/inventory")}>
                  <Box size={18} />
                  View Inventory
                </button>

                {/* Waste Reduction */}
                <div className={styles.wasteCard}>
                  <div className={styles.wasteHeader}>
                    <TrendingDown size={18} />
                    <span>Waste Reduction</span>
                  </div>
                  <h2>{wasteReduction || 0 }%</h2>
                  <p>
                    {wasteReduction > 0
                      ? "less waste this month"
                      : "no improvement this month"}
                  </p>
                </div>
              </div>
            </div>


            {/* ================= BOTTOM GRID ================= */}
            <div className={styles.bottomGrid}>
              {/* Recent Activity */}
              <div className={styles.activityCard}>
                  <h3>Recent Activity</h3>

                  <div className={styles.activityList}>
                    {activities.map((activity) => {
                      const meta = activityMeta[activity.action] || {
                        label: "Activity",
                        icon: AlertTriangle,
                        bg: "orangeBg",
                      };

                      const Icon = meta.icon;

                      return (
                        <div key={activity._id} className={styles.activityItem}>
                          <div className={styles.left}>
                            <div className={`${styles.iconBox} ${styles[meta.bg]}`}>
                              <Icon size={18} />
                            </div>

                            <div>
                              <p className={styles.itemName}>{activity.itemName}</p>
                              <span className={styles.itemAction}>{meta.label}</span>
                            </div>
                          </div>

                          <span className={styles.time}>
                            {new Date(activity.createdAt).toLocaleString()}
                          </span>
                        </div>
                      );
                    })}

                  </div>
                </div>


              {/* Category Distribution (placeholder) */}
              <div className={styles.chartCard}>
                <h3>Category Distribution</h3>
                <CategoryDistribution items={items} />

              </div>
            </div>
          </div>
        </div>
      </div>
      {children}
      <MobileBottomNav />
    </>
);
};

export default Dashboard;


