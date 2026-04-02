import { useState, useRef, useEffect } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import { Camera, Upload, Box, ChevronDown, Check } from "lucide-react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import MobileBottomNav from "../../components/MobileBottomNav/MobileBottomNav";
import styles from "./AddItem.module.css";
import CustomCalendar from "../../components/CustomCalendar/CustomCalendar";
import CustomDropdown from "../../components/CustomDropdown/CustomDropdown";
import api from "../../services/api";

const AddItem = () => {

      const [calendarOpen, setCalendarOpen] = useState(false);
      const calendarRef = useRef(null);
      const navigate = useNavigate();
      const location = useLocation();
      const editMode = location.state?.mode === "edit";
      const editItem = location.state?.item;
      const API_URL = import.meta.env.VITE_API_URL;
      const [form, setForm] = useState({
            name: "",
            category: "",
            expiryDate: "",
            quantity: 1,
            unit: "pcs",
            storage: "",
            notes: "",
            image: null,
          });
          const CATEGORIES = [
          "Dairy",
          "Meat",
          "Vegetables",
          "Fruits",
          "Beverages",
          "Bakery",
          "Frozen",
          "Canned",
          "Snacks",
          "Other",
      ];
      const UNITS = ["pcs", "kg", "g", "L", "ml", "pack", "box", "bottle", "can", "loaf"];
      const LOCATIONS = ["Refrigerator", "Freezer", "Pantry", "Counter"];


        const handleChange = (e) => {
          setForm({ ...form, [e.target.name]: e.target.value });
        };

        const handleImageUpload = (e) => {
          const file = e.target.files[0];
          if (!file) return;

          setForm({ ...form, image: file }); // ✅ store File directly
        };



        // const handleSubmit = () => {
        //   // 🔌 BACKEND API CALL
        //   console.log("Add Item Payload:", form);
        // };

      useEffect(() => {
        const close = (e) => {
          if (calendarRef.current && !calendarRef.current.contains(e.target)) {
            setCalendarOpen(false);
          }
        };

        document.addEventListener("pointerdown", close);
        return () => document.removeEventListener("pointerdown", close);
      }, []);


      useEffect(() => {
        if (!editMode || !editItem) return;

        const formattedDate = new Date(editItem.expiryDate)
          .toISOString()
          .split("T")[0]; // YYYY-MM-DD

        setForm({
          name: editItem.name || "",
          category: editItem.category || "",
          quantity: Number(editItem.quantity.split(" ")[0]),
          unit: editItem.quantity.split(" ")[1],
          storage: editItem.storage || "",
          expiryDate: formattedDate, // ✅ now defined
          notes: editItem.notes || "",
          image: editItem.image || null,
        });
      }, [editMode, editItem]);



      //after adding item redirecting to the inventory
      // const handleSubmit = () => {
      //     const existing =
      //       JSON.parse(localStorage.getItem("inventoryItems")) || [];

      //     const newItem = {
      //       id: Date.now(), // unique id
      //       name: form.name,
      //       category: form.category,
      //       quantity: `${form.quantity} ${form.unit}`,
      //       storage: form.storage,
      //       expiryDate: form.expiryDate,
      //       notes: form.notes,
      //       image: form.image,

      //       // 🔑 derive status (important)
      //       status: getStatusFromDate(form.expiryDate),
      //       label: getExpiryLabel(form.expiryDate),
      //     };

      //     const updated = [...existing, newItem];

      //     localStorage.setItem("inventoryItems", JSON.stringify(updated));

      //     navigate("/inventory");
      //   };

       const isFormValid =
          form.name.trim() !== "" &&
          form.category !== "" &&
          form.expiryDate !== "" &&
          form.quantity > 0 &&
          form.unit !== "" &&
          form.storage !== "" &&
          form.image !== null; // image also mandatory


      const handleSubmit = async () => {
        if (!isFormValid) {
          alert("Please fill all required fields");
          return;
        }
      try {
        const formData = new FormData();

        formData.append("name", form.name);
        formData.append("category", form.category);
        formData.append("quantity", `${form.quantity} ${form.unit}`);
        formData.append("storage", form.storage);
        formData.append("expiryDate", form.expiryDate);
        formData.append("notes", form.notes);

        // ✅ append image ONLY if user selected a new one
        if (form.image && form.image instanceof File) {
          formData.append("image", form.image);
        }

        // 🔥 THIS IS WHERE YOUR QUESTION CODE GOES
        if (editMode) {
          await api.put(`/food/${editItem._id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          navigate("/inventory", { replace: true });
        } else {
          await api.post("/food", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          navigate("/inventory", { replace: true });
        }

      } catch (error) {
        console.error("Failed to save item", error);
        alert("Something went wrong while saving the item");
      }
    };



        useEffect(() => {
          if (form.image instanceof File) {
            const previewUrl = URL.createObjectURL(form.image);
            return () => URL.revokeObjectURL(previewUrl);
          }
        }, [form.image]);


       


          

  return (
    <>
      <div className={styles.layout}>
        <Sidebar />

        <div className={styles.main}>
          <Topbar />

          <div className={styles.page}>
            {/* Header */}
            <div className={styles.header}>
              <h1>Add New Item</h1>
              <p>Track a new food item in your inventory</p>
            </div>

            {/* Quick Add */}
            <div className={styles.quickAdd}>
              <div className={styles.quickCard} onClick={() => navigate("/scan-expiry")}>
                <div className={styles.icon}>
                    <Camera size={28} />
                </div>
                <h4>Scan Expiry</h4>
                <p>Use camera to detect expiry date</p>
              </div>

              <label className={styles.quickCard}>
                <div className={styles.icon}>
                  <Upload size={28} />

                </div>
                <h4>Upload Image</h4>
                <p>Upload product photo</p>
                <input type="file" hidden onChange={handleImageUpload} />
              </label>
            </div>

            {/* Content */}
              <h1>{editMode ? "Edit Item" : " Item Details"}</h1>

            <div className={styles.content}>
              {/* Item Details */}

              <div className={styles.formCard}>
                {/* <h3>Item Details</h3> */}

                <label>
                  Item Name *
                  <input
                    name="name"
                    placeholder="e.g. Greek Yogurt"
                    value={form.name}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  Category *
                    <CustomDropdown
                      label="Category"
                      value={form.category}
                      placeholder="Select category"
                      options={CATEGORIES}
                      onSelect={(val) =>
                        setForm({ ...form, category: val })
                      }
                    />
                </label>

                
                <label className={styles.dateField}>
                    Expiry Date *
                    <input
                        type="text"
                        name="expiryDate"
                        placeholder="Select expiry date"
                        readOnly
                        value={form.expiryDate}
                        onClick={(e) => {
                            e.stopPropagation();
                            setCalendarOpen(true);
                        }}
                    />



                    {calendarOpen && (
                        <div  ref={calendarRef}  className={styles.calendarPopup}  onClick={(e) => e.stopPropagation()}>
                        <CustomCalendar
                            value={form.expiryDate}
                            onChange={(date) => {
                            setForm({ ...form, expiryDate: date });
                            setCalendarOpen(false); // close after select
                            }}
                        />
                        </div>
                    )}
                    </label>


                <div className={styles.row}>
                  <label>
                    Quantity *
                    <input
                      type="number"
                      name="quantity"
                      value={form.quantity}
                      onChange={handleChange}
                    />
                  </label>

                  <label>
                    Unit *
                    <CustomDropdown
                      label="Unit"
                      value={form.unit}
                      placeholder="Select unit"
                      options={["pcs", "kg", "g", "L", "ml", "pack", "box", "bottle", "can", "loaf"]}
                      onSelect={(val) =>
                        setForm({ ...form, unit: val })
                      }
                    />

                  </label>
                </div>

                <label>
                  Storage Location *  
                  <CustomDropdown
                    label="Storage Location"
                    value={form.storage}
                    placeholder="Where will you store this?"
                    options={["Refrigerator", "Freezer", "Pantry", "Counter"]}
                    onSelect={(val) =>
                      setForm({ ...form, storage: val })
                    }
                  />

                </label>

                <label>
                  Notes
                  <textarea
                    name="notes"
                    placeholder="Any additional notes..."
                    onChange={handleChange}
                  />
                </label>

                <div className={styles.actions}>
                  <button className={styles.secondary} onClick={() => navigate("/scan-expiry")}>Scan Expiry</button>
                  {/* <button className={styles.primary} onClick={handleSubmit}>
                    {editMode ? "Edit Item" : "Add New Item"}
                  </button> */}

                  <button
                      className={styles.primary}
                      onClick={handleSubmit}
                      disabled={!isFormValid}
                      style={{
                        opacity: isFormValid ? 1 : 0.5,
                        cursor: isFormValid ? "pointer" : "not-allowed",
                      }}
                  >
                    {editMode ? "Edit Item" : "Add New Item"}
                  </button>

                </div>
              </div>

              {/* Preview */}
              <div className={styles.previewCard}>
                <h3>Preview</h3>

                <div className={styles.previewBox}>
                  {form.image ? (
                    <img
                      src={
                        form.image instanceof File
                          ? URL.createObjectURL(form.image)               // new upload
                          : `${API_URL}${form.image}`          // existing image
                      }
                      alt="preview"
                    />
                  ) : (
                    <div className={styles.icon}>
                      <Box size={40} />
                    </div>
                  )}



                  <h4>{form.name || "Item Name"}</h4>
                  <p className={styles.previewCategory}>{form.category || "Category"}</p>

                  <div className={styles.previewMeta}>
                    <span>Expiry Date</span>
                    <span>{form.expiryDate || "—"}</span>

                    <span>Quantity</span>
                    <span>
                      {form.quantity} {form.unit}
                    </span>

                    <span>Storage</span>
                    <span>{form.storage || "—"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MobileBottomNav />
    </>
  );
};

export default AddItem;