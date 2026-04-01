import React from "react";
import styles from "./Landing.module.css";
import {Sparkles,  ChevronRight,Smartphone, Leaf, Bell, ScanLine, ShieldCheck,TrendingDown } from "lucide-react";


import { useNavigate } from "react-router-dom";
import tomatoIcon from "../../assets/icons/tomato.png";

const Landing = () => {
   const navigate = useNavigate();
      const consumeFirstData = [
      {
        id: 1,
        name: "Greek Yogurt",
        category: "Dairy",
        status: "today",          // today | soon | expired
        label: "Expires today",
      },
      {
        id: 2,
        name: "Fresh Milk",
        category: "Dairy",
        status: "soon",
        label: "1 day left",
      },
      {
        id: 3,
        name: "Chicken Breast",
        category: "Meat",
        status: "soon",
        label: "1 day left",
      },
      {
        id: 4,
        name: "Spinach Leaves",
        category: "Vegetables",
        status: "soon",
        label: "2 days left",
      },
      {
        id: 5,
        name: "Orange Juice",
        category: "Beverages",
        status: "expired",
        label: "1d overdue",
      },
    ];


  return (
    <div className={styles.page}>
      {/* ================= HEADER ================= */}
      <header className={styles.header}>
        <div className={styles.logo}>
            <img src={tomatoIcon} alt="Tomato" />
            <span>Food Expiry Vision</span>
        </div>


        <div className={styles.headerActions}>
          <button className={styles.linkBtn} onClick={() => navigate("/login")}>
            Sign in
          </button>
          <button
            className={styles.primaryBtn}
            onClick={() => navigate("/signup")}
          >
            Get Started
          </button>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          
          <span className={styles.badge}>
            <Sparkles size={14} />
            Smart Food Management
          </span>
          <h1 className={styles.title}>
            Never Let Food <br />
            <span>Go To Waste</span>
          </h1>

          <p className={styles.subtitle}>
            Track expiry dates, get timely alerts, and reduce food waste with our
            intelligent food management system.
          </p>

          <div className={styles.heroButtons}>
            <button className={styles.primaryBtn} onClick={() => navigate("/signup")}> 
              Start Free Trial
              <ChevronRight size={16} />
            </button>

            <button className={styles.secondaryBtn}>
              <Smartphone size={16} />
              View Demo
            </button>
          </div>


          <div className={styles.stats}>
            <div>
              <h3>40%</h3>
              <p>Less Food Waste</p>
            </div>
            <div>
              <h3>500+</h3>
              <p>Items Tracked</p>
            </div>
            <div>
              <h3>24/7</h3>
              <p>Smart Alerts</p>
            </div>
          </div>
        </div>

        {/* Floating cards */}
        <div className={styles.heroRight}>
          {/* MAIN CARD */}
          <div className={styles.mainCard}>
            <div className={styles.mainCardLeft}>
              <div className={styles.iconGreen}>
                <Leaf className={styles.icon} />
              </div>

              <div>
                <h4 className={styles.cardTitle}>Fresh Milk</h4>
                <p className={styles.cardSub}>Refrigerator</p>
                <p className={styles.expireLabel}>Expires in</p>
              </div>
            </div>

          <span className={styles.daysBadge}>5 days</span>
        </div>

        {/* FLOATING CARD – WASTE REDUCED */}
          <div className={`${styles.floatingCard} ${styles.floatOne}`}>
              <div className={styles.iconRed}>
                <TrendingDown className={styles.icon} />
              </div>
              <div>
                <p className={styles.floatText}>Waste reduced</p>
                <strong className={styles.floatValue}>-42%</strong>
              </div>
            </div>

            {/* FLOATING CARD – YOGURT */}
            <div className={`${styles.floatingCard} ${styles.floatTwo}`}>
              <div className={styles.iconYellow}>
                <Bell className={styles.icon} />
              </div>
              <div>
                <p className={styles.floatText}>Yogurt expires</p>
                <strong className={styles.floatValue}>in 2 days</strong>
              </div>
            </div>
          </div>

      </section>

      {/* ================= FEATURES ================= */}
      <section className={styles.features}>
        <h2>Everything You Need</h2>
        <p className={styles.sectionSub}>
          Powerful features to help you manage your food inventory efficiently and reduce waste.
        </p>

        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={`${styles.iconWrap} ${styles.iconRed}`}>
              <ScanLine />
            </div>
            <h4>Smart OCR Scanning</h4>
            <p>
              Instantly capture expiry dates with your camera.
              No manual entry needed.
            </p>
          </div>

          <div className={styles.featureCard}>
              <div className={`${styles.iconWrap} ${styles.iconYellow}`}>
                <Bell />
              </div>
              <h4>Timely Alerts</h4>
              <p>
                Get notified before food expires.
                Customize reminders at 7, 3, or 1 day.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={`${styles.iconWrap} ${styles.iconRed}`}>
                <TrendingDown />
              </div>
              <h4>Reduce Waste</h4>
              <p>
                Track consumption patterns and minimize
                food waste by up to 40%.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={`${styles.iconWrap} ${styles.iconRed}`}>
                <ShieldCheck />
              </div>
              <h4>Food Safety</h4>
              <p>
                Never consume expired food again.
                Keep your family safe and healthy.
              </p>
            </div>
        </div>
      </section>
      {/* ================= HOW IT WORKS ================= */}
      <section className={styles.howItWorks}>
        <h2 className={styles.hiwTitle}>How It Works</h2>
        <p className={styles.hiwSub}>
          Get started in minutes with our simple three-step process.
        </p>

        <div className={styles.stepsGrid}>
          <div className={styles.stepCard}>
            <span className={styles.stepNumber}>01</span>
            <h4>Scan or Add</h4>
            <p>
              Use your camera to scan expiry dates or add items manually.
            </p>
          </div>

          <div className={styles.stepCard}>
            <span className={styles.stepNumber}>02</span>
            <h4>Track &amp; Organize</h4>
            <p>
              View your inventory organized by expiry status and category.
            </p>
          </div>

          <div className={styles.stepCard}>
            <span className={styles.stepNumber}>03</span>
            <h4>Get Alerts</h4>
            <p>
              Receive smart notifications before your food expires.
            </p>
          </div>
        </div>
      </section>


      {/* ================= CTA ================= */}
      <section className={styles.cta}>
        <div className={styles.ctaIcon}>
          <ShieldCheck />
        </div>

        <h2>Ready to Reduce Food Waste?</h2>

        <p>
          Join thousands of households saving money and reducing waste with
          Food Expiry Vision. Start your free trial today.
        </p>

        <button className={styles.primaryBtn} onClick={() => navigate("/signup")}>
          Get Started Free <ChevronRight size={16} />
        </button>

        <span>No credit card required • Free forever for personal use</span>
      </section>


      {/* ================= FOOTER ================= */}
      <footer className={styles.footer}>
        <div className={styles.footerLeft}>
          <div className={styles.footerLogo}>
            <img src={tomatoIcon} alt="Tomato" />
          </div>
          <p>© 2026 Food Expiry Vision. All rights reserved.</p>
        </div>

        <div className={styles.footerActions}>
          <button className={styles.footerLink} onClick={() => navigate("/login")}>Sign in</button>
          <button className={styles.footerLink} onClick={() => navigate("/signup")}>Sign up</button>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
