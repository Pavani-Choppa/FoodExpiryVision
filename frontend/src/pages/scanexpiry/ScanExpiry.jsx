import { useState,useEffect, useRef } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import MobileBottomNav from "../../components/MobileBottomNav/MobileBottomNav";
import styles from "./ScanExpiry.module.css";

import {
  Camera,
  Upload,
  Scan,
  CheckCircle,
  RotateCcw,
  AlertTriangle,
  Calendar,
  Eye,
  Brain,
} from "lucide-react";

const ScanExpiry = () => {

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [confidence, setConfidence] = useState(0);
  const [aiLabel, setAiLabel] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const getResultClass = () => {
    if (aiLabel === "Fresh") return styles.green;
    if (aiLabel === "Spoiled") return styles.red;
    return styles.yellow;
  };

//   const [cameraOpen, setCameraOpen] = useState(false);
  const [step, setStep] = useState("idle"); 
  // idle | preview | processing | manual | success

  const [image, setImage] = useState(null);
  const [expiryDate, setExpiryDate] = useState("");
  

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(URL.createObjectURL(file));
    setStep("processing");
    sendImageToModel(file);
  };



    const startCamera = async () => {
        setStep("camera");
    };

    useEffect(() => {
        if (step !== "camera") return;

        const startStream = async () => {
            try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" },
                audio: false,
            });

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }
            } catch (err) {
            alert("Camera access denied");
            setStep("idle");
            }
        };

        // if (!imageBlob || imageBlob.size < 10000) {
        // setErrorMsg("⚠️ Invalid image. Try again.");
        // setStep("idle");
        // return;
      // }

        startStream();

        return () => {
            if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
            }
        };
    }, [step]);


    // const sendImageToModel = async (imageBlob) => {
    //   const formData = new FormData();
    //   formData.append("file", imageBlob);

    //   try {
    //     // const response = await fetch("http://localhost:5000/api/food/scan", {
    //     // // fetch("http://127.0.0.1:8000/predict", {
    //     //   method: "POST",
    //     //   body: formData,
    //     // });
        



    //     const data = await response.json();

    //     if (data.label === "Fresh") {
    //       setExpiryDate("Safe to consume");
    //       setStep("success");
    //     } else {
    //       setStep("manual");
    //     }

    //   } catch (error) {
    //     console.error(error);
    //     setStep("manual");
    //   }
    // };
    const sendImageToModel = async (imageBlob) => {
      const formData = new FormData();
      formData.append("image", imageBlob);

      try {
        const response = await fetch("http://localhost:5000/api/food/scan", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        console.log("AI RESULT:", data);

        const score = data.freshness_score;

        // 🔥 STEP 1: INVALID DETECTION (VERY IMPORTANT)
        // 🚨 INVALID INPUT CHECK
      if (score > 0.35 && score < 0.65) {
        setErrorMsg("⚠️ No food detected. Please scan a valid food item.");
        
        setTimeout(() => {
          setStep("idle");
        }, 1500);

        return;
      }

      // ✅ CLEAR ERROR ONLY WHEN VALID
      setErrorMsg("");

        // ✅ SET CONFIDENCE
        // setConfidence((score * 100).toFixed(0));
        if (score > 0.7) {
          setConfidence((score * 100).toFixed(0));
        } else if (score < 0.3) {
          setConfidence(((1 - score) * 100).toFixed(0));
        } else {
          setConfidence((score * 100).toFixed(0));
        }

        // ✅ SET LABEL
        if (score > 0.7) {
          setAiLabel("Fresh");
          setExpiryDate("Safe to consume");
          setStep("success");
        } else if (score < 0.3) {
          setAiLabel("Spoiled");
          setStep("manual");
        } else {
          setAiLabel("Uncertain");
          setStep("manual");
        }

      } catch (error) {
        console.error(error);
        setStep("manual");
      }
    };

    const getIcon = () => {
      if (aiLabel === "Fresh") return <CheckCircle />;
      if (aiLabel === "Spoiled") return <AlertTriangle />;
      return <Brain />;
    };
    // const capturePhoto = () => {
    //   const canvas = canvasRef.current;
    //   canvas.toBlob((blob) => {
    //     setImage(URL.createObjectURL(blob));
    //     setStep("processing");
    //     sendImageToModel(blob);
    //   }, "image/jpeg");
    // };

    const capturePhoto = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      const context = canvas.getContext("2d");

      // 🔥 SET CANVAS SIZE
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // 🔥 DRAW VIDEO FRAME
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // 🔥 CONVERT TO IMAGE
      // canvas.toBlob((blob) => {
      //   setImage(URL.createObjectURL(blob));
      //   setStep("processing");
      //   sendImageToModel(blob);
      // }, "image/jpeg");
      canvas.toBlob((blob) => {
        setImage(URL.createObjectURL(blob));
        setStep("processing");
        stopCamera(); // ✅ ADD THIS
        sendImageToModel(blob);
      }, "image/jpeg");
    };



    const stopCamera = () => {
    if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
    }
    setStep("idle");
    };

    useEffect(() => {
    return () => {
        if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        }
    };
    }, []);

  

  return (
    <>
      <div className={styles.layout}>
        <Sidebar />

        <div className={styles.main}>
          <Topbar />

          <div className={styles.page}>
            {/* Header */}
            <div className={styles.header}>
              <h1>Scan Expiry Date</h1>
              <p>Use your camera or upload an image to detect expiry dates</p>
            </div>

            {errorMsg && (
              <div className={styles.error}>
                {errorMsg}
              </div>
            )}

            {/* MAIN CARD */}
            <div className={styles.card}>

                {/* ========== IDLE STATE ========== */}
                {step === "idle" && (
                    <>
                    <div className={styles.iconBox}>
                        <Scan size={28} />
                    </div>

                    <h3>Smart Expiry Detection</h3>
                    <p className={styles.sub}>
                        Capture or upload a photo of the expiry date label and we’ll
                        detect it automatically using OCR.
                    </p>

                    <div className={styles.actions}>
                        <button className={styles.lightBtn} onClick={startCamera}>
                        <Camera size={18} className={styles.icon} />
                        <h3>Use Camera</h3>
                        <p>Capture Live</p>
                        </button>

                        <label className={styles.dashedBtn}>
                        <Upload size={18} className={styles.icon} />
                        <h4>Upload Image</h4>
                        <p>From Gallery</p>
                        <input type="file" hidden onChange={handleUpload} />
                        </label>
                    </div>

                    <div className={styles.ocrInfo}>
                        <CheckCircle size={16} />
                        OCR Powered – works best with clear images
                    </div>
                    </>
                )}

                {/* ========== CAMERA STATE ========== */}
                {step === "camera" && (
                    <div className={styles.cameraCard}>
                        <div className={styles.videoWrap}>
                            <video
                            ref={videoRef}
                            className={styles.video}
                            autoPlay
                            playsInline
                            muted
                            />

                            {/* 🔴 Scanning Overlay */}
                            <div className={styles.scanFrame}>
                            <span className={styles.scanLine}></span>
                            </div>
                        </div>

                        <div className={styles.cameraActions}>
                            <button onClick={stopCamera} className={styles.secondary}>
                            Cancel
                            </button>

                            <button onClick={capturePhoto} className={styles.primary}>
                            Capture & Scan
                            </button>
                        </div>

                        <canvas ref={canvasRef} hidden />
                        </div>

                )}

                {/* ========== PROCESSING STATE ========== */}                

                {step === "processing" && (
                  <div className={styles.processingCard}>
                    {/* Image Preview */}
                    <div className={styles.processingImage}>
                      {image && <img src={image} alt="preview" />}
                    </div>

                    {/* AI Icon 🧠 */}
                    <div className={styles.aiIcon}><Brain size={30}/></div>

                    {/* Title */}
                    <h3 className={styles.processingTitle}>AI Analysis</h3>
                    <p className={styles.processingSub}>
                      Analyzing food condition with AI...
                    </p>

                    {/* Progress Bars */}
                    <div className={styles.analysisBlock}>
                      <div className={styles.analysisRow}>
                        <span>OCR Analysis</span>
                        <span>100%</span>
                      </div>
                      <div className={styles.progressBar}>
                        <div className={`${styles.progressFill} ${styles.full}`}></div>
                      </div>

                      <div className={styles.analysisRow}>
                        <span>AI Spoilage Detection</span>
                        <span>45%</span>
                      </div>
                      <div className={styles.progressBar}>
                        <div className={`${styles.progressFill} ${styles.partial}`}></div>
                      </div>
                    </div>
                  </div>
                )}


              {step === "manual" && (
                <div className={styles.resultCard}>
                  <div className={styles.resultHeader}>
                    <span className={styles.aiBadge}><Brain size={20}/></span>
                    <div>
                      <h4>AI Analysis Result</h4>
                      <p>Computer Vision + OCR</p>
                    </div>
                  </div>

                  {/* 🔴 SPOILED RESULT */}
                  {/* <div className={styles.resultAlertRed}> */}
                  <div className={`${styles.resultAlert} ${getResultClass()}`}>
                   <h3>
                      <AlertTriangle size={18}/> {aiLabel}
                    </h3>
                    <p>Visual spoilage detected: discoloration</p>

                    <div className={styles.confidenceRow}>
                      <span>Confidence</span>
                      <span>{confidence}%</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${confidence}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Expiry */}
                  <div className={styles.resultSection}>
                    <h4><Calendar size={18} className={styles.iconm}/> Expiry Analysis</h4>
                    <p>No expiry date detected</p>
                  </div>

                  {/* Visual */}
                  <div className={styles.resultSection}>
                     <div>
                    <h4><Eye size={18} className={styles.iconm}/> Visual Spoilage Check</h4>
                    <p>Indicators: discoloration</p> </div>
                     <div> <span className={styles.badgeRed}>Detected</span> </div>
                  </div>

                  {/* Manual Entry */}
                  <label className={styles.manualInput}>
                    Enter expiry date
                    <input
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                    />
                  </label>

                  <div className={styles.bottomActions}>
                    <button className={styles.secondary} onClick={() => setStep("idle")}>
                      Retry
                    </button>
                    {/* <button className={styles.primary} onClick={() => setStep("success")}>
                      Confirm & Continue
                    </button> */}
                    <button
                      className={styles.primary}
                      onClick={() => {
                        if (aiLabel === "Fresh") {
                          setStep("success");
                        } else if (aiLabel === "Spoiled") {
                          alert("⚠️ This item is spoiled. Not safe to consume.");
                        } else {
                          if (!expiryDate) {
                            alert("Please enter expiry date first");
                            return;
                          }
                          setStep("success");
                        }
                      }}
                      >
                      Confirm & Continue
                      </button>
                  </div>
                </div>
              )}

              {step === "success" && (
                <div className={styles.successCard}>
                    <div className={styles.successIcon}>
                    <CheckCircle size={36} />
                    </div>

                    <h3 className={styles.successTitle}>Expiry Date Detected</h3>

                    <div className={styles.datePill}>
                    {expiryDate}
                    </div>

                    <p className={styles.successHint}>
                    Please confirm the detected expiry date before continuing
                    </p>

                    <div className={styles.successActions}>
                    <button
                        className={styles.secondary}
                        onClick={() => setStep("idle")}
                    >
                        Scan Another
                    </button>

                    <button
                        className={styles.primary}
                        onClick={() => {
                        alert("Expiry date confirmed!");
                        }}
                    >
                        Confirm & Continue
                    </button>
                    </div>
                </div>
                )}
            </div>

            {/* Tips */}
            <div className={styles.infoGrid}>
                {/* Left: Tips */}
                <div className={styles.tipsCard}>
                    <h3>Tips for Better Detection</h3>
                    <ul className={styles.tipsList}>
                    <li>Ensure good lighting – natural light works best</li>
                    <li>Keep the camera steady and focus on the date area</li>
                    <li>Avoid curved or reflective surfaces</li>
                    <li>Common formats: DD/MM/YYYY, MM/YYYY, “Best Before”, “Use By”</li>
                    </ul>
                </div>

                {/* Right: OCR Workflow */}
                <div className={styles.workflowCard}>
                    <h3>How it works</h3>

                    <div className={styles.step}>
                    <span className={styles.stepCircle}>1</span>
                    <div>
                        <h4>Position the item</h4>
                        <p>Place food package in camera view</p>
                    </div>
                    </div>

                    <div className={styles.step}>
                    <span className={styles.stepCircle}>2</span>
                    <div>
                        <h4>AI Analysis</h4>
                        <p>OCR reads expiry, CNN checks freshness</p>
                    </div>
                    </div>

                    <div className={styles.step}>
                    <span className={styles.stepCircle}>3</span>
                    <div>
                        <h4>Get Results</h4>
                        <p>Safe / Unsafe classification instantly</p>
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

export default ScanExpiry;
