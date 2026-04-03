import React, { useState } from "react";
import styles from "./auth.module.css";
import tomatoIcon from "../../assets/icons/tomato.png";
import { Mail, User, Lock, Eye, EyeOff, Sparkles, Trash2, PiggyBank, Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";


const Register = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/register", {
        name: form.fullName,     // mapping
        email: form.email,
        password: form.password,
      });

      alert("Account created successfully!");
      navigate("/"); // go to login page

    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Server not responding");
      }
    }
  };


  return (
    <div className={styles.page}>
      {/* LEFT PANEL (Same as Login) */}
      <div className={styles.leftPanel}>
        {/* Tomato Background */}
        <img
          src={tomatoIcon}
          alt="Tomato Background"
          className={styles.tomatoBg}
        />

        <div className={styles.brandWrap}>
          {/* Logo + Title side by side */}
          <div className={styles.brandHeader}>
            <div className={styles.logoBox}>
              <img
                src={tomatoIcon}
                alt="FoodExpiryVision Logo"
                className={styles.logoImage}
              />
            </div>

            <h1 className={styles.brandTitle}>Food Expiry Vision</h1>
          </div>

          {/* Listing */}
          <div className={styles.pointsList}>
                <div className={styles.pointItem}>
                <Sparkles className={styles.pointIcon} />
                <span className={styles.pointText}>AI Expiry Detection</span>
                </div>

                <div className={styles.pointItem}>
                <Trash2 className={styles.pointIcon} />
                <span className={styles.pointText}>Reduce Food Waste</span>
                </div>

                <div className={styles.pointItem}>
                <PiggyBank className={styles.pointIcon} />
                <span className={styles.pointText}>Save Money</span>
                </div>

                <div className={styles.pointItem}>
                <Leaf className={styles.pointIcon} />
                <span className={styles.pointText}>Help the Planet</span>
                </div>
          </div>

          {/* Paragraph */}
          <p className={styles.brandDesc}>
            Our AI-powered system helps you track food expiry dates and detect
            spoilage, reducing waste and saving you money.
          </p>
        </div>

        <div className={styles.footer}>
          © 2026 FoodExpiryVision. All rights reserved.
        </div>
      </div>

      {/* RIGHT PANEL (Register UI as Provided) */}
      <div className={styles.rightPanel}>
        <div className={styles.mobileHeader}>
            <div className={styles.mobileLogoBox}>
                <img src={tomatoIcon} alt="Tomato Icon" className={styles.mobileLogoImg} />
            </div>

            <div className={styles.mobileBrandText}>
                <h3 className={styles.mobileBrandTitle}>Food Expiry</h3>
                <p className={styles.mobileBrandSub}>Vision</p>
            </div>
        </div>



        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Create account</h2>
          <p className={styles.cardSubtitle}>
            Start your journey to zero food waste
          </p>

          <form className={styles.form} onSubmit={handleSubmit}>
            {/* FULL NAME */}
            <div className={styles.field}>
              <label className={styles.label}>Full Name</label>
              <div className={styles.inputWrap}>
                <User className={styles.inputIcon} />
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className={styles.input}
                  required
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <div className={styles.inputWrap}>
                <Mail className={styles.inputIcon} />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={styles.input}
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className={styles.field}>
              <label className={styles.label}>Password</label>
              <div className={styles.inputWrap}>
                <Lock className={styles.inputIcon} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={styles.input}
                  required
                />

                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className={styles.eyeIcon} />
                  ) : (
                    <Eye className={styles.eyeIcon} />
                  )}
                </button>
              </div>

              <p className={styles.helperText}>Must be at least 8 characters</p>
            </div>

            {/* BUTTON */}
            <button type="submit" className={styles.signInBtn}>
              Create account
            </button>

            {/* BOTTOM TEXT */}
            <p className={styles.bottomText}>
                Already have an account?{" "}
                <button
                    type="button"
                    className={styles.signupBtn}
                    onClick={() => navigate("/")}
                >
                    Sign in
                </button>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
