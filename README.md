# HoneyToken Sentinel (Version 2.0)

HoneyToken Sentinel is a high-fidelity cybersecurity honeypot monitoring system designed to detect and alert on unauthorized file access in real-time. By placing "honeytokens" (decoy files) within your filesystem, the system acts as a silent alarm, providing immediate notification when an intruder interacts with sensitive areas.

---

## 🚀 Version 2.0
This version introduces major improvements in real-time detection, dashboard management, and automated security responses, including screenshot capture and enhanced alert filtering.

## ✨ Features
- **Real-time Honeypot Monitoring**: Instant detection of file interactions using high-performance filesystem watchers.
- **File Access Detection**: Tracks read, write, and delete operations on monitored assets.
- **Intrusion Alerts**: Automated email and dashboard notifications upon security breaches.
- **Activity Logs**: Detailed history of all detected interactions for forensic analysis.
- **Security Dashboard**: A premium, modern interface for managing security state at a glance.
- **Dashboard Snapshot Capture**: Automatically captures current dashboard state or webcam snapshots during alerts.
- **Email Alerts**: Integration with SMTP services for reliable notification delivery.
- **Alert Management**: Full control over alerts including Mark Read, Delete, and Advanced Filtering.

## 🛠 Tech Stack
### Frontend
- **React + Vite**: For a fast, responsive single-page application experience.
- **Tailwind CSS**: Modern utility-first styling for a premium look.

### Backend
- **Node.js & Express**: Scalable and fast server-side architecture.
- **Socket.io**: Enables real-time, bi-directional communication between server and client.
- **Chokidar**: Robust and efficient file watching library.

### Database
- **MongoDB**: Flexible NoSQL database for storing alerts, logs, and user configurations.

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-repo/HoneyToken-Sentinel.git
cd HoneyToken-Sentinel
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the `backend` directory based on the variables listed below.

### 5. Run the System
**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

---

## 🔑 Environment Variables
Configure these in `backend/.env`:

| Variable | Description |
| :--- | :--- |
| `MONGO_URI` | Connection string for MongoDB |
| `SMTP_HOST` | SMTP server host address |
| `SMTP_PORT` | SMTP server port |
| `SMTP_USER` | Email service username |
| `SMTP_PASS` | Email service password |
| `ALERT_EMAIL` | Destination email for security alerts |
| `JWT_SECRET` | Secret key for authentication tokens |

---

## 📋 How It Works & Workflow

HoneyToken Sentinel operates on a "tripwire" principle. 

1. **Create Honeypot Rule**: Configure specific files or directories as honeytokens via the dashboard.
2. **Backend Watches Filesystem**: The backend service (using Chokidar) monitors the specified paths for any activity.
3. **Unauthorized Access Triggers Alert**: As soon as a file is accessed (read/modified/deleted), an event is fired.
4. **Alert Stored in MongoDB**: The event details (timestamp, file path, access type) are persisted.
5. **Real-time Notification**: Socket.io pushes the alert to the dashboard immediately, and an email is dispatched via SMTP.

---

## 📁 Project Structure
```text
HoneyToken-Detector/
├── backend/
│   ├── models/          # MongoDB Schemas
│   ├── routes/          # API Endpoints
│   ├── services/        # Business logic (Watcher, Email, Screenshot)
│   ├── intruders/       # Directory for monitored files
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # UI Components
│   │   ├── pages/       # Dashboard and Login views
│   │   ├── context/      # Auth and Alert state management
│   │   └── App.jsx      # Main router
│   └── index.html
└── README.md
```

---

## 📄 License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
