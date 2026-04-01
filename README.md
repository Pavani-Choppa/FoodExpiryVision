# 🍱 FoodExpiryVision

An **AI-powered food management system** that helps users track food items, monitor expiry dates, and reduce food waste using **image-based detection and smart analytics**.

---

## 🚀 Project Overview

FoodExpiryVision combines:

* ⚙️ **Node.js Backend** → API, authentication, database
* 🤖 **FastAPI AI Service** → image-based food detection
* 💻 **React Frontend** → user interface

---

## 🧠 Architecture

```
Frontend (React)
        ↓
Node.js Backend (Express API)
        ↓
FastAPI AI Service (Python)
        ↓
AI Model (Food Detection)
```

---

## ✨ Features

* 🔐 User Authentication (JWT)
* 📦 Food Inventory Management
* 🤖 AI Food Detection via Image Upload
* 🔔 Expiry Notifications
* 📊 Analytics Dashboard
* 📱 Responsive UI

---

## 🛠️ Tech Stack

### 💻 Frontend

* React.js (Vite)
* Axios

### ⚙️ Backend

* Node.js
* Express.js
* MongoDB (Mongoose)

### 🤖 AI Service

* FastAPI
* Python
* Machine Learning Model (.pkl / .h5)

---

## 📁 Project Structure

```bash
FoodExpiryVision/
│
├── backend/           # Node.js backend
├── ai-service/        # FastAPI service (Python)
├── frontend/          # React frontend
└── README.md
```

---

## ⚙️ Installation & Setup

---

## 🔹 Prerequisites

Make sure you have installed:

* Node.js (v16+)
* Python (3.8+)
* MongoDB
* Git

---

# 🔧 Step 1: Clone Repository

```bash
git clone https://github.com/Pavani-Choppa/FoodExpiryVision.git
cd FoodExpiryVision
```

---

# ⚙️ Step 2: Setup Backend (Node.js)

```bash
cd backend
npm install
```

### Create `.env` file

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

### Run Backend

```bash
npm run dev
```

---

# 🤖 Step 3: Setup AI Service (FastAPI)

```bash
cd ../ai-service
```

### 🧪 Create Virtual Environment

#### Windows:

```bash
python -m venv venv
venv\Scripts\activate
```

#### Mac/Linux:

```bash
python3 -m venv venv
source venv/bin/activate
```

---

### 📦 Install Dependencies

```bash
pip install -r requirements.txt
```

If `requirements.txt` not available:

```bash
pip install fastapi uvicorn numpy pandas scikit-learn pillow
```

---

### ▶️ Run FastAPI Server

```bash
uvicorn main:app --reload
```

Server runs at:

```
http://127.0.0.1:8000
```

---

# 🎨 Step 4: Setup Frontend

```bash
cd ../frontend
npm install
npm run dev
```

---

## 🌐 Application URLs

| Service    | URL                   |
| ---------- | --------------------- |
| Frontend   | http://localhost:5173 |
| Backend    | http://localhost:5000 |
| AI Service | http://127.0.0.1:8000 |

---

## 🧠 How It Works

1. User uploads food image
2. Frontend sends image to Node.js backend
3. Backend forwards request to FastAPI
4. FastAPI processes image using AI model
5. Detected food data is returned
6. Stored in MongoDB
7. User gets expiry tracking + alerts

---

## 📸 Screenshots

*Add screenshots here*

---

## 🔒 Environment Variables

| Variable   | Description           |
| ---------- | --------------------- |
| MONGO_URI  | MongoDB connection    |
| JWT_SECRET | Authentication secret |
| EMAIL_USER | Email sender          |
| EMAIL_PASS | Email password        |

---

## 🚀 Future Enhancements

* Barcode scanning
* Mobile app
* Cloud deployment
* AI model improvement

---

🔥 *AI + Full Stack = Real Impact Project*
