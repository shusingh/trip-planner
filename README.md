# 🌍 AI Trip Planner

An intelligent full-stack web application that leverages AI to create personalized travel itineraries. Simply input your destination, travel dates, and interests to receive AI-powered recommendations for attractions, restaurants, activities, and more through the Groq API.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Go](https://img.shields.io/badge/Go-1.18+-00ADD8?logo=go)](https://golang.org/doc/install)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue?logo=typescript)](https://www.typescriptlang.org/)

---

### 🌟 Quick Links

- **Live Demo:** [TripPlanner Website](https://tripplannerwebsite.onrender.com)

---

### ✨ Key Features

- **Smart Trip Planning**

  - Multi-step intuitive form with progress tracking
  - AI-powered personalized recommendations (via Groq with llama-3.1-8b-instant)
  - Interactive destination selection with map integration

- **Modern Tech Architecture**

  - Type-safe frontend with React + TypeScript
  - High-performance Go backend
  - AI integration via Groq (llama-3.1-8b-instant)
  - Responsive UI with Hero UI components

- **Production-Ready**
  - Comprehensive error handling
  - Client-side routing with fallback support
  - Optimized deployment configuration
  - Environment-based configuration

---

### 🛠 Technology Stack

#### Frontend

- **Core:** [React 18](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **UI Framework:** [Hero UI](https://heroicons.com/)
- **Routing:** [React Router](https://reactrouter.com/)
- **Styling:** [TailwindCSS](https://tailwindcss.com/)
- **Maps:** [Leaflet](https://leafletjs.com/)
- **Icons:** [Iconify](https://iconify.design/)

#### Backend

- **Language:** [Go 1.18+](https://golang.org/)
- **Web Framework:** Standard `net/http`
- **Environment:** [godotenv](https://github.com/joho/godotenv)
- **AI Service:** [Groq API](https://groq.com/) (llama-3.1-8b-instant)

#### Infrastructure

- **Hosting:** [Render.com](https://render.com/)
  - Frontend: Static Site Hosting
  - Backend: Private Service
- **CI/CD:** Automated deployments via Render

---

### 🚀 Getting Started

#### Prerequisites

- Node.js 16 or higher with npm
- Go 1.18 or higher
- Groq API key with inference permissions
- Git

#### Local Development Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/shusingh/TripPlanner.git
   cd TripPlanner
   ```

2. **Backend Setup**

   ```bash
   cd backend
   cp .env.example .env
   # Configure your .env file:
   # GROQ_API_KEY=your_groq_api_key
   # PORT=8080

   go mod download
   go run cmd/tripplanner/main.go
   ```

3. **Frontend Setup**

   ```bash
   cd ../frontend
   npm install

   # Create and configure .env
   echo "VITE_API_BASE_URL=http://localhost:8080" > .env

   npm run dev
   ```

4. **Access the Application**
   - Open [http://localhost:5173](http://localhost:5173) in your browser
   - Backend API will be available at [http://localhost:8080](http://localhost:8080)

---

### 📦 Deployment Guide

#### Render.com Configuration

1. **Backend Service**

   - Repository: Select your GitHub repository
   - Root Directory: `/backend`
   - Build Command: `go build -o app cmd/tripplanner/main.go`
   - Start Command: `./app`
   - Environment Variables:
     - `GROQ_API_KEY`: Your Groq API key

2. **Frontend Static Site**
   - Repository: Same GitHub repository
   - Root Directory: `/frontend`
   - Build Command: `npm run build`
   - Publish Directory: `dist`
   - Environment Variables:
     - `VITE_API_BASE_URL`: Your backend service URL
   - Add Rewrite Rule: `/* /index.html 200`

---

### 📁 Project Structure

```
TripPlanner/
├─ backend/                # Go API Service
│  ├─ cmd/
│  │  └─ tripplanner/     # Application entry point
│  ├─ internal/           # Internal packages
│  │  ├─ groq/           # Groq client
│  │  ├─ recommendations/ # Recommendation logic
│  │  └─ models/         # Data models
│  ├─ go.mod             # Go dependencies
│  └─ .env.example       # Environment template
│
├─ frontend/              # React Application
│  ├─ src/
│  │  ├─ pages/          # Route components
│  │  ├─ components/     # Reusable UI components
│  │  ├─ config/         # App configuration
│  │  └─ App.tsx         # Root component
│  ├─ public/            # Static assets
│  ├─ vite.config.ts     # Vite configuration
│  └─ package.json       # NPM dependencies
│
└─ README.md             # Project documentation
```

---

### 🤝 Contributing

We welcome contributions! Here's how you can help:

- 🐛 Report bugs by opening an issue
- 💡 Propose new features or improvements
- 🔧 Submit pull requests
- 🎨 Improve UI/UX design
- 🤖 Enhance AI prompt engineering

Please read our [Contributing Guidelines](CONTRIBUTING.md) before making a pull request.

---

### 📄 License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.

---

### 👏 Acknowledgments

- [Groq](https://groq.com/) for their fast AI inference
- [Render.com](https://render.com/) for hosting services
- All our [contributors](https://github.com/shusingh/TripPlanner/graphs/contributors)
