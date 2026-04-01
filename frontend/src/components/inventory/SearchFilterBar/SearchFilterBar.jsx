import { useState, useRef, useEffect } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  LayoutGrid,
  List,
  Check,
} from "lucide-react";
import styles from "./SearchFilterBar.module.css";

const FILTERS = {
  category: ["All", "Dairy", "Meat", "Vegetables", "Beverages", "Bakery", "Fruits"],
  status: ["All", "Safe", "Near Expiry", "Expired"],
  location: ["All", "Refrigerator", "Freezer", "Room Temperature"],
};

const SearchFilterBar = ({
  search,
  setSearch,
  filters,
  setFilters,
  view,
  setView,
}) => {
  const [open, setOpen] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(null);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const renderDropdown = (key) => (
    <div className={styles.dropdown}>
      {FILTERS[key].map((item) => (
        <button
          key={item}
          className={item === filters[key] ? styles.activeOption : ""}
          onClick={() => {
            setFilters((prev) => ({ ...prev, [key]: item }));
            setOpen(null);
          }}
        >
          {item === filters[key] && <Check size={14} />}
          {item}
        </button>
      ))}
    </div>
  );

  return (
    <div className={styles.bar} ref={ref}>
      {/* Search */}
      <div className={styles.search}>
        <Search size={18} />
        <input
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        {["category", "status", "location"].map((key) => (
          <div className={styles.filterWrap} key={key}>
            <button onClick={() => setOpen(open === key ? null : key)}>
              {filters[key]}
              <ChevronDown size={14} />
            </button>
            {open === key && renderDropdown(key)}
          </div>
        ))}
      </div>

      {/* View Toggle */}
      <div className={styles.viewToggle}>
        <button
          className={view === "grid" ? styles.activeView : ""}
          onClick={() => setView("grid")}
        >
          <LayoutGrid size={18} />
        </button>
        <button
          className={view === "table" ? styles.activeView : ""}
          onClick={() => setView("table")}
        >
          <List size={18} />
        </button>
      </div>
    </div>
  );
};

export default SearchFilterBar;
