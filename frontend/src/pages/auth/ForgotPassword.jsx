import React, { useState } from "react";
import styles from "./auth.module.css";
import {ArrowLeft, Mail, Sparkles, Trash2, PiggyBank, Leaf } from "lucide-react";

import { useNavigate } from "react-router-dom";

import tomatoIcon from "../../assets/icons/tomato.png"; // (only if you already use this in login/register)

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Later: API call -> send reset email/otp
    // After success navigate to check email screen
    navigate("/check-email", { state: { email } });
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
        {/* MOBILE HEADER (same as login/register mobile) */}
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
          {/* Back to login */}
          <button
            type="button"
            className={styles.backLink}
            onClick={() => navigate("/")}
          >
            <ArrowLeft className={styles.backIcon} />
            Back to login
          </button>

          <h2 className={styles.cardTitle}>Forgot password?</h2>
          <p className={styles.cardSubtitle}>
            No worries, we&apos;ll send you reset instructions.
          </p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.label}>Email</label>

              <div className={styles.inputWrap}>
                <Mail className={styles.inputIcon} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={styles.input}
                  required
                />
              </div>
            </div>

            <button type="submit" className={styles.signInBtn}>
              Reset password
            </button>

            <p className={styles.bottomText}>
              Remember your password?{" "}
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

export default ForgotPassword;
