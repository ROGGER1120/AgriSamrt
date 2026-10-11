# 🌾 AgriSmart — Farmer Market Price & Weather Forecast System

AgriSmart is a full-stack agricultural intelligence platform designed to empower farmers and agricultural traders with real-time APMC mandi prices, multi-market comparison analytics, microclimate weather forecasts, and agro-meteorological advisories.

---

## 🌟 Key Features

### 1. 🔐 Authentication & Access Control
- **Farmer & Mandi Admin Registration & Login** with JSON Web Tokens (JWT) & bcrypt password hashing.
- **Role-Based Access Control**:
  - **Farmer Mode**: View prices, bookmark favorite crops, simulate transport profits, receive alerts.
  - **Mandi Admin Mode**: Add, edit, and delete crop price records, broadcast notices.
- **1-Click Demo Logins**: Instant testing buttons for both Farmer and Admin roles.
- **Password Recovery**: Security question verification and reset workflow.

### 2. 📈 Market Price Management
- **Live Mandi Rates**: Track Modal (prevailing) prices, Min/Max ranges, and arrival volume (Quintals).
- **Search & Filters**: Instant search by crop name, category (Cereals, Vegetables, Pulses, Oilseeds, Cash Crops, Spices), market, and sort options.
- **14-Day Price History**: Interactive Recharts area chart showing historical trends and trading volumes.
- **High/Low Price Badges**: Real-time visual indicators for highest-paying and lowest-paying mandis.
- **Admin CRUD**: Full modal interface to add, update, and remove mandi price entries.

### 3. ⭐ Special Feature: Market Price Comparison & Net Profit Calculator
- **Multi-Mandi Side-by-Side Comparison**: Compare prices for any crop (Wheat, Tomato, Onion, Basmati Rice, Cotton, Soybean, etc.) across multiple APMC terminals (Azadpur, Vashi, Lasalgaon, Khanna, Surat, Indore, Guntur).
- **Comparative Bar Chart**: Visual spread comparison highlighting peak and minimum price mandis.
- **Farmer Transport & Net Profit Calculator**: Enter harvest quantity (quintals) to calculate gross revenue, approximate freight cost based on transport distance benchmarks, and net farmer payout.
- **Recommendation Badge**: Recommends the highest net profit destination.

### 4. 🌦️ Weather Dashboard & Agro-Advisories
- **Live Atmospheric Telemetry**: Temperature, "Feels Like", Humidity, Wind Velocity, Barometric Pressure, and Visibility.
- **Mandi City Search**: Quick buttons for major farming hubs (Nashik, Delhi, Mumbai, Ludhiana, Pune, Surat, Indore, Guntur, Bengaluru, etc.).
- **Smart Agricultural Advisories**:
  - **Spraying Window**: Advises whether conditions are optimal or if pesticide spraying should be delayed due to rain/wind drift.
  - **Rainfall & Drainage Alerts**: Warnings for heavy precipitation and moisture retention.
  - **Heat & Frost Warnings**: Temperature threshold advisories for horticultural crops.
- **6-Day Forecast**: Daily max/min temperatures and rain probability percentages.

### 5. 🔔 Notifications & Announcements
- **Slide-Over Notification Drawer**: Real-time slide-over panel with unread badges.
- **Categorized Hub**: Filter between **Weather Alerts**, **Price Spikes**, and **Govt Announcements (MSP revisions, subsidies)**.
- **Mark as Read**: One-click acknowledgement and read status synchronization.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + Vite |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/vite`) + Custom Glassmorphism |
| **Icons** | Lucide React |
| **Charts** | Recharts (AreaChart, BarChart) |
| **Backend** | Node.js + Express.js (ES Modules) |
| **Database** | MongoDB (Mongoose ORM) |
| **Authentication** | JWT (jsonwebtoken) + bcryptjs |
| **Weather Integration** | OpenWeatherMap API + Zero-Config High-Precision Fallback |

---

## 📋 Prerequisites

Before running the application, make sure you have the following installed:
1. **Node.js**: v18.0.0 or later (v20+ recommended)
2. **npm**: v9.0.0 or later
3. **MongoDB**: Local MongoDB Community/Enterprise Server running on port `27017` (or a MongoDB Atlas connection URI)

---

## 🚀 Quick Setup & Run Instructions

### Step 1: Clone or Navigate to the Project Directory
```powershell
cd h:\Arini\AgriSmart
```

---

### Step 2: Backend Setup

1. **Navigate to the `backend` folder**:
   ```powershell
   cd backend
   ```

2. **Install backend dependencies**:
   ```powershell
   npm install
   ```

3. **Verify Environment Variables (`.env`)**:
   A `.env` file is located at `backend/.env`. You can adjust configurations as needed:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/agrismart
   JWT_SECRET=agrismart_super_secret_jwt_key_2026_crop_harvest
   OPENWEATHERMAP_API_KEY=your_openweathermap_api_key_here
   ```
   > **Note on Weather API**: If you do not have an OpenWeatherMap API key yet, leave it blank. AgriSmart includes an automatic intelligent agricultural climate fallback engine so all weather metrics, city searches, and agro-advisories will function out-of-the-box!

4. **Seed the Database with Sample Data**:
   Populates default users, 8 APMC mandis, 27+ crop price records with 14-day history, and notifications:
   ```powershell
   npm run seed
   ```

5. **Start the Backend Server**:
   ```powershell
   npm start
   ```
   *The backend will be running at:* `http://localhost:5000`  
   *Health Check:* `http://localhost:5000/api/health`

---

### Step 3: Frontend Setup

1. **Open a new terminal window** and navigate to the `frontend` folder:
   ```powershell
   cd h:\Arini\AgriSmart\frontend
   ```

2. **Install frontend dependencies**:
   ```powershell
   npm install
   ```

3. **Start the Vite Development Server**:
   ```powershell
   npm run dev
   ```

4. **Open in Browser**:
   Open your browser and navigate to:
   ```
   http://localhost:5173/
   ```

---

## 🔑 Pre-Configured Demo Credentials

For quick evaluation without registering a new account, you can use either the 1-click buttons on the login screen or these credentials:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **🌾 Farmer (Kisan)** | `farmer@agrismart.in` | `Farmer@123` | View prices, favorite crops, weather, market comparison & profit calculator |
| **🛡️ Mandi Admin** | `admin@agrismart.in` | `Admin@123` | Add/Edit/Delete mandi crop prices, broadcast announcements |

*(You can also click the quick **"🌾 Kisan Mode"** / **"🛡️ Mandi Admin"** toggle pill directly in the top navbar to switch roles on the fly).*

---

## 📂 Project Architecture

```text
AgriSmart/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection
│   │   ├── models/
│   │   │   ├── User.js               # User accounts & favorite crops
│   │   │   ├── CropPrice.js          # Mandi price records & 14-day history
│   │   │   ├── Market.js             # APMC mandis & transport benchmarks
│   │   │   └── Notification.js       # Weather alerts & price spikes
│   │   ├── controllers/
│   │   │   ├── authController.js     # Register, Login, Me, Reset Password
│   │   │   ├── priceController.js    # Prices CRUD, multi-mandi comparison
│   │   │   ├── weatherController.js  # Telemetry, agro-advisories, 6-day forecast
│   │   │   └── notificationController.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── priceRoutes.js
│   │   │   ├── weatherRoutes.js
│   │   │   └── notificationRoutes.js
│   │   ├── middleware/
│   │   │   └── authMiddleware.js     # JWT verification & role authorization
│   │   ├── seed/
│   │   │   └── seedData.js           # Database seeder
│   │   └── server.js                 # Express application entry point
│   ├── .env                          # Backend environment variables
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js             # Axios client with JWT interceptor
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Auth state, login, logout, favorites
│   │   │   └── NotificationContext.jsx # Live notifications state
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Top navbar, weather pill, role switcher
│   │   │   ├── Sidebar.jsx           # App navigation sidebar
│   │   │   ├── PriceCard.jsx         # Card with high/low badges & modal triggers
│   │   │   ├── PriceHistoryModal.jsx # 14-day Recharts area chart modal
│   │   │   ├── PriceFormModal.jsx    # Add/Edit crop price modal
│   │   │   ├── ProfitCalculator.jsx  # Net profit & freight cost calculator
│   │   │   └── NotificationDrawer.jsx# Slide-over notification panel
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx         # Main Farmer Dashboard
│   │   │   ├── MarketPrices.jsx      # Filterable prices list (Grid/Table)
│   │   │   ├── MarketComparison.jsx  # Special feature: Multi-mandi comparison
│   │   │   ├── WeatherPage.jsx       # Weather telemetry & agro-advisories
│   │   │   ├── NotificationsPage.jsx # Full notification center
│   │   │   ├── Login.jsx             # Auth sign-in with 1-click demo
│   │   │   ├── Register.jsx          # User registration
│   │   │   └── ForgotPassword.jsx    # Password recovery
│   │   ├── App.jsx                   # Main layout and tab router
│   │   ├── main.jsx                  # React DOM mount
│   │   └── index.css                 # Tailwind v4 & glassmorphic styling
│   ├── index.html
│   ├── vite.config.js                # Vite config with @tailwindcss/vite & API proxy
│   └── package.json
│
└── README.md                         # Documentation & instructions
```

---

## 📡 API Reference Summary

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new farmer or admin
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET /api/auth/me` — Get authenticated user profile (`Bearer <token>`)
- `PUT /api/auth/favorites` — Add or remove a crop from favorites
- `POST /api/auth/forgot-password-check` — Verify user email and retrieve security question
- `POST /api/auth/reset-password` — Reset account password

### Market Prices (`/api/prices`)
- `GET /api/prices` — Get crop prices with search, filtering, and pagination
- `GET /api/prices/compare?crop=Wheat` — **Special Feature**: Cross-market comparison and spread analysis
- `GET /api/prices/history?crop=Wheat&market=Azadpur` — 14-day price trend history points
- `GET /api/prices/summary` — Dashboard metrics, top gainers, and downward price movements
- `GET /api/prices/meta` — Get list of distinct crop names, mandis, and categories
- `POST /api/prices` — Create a new crop price record (Protected)
- `PUT /api/prices/:id` — Update existing crop price (Protected)
- `DELETE /api/prices/:id` — Delete a crop price record (Protected)

### Weather (`/api/weather`)
- `GET /api/weather?city=Nashik` — Current weather telemetry, agro-advisories, and 6-day forecast

### Notifications (`/api/notifications`)
- `GET /api/notifications` — Fetch weather alerts, price spikes, and announcements
- `POST /api/notifications` — Create announcement (Admin only)
- `PUT /api/notifications/:id/read` — Mark notification as acknowledged
- `PUT /api/notifications/read-all` — Mark all notifications as read

---

## 💡 Troubleshooting

1. **MongoDB Connection Failed**:
   - Ensure MongoDB is running locally:
     ```powershell
     Get-Service MongoDB
     ```
   - If not running, start it using:
     ```powershell
     Start-Service MongoDB
     ```
2. **Port 5000 or 5173 Already in Use**:
   - Change `PORT=5000` in `backend/.env` or specify `--port 5174` in `frontend/package.json`.
3. **OpenWeatherMap Invalid Key**:
   - If you do not have an active key, leave `OPENWEATHERMAP_API_KEY=` empty in `backend/.env`. The application will automatically switch to the high-precision climate engine without any errors.
