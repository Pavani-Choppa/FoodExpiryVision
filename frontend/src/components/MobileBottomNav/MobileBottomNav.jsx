import { LayoutGrid, Box, ScanLine, BarChart3 } from "lucide-react";
import { NavLink } from "react-router-dom";
import styles from "./MobileBottomNav.module.css";

const MobileBottomNav = () => {
  return (
    <nav className={styles.bottomNav}>
      <NavLink
        to="/dashboard"
        end
        className={({ isActive }) =>
          isActive ? `${styles.item} ${styles.active}` : styles.item
        }
      >
        <LayoutGrid size={20} />
        <span>Dashboard</span>
      </NavLink>

      <NavLink
        to="/inventory"
        end
        className={({ isActive }) =>
          isActive ? `${styles.item} ${styles.active}` : styles.item
        }
      >
        <Box size={20} />
        <span>Inventory</span>
      </NavLink>

      <NavLink
        to="/scan-expiry"
        end
        className={({ isActive }) =>
          isActive ? `${styles.item} ${styles.active}` : styles.item
        }
      >
        <ScanLine size={20} />
        <span>Scan</span>
      </NavLink>

      <NavLink
        to="/analytics"
        end
        className={({ isActive }) =>
          isActive ? `${styles.item} ${styles.active}` : styles.item
        }
      >
        <BarChart3 size={20} />
        <span>Analytics</span>
      </NavLink>
    </nav>
  );
};

export default MobileBottomNav;
