import React, { useEffect, useState } from "react";
import styles from "./auth.module.css";
import { CheckCircle2, ArrowLeft, Sparkles, Trash2, PiggyBank, Leaf } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import tomatoIcon from "../../assets/icons/tomato.png";

const CheckEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showToast, setShowToast] = useState(true);
  const [loading, setLoading] = useState(false);
  const email = location?.state?.email || "your email";

  useEffect(() => {
    const timer = setTimeout(() => setShowToast(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleResend = async () => {
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error();

      setShowToast(true);

    } catch {
      alert("Failed to resend email ❌");
    }

    setLoading(false);
  };

  return (
    <div className={styles.page}>
      {/* LEFT PANEL (Same as Login/Register) */}
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
          <div className={styles.centerIconWrap}>
            <div className={styles.successCircle}>
              <CheckCircle2 className={styles.successIcon} />
            </div>
          </div>

          <h2 className={styles.centerTitle}>Check your email</h2>

          <p className={styles.centerSubtitle}>
            We sent a password reset link to <span className={styles.boldEmail}>{email}</span>
          </p>

          <button
            type="button"
            className={styles.resendBtn}
            onClick={handleResend}
            disabled={loading}
          >
            {loading ? "Sending..." : "Didn't receive the email? Click to resend"}
          </button>

          <button
            type="button"
            className={styles.backToLoginBtn}
            onClick={() => navigate("/")}
          >
            <ArrowLeft className={styles.backIconRed} />
            Back to login
          </button>
        </div>

        {/* Toast */}
        {showToast && (
          <div className={styles.toast}>
            <p className={styles.toastTitle}>Reset link sent!</p>
            <p className={styles.toastText}>
              Check your email for password reset instructions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckEmail;
