import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,CartesianGrid,AreaChart,
  Area,
} from "recharts";
import { useState,useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import MobileBottomNav from "../../components/MobileBottomNav/MobileBottomNav";
import styles from "./Analytics.module.css";
import api from "../../services/api";
import {
  CheckCircle,
  Trash2,
  TrendingDown,
  Activity,
  
} from "lucide-react";

/* ---------- Dummy Data (Backend-ready) ---------- */

// const stats = [
//   {
//     title: "Total Consumed",
//     value: "318",
//     change: "+12%",
//     icon: <CheckCircle size={18} />,
//     variant: "green",
//   },
//   {
//     title: "Total Wasted",
//     value: "36",
//     change: "-23%",
//     icon: <Trash2 size={18} />,
//     variant: "red",
//   },
//   {
//     title: "Waste Reduction",
//     value: "35%",
//     change: "+8%",
//     icon: <TrendingDown size={18} />,
//     variant: "yellow",
//   },
//   {
//     title: "Efficiency Rate",
//     value: "89.8%",
//     change: "+5%",
//     icon: <Activity size={18} />,
//     variant: "green",
//   },
// ];


// const barData = [
//   { month: "Jan", consumed: 45, wasted: 8 },
//   { month: "Feb", consumed: 52, wasted: 6 },
//   { month: "Mar", consumed: 48, wasted: 5 },
//   { month: "Apr", consumed: 56, wasted: 4 },
//   { month: "May", consumed: 60, wasted: 3 },
//   { month: "Jun", consumed: 58, wasted: 2 },
// ];

// const pieData = [
//   { name: "Dairy", value: 30 },
//   { name: "Vegetables", value: 25 },
//   { name: "Meat", value: 18 },
//   { name: "Fruits", value: 15 },
//   { name: "Snacks", value: 12 },
// ];

const COLORS = ["#22c55e", "#facc15", "#fb7185", "#60a5fa", "#a855f7"];

// const lineData = [
//   { month: "Jan", value: 12 },
//   { month: "Feb", value: 18 },
//   { month: "Mar", value: 15 },
//   { month: "Apr", value: 22 },
//   { month: "May", value: 28 },
//   { month: "Jun", value: 35 },
// ];

// const weeklyData = [
//   { week: "Week 1", safe: 20, near: 5, expired: 3 },
//   { week: "Week 2", safe: 22, near: 4, expired: 2 },
//   { week: "Week 3", safe: 18, near: 6, expired: 3 },
//   { week: "Week 4", safe: 24, near: 3, expired: 2 },
// ];





/* ---------- Animations ---------- */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const Analytics = () => {
  const [stats, setStats] = useState([]);
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [wasteTrend, setWasteTrend] = useState([]);
  const [efficiency, setEfficiency] = useState(0);
  const [savedAmount, setSavedAmount] = useState(0);
  const [wastedKg, setWastedKg] = useState(0);
  const [wasteReduction, setWasteReduction] = useState(null);

  useEffect(() => {
    const fetchWasteReduction = async () => {
      try {
        const res = await api.get("/analytics/waste-reduction");

        setWasteReduction(res.data.summary); // 👈 for cards
        setWasteTrend(res.data.trend);       // 👈 for area chart
      } catch (err) {
        console.error("Waste reduction fetch failed", err);
      }
    };

    fetchWasteReduction();
  }, []);






  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("/analytics");
        console.log("STATS RESPONSE 👉", res.data);

        setStats([
          {
            title: "Total Consumed",
            value: res.data.stats.totalConsumed,
            icon: <CheckCircle size={18} />,
            variant: "green",
          },
          {
            title: "Total Wasted",
            value: res.data.stats.totalWasted,
            icon: <Trash2 size={18} />,
            variant: "red",
          },
          {
            title: "Efficiency Rate",
            value: `${res.data.stats.efficiencyRate}%`,
            icon: <Activity size={18} />,
            variant: "green",
          },
        ]);

        setBarData(res.data.barData);
        setPieData(res.data.pieData);
        setWeeklyData(res.data.weeklyData);
        setEfficiency(res.data.stats.efficiencyRate);
        setSavedAmount(res.data.stats.savedAmount);
        setWastedKg(res.data.stats.wastedKg);


        // WASTE REDUCTION
        const wasteRes = await api.get("/analytics/waste-reduction");
        setWasteTrend(wasteRes.data.trend);


        // 💰 Simple savings logic (you can refine later)
        // const SAVING_PER_ITEM = 50; // ₹ or $
        // const saved =
        //   (wasteRes.data.summary.lastMonthWaste -
        //     wasteRes.data.summary.thisMonthWaste) *
        //   SAVING_PER_ITEM;

        // setSavedAmount(Math.max(0, saved));

      } catch (err) {
        console.error("Analytics fetch failed", err);
      }
    };

    fetchAnalytics();
  }, []);







  return (
    <>
      <div className={styles.layout}>
        <Sidebar />

        <div className={styles.main}>
          <Topbar />

          <div className={styles.page}>
            {/* Header */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className={styles.header}
            >
              <h1>Analytics & Waste Tracking</h1>
              <p>Monitor consumption patterns and reduce food waste</p>
            </motion.div>

            {/* Stats */}
            <div className={styles.statsGrid}>
              {Array.isArray(stats) && stats.length > 0 ? (
                stats.map((s, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: i * 0.1 }}
                    className={`${styles.statCard} ${styles[s.variant]}`}
                  >
                    <div className={styles.statIcon}>{s.icon}</div>
                    <h4>{s.title}</h4>
                    <h2>{s.value}</h2>
                  </motion.div>
                ))
              ) : (
                <p style={{ opacity: 0.6 }}>No stats available</p>
              )}
            </div>



            {/* Charts Row 1 */}
            <div className={styles.grid2}>
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className={styles.chartCard}
              >
                <h3>Consumption vs Waste</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={barData}
                        barGap={18}
                        barCategoryGap={64}
                    >
                        {/* Grid */}
                        <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f1f1f1"
                        />

                        {/* X Axis */}
                        <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#6b7280", fontSize: 13 }}
                        />

                        {/* Y Axis */}
                        <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#6b7280", fontSize: 13 }}
                        />

                        {/* Tooltip */}
                        <Tooltip
                        cursor={{ fill: "rgba(0,0,0,0.04)" }}
                        contentStyle={{
                            background: "#ffffff",
                            borderRadius: "12px",
                            border: "1px solid #e5e7eb",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                            fontSize: "13px",
                        }}
                        labelStyle={{ fontWeight: 600 }}
                        />

                        {/* Bars */}
                        <Bar
                        dataKey="consumed"
                        fill="#22c55e"
                        radius={[8, 8, 0, 0]}
                        name="Consumed"
                        />
                        <Bar
                        dataKey="wasted"
                        fill="#ef4444"
                        radius={[8, 8, 0, 0]}
                        name="Wasted"
                        />
                    </BarChart>
                    </ResponsiveContainer>

              </motion.div>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className={styles.chartCard}
              >
                <h3>Category Distribution</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={pieData} innerRadius={60} outerRadius={90} dataKey="value">
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>

                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* Charts Row 2 */}
            <div className={styles.grid2}>
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className={styles.chartCard}
              >
                {/* <h3>Waste Reduction Trend</h3>
                <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={wasteTrend}>

                        <defs>
                        <linearGradient id="pinkGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#fb7185" stopOpacity={0.45} />
                            <stop offset="100%" stopColor="#fb7185" stopOpacity={0.05} />
                        </linearGradient>
                        </defs>

                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />

                        <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#fb7185"
                        strokeWidth={3}
                        fill="url(#pinkGradient)"
                        dot={false}
                        activeDot={{ r: 6 }}
                        />
                    </AreaChart>
                </ResponsiveContainer> */}

                <h3>Waste Reduction Trend</h3>

                  {Array.isArray(wasteTrend) && wasteTrend.length > 0 ? (
                    <ResponsiveContainer width="100%" height={260}>
                      <AreaChart data={wasteTrend}>
                        <defs>
                          <linearGradient id="wasteGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#fb7185" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="#fb7185" stopOpacity={0.05} />
                          </linearGradient>
                        </defs>

                        <XAxis dataKey="month" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />

                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#fb7185"
                          strokeWidth={3}
                          fill="url(#wasteGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <p style={{ opacity: 0.6 }}>No waste data yet</p>
                  )}


              </motion.div>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className={styles.chartCard}
              >
                <h3>Weekly Expiry Status</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={weeklyData}>
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Line dataKey="safe" stroke="#22c55e"  type="monotone" strokeWidth={2} activeDot={{ r: 6 }} />
                    <Line dataKey="near" stroke="#facc15"  type="monotone" strokeWidth={2}  activeDot={{ r: 6 }}/>
                    <Line dataKey="expired" stroke="#fb7185"  type="monotone" strokeWidth={2} activeDot={{ r: 6 }}/>
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* Bottom Stats */}
            {/* <div className={styles.bottomStats}>
              <motion.div className={styles.bottomCard} variants={fadeUp} initial="hidden" animate="visible">
               <div className={`${styles.bottomIcon} ${styles.green}`}>
                     <CheckCircle size={20} />
                </div>
                <h2 className={styles.green}>89.8%</h2>
                <p>Items consumed before expiry</p>
              </motion.div>

              <motion.div className={styles.bottomCard} variants={fadeUp} initial="hidden" animate="visible">
                <div className={`${styles.bottomIcon} ${styles.red}`}>
                     <TrendingDown size={20} />
                </div>
                <h2 className={styles.red}>$127</h2>
                <p>Saved this month</p>
              </motion.div>

              <motion.div className={styles.bottomCard} variants={fadeUp} initial="hidden" animate="visible">
               <div className={`${styles.bottomIcon} ${styles.red}`}>
                     <Trash2 size={20} />
                </div>
                <h2 className={styles.red}>4.2 kg</h2>
                <p>Less waste vs last month</p>
              </motion.div>
            </div> */}
            <div className={styles.bottomStats}>

              {/* Efficiency */}
              <motion.div className={styles.bottomCard}>
                <div className={`${styles.bottomIcon} ${styles.green}`}>
                  <CheckCircle size={20} />
                </div>

                <h2 className={styles.green}>
                  {efficiency}%
                </h2>

                <p>Items consumed before expiry</p>
              </motion.div>

              {/* Saved Amount */}
              <motion.div className={styles.bottomCard}>
                <div className={`${styles.bottomIcon} ${styles.green}`}>
                  <TrendingDown size={20} />
                </div>

                <h2 className={styles.green}>
                  ₹{savedAmount}
                </h2>

                <p>Saved this month</p>
              </motion.div>

              {/* Waste (kg) */}
              <motion.div className={styles.bottomCard}>
                  <div className={`${styles.bottomIcon} ${styles.red}`}>
                    <Trash2 size={20} />
                  </div>

                  <h2 className={styles.red}>
                    {wasteReduction
                      ? `${wasteReduction.reduction}%`
                      : "0%"}
                  </h2>

                  <p>Less waste vs last month</p>
                </motion.div>


                

            </div>


          </div>
        </div>
      </div>

      <MobileBottomNav />
    </>
  );
};

export default Analytics;
