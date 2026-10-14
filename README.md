# Good Life Fitness AI — Computer Vision Fitness Platform

A real, privacy-first AI-assisted personal fitness platform integrating browser-based computer vision (MediaPipe Pose Landmarker), biometric telemetry, exercise state machines, and MongoDB persistence.

---

## 1. Architecture Overview

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS + Custom CSS (Light Futuristic Aesthetic: white/off-white surfaces, fine borders, emerald/gold accents)
- **Computer Vision**: `@mediapipe/tasks-vision` (Official Pose Landmarker model loaded client-side via WebAssembly & WebGL GPU delegate)
- **Networking**: Axios instance with JWT bearer token interceptors & error abstraction
- **Analytics & Charts**: Recharts + Framer Motion
- **State Management**: React Context (`AuthContext` for JWT sessions, `ContentContext` for website CMS)

### Backend
- **Runtime**: Node.js + Express.js (ES Modules)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcryptjs password hashing (salted at 10 rounds)
- **API Standard**: RESTful endpoints under `/api/v1`
- **Port**: Default 5000 (proxied through Vite dev server at `/api`)

---

## 2. Privacy & Camera Security Design

- **100% Local Inference**: Pose landmark detection occurs entirely on the client device inside the user's browser using MediaPipe WebAssembly.
- **No Video Uploads**: Raw video streams and camera frames are **never** recorded, transmitted across the network, or saved to MongoDB.
- **Voluntary Access**: Camera access is requested only when the user explicitly clicks "Enable Camera" in the AI Workout Studio. It is never activated automatically during login or page visits.
- **Instant Track Release**: All hardware video tracks are explicitly terminated (`track.stop()`) when tracking stops, when workouts complete, or when components unmount.
- **Environment Requirements**: Camera access (`getUserMedia`) requires HTTPS in deployed environments, with `localhost` supported for local development.

---

## 3. Biomechanical Tracking & State Machines

### Supported Exercises
1. **Bodyweight Squat** (AI-Tracked):
   - Key joint angles: Knee flexion ($\text{Hip} \rightarrow \text{Knee} \rightarrow \text{Ankle}$), Hip hinge angle.
   - States: `START` (standing, $>160^\circ$) $\rightarrow$ `DESCENDING` $\rightarrow$ `BOTTOM` (depth $\le 95^\circ$) $\rightarrow$ `ASCENDING` $\rightarrow$ `COMPLETED` (lockout $>155^\circ$).
   - Hysteresis prevents duplicate or accidental repetition increments; rejects shallow half squats.
2. **Push-Up** (AI-Tracked):
   - Key joint angles: Elbow flexion ($\text{Shoulder} \rightarrow \text{Elbow} \rightarrow \text{Wrist}$), Torso alignment ($\text{Shoulder} \rightarrow \text{Hip} \rightarrow \text{Ankle}$).
   - States: `PLANK_START` $\rightarrow$ `DESCENDING` $\rightarrow$ `BOTTOM` (elbow $\le 90^\circ$) $\rightarrow$ `ASCENDING` $\rightarrow$ `COMPLETED`.
   - Form feedback flags hip sagging or hip piking.
3. **Plank Hold** (AI-Tracked Duration):
   - Posture tracking: Checks continuous alignment ($160^\circ - 195^\circ$).
   - Hold timer increments only while valid anatomical posture is maintained.
4. **Forward Lunge** (AI-Tracked):
   - Lead and rear knee angle evaluation with $90^\circ$ depth validation.
5. **Standing Overhead Press** (Instructional Biomechanics):
   - Form cues and manual set tracking until multi-view tracking is validated.

### Calorie Estimation Formula
Scientific estimation using published **MET (Metabolic Equivalent of Task)** values:
$$\text{Calories Burned (kcal)} = \frac{\text{MET} \times 3.5 \times \text{Bodyweight (kg)}}{200} \times \text{Duration (minutes)}$$
*All calorie values are transparently labeled as physiological estimates.*

---

## 4. API Endpoints (`/api/v1`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/health` | Public | Server health status |
| `POST` | `/api/v1/auth/register` | Public | Register new user account |
| `POST` | `/api/v1/auth/login` | Public | Authenticate user & issue JWT |
| `GET` | `/api/v1/auth/me` | Private | Retrieve authenticated profile |
| `PUT` | `/api/v1/auth/profile` | Private | Update biometric metrics & goals |
| `GET` | `/api/v1/exercises` | Public | List exercises (filters: category, difficulty, tracking) |
| `GET` | `/api/v1/exercises/:id` | Public | Get exercise biomechanics & instructions |
| `POST` | `/api/v1/workouts/sessions` | Private | Initialize / start workout session |
| `GET` | `/api/v1/workouts/sessions` | Private | Fetch user workout history from MongoDB |
| `GET` | `/api/v1/workouts/sessions/:id` | Private | Fetch single session summary (user-scoped) |
| `PATCH` | `/api/v1/workouts/sessions/:id` | Private | Complete workout session with reps & calories |
| `GET` | `/api/v1/workouts/stats` | Private | Weekly stats, total reps, & aggregate analytics |
| `GET` | `/api/v1/recommendations` | Private | Multi-criteria personalized exercise scoring |

---

## 5. Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v24.18.0)
- MongoDB instance running locally on `mongodb://127.0.0.1:27017`

### Setup & Run
1. **Install Dependencies**:
   ```bash
   npm install
   cd server && npm install && cd ..
   ```

2. **Seed Initial Exercise Library & Demo User**:
   ```bash
   npm run server:seed
   ```
   *Seeds default exercises and demo account: `demo@goodlifefitness.com` / `password123`.*

3. **Start the Backend Server**:
   ```bash
   npm run server
   ```
   *Runs Express server on port 5000 with MongoDB connection.*

4. **Start the Frontend Development Server**:
   ```bash
   npm run dev
   ```
   *Vite server runs on `http://localhost:5173` with proxy to `/api`.*

5. **Run Integration & Algorithm Tests**:
   ```bash
   npm run test:api   # Tests all backend REST endpoints & security checks
   npm run test:bio   # Tests biomechanical geometry & state machines
   ```
