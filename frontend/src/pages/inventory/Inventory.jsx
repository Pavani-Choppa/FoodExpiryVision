import React, { useEffect, useState,useRef } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import MobileBottomNav from "../../components/MobileBottomNav/MobileBottomNav";
import SearchFilterBar from "../../components/inventory/SearchFilterBar/SearchFilterBar";
import styles from "./Inventory.module.css";
import { useNavigate,useLocation } from "react-router-dom";
import { useSearchParams } from "react-router-dom";


import api from "../../services/api";
import {
  Plus,
  MoreVertical,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

const Inventory = () => {

  const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({
    category: "All",
    status: "All",
    location: "All",
    });
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);
  const [items, setItems] = useState([]);
  const [view, setView] = useState("grid"); // grid | table
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const focusItemId = searchParams.get("itemId");

  useEffect(() => {
      if (!focusItemId || items.length === 0) return;

      const el = document.getElementById(focusItemId);

      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add(styles.highlight);

        setTimeout(() => {
          el.classList.remove(styles.highlight);
        }, 2500);
      }
    }, [focusItemId, items]);


    useEffect(() => {
    if (!location.state?.focusItemId) return;
    if (items.length === 0) return;

    const timeout = setTimeout(() => {
        const el = document.getElementById(location.state.focusItemId);

        if (el) {
          el.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });

          el.classList.add(styles.highlight);

          setTimeout(() => {
            el.classList.remove(styles.highlight);
          }, 2000);
        }
      }, 300);

      return () => clearTimeout(timeout);
    }, [location.state, items]);






    useEffect(() => {
      if (!location.state?.focusItemId) return;
      if (items.length === 0) return;

      const timeout = setTimeout(() => {
        const el = document.getElementById(location.state.focusItemId);

        if (el) {
          el.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });

          el.classList.add(styles.highlight);

          setTimeout(() => {
            el.classList.remove(styles.highlight);
          }, 2000);
        }
      }, 300); // wait for DOM render

      return () => clearTimeout(timeout);
    }, [location.state, items]);




    useEffect(() => {
      if (location.state?.focusItemId) {
        const el = document.getElementById(
          location.state.focusItemId
        );

        if (el) {
          el.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });

          el.classList.add(styles.highlight);

          setTimeout(() => {
            el.classList.remove(styles.highlight);
          }, 2000);
        }
      }
    }, [location.state]); 

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.get("/food");
        setItems(res.data);
      } catch (err) {
        console.error("Failed to fetch food items", err);
      }
    };

    fetchItems();
  }, [location.key]);




  const handleDelete = async (id) => {
    await api.delete(`/food/${id}`);
    setItems(items.filter(item => item._id !== id));
  };

  const markConsumed = async (id) => {
    try {
      await api.patch(`/food/${id}/consume`);

      // remove from UI immediately
      setItems(prev => prev.filter(item => item._id !== id));
      setOpenMenuId(null);
    } catch (error) {
      console.error("Failed to mark item as consumed", error);
    }
  };

    const handleEdit = (item) => {
    navigate("/add-item", {
      state: {
        mode: "edit",
        item,
      },
    });
  };


    // 2️⃣ Close dropdown when clicking outside
    useEffect(() => {
    const handleClickOutside = (e) => {
        if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
        }
    };

  },[]);

const filteredItems = items.filter((item) => {
  const matchSearch =
    item.name?.toLowerCase().includes(search.toLowerCase());

  const matchCategory =
    filters.category === "All" ||
    item.category === filters.category;

  const matchStatus =
    filters.status === "All" ||
    (filters.status === "Safe" && item.status === "safe") ||
    (filters.status === "Near Expiry" && item.status === "near") ||
    (filters.status === "Expired" && item.status === "expired");

  const matchLocation =
    filters.location === "All" ||
    item.storage
      ?.toLowerCase()
      .includes(filters.location.toLowerCase());

  return matchSearch && matchCategory && matchStatus && matchLocation;
});



    

 const getStatusBadge = (status) => {
  if (status === "safe") {
    return (
      <span className={`${styles.badge} ${styles.safe}`}>
        <CheckCircle size={14} /> Safe
      </span>
    );
  }

  if (status === "near") {
    return (
      <span className={`${styles.badge} ${styles.near}`}>
        <AlertTriangle size={14} /> Near Expiry
      </span>
    );
  }

  return (
    <span className={`${styles.badge} ${styles.expired}`}>
      <XCircle size={14} /> Expired
    </span>
  );
};


      


  return (
    
    <>
      <div className={styles.layout}>
        <Sidebar />

        <div className={styles.main}>
          <Topbar onSearch={setSearch} />


          <div className={styles.page}>
            {/* ================= HEADER ================= */}
            <div className={styles.header}>
              <div>
                <h1>Inventory</h1>
                <p>Manage your food items</p>
              </div>

              <button
                className={styles.addBtn}
                onClick={() => navigate("/add-item")}
                >
                <Plus size={16} /> Add Item
              </button>

            </div>

            {/* ================= SEARCH & FILTER ================= */}
            <SearchFilterBar
                search={search}
                setSearch={setSearch}
                filters={filters}
                setFilters={setFilters}
                view={view}
                setView={setView}
            />



            {/* ================= GRID VIEW ================= */}
            {view === "grid" && (
                <div className={styles.grid}>
                    {filteredItems.map((item) => (
                    <div
                      id={item._id}
                      key={item._id}
                      className={`${styles.card} ${styles[item.status + "Card"]}`}
                    >

                        {/* Top Row */}
                        <div className={styles.cardHeader}>
                        <span className={`${styles.badge} ${styles[item.status]}`}>
                            {item.status === "safe" && <CheckCircle size={14} />}
                            {item.status === "near" && <AlertTriangle size={14} />}
                            {item.status === "expired" && <XCircle size={14} />}
                            {item.status === "safe"
                            ? "Safe"
                            : item.status === "near"
                            ? "Near Expiry"
                            : "Expired"}
                        </span>

                        <div className={styles.menuWrapper} ref={menuRef}>
                                <MoreVertical
                                    size={18}
                                    // onClick={() => handleDelete(item.id)}
                                    // onClick={() => markConsumed(item.id)}

                                    onClick={() =>
                                    setOpenMenuId(openMenuId === item._id ? null : item._id)
                                    }
                                    className={styles.menuIcon}
                                />

                                {openMenuId === item._id && (
                                  <div className={styles.dropdownMenu}>
                                    <button onClick={() => handleEdit(item)}>
                                      <Pencil size={16} />
                                      Edit
                                    </button>

                                    <button onClick={() => markConsumed(item._id)}>
                                      <CheckCircle size={16} />
                                      Mark Consumed
                                    </button>

                                    <div className={styles.menuDivider}></div>

                                    <button
                                      className={styles.delete}
                                      onClick={() => handleDelete(item._id)}
                                    >
                                      <Trash2 size={16} />
                                      Delete
                                    </button>
                                  </div>
                                )}

                                </div>
                        </div>

                        {/* Main Content */}
                        <div className={styles.cardBody}>
                        {/* Image */}
                        <div className={styles.imageBox}>
                            {/* <img src={item.image} alt={item.name} /> */}
                            <img
                              src={`http://localhost:5000${item.image}?t=${item.updatedAt}`}
                              alt={item.name}
                            />


                        </div>

                        {/* Info */}
                        <div className={styles.info}>
                            <h3>{item.name}</h3>

                            <p className={styles.meta}>
                            {item.quantity} • {item.category}
                            </p>

                            <p className={styles.storage}>{item.storage}</p>
                        </div>
                        </div>

                        {/* Expiry */}
                        <span
                        className={`${styles.expiryText} ${styles[item.status + "Text"]}`}
                        >
                        {item.label}
                        </span>
                    </div>
                    ))}
                </div>
                )}


            {/* ================= TABLE VIEW ================= */}
            {view === "table" && (
              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Category</th>
                      <th>Quantity</th>
                      <th>Storage</th>
                      <th>Expiry</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredItems.map((item) => (
                        <tr
                          id={item._id}
                          key={item._id}
                          className={styles.tableRow}
                        >

                        <td className={styles.itemCell}>
                            <img
                              src={`http://localhost:5000${item.image}?t=${item.updatedAt}`}
                              alt={item.name}
                            
                              className={styles.itemImage}
                            />
                            <span className={styles.itemName}>{item.name}</span>
                        </td>

                        <td>{item.category}</td>
                        <td>{item.quantity}</td>
                        <td>{item.storage}</td>

                        <td>
                            {new Date(item.expiryDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            })}
                        </td>

                        <td className={styles.statusCell}>
                            {getStatusBadge(item.status)}
                            <span className={`${styles.expiryText} ${styles[item.status]}`}>
                            {item.label}
                            </span>
                        </td>

                        <td>
                            <div className={styles.menuWrapper} ref={menuRef}>
                                <MoreVertical
                                    size={18}
                                    // onClick={() => handleDelete(item.id)}
                                    // onClick={() => markConsumed(item.id)}

                                    onClick={() =>
                                    setOpenMenuId(openMenuId === item._id ? null : item._id)
                                    }
                                    className={styles.menuIcon}
                                />

                                {openMenuId === item._id && (
                                  <div className={styles.dropdownMenu}>
                                    <button onClick={() => handleEdit(item)}>
                                      <Pencil size={16} />
                                      Edit
                                    </button>

                                    <button onClick={() => markConsumed(item._id)}>
                                      <CheckCircle size={16} />
                                      Mark Consumed
                                    </button>

                                    <div className={styles.menuDivider}></div>

                                    <button
                                      className={styles.delete}
                                      onClick={() => handleDelete(item._id)}
                                    >
                                      <Trash2 size={16} />
                                      Delete
                                    </button>
                                  </div>
                                )}
                                </div>

                        </td>
                        </tr>
                    ))}
                    </tbody>

                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <MobileBottomNav />
    </>
  );
};

export default Inventory;