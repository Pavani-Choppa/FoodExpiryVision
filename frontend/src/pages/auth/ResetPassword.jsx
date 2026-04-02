
import React, { useState } from "react";
import styles from "./auth.module.css";
import { ArrowLeft, Lock, Sparkles, Trash2, PiggyBank, Leaf , Eye,EyeOff} from "lucide-react";
import { useNavigate } from "react-router-dom";
import tomatoIcon from "../../assets/icons/tomato.png";
import { useLocation } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token");
  
  const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const API_URL = import.meta.env.VITE_API_URL;

            const response = await fetch(`${API_URL}/api/auth/reset-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, password }),
            });

            if (!response.ok) {
            throw new Error("Reset failed");
            }

            alert("Password reset successful ✅");
            navigate("/");

        } catch (err) {
            alert("Invalid or expired link ❌");
        }
    };


  return (
    <div className={styles.page}>
      
      {/* LEFT PANEL (same as forgot password) */}
      <div className={styles.leftPanel}>
        <img src={tomatoIcon} alt="Tomato Background" className={styles.tomatoBg} />

        <div className={styles.brandWrap}>
          <div className={styles.brandHeader}>
            <div className={styles.logoBox}>
              <img src={tomatoIcon} alt="Tomato Icon" className={styles.logoImage} />
            </div>

            <h1 className={styles.brandTitle}>Food Expiry Vision</h1>
          </div>

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

          <p className={styles.brandDesc}>
            Our AI-powered system helps you track food expiry dates and detect
            spoilage, reducing waste and saving you money.
          </p>
        </div>

        <div className={styles.footer}>
          © 2026 FoodExpiryVision. All rights reserved.
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className={styles.rightPanel}>
        
        {/* MOBILE HEADER */}
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
          
          {/* Back */}
          <button
            type="button"
            className={styles.backLink}
            onClick={() => navigate("/")}
          >
            <ArrowLeft className={styles.backIcon} />
            Back to login
          </button>

          <h2 className={styles.cardTitle}>Reset Password</h2>
          <p className={styles.cardSubtitle}>
            Enter your new password below.
          </p>

          <form className={styles.form} onSubmit={handleSubmit}>
            
            <div className={styles.field}>
              <label className={styles.label}>New Password</label>

              <div className={styles.inputWrap}>
                <Lock className={styles.inputIcon} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
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
            </div>

            <button type="submit" className={styles.signInBtn}>
              Reset Password
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;