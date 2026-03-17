# HoneyToken Sentinel (Version 3.0) — SOC Intelligence Dashboard

HoneyToken Sentinel is a high-fidelity, premium cybersecurity honeypot monitoring system designed to detect and alert on unauthorized file access in real-time. By placing "honeytokens" (decoy files) within your filesystem, the system acts as a silent alarm, providing immediate notification when an intruder interacts with sensitive areas.

---

## 🚀 Version 3.0 (SOC Edition)
This version introduces a complete professional redesign, robust email alert reliability, and advanced SOC (Security Operations Center) management features.

## ✨ Features
- **Premium SOC Dashboard**: A stunning, dark-themed interface with neon accents and glassmorphism for maximum visual impact.
- **Real-time Heuristic Monitoring**: High-performance filesystem watchers with Socket.io for millisecond-latency alerts.
- **Forensic Evidence Suite**: Automated capture of dashboard snapshots, desktop screenshots, and webcam images during critical breaches.
- **Reliable Email Alerts**: A robust email system with retry logic (3 attempts), database status tracking, and rich HTML formatting.
- **Advanced Incident Command**: Bulk alert management, multi-select purge, and high-fidelity search/filtering.
- **Visual Intelligence**: Real-time Recharts visualizations showing threat vectors, high-risk assets, and access frequency.
- **Audit Trail Forensics**: Comprehensive logging of every interaction for deep forensic analysis.

## 🛠 Tech Stack
### Frontend
- **React + Vite**
- **Tailwind CSS**
- **Recharts**
- **Lucide Icons**

### Backend
- **Node.js & Express**
- **Socket.io**
- **Mongoose (MongoDB)**
- **Chokidar**
- **Nodemailer**
- **Puppeteer & node-webcam**

---

## ⚙️ Setup Instructions

1. Clone the repository and navigate to the project root.
2. **Backend**: `cd backend && npm install && npm run dev`
3. **Frontend**: `cd frontend && npm install && npm run dev`
4. Configure the `.env` file in the backend directory.

---

## 🔑 Environment Variables
Configure these in `backend/.env`:

| Variable | Description |
| :--- | :--- |
| `MONGO_URI` | MongoDB Connection URL |
| `SMTP_HOST` | SMTP Server (e.g., smtp.gmail.com) |
| `SMTP_PORT` | SMTP Port (587 or 465) |
| `SMTP_USER` | Admin User |
| `SMTP_PASS` | App-specific Password |
| `ALERT_EMAIL` | Destination for security alerts |
| `JWT_SECRET` | Authentication Secret |
| `FRONTEND_URL` | Application root URL |

---

## 📁 Project Structure
```text
HoneyToken-Sentinel/
├── backend/
│   ├── models/          # Persistent Data Schemas
│   ├── services/        # Email, FileWatcher, Recording Logic
│   ├── routes/          # SOC API Endpoints
│   └── server.js        # Main Gateway
├── frontend/
│   ├── src/
│   │   ├── pages/       # Dashboard, Alerts, Logs, Monitor
│   │   ├── components/  # Core UI Modules
│   │   └── context/     # Alert & Auth Providers
│   └── index.html
└── README.md
```

---

## 📄 License
This project is licensed under the MIT License.
