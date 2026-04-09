import { lazy } from 'react';

const sceneRegistry = {
  // ── Physics Class 10 ──────────────────────────────────────────────────
  "magnetic-field-bar":       lazy(() => import('./physics/MagneticFieldBar')),
  "magnetic-field-wire":      lazy(() => import('./physics/MagneticFieldWire')),
  "oersted":                  lazy(() => import('./physics/OerstedExperiment')),
  "circuit-series-parallel":  lazy(() => import('./physics/CircuitSeriesParallel')),
  "refraction-glass-slab":    lazy(() => import('./physics/RefractionGlassSlab')),
  "convex-lens":              lazy(() => import('./physics/ConvexLens')),
  "concave-mirror":           lazy(() => import('./physics/ConcaveMirror')),
  "ohms-law":                 lazy(() => import('./physics/OhmsLaw')),
  "prism-dispersion":         lazy(() => import('./physics/PrismDispersion')),
  "reflection":               lazy(() => import('./physics/Reflection')),

  // ── Physics Class 12 ──────────────────────────────────────────────────
  "electric-field-point":     lazy(() => import('./physics/ElectricFieldPoint')),
  "electric-field-dipole":    lazy(() => import('./physics/ElectricFieldDipole')),
  "gauss-law":                lazy(() => import('./physics/GaussLaw')),
  "capacitor":                lazy(() => import('./physics/Capacitor')),
  "biot-savart":              lazy(() => import('./physics/BiotSavart')),
  "solenoid":                 lazy(() => import('./physics/Solenoid')),
  "faraday-induction":        lazy(() => import('./physics/FaradayInduction')),
  "ac-generator":             lazy(() => import('./physics/ACGenerator')),
  "transformer":              lazy(() => import('./physics/Transformer')),
  // Both DB key variants supported:
  "photoelectric":            lazy(() => import('./physics/PhotoelectricEffect')),
  "photoelectric-effect":     lazy(() => import('./physics/PhotoelectricEffect')),
  "bohr-atom":                lazy(() => import('./physics/BohrAtom')),
  "young-double-slit":        lazy(() => import('./physics/YoungDoubleSlit')),
  "single-slit":              lazy(() => import('./physics/SingleSlit')),
  "polarisation":             lazy(() => import('./physics/Polarisation')),
  "logic-gates":              lazy(() => import('./physics/LogicGates')),
  "pn-junction":              lazy(() => import('./physics/PNJunction')),
  "nuclear-fission":          lazy(() => import('./physics/NuclearFission')),
  "radioactive-decay":        lazy(() => import('./physics/RadioactiveDecay')),

  // ── Chemistry Class 10 ────────────────────────────────────────────────
  "electrolysis-water":       lazy(() => import('./chemistry/ElectrolysisWater')),
  // Both DB key variants supported:
  "electrolysis-cuso4":       lazy(() => import('./chemistry/ElectrolysisCopper')),
  "electrolysis-copper":      lazy(() => import('./chemistry/ElectrolysisCopper')),
  "ph-indicators":            lazy(() => import('./chemistry/PhIndicators')),
  "neutralisation":           lazy(() => import('./chemistry/Neutralisation')),
  "rusting":                  lazy(() => import('./chemistry/Rusting')),
  "nacl-crystal":             lazy(() => import('./chemistry/NaClCrystal')),
  "atomic-structure":         lazy(() => import('./chemistry/AtomicStructure')),

  // ── Chemistry Class 12 ────────────────────────────────────────────────
  "crystal-structures":       lazy(() => import('./chemistry/CrystalStructures')),
  "daniel-cell":              lazy(() => import('./chemistry/DanielCell')),
  "electrolytic-cell":        lazy(() => import('./chemistry/ElectrolyticCell')),
  "collision-theory":         lazy(() => import('./chemistry/CollisionTheory')),
  "molecular-orbital":        lazy(() => import('./chemistry/MolecularOrbital')),
  // Both DB key variants supported:
  "hybridisation":            lazy(() => import('./chemistry/HybridisationSP3')),
  "hybridisation-sp3":        lazy(() => import('./chemistry/HybridisationSP3')),
  "vsepr-theory":             lazy(() => import('./chemistry/VseprTheory')),
  "benzene-resonance":        lazy(() => import('./chemistry/BenzeneResonance')),
  "chirality":                lazy(() => import('./chemistry/Chirality')),
  "galvanic-corrosion":       lazy(() => import('./chemistry/GalvanicCorrosion')),

  // ── Biology Class 10 ──────────────────────────────────────────────────
  "photosynthesis":           lazy(() => import('./biology/Photosynthesis')),
  "digestive-system":         lazy(() => import('./biology/DigestiveSystem')),
  "neuron-impulse":           lazy(() => import('./biology/NeuronImpulse')),
  "mitosis":                  lazy(() => import('./biology/Mitosis')),
  "dna-helix":                lazy(() => import('./biology/DNAHelix')),

  // ── Biology Class 12 ──────────────────────────────────────────────────
  "dna-replication":          lazy(() => import('./biology/DNAReplication')),
  "transcription":            lazy(() => import('./biology/Transcription')),
  "translation":              lazy(() => import('./biology/Translation')),
  "heart-circulation":        lazy(() => import('./biology/HeartCirculation')),
  "nephron":                  lazy(() => import('./biology/Nephron')),
  "synapse":                  lazy(() => import('./biology/Synapse')),
  "meiosis":                  lazy(() => import('./biology/Meiosis')),
  "mendelian-mono":           lazy(() => import('./biology/MendelianMono')),
  "mendelian-di":             lazy(() => import('./biology/MendelianDi')),
  "ecosystem-energy":         lazy(() => import('./biology/EcosystemEnergy')),
};

export default sceneRegistry;
