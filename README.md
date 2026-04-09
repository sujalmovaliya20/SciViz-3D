# SciViz 3D

SciViz 3D is a high-fidelity 3D science experiment platform built for students in Classes 10 & 12. It features 20+ interactive simulations across Physics, Chemistry, and Biology, combined with a robust assessment and progress tracking system.

![SciViz 3D Dashboard](https://via.placeholder.com/800x450?text=SciViz+3D+Dashboard)

## 🚀 Tech Stack

- **Frontend**: React, Vite, Three.js, React Three Fiber, Framer Motion, Zustand
- **Backend**: Node.js, Express, MongoDB, JWT, Bcrypt
- **Styling**: Vanilla CSS (Glassmorphism), Syne & Inter Typography
- **Deployment**: Vercel (Frontend), Railway (Backend)

## 🧪 Experiment Categories

### Physics
- **Magnetism**: Magnetic Fields, Oersted Experiment
- **Optics**: Lenses, Mirrors, Prism Dispersion, Reflection
- **Electricity**: Ohm's Law, Circuit Analysis, Electric Fields

### Chemistry
- **Physical**: Electrolysis, Crystal Lattices (SC, BCC, FCC, NaCl)
- **Inorganic**: Daniel Cell, Orbital Hybridisation

### Biology
- **Cytology**: Mitosis, Neuron Impulse
- **Systems**: DNA Double Helix, Photosynthesis, Heart Circulation

## 🛠️ Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/sciviz-3d.git
   cd sciviz-3d
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   # Create .env file with MONGODB_URI and JWT_SECRET
   npm run seed # Populate experiment data
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd client
   npm install
   npm run dev
   ```

## 🔐 Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for token signing |
| `PORT` | Backend port (default: 5000) |
| `FRONTEND_URL` | URL of the frontend for CORS |

## 🏗️ Deployment

- **Frontend**: Connect your GitHub repo to Vercel and set the `root directory` to `client`.
- **Backend**: Deploy the `server` directory to Railway or Render.

## 🤝 Contribution Guide

To add a new experiment:
1. Create a new component in `client/src/experiments/[subject]/`.
2. Register the component in `client/src/experiments/index.js` using `lazy()`.
3. Add the experiment metadata to the `server/seed.js` script and re-run.

## 📄 License
MIT License.

