# SciViz 3D | Interactive Science Visualization Platform



**SciViz 3D** is a high-fidelity, immersive science experiment platform designed for STEM students. It bridges the gap between theoretical concepts and practical understanding through 60+ interactive 3D simulations across Physics, Chemistry, and Biology, enhanced by AI-driven hand gesture control and real-time AI tutoring.

---

## 🌟 Key Features

### 🎮 Immersive Simulations
- **60+ Interactive Experiments**: Deep dives into Class 10 & 12 curricula.
- **Physics Engine**: Real-time collision and physics dynamics powered by `Rapier`.
- **Photo-realistic Rendering**: High-performance 3D graphics using `React Three Fiber`.

### 🤖 AI-Powered Interaction
- **Gesture Control**: Control experiments using real-world hand gestures captured via webcam (TensorFlow.js & Python backend).
- **AI Tutor**: Integrated AI mentor that provides context-aware hints and explains complex steps in real-time.
- **Voice Recognition**: Interactive voice commands for navigating and interacting with simulations.

### 🏫 Academic Ecosystem
- **Student Dashboard**: Track progress, quiz scores, and experiment completion.
- **Teacher Console**: Manage classes, assign experiments, and monitor student analytics.
- **Simulated Lab World**: A first-person exploration mode where students can walk through a virtual laboratory.

---

## 🧪 Experiment Gallery

<details>
<summary><b>🔭 Physics (28 Simulations)</b></summary>

- **Electromagnetism**: AC Generator, Biot-Savart, Faraday Induction, Solenoid, Oersted Experiment.
- **Optics**: Convex Lens, Concave Mirror, Prism Dispersion, Reflection, Young's Double Slit, Single Slit.
- **Modern Physics**: Bohr Atom, Photoelectric Effect, Nuclear Fission, Radioactive Decay.
- **Electronics**: Logic Gates, PN Junction, Capacitor, Ohm's Law.
- **Fields**: Electric Field (Point/Dipole), Magnetic Field (Bar/Wire), Gauss Law.
</details>

<details>
<summary><b>🧬 Biology (15 Simulations)</b></summary>

- **Genetics & Molecular**: DNA Double Helix, DNA Replication, Transcription, Translation, Mendelian Genetics.
- **Cell Biology**: Mitosis, Meiosis.
- **Human Systems**: Heart Circulation, Digestive System, Nephron, Neuron Impulse, Synapse.
- **Plant Science**: Photosynthesis.
- **Ecology**: Ecosystem Energy Flow.
</details>

<details>
<summary><b>⚛️ Chemistry (17 Simulations)</b></summary>

- **Structure**: Atomic Structure, Crystal Structures (BCC/FCC/SC), NaCl Crystal.
- **Bonding**: VSEPR Theory, Hybridisation (SP3), Molecular Orbitals, Benzene Resonance.
- **Electrochemistry**: Daniel Cell, Electrolysis (Water/Copper), Electrolytic Cell, Galvanic Corrosion.
- **Mechanisms**: Collision Theory, Chirality, Neutralisation, Rusting.
</details>

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: `React` (Vite)
- **3D Rendering**: `three.js`, `@react-three/fiber`, `@react-three/drei`
- **Physics**: `@react-three/rapier`
- **State Management**: `Zustand`
- **Animations**: `Framer Motion`
- **AI/CV**: `@tensorflow/tfjs`, `@tensorflow-models/hand-pose-detection`

### Backend (Node.js)
- **Server**: `Express.js`
- **Database**: `MongoDB` (Mongoose)
- **Security**: `JWT`, `bcryptjs`, `helmet`, `express-rate-limit`

### AI Backend (Python)
- **Framework**: `FastAPI`
- **AI Tutor**: `Anthropic API` (Claude)
- **Real-time Sync**: `WebSockets`
- **Gesture Engine**: Custom Python-based detection

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) (3.9+)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- Webcam (for gesture control)

### 1. Clone the Project
```bash
git clone https://github.com/your-username/sciviz-3d.git
cd sciviz-3d
```

### 2. Backend Setup (Node)
```bash
cd server
npm install
# Configure .env: MONGODB_URI, JWT_SECRET, PORT, FRONTEND_URL
npm run seed  # Initialize experiment data
npm start
```

### 3. AI Backend Setup (Python)
```bash
cd python-backend
python -m venv venv
source venv/bin/activate  # venv\Scripts\activate on Windows
pip install -r requirements.txt
# Configure .env: ANTHROPIC_API_KEY, CORS_ORIGINS
python main.py
```

### 4. Frontend Setup (React)
```bash
cd client
npm install
npm run dev
```

---

## 🐳 Docker Setup
Run the entire ecosystem with a single command:
```bash
docker-compose up --build
```

---

## 🏗️ Architecture
SciViz 3D uses a tri-service architecture:
1. **Frontend**: React-based UI + R3F rendering engine.
2. **Node Server**: Handles User Auth, Analytics, and Metadata.
3. **Python AI**: Provides real-time physics calculations, AI tutoring, and gesture analysis over WebSockets.

---


