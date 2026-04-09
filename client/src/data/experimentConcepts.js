const experimentConcepts = {
  "radioactive-decay": {
    formula: "N = N₀e^(-λt)",
    formulaLabel: "Radioactive Decay Law",
    concepts: [
      {
        title: "Half-Life",
        description: "Time for half the radioactive nuclei to decay. T½ = 0.693/λ"
      },
      {
        title: "Decay Constant (λ)",
        description: "Probability of decay per unit time. Higher λ = faster decay."
      },
      {
        title: "Activity",
        description: "Rate of decay: A = λN. Measured in Becquerel (Bq)."
      }
    ]
  },
  "magnetic-field-bar": {
    formula: "B = μ₀/4π · (2M/r³)",
    formulaLabel: "Field on Axial Point",
    concepts: [
      {
        title: "Magnetic Field Lines",
        description: "Closed loops from N to S pole outside, S to N inside magnet."
      },
      {
        title: "Magnetic Moment (M)",
        description: "M = m × 2l. Product of pole strength and magnetic length."
      },
      {
        title: "Inverse Cube Law",
        description: "Field strength decreases as 1/r³ from the magnet."
      }
    ]
  },
  "electric-field-point": {
    formula: "E = kq/r²",
    formulaLabel: "Coulomb's Electric Field",
    concepts: [
      {
        title: "Electric Field",
        description: "Force per unit positive charge. E = F/q₀"
      },
      {
        title: "Inverse Square Law",
        description: "Field intensity decreases as 1/r² from the source charge."
      },
      {
        title: "Field Lines",
        description: "Radiate outward from +ve, inward to -ve charges. Never cross."
      }
    ]
  },
  "gauss-law": {
    formula: "Φ = Q/ε₀",
    formulaLabel: "Gauss's Law",
    concepts: [
      { title: "Electric Flux", description: "Φ = E·A·cosθ. Total field lines through a surface." },
      { title: "Gaussian Surface", description: "Imaginary closed surface used to calculate flux." },
      { title: "Permittivity (ε₀)", description: "ε₀ = 8.85×10⁻¹² C²/Nm². Property of free space." }
    ]
  },
  "ohms-law": {
    formula: "V = IR",
    formulaLabel: "Ohm's Law",
    concepts: [
      { title: "Voltage (V)", description: "Potential difference driving current. Measured in Volts." },
      { title: "Current (I)", description: "Flow of charge per second. I = Q/t. Measured in Amperes." },
      { title: "Resistance (R)", description: "Opposition to current flow. R = ρL/A. Measured in Ohms (Ω)." }
    ]
  },
  "convex-lens": {
    formula: "1/f = 1/v - 1/u",
    formulaLabel: "Lens Formula",
    concepts: [
      { title: "Focal Length (f)", description: "Distance from lens to focus point. +ve for convex lens." },
      { title: "Magnification", description: "m = v/u = hi/ho. Ratio of image to object height." },
      { title: "Power of Lens", description: "P = 1/f (in metres). Measured in Dioptres (D)." }
    ]
  },
  "concave-mirror": {
    formula: "1/f = 1/v + 1/u",
    formulaLabel: "Mirror Formula",
    concepts: [
      { title: "Centre of Curvature (C)", description: "Centre of the sphere of which mirror is a part." },
      { title: "Focal Length", description: "f = R/2. Half the radius of curvature." },
      { title: "Sign Convention", description: "Distances measured from pole. +ve right/up, -ve left/down." }
    ]
  },
  "solenoid": {
    formula: "B = μ₀nI",
    formulaLabel: "Solenoid Magnetic Field",
    concepts: [
      { title: "Turns Density (n)", description: "Number of turns per unit length of solenoid." },
      { title: "Uniform Field", description: "Field inside a long solenoid is uniform and parallel." },
      { title: "Ampere's Law", description: "∮B·dl = μ₀I_enclosed. Used to derive solenoid formula." }
    ]
  },
  "faraday-induction": {
    formula: "ε = -dΦ/dt",
    formulaLabel: "Faraday's Law",
    concepts: [
      { title: "Induced EMF", description: "EMF is induced when magnetic flux through a coil changes." },
      { title: "Lenz's Law", description: "Induced current opposes the change causing it (negative sign)." },
      { title: "Magnetic Flux", description: "Φ = B·A·cosθ. Total field passing through a surface." }
    ]
  },
  "ac-generator": {
    formula: "ε = NBA ω sin(ωt)",
    formulaLabel: "Generator EMF",
    concepts: [
      { title: "Frequency (f)", description: "f = ω/2π. Number of complete cycles per second." },
      { title: "Peak EMF (ε₀)", description: "ε₀ = NBAω. Maximum value of induced EMF." },
      { title: "RMS Value", description: "V_rms = V₀/√2. Effective value of AC voltage." }
    ]
  },
  "photoelectric": {
    formula: "KE = hf - φ",
    formulaLabel: "Einstein's Photoelectric Equation",
    concepts: [
      { title: "Work Function (φ)", description: "Minimum energy needed to eject electron from metal surface." },
      { title: "Threshold Frequency", description: "Minimum frequency of light to cause photoelectric effect." },
      { title: "Planck's Constant (h)", description: "h = 6.626×10⁻³⁴ J·s. Quantum of action." }
    ]
  },
  "bohr-atom": {
    formula: "E_n = -13.6/n² eV",
    formulaLabel: "Bohr Energy Levels",
    concepts: [
      { title: "Quantised Orbits", description: "Electrons only exist in orbits where mvr = nh/2π." },
      { title: "Energy Levels", description: "E₁=-13.6eV, E₂=-3.4eV, E₃=-1.51eV for hydrogen." },
      { title: "Spectral Lines", description: "Emitted when electron drops from higher to lower orbit." }
    ]
  },
  "young-double-slit": {
    formula: "β = λD/d",
    formulaLabel: "Fringe Width",
    concepts: [
      { title: "Interference", description: "Superposition of two coherent waves creating bright/dark fringes." },
      { title: "Path Difference", description: "Bright fringe: nλ. Dark fringe: (2n-1)λ/2." },
      { title: "Coherence", description: "Same frequency, constant phase difference — needed for interference." }
    ]
  },
  "pn-junction": {
    formula: "I = I₀(e^(V/V_T) - 1)",
    formulaLabel: "Diode Equation",
    concepts: [
      { title: "Depletion Region", description: "Region near junction depleted of charge carriers." },
      { title: "Forward Bias", description: "External +ve to p-side, reduces barrier, current flows." },
      { title: "Reverse Bias", description: "External +ve to n-side, increases barrier, no current." }
    ]
  },
  "nuclear-fission": {
    formula: "E = Δmc²",
    formulaLabel: "Mass-Energy Equivalence",
    concepts: [
      { title: "Chain Reaction", description: "Each fission releases 2-3 neutrons triggering more fissions." },
      { title: "Critical Mass", description: "Minimum mass needed to sustain a chain reaction." },
      { title: "Binding Energy", description: "Energy needed to disassemble nucleus into protons and neutrons." }
    ]
  },
  "dna-helix": {
    formula: "A=T, G≡C",
    formulaLabel: "Chargaff's Base Pairing Rules",
    concepts: [
      { title: "Double Helix", description: "Two antiparallel strands wound around each other. Watson & Crick 1953." },
      { title: "Base Pairing", description: "Adenine pairs with Thymine (2 H-bonds), Guanine with Cytosine (3 H-bonds)." },
      { title: "Sugar-Phosphate Backbone", description: "Alternating deoxyribose sugar and phosphate groups form the backbone." }
    ]
  },
  "photosynthesis": {
    formula: "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂",
    formulaLabel: "Photosynthesis Equation",
    concepts: [
      { title: "Light Reaction", description: "In thylakoid membrane. Water splits, O₂ released, ATP and NADPH formed." },
      { title: "Calvin Cycle", description: "In stroma. CO₂ fixed using ATP and NADPH to make glucose." },
      { title: "Chlorophyll", description: "Green pigment absorbing red and blue light for photosynthesis." }
    ]
  },
  "mitosis": {
    formula: "2n → 2n + 2n",
    formulaLabel: "Mitosis Result",
    concepts: [
      { title: "Prophase", description: "Chromosomes condense and become visible. Nuclear envelope breaks down." },
      { title: "Metaphase", description: "Chromosomes align at cell equator (metaphase plate)." },
      { title: "Anaphase", description: "Sister chromatids pulled to opposite poles by spindle fibres." }
    ]
  },
  "nacl-crystal": {
    formula: "r+/r- = 0.414-0.732",
    formulaLabel: "Radius Ratio Rule (Octahedral)",
    concepts: [
      { title: "Face-Centred Cubic", description: "Both Na⁺ and Cl⁻ form FCC sublattices offset by a/2." },
      { title: "Coordination Number", description: "Each Na⁺ surrounded by 6 Cl⁻ and vice versa." },
      { title: "Ionic Bonding", description: "Electrostatic attraction between Na⁺ and Cl⁻ ions." }
    ]
  },
  "daniel-cell": {
    formula: "E°cell = E°cathode - E°anode",
    formulaLabel: "Cell Potential",
    concepts: [
      { title: "Oxidation (Anode)", description: "Zn → Zn²⁺ + 2e⁻. Zinc loses electrons at anode." },
      { title: "Reduction (Cathode)", description: "Cu²⁺ + 2e⁻ → Cu. Copper deposits at cathode." },
      { title: "Salt Bridge", description: "Maintains electrical neutrality by allowing ion migration." }
    ]
  },
  "electrolysis-water": {
    formula: "2H₂O → 2H₂ + O₂",
    formulaLabel: "Water Electrolysis",
    concepts: [
      { title: "Cathode Reaction", description: "4H⁺ + 4e⁻ → 2H₂. Hydrogen gas produced at cathode." },
      { title: "Anode Reaction", description: "2H₂O → O₂ + 4H⁺ + 4e⁻. Oxygen produced at anode." },
      { title: "Volume Ratio", description: "H₂ : O₂ = 2:1 by volume (Cathode gets double gas)." }
    ]
  }
}

export default experimentConcepts;
