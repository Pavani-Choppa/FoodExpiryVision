import React, { useMemo } from "react";
import styles from "./CategoryDistribution.module.css";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = {
  Dairy: "#ef4444",
  Vegetables: "#22c55e",
  Meat: "#f59e0b",
  Fruits: "#a855f7",
  Snacks: "#3b82f6",
  Beverages: "#14b8a6",
  Other: "#64748b",
};

const CategoryDistribution = ({ items = [] }) => {
  // 🔹 Build chart data from backend items
  const data = useMemo(() => {
    const map = {};

    items.forEach((item) => {
      // ⛔ optionally ignore consumed items
      if (item.status === "consumed") return;

      const category = item.category || "Other";
      map[category] = (map[category] || 0) + 1;
    });

    return Object.entries(map).map(([category, count]) => ({
      category,
      count,
    }));
  }, [items]);

  if (data.length === 0) {
    return <p className={styles.empty}>No items available</p>;
  }

  return (
    <div className={styles.chartCard}>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="category"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={3}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.category}
                  fill={COLORS[entry.category] || COLORS.Other}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        {data.map((item) => (
          <div key={item.category} className={styles.legendItem}>
            <span
              className={styles.dot}
              style={{
                background: COLORS[item.category] || COLORS.Other,
              }}
            />
            {item.category} ({item.count})
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryDistribution;
