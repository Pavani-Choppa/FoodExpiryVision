import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import styles from "./CustomDropdown.module.css";

const CustomDropdown = ({
  label,
  value,
  options = [],
  placeholder = "Select option",
  onSelect,
  required = false,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // 🔹 Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.wrapper} ref={ref}>
      {/* {label && (
        <label className={styles.label}>
          {label} {required && <span>*</span>}
        </label>
      )} */}

      <button
        type="button"
        className={styles.dropdownBtn}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={value ? styles.value : styles.placeholder}>
          {value || placeholder}
        </span>
        <ChevronDown size={16} />
      </button>

      {open && (
        <div className={styles.dropdownMenu}>
          {options.map((opt) => (
            <div
              key={opt}
              className={`${styles.option} ${
                value === opt ? styles.activeOption : ""
              }`}
              onClick={() => {
                onSelect(opt);
                setOpen(false);
              }}
            >
              {value === opt && <Check size={16} />}
              <span>{opt}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
