# 🗺️ Michi

**Plan calm, map-first travel itineraries with AI.**

Michi is a full-stack web app that turns a destination, your travel dates, and your interests into a personalized itinerary: attractions, restaurants, and activities, plotted live on a map and generated through the Groq API.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Go](https://img.shields.io/badge/Go-1.18+-00ADD8?logo=go)](https://golang.org/doc/install)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue?logo=typescript)](https://www.typescriptlang.org/)

---

### 🌟 Quick Links

- **Live Demo:** [michi-planner.vercel.app](https://michi-planner.vercel.app/)
- **Behind the build:** [Building Michi: a map-first trip planner](https://shusingh.github.io/writing/building-michi-a-map-first-trip-planner)

---

### ✨ Key Features

- **Smart Trip Planning**

  - Multi-step intuitive form with progress tracking
  - AI-powered personalized recommendations (via Groq with llama-3.3-70b-versatile)
  - Map-first layout: recommendations render live on a MapLibre GL map as you plan

- **Modern Tech Architecture**

  - Type-safe frontend with React + TypeScript
  - Go backend deployed as Vercel serverless functions
  - AI integration via Groq (llama-3.3-70b-versatile)
  - Local, dependency-light UI components (no external component library)

- **Production-Ready**
  - Comprehensive error handling
  - Client-side routing with fallback support
  - Per-IP rate limiting on the recommendations endpoint
  - Environment-based configuration

---

### 🛠 Technology Stack

#### Frontend

- **Core:** [React 18](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **UI:** Local shadcn-style components (button, input, chip, date range field)
- **Routing:** [React Router](https://reactrouter.com/)
- **Styling:** [TailwindCSS](https://tailwindcss.com/) v3
- **Maps:** [MapLibre GL JS](https://maplibre.org/) + [OpenFreeMap](https://openfreemap.org/) (keyless vector tiles)
- **Geocoding:** [Photon](https://photon.komoot.io/)

#### Backend

- **Language:** [Go 1.18+](https://golang.org/)
- **Web Framework:** Standard `net/http`
- **Environment:** [godotenv](https://github.com/joho/godotenv)
- **AI Service:** [Groq API](https://groq.com/) (llama-3.3-70b-versatile)
- **Rate Limiting:** per-IP token bucket via `golang.org/x/time/rate`

#### Infrastructure

- **Hosting:** [Vercel](https://vercel.com/)
  - Frontend: static Vite build (project root: `frontend/`)
  - Backend: Go serverless function (project root: `backend/`)
- **CI/CD:** deployed via the Vercel CLI

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
   git clone https://github.com/shusingh/michi-planner.git
   cd michi-planner
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

Both the frontend and backend deploy as separate Vercel projects from this same repository, using the [Vercel CLI](https://vercel.com/docs/cli).

1. **Backend** (`backend/` as the project root)

   ```bash
   cd backend
   vercel --prod
   ```

   - Vercel auto-detects `api/recommendations.go` as a Go serverless function.
   - Set `GROQ_API_KEY` (and optionally `GROQ_MODEL`) under Project Settings → Environment Variables.
   - Note: the Go builder does not respect module-relative resolution for a package literally named `internal/`; shared backend code lives under `pkg/` instead for this reason.

2. **Frontend** (`frontend/` as the project root)

   ```bash
   cd frontend
   vercel --prod
   ```

   - Set `VITE_API_BASE_URL` to the backend project's deployed URL.
   - `vercel.json` includes a SPA rewrite so client-side routes survive a refresh.

New Vercel projects have SSO deployment protection on by default; disable it (Project Settings → Deployment Protection, or `vercel project protection disable <name> --sso`) for a publicly reachable demo.

---

### 📁 Project Structure

```
michi-planner/
├─ backend/                 # Go API Service
│  ├─ api/
│  │  └─ recommendations.go # Vercel serverless entry point
│  ├─ cmd/
│  │  └─ tripplanner/       # Standalone server entry point (local dev)
│  ├─ pkg/                  # Shared packages
│  │  ├─ config/            # Environment configuration
│  │  ├─ groq/               # Groq client
│  │  ├─ ratelimit/          # Per-IP rate limiter
│  │  ├─ recommendations/    # Recommendation logic
│  │  └─ models/             # Data models
│  ├─ go.mod                # Go dependencies
│  ├─ vercel.json           # Function config (maxDuration)
│  └─ .env.example           # Environment template
│
├─ frontend/                 # React Application
│  ├─ src/
│  │  ├─ pages/              # Route components
│  │  ├─ components/         # Reusable UI components (incl. ui/ primitives)
│  │  ├─ layouts/            # Page shells (map-first split layout)
│  │  ├─ lib/                # Geocoding, utilities
│  │  └─ App.tsx             # Root component
│  ├─ public/                # Static assets
│  ├─ vercel.json            # SPA rewrite config
│  ├─ vite.config.ts         # Vite configuration
│  └─ package.json           # NPM dependencies
│
└─ README.md                 # Project documentation
```

---

### 🤝 Contributing

We welcome contributions! Here's how you can help:

- 🐛 Report bugs by opening an issue
- 💡 Propose new features or improvements
- 🔧 Submit pull requests
- 🎨 Improve UI/UX design
- 🤖 Enhance AI prompt engineering

---

### 📄 License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.

---

### 👏 Acknowledgments

- [Groq](https://groq.com/) for their fast AI inference
- [Vercel](https://vercel.com/) for hosting services
- [OpenFreeMap](https://openfreemap.org/) for keyless vector map tiles
- All our [contributors](https://github.com/shusingh/michi-planner/graphs/contributors)
