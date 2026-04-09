import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Experiment from './models/Experiment.js';

dotenv.config();

const experiments = [
  // PHYSICS - CLASS 10
  {
    title: "Magnetic field lines of bar magnet",
    subject: "physics",
    class: 10,
    chapter: "Magnetic Effects of Electric Current",
    chapterNumber: 13,
    description: "Visualize the invisible magnetic field lines around a permanent bar magnet using iron filings and a compass.",
    difficulty: "easy",
    tags: ["magnetism", "field lines", "physics"],
    steps: [
      { stepNumber: 1, title: "Setup Magnet", description: "Place a bar magnet in the center of the scene." },
      { stepNumber: 2, title: "Add Iron Filings", description: "Scatter virtual iron filings around the magnet." },
      { stepNumber: 3, title: "Observe Alignment", description: "Watch iron filings align along the field lines from North to South pole." },
      { stepNumber: 4, title: "Use Compass", description: "Move a magnetic compass around to see the needle orientation." },
      { stepNumber: 5, title: "Trace Lines", description: "Connect the paths indicated by the needle to draw continuous field lines." }
    ],
    quiz: [
      { question: "Where is the magnetic field strongest?", options: ["At the poles", "In the middle", "Far away", "Nowhere"], correctAnswer: "At the poles", explanation: "Magnetic field lines are most dense at the poles, indicating maximum strength." },
      { question: "What is the direction of field lines outside a magnet?", options: ["South to North", "North to South", "Clockwise", "Anti-clockwise"], correctAnswer: "North to South", explanation: "By convention, magnetic field lines emerge from the North pole and enter the South pole." },
      { question: "Do magnetic field lines ever intersect?", options: ["Yes, at the center", "Yes, at the poles", "Never", "Always"], correctAnswer: "Never", explanation: "If they intersected, a compass needle would point in two directions at once, which is impossible." }
    ],
    sceneKey: "magnetic-field-bar",
    thumbnail: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=400",
    duration: 15,
    objectives: ["Understand magnetic field patterns", "Identify poles", "Learn field line properties"],
    materials: ["Bar magnet", "Iron filings", "Compass"],
    isPublished: true
  },
  {
    title: "Magnetic field of current-carrying conductor",
    subject: "physics",
    class: 10,
    chapter: "Magnetic Effects of Electric Current",
    chapterNumber: 13,
    description: "Demonstrate the magnetic field produced by an electric current flowing through a straight wire.",
    difficulty: "medium",
    tags: ["electromagnetism", "current", "wire"],
    steps: [
      { stepNumber: 1, title: "Prepare Wire", description: "Set up a vertical straight conductor passing through a cardboard." },
      { stepNumber: 2, title: "Apply Current", description: "Connect the wire to a battery and switch it on." },
      { stepNumber: 3, title: "Add Filings", description: "Sprinkle iron filings on the cardboard." },
      { stepNumber: 4, title: "Tap Cardboard", description: "Gently tap to allow filings to arrange themselves." },
      { stepNumber: 5, title: "Observe Pattern", description: "Observe the concentric circles formed around the wire." }
    ],
    quiz: [
      { question: "What is the shape of the magnetic field lines?", options: ["Straight lines", "Concentric circles", "Ellipses", "Random"], correctAnswer: "Concentric circles", explanation: "The magnetic field around a straight wire forms concentric circles centered on the wire." },
      { question: "Which rule determines the field direction?", options: ["Left hand rule", "Right hand thumb rule", "Lenz's law", "Ohm's law"], correctAnswer: "Right hand thumb rule", explanation: "Pointing the thumb in current direction gives field direction with curled fingers." },
      { question: "What happens if current is increased?", options: ["Field weakens", "Field strengthens", "Field disappears", "No change"], correctAnswer: "Field strengthens", explanation: "The magnitude of magnetic field is directly proportional to the current." }
    ],
    sceneKey: "magnetic-field-wire",
    thumbnail: "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&q=80&w=400",
    duration: 20,
    objectives: ["Observe field around straight wire", "Apply Right Hand Thumb Rule", "Relate current and field strength"],
    materials: ["Straight wire", "Battery", "Cardboard", "Iron filings"],
    isPublished: true
  },
  {
    title: "Oersted's experiment — compass needle deflection",
    subject: "physics",
    class: 10,
    chapter: "Magnetic Effects of Electric Current",
    chapterNumber: 13,
    description: "The historic experiment showing that electricity and magnetism are linked.",
    difficulty: "easy",
    tags: ["Oersted", "compass", "electricity"],
    steps: [
      { stepNumber: 1, title: "Place Compass", description: "Place a magnetic compass near a wire." },
      { stepNumber: 2, title: "Align Wire", description: "Align the wire parallel to the compass needle." },
      { stepNumber: 3, title: "Close Circuit", description: "Switch on the circuit to let current flow." },
      { stepNumber: 4, title: "Observe Deflection", description: "Note the sudden movement of the compass needle." },
      { stepNumber: 5, title: "Reverse Current", description: "Change current direction and see the needle deflect the other way." }
    ],
    quiz: [
      { question: "What did Oersted discover?", options: ["Gravity", "Electromagnetism", "Static energy", "Atomic structure"], correctAnswer: "Electromagnetism", explanation: "He showed meant that an electric current produces a magnetic field." },
      { question: "Why does the needle deflect?", options: ["Wire is hot", "Electrostatic force", "Magnetic force from current", "Air pressure"], correctAnswer: "Magnetic force from current", explanation: "The current in the wire creates a magnetic field that exerts force on the needle." },
      { question: "Effect of reversing current?", options: ["Needle stops", "Deflection reverses", "No change", "Needle breaks"], correctAnswer: "Deflection reverses", explanation: "Reversing current reverses the magnetic field direction." }
    ],
    sceneKey: "oersted",
    thumbnail: "https://images.unsplash.com/photo-1554748152-ed327117181f?auto=format&fit=crop&q=80&w=400",
    duration: 10,
    objectives: ["Evidence of magnetic effect of current", "Observation of needle deflection", "Impact of current direction"],
    materials: ["Wire", "Battery", "Compass", "Switch"],
    isPublished: true
  },
  {
    title: "Electric circuit — series and parallel",
    subject: "physics",
    class: 10,
    chapter: "Electricity",
    chapterNumber: 12,
    description: "Compare how resistors behave when connected in sequence versus across the same voltage.",
    difficulty: "medium",
    tags: ["circuit", "series", "parallel", "ohms law"],
    steps: [
      { stepNumber: 1, title: "Series Connection", description: "Connect two bulbs one after another in a single loop." },
      { stepNumber: 2, title: "Measure Series", description: "Check current and brightness; note that removing one bulb breaks the circuit." },
      { stepNumber: 3, title: "Parallel Connection", description: "Connect two bulbs across the same two points." },
      { stepNumber: 4, title: "Measure Parallel", description: "Check brightness and note that removing one bulb doesn't affect the other." },
      { stepNumber: 5, title: "Voltage Analysis", description: "Observe voltage drop across each component in both types." }
    ],
    quiz: [
      { question: "In series, if one bulb blows, the other:", options: ["Stays on", "Glows brighter", "Goes out", "Flashes"], correctAnswer: "Goes out", explanation: "In series, there is only one path for current; a break stops all flow." },
      { question: "Total resistance in parallel is:", options: ["Sum of individual", "Higher than highest", "Lower than lowest", "Average"], correctAnswer: "Lower than lowest", explanation: "Parallel paths increase the total 'conductance', reducing overall resistance." },
      { question: "Where is voltage the same across all components?", options: ["Series", "Parallel", "Open circuit", "Short circuit"], correctAnswer: "Parallel", explanation: "In parallel, all components are connected directly to the same potential difference." }
    ],
    sceneKey: "circuit-series-parallel",
    thumbnail: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=400",
    duration: 25,
    objectives: ["Distinguish series vs parallel", "Calculate equivalent resistance", "Understand home wiring basics"],
    materials: ["Bulbs", "Wires", "Battery", "Ammeter", "Voltmeter"],
    isPublished: true
  },
  {
    title: "Refraction of light through glass slab",
    subject: "physics",
    class: 10,
    chapter: "Light - Reflection and Refraction",
    chapterNumber: 10,
    description: "Trace the path of light as it enters and leaves a rectangular glass slab.",
    difficulty: "medium",
    tags: ["optics", "refraction", "glass slab"],
    steps: [
      { stepNumber: 1, title: "Incident Ray", description: "Aim a beam of light at an angle to the glass interface." },
      { stepNumber: 2, title: "Entry Refraction", description: "Observe light bending towards the normal as it enters glass." },
      { stepNumber: 3, title: "Path inside Glass", description: "Trace the straight path of light through the glass." },
      { stepNumber: 4, title: "Exit Refraction", description: "Observe light bending away from the normal as it exits to air." },
      { stepNumber: 5, title: "Lateral Shift", description: "Compare incident and emergent rays to see they are parallel but shifted." }
    ],
    quiz: [
      { question: "Light bends towards normal when:", options: ["Rare to dense", "Dense to rare", "Always", "Never"], correctAnswer: "Rare to dense", explanation: "Light slows down in denser medium, bending towards the normal." },
      { question: "Are incident and emergent rays parallel?", options: ["Yes", "No", "Depends on color", "Only at 90 degrees"], correctAnswer: "Yes", explanation: "Since the slab faces are parallel, the angles of entry and exit compensate." },
      { question: "What is lateral displacement?", options: ["Bending angle", "Perpendicular distance between rays", "Total path length", "Time delay"], correctAnswer: "Perpendicular distance between rays", explanation: "It is the shift between the original path and the shifted emergent path." }
    ],
    sceneKey: "refraction-glass-slab",
    thumbnail: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&q=80&w=400",
    duration: 20,
    objectives: ["Observe refraction", "Verify lateral shift", "Understand refractive index"],
    materials: ["Glass slab", "Laser/Ray box", "Paper", "Protractor"],
    isPublished: true
  },
  {
    title: "Image formation by convex lens",
    subject: "physics",
    class: 10,
    chapter: "Light - Reflection and Refraction",
    chapterNumber: 10,
    description: "Explore how the position of an object affects the nature and size of the image formed by a converging lens.",
    difficulty: "medium",
    tags: ["optics", "lens", "convex"],
    steps: [
      { stepNumber: 1, title: "Beyond 2F", description: "Place object far away and find small, inverted image at F." },
      { stepNumber: 2, title: "At 2F", description: "Place object at 2F and observe same-sized image at 2F." },
      { stepNumber: 3, title: "Between F and 2F", description: "Observe magnified, inverted image beyond 2F." },
      { stepNumber: 4, title: "At F", description: "See image forming at infinity (parallel rays)." },
      { stepNumber: 5, title: "Inside F", description: "Observe virtual, erect, and highly magnified image on the same side." }
    ],
    quiz: [
      { question: "Which lens is called converging?", options: ["Convex", "Concave", "Plane", "Cylindrical"], correctAnswer: "Convex", explanation: "A convex lens brings parallel rays of light to a single focal point." },
      { question: "Nature of image when object is very close?", options: ["Real, Inverted", "Virtual, Erect", "Real, Erect", "Virtual, Inverted"], correctAnswer: "Virtual, Erect", explanation: "Inside the focal point, the image is virtual, erect and magnified." },
      { question: "Used in a magnifying glass?", options: ["Convex lens", "Concave lens", "Convex mirror", "Concave mirror"], correctAnswer: "Convex lens", explanation: "Convex lenses create magnified virtual images when objects are close." }
    ],
    sceneKey: "convex-lens",
    thumbnail: "https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?auto=format&fit=crop&q=80&w=400",
    duration: 25,
    objectives: ["Ray diagram plotting", "Find focal length", "Understand magnification"],
    materials: ["Convex lens", "Screen", "Candle/Object", "Scale"],
    isPublished: true
  },
  {
    title: "Image formation by concave mirror",
    subject: "physics",
    class: 10,
    chapter: "Light - Reflection and Refraction",
    chapterNumber: 10,
    description: "Analyze how a curved mirror focuses light and creates diverse images.",
    difficulty: "medium",
    tags: ["optics", "mirror", "concave"],
    steps: [
      { stepNumber: 1, title: "Infinity Object", description: "Focus distant object to a point at F." },
      { stepNumber: 2, title: "Beyond C", description: "See diminished, inverted image between C and F." },
      { stepNumber: 3, title: "At C", description: "Observe same-sized, inverted image at C." },
      { stepNumber: 4, title: "At F", description: "Observe no clear image (formed at infinity)." },
      { stepNumber: 5, title: "Between P and F", description: "See large virtual erect image behind the mirror." }
    ],
    quiz: [
      { question: "Used in car headlights?", options: ["Convex mirror", "Plane mirror", "Concave mirror", "None"], correctAnswer: "Concave mirror", explanation: "Bulb at focus produces a powerful parallel beam." },
      { question: "Image at C is always:", options: ["Magnified", "Diminished", "Same size", "Virtual"], correctAnswer: "Same size", explanation: "When placed at center of curvature C, height of image equals height of object." },
      { question: "Dentist's mirror type?", options: ["Convex", "Concave", "Plane", "Bifocal"], correctAnswer: "Concave", explanation: "It gives a magnified view of the teeth when held close." }
    ],
    sceneKey: "concave-mirror",
    thumbnail: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=400",
    duration: 20,
    objectives: ["Identify mirror types", "Locate image positions", "Learn real vs virtual images"],
    materials: ["Concave mirror", "Screen", "Stand", "Light source"],
    isPublished: true
  },
  {
    title: "Ohm's law demonstration",
    subject: "physics",
    class: 10,
    chapter: "Electricity",
    chapterNumber: 12,
    description: "Verify the fundamental relationship between Voltage, Current, and Resistance.",
    difficulty: "hard",
    tags: ["electricity", "ohms law", "resistance"],
    steps: [
      { stepNumber: 1, title: "Circuit Assembly", description: "Connect resistor, battery, ammeter, and voltmeter." },
      { stepNumber: 2, title: "Low Voltage", description: "Set voltage to 2V and record ammeter reading." },
      { stepNumber: 3, title: "Increase Voltage", description: "Increase to 4V, 6V, 8V and record corresponding currents." },
      { stepNumber: 4, title: "Plot Graph", description: "Plot V on Y-axis and I on X-axis." },
      { stepNumber: 5, title: "Calculate Slope", description: "Find the resistance as the slope (R = V/I)." }
    ],
    quiz: [
      { question: "Ohm's Law formula?", options: ["V=I/R", "V=IR", "I=VR", "R=VI"], correctAnswer: "V=IR", explanation: "Voltage is the product of current and resistance." },
      { question: "V-I graph shape for ohmic conductor?", options: ["Parabola", "Straight line passing through origin", "Curved", "Horizontal"], correctAnswer: "Straight line passing through origin", explanation: "Direct proportionality results in a linear graph." },
      { question: "SI unit of Resistance?", options: ["Volt", "Ampere", "Ohm", "Watt"], correctAnswer: "Ohm", explanation: "Resistance is measured in Ohms, denoted by Ω." }
    ],
    sceneKey: "ohms-law",
    thumbnail: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=400",
    duration: 30,
    objectives: ["Verify V ∝ I", "Understand resistance", "Data plotting skills"],
    materials: ["Resistor", "Ammeter", "Voltmeter", "Variable power supply"],
    isPublished: true
  },
  {
    title: "Dispersion of light through prism",
    subject: "physics",
    class: 10,
    chapter: "Human Eye and the Colourful World",
    chapterNumber: 11,
    description: "Witness how white light splits into its constituent colors (VIBGYOR) through a glass prism.",
    difficulty: "easy",
    tags: ["optics", "prism", "dispersion", "colors"],
    steps: [
      { stepNumber: 1, title: "Setup Prism", description: "Place a triangular glass prism on a white sheet." },
      { stepNumber: 2, title: "White Light Beam", description: "Direct a narrow beam of white light at the prism face." },
      { stepNumber: 3, title: "First Refraction", description: "Observe light bending at the first air-glass interface." },
      { stepNumber: 4, title: "Internal Path", description: "See different colors traveling at different speeds inside." },
      { stepNumber: 5, title: "Spectrum Formation", description: "Observe the rainbow pattern on the screen after the second refraction." }
    ],
    quiz: [
      { question: "Which color bends the most?", options: ["Red", "Green", "Yellow", "Violet"], correctAnswer: "Violet", explanation: "Violet has the shortest wavelength and slows down the most, bending most." },
      { question: "Cause of dispersion?", options: ["Reflection", "Different speeds in medium", "Prism is colored", "Interference"], correctAnswer: "Different speeds in medium", explanation: "Each color has a different refractive index in glass." },
      { question: "What is VIBGYOR?", options: ["A robot", "Acronym for spectrum colors", "Refractive unit", "Prism brand"], correctAnswer: "Acronym for spectrum colors", explanation: "Violet, Indigo, Blue, Green, Yellow, Orange, Red." }
    ],
    sceneKey: "prism-dispersion",
    thumbnail: "https://images.unsplash.com/photo-1510906594845-bc0974739cc4?auto=format&fit=crop&q=80&w=400",
    duration: 15,
    objectives: ["Observe spectrum", "Define dispersion", "Compare color bending"],
    materials: ["Glass prism", "White light source", "Screen"],
    isPublished: true
  },
  {
    title: "Reflection of light — laws of reflection",
    subject: "physics",
    class: 10,
    chapter: "Light - Reflection and Refraction",
    chapterNumber: 10,
    description: "Verify that the angle of incidence equals the angle of reflection on a plane surface.",
    difficulty: "easy",
    tags: ["optics", "reflection", "mirror"],
    steps: [
      { stepNumber: 1, title: "Mirror Setup", description: "Fix a plane mirror vertically on paper." },
      { stepNumber: 2, title: "Draw Normal", description: "Draw a line perpendicular to the mirror surface." },
      { stepNumber: 3, title: "Incident Ray", description: "Draw a line at 30 degrees to the normal and place pins." },
      { stepNumber: 4, title: "Locate Images", description: "Look from the other side and place pins where images align." },
      { stepNumber: 5, title: "Verify Angles", description: "Measure the reflected angle and compare with incident angle." }
    ],
    quiz: [
      { question: "Law of Reflection states i =", options: ["r/2", "r", "2r", "90-r"], correctAnswer: "r", explanation: "The angle of incidence is always equal to the angle of reflection." },
      { question: "Incident ray, normal and reflected ray lie in:", options: ["Same plane", "Different planes", "Circular path", "Void"], correctAnswer: "Same plane", explanation: "The second law of reflection states they all lie in the same plane." },
      { question: "If angle of incidence is 0, angle of reflection is:", options: ["0", "90", "180", "45"], correctAnswer: "0", explanation: "A ray hit perpendicular to surface returns along the same path." }
    ],
    sceneKey: "reflection",
    thumbnail: "https://images.unsplash.com/photo-1490077476659-09515969515a?auto=format&fit=crop&q=80&w=400",
    duration: 10,
    objectives: ["Verify reflection laws", "Measure angles", "Understand plane mirrors"],
    materials: ["Plane mirror", "Pins", "Protractor", "Drawing board"],
    isPublished: true
  },
  // PHYSICS - CLASS 12
  {
    title: "Electric field lines — point charge",
    subject: "physics",
    class: 12,
    chapter: "Electric Charges and Fields",
    chapterNumber: 1,
    description: "Visualize the radial electric field lines emanating from a positive or negative point charge.",
    difficulty: "easy",
    tags: ["electrostatics", "field lines", "charge"],
    steps: [
      { stepNumber: 1, title: "Place Charge", description: "Place a positive point charge in the center." },
      { stepNumber: 2, title: "Observe Lines", description: "See field lines radiating outwards in all directions." },
      { stepNumber: 3, title: "Change Polarity", description: "Switch to a negative charge and see lines pointing inwards." },
      { stepNumber: 4, title: "Test Charge", description: "Move a small positive test charge to see the force direction." },
      { stepNumber: 5, title: "Field Density", description: "Notice lines are closer near the charge where the field is stronger." }
    ],
    quiz: [
      { question: "Direction of field for positive charge?", options: ["Inwards", "Outwards", "Circular", "None"], correctAnswer: "Outwards", explanation: "Field lines are defined to point away from positive charges." },
      { question: "What does line density represent?", options: ["Charge speed", "Field strength", "Temperature", "Color"], correctAnswer: "Field strength", explanation: "Closely packed lines indicate a stronger electric field." },
      { question: "Can field lines cross?", options: ["Yes", "No", "Only if overlapping", "At the charge"], correctAnswer: "No", explanation: "Crossing would mean two different field directions at one point." }
    ],
    sceneKey: "electric-field-point",
    thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=400",
    duration: 10,
    objectives: ["Map point charge fields", "Understand charge interactions", "Analyze field strength"],
    materials: ["Simulated charges", "Field probes"],
    isPublished: true
  },
  {
    title: "Electric field lines — dipole",
    subject: "physics",
    class: 12,
    chapter: "Electric Charges and Fields",
    chapterNumber: 1,
    description: "Explore the complex field pattern created by two equal and opposite charges separated by a distance.",
    difficulty: "medium",
    tags: ["electrostatics", "dipole", "field lines"],
    steps: [
      { stepNumber: 1, title: "Setup Dipole", description: "Place one positive and one negative charge near each other." },
      { stepNumber: 2, title: "Observe Curved Lines", description: "See lines starting from positive and ending on negative charge." },
      { stepNumber: 3, title: "Identify Neutral Point", description: "Check if there's any point where field is zero (not in a dipole)." },
      { stepNumber: 4, title: "Check Axial Line", description: "Measure field along the line joining the charges." },
      { stepNumber: 5, title: "Check Equatorial Line", description: "Measure field along the perpendicular bisector." }
    ],
    quiz: [
      { question: "Where do dipole field lines start?", options: ["Negative charge", "Positive charge", "Infinity", "Center"], correctAnswer: "Positive charge", explanation: "Lines emerge from + and terminate at -." },
      { question: "Total charge of an electric dipole?", options: ["Positive", "Negative", "Zero", "Variable"], correctAnswer: "Zero", explanation: "A dipole consists of +q and -q, so net charge is zero." },
      { question: "Field at large distance falls off as:", options: ["1/r", "1/r^2", "1/r^3", "Log(r)"], correctAnswer: "1/r^3", explanation: "The dipole field decreases faster than a point charge field (which is 1/r^2)." }
    ],
    sceneKey: "electric-field-dipole",
    thumbnail: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=400",
    duration: 15,
    objectives: ["Visualize dipole field", "Calculate dipole moment", "Compare with point charge"],
    materials: ["Opposite charges", "Voltage mapping tool"],
    isPublished: true
  },
  {
    title: "Gauss's law — electric flux",
    subject: "physics",
    class: 12,
    chapter: "Electric Charges and Fields",
    chapterNumber: 1,
    description: "Understand flux and how the total electric field passing through a closed surface relates to the enclosed charge.",
    difficulty: "hard",
    tags: ["Gauss law", "flux", "calculus"],
    steps: [
      { stepNumber: 1, title: "Select Surface", description: "Create a Gaussian sphere or cylinder around a charge." },
      { stepNumber: 2, title: "Calculate Flux", description: "Visualize the 'number' of field lines passing through the surface." },
      { stepNumber: 3, title: "Move Charge Outside", description: "See that net flux becomes zero when charge is outside." },
      { stepNumber: 4, title: "Vary Surface Size", description: "Observe that flux remains constant regardless of surface size, as long as charge is enclosed." },
      { stepNumber: 5, title: "Apply Formula", description: "Verify Φ = q/ε₀." }
    ],
    quiz: [
      { question: "Total flux through closed surface depends on:", options: ["Surface shape", "Surface size", "Enclosed charge", "Charge outside"], correctAnswer: "Enclosed charge", explanation: "Gauss's law states Φ = q_in / ε₀." },
      { question: "Flux through a surface where q=0?", options: ["Positive", "Negative", "Zero", "Infinite"], correctAnswer: "Zero", explanation: "No enclosed charge means no net flux." },
      { question: "Unit of Electric Flux?", options: ["Newton", "Coulomb", "V·m", "Ampere"], correctAnswer: "V·m", explanation: "Flux is E·A, which results in Volt-meters." }
    ],
    sceneKey: "gauss-law",
    thumbnail: "https://images.unsplash.com/photo-1532187875605-1ef6ec82114e?auto=format&fit=crop&q=80&w=400",
    duration: 25,
    objectives: ["Define flux", "Understand Gaussian surfaces", "Relate flux to charge"],
    materials: ["Gaussian surfaces", "Point charges", "Flux meter"],
    isPublished: true
  },
  {
    title: "Capacitor — charging and discharging",
    subject: "physics",
    class: 12,
    chapter: "Electrostatic Potential and Capacitance",
    chapterNumber: 2,
    description: "Observe how charge builds up on parallel plates and how energy is stored and released.",
    difficulty: "medium",
    tags: ["capacitor", "electrostatics", "circuit"],
    steps: [
      { stepNumber: 1, title: "Setup Plates", description: "Connect two metal plates to a battery." },
      { stepNumber: 2, title: "Charging Process", description: "Observe electrons moving to one plate, leaving the other positive." },
      { stepNumber: 3, title: "Saturation", description: "See current drop to zero once the capacitor reaches battery voltage." },
      { stepNumber: 4, title: "Disconnect Battery", description: "Observe that charge remains stored on the plates." },
      { stepNumber: 5, title: "Discharge", description: "Connect to a bulb and watch it glow briefly as energy is released." }
    ],
    quiz: [
      { question: "What is stored in a capacitor?", options: ["Current", "Energy", "Magnetic field", "Resistance"], correctAnswer: "Energy", explanation: "Capacitors store energy in an electric field between plates." },
      { question: "Capacitance unit?", options: ["Farad", "Henry", "Tesla", "Ohm"], correctAnswer: "Farad", explanation: "Measured in Farads (F), usually microfarads (µF)." },
      { question: "Effect of dielectric?", options: ["Increases C", "Decreases C", "No change", "Short circuit"], correctAnswer: "Increases C", explanation: "Dielectrics reduce the E-field, allowing more charge storage for same V." }
    ],
    sceneKey: "capacitor",
    thumbnail: "https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&q=80&w=400",
    duration: 20,
    objectives: ["Understand charge storage", "Observe RC time constant", "Role of dielectrics"],
    materials: ["Plates", "Battery", "Dielectric", "Ammeter"],
    isPublished: true
  },
  {
    title: "Biot-Savart law — circular loop field",
    subject: "physics",
    class: 12,
    chapter: "Moving Charges and Magnetism",
    chapterNumber: 4,
    description: "Calculate and visualize the magnetic field at the center and along the axis of a current-carrying circular loop.",
    difficulty: "hard",
    tags: ["magnetism", "Biot-Savart", "loop"],
    steps: [
      { stepNumber: 1, title: "Create Loop", description: "Setup a circular wire loop and pass current." },
      { stepNumber: 2, title: "Map Center Field", description: "Calculate field at the center (B = μ₀I/2R)." },
      { stepNumber: 3, title: "Axial Probe", description: "Move along the axis and see field strength decrease." },
      { stepNumber: 4, title: "Vector Summation", description: "See how small current elements dI contribute to total B." },
      { stepNumber: 5, title: "Rule Check", description: "Use right-hand grip rule to find field direction." }
    ],
    quiz: [
      { question: "Field at center of N turns?", options: ["N*B", "B/N", "B", "N^2*B"], correctAnswer: "N*B", explanation: "Magnetic field is directly proportional to the number of turns." },
      { question: "Field direction for clockwise current?", options: ["Inwards", "Outwards", "Upward", "Tangent"], correctAnswer: "Inwards", explanation: "According to R.H. grip rule, field points into the loop plane." },
      { question: "Field at axis vs center?", options: ["Equal", "Axial is less", "Axial is more", "Zero"], correctAnswer: "Axial is less", explanation: "Field is strongest at the center and decreases as you move away." }
    ],
    sceneKey: "biot-savart",
    thumbnail: "https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?auto=format&fit=crop&q=80&w=400",
    duration: 25,
    objectives: ["Apply Biot-Savart Law", "Calculate axial field", "Verify loop magnetic moment"],
    materials: ["Circular loop", "Power source", "Magnetic sensor"],
    isPublished: true
  },
  {
    title: "Ampere's law — solenoid magnetic field",
    subject: "physics",
    class: 12,
    chapter: "Moving Charges and Magnetism",
    chapterNumber: 4,
    description: "Examine the uniform magnetic field inside a long coil (solenoid) and compare it to a bar magnet.",
    difficulty: "medium",
    tags: ["magnetism", "Ampere law", "solenoid"],
    steps: [
      { stepNumber: 1, title: "Setup Solenoid", description: "Wind a long coil of wire." },
      { stepNumber: 2, title: "Inside Field", description: "Pass current and map the uniform axial field inside." },
      { stepNumber: 3, title: "End Effects", description: "Observe field leaking/spreading at the ends." },
      { stepNumber: 4, title: "Core Insertion", description: "Insert a soft iron core and see field strength skyrocket." },
      { stepNumber: 5, title: "Formula Check", description: "Verify B = μ₀nI." }
    ],
    quiz: [
      { question: "Field inside ideal solenoid is:", options: ["Zero", "Uniform", "Varying", "Circular"], correctAnswer: "Uniform", explanation: "An ideal solenoid has a constant, uniform magnetic field inside." },
      { question: "What is 'n' in the formula?", options: ["Total turns", "Turns per unit length", "Resistance", "Current"], correctAnswer: "Turns per unit length", explanation: "Lower case 'n' is N/L." },
      { question: "Role of soft iron core?", options: ["Insulation", "Increases magnetism", "Decreases heat", "Structure only"], correctAnswer: "Increases magnetism", explanation: "Iron has high permeability, concentrating the magnetic flux." }
    ],
    sceneKey: "solenoid",
    thumbnail: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&q=80&w=400",
    duration: 20,
    objectives: ["Analyze solenoid field", "Apply Ampere's Law", "Learn electromagnet principles"],
    materials: ["Copper wire", "Iron core", "Battery"],
    isPublished: true
  },
  {
    title: "Faraday's law — electromagnetic induction",
    subject: "physics",
    class: 12,
    chapter: "Electromagnetic Induction",
    chapterNumber: 6,
    description: "Discover how a changing magnetic field creates an electric current in a wire loop.",
    difficulty: "medium",
    tags: ["induction", "Faraday", "Lenz law"],
    steps: [
      { stepNumber: 1, title: "Setup Coil", description: "Connect a coil to a sensitive galvanometer." },
      { stepNumber: 2, title: "Move Magnet In", description: "Push a magnet into the coil and note deflection." },
      { stepNumber: 3, title: "Stationary Magnet", description: "Hold the magnet still and see zero deflection." },
      { stepNumber: 4, title: "Move Magnet Out", description: "Pull it out and see opposite deflection." },
      { stepNumber: 5, title: "Speed Effect", description: "Move magnet faster to see more current." }
    ],
    quiz: [
      { question: "Current flows only when:", options: ["Magnet is inside", "Flux is changing", "Coil is cold", "Magnet is strong"], correctAnswer: "Flux is changing", explanation: "Relative motion change in flux is required for induction." },
      { question: "Which law gives the direction?", options: ["Ohm's", "Lenz's", "Boyle's", "Newton's"], correctAnswer: "Lenz's", explanation: "Lenz's law states the induced current opposes the change that caused it." },
      { question: "Faster movement results in:", options: ["Less EMF", "More EMF", "Same EMF", "Zero EMF"], correctAnswer: "More EMF", explanation: "EMF is proportional to the rate of change of magnetic flux." }
    ],
    sceneKey: "faraday-induction",
    thumbnail: "https://images.unsplash.com/photo-1581092162384-8987c1794ed9?auto=format&fit=crop&q=80&w=400",
    duration: 15,
    objectives: ["Demonstrate Induction", "Verify Faraday's Law", "Learn flux linkage"],
    materials: ["Coil", "Bar magnet", "Galvanometer"],
    isPublished: true
  },
  {
    title: "AC generator working",
    subject: "physics",
    class: 12,
    chapter: "Electromagnetic Induction",
    chapterNumber: 6,
    description: "Visualize how mechanical rotation in a magnetic field is converted into Alternating Current.",
    difficulty: "hard",
    tags: ["AC", "generator", "induction"],
    steps: [
      { stepNumber: 1, title: "Identify Parts", description: "Locate Armature, Magnets, Slip Rings, and Brushes." },
      { stepNumber: 2, title: "Rotation", description: "Rotate the armature coil between the poles." },
      { stepNumber: 3, title: "Observe Graph", description: "Watch the sinusoidal voltage wave being generated." },
      { stepNumber: 4, title: "Peak Voltage", description: "Notice max voltage when coil is parallel to field lines." },
      { stepNumber: 5, title: "Zero Voltage", description: "Notice zero voltage when coil is perpendicular." }
    ],
    quiz: [
      { question: "Generator works on:", options: ["Heat", "Electromagnetic induction", "Static friction", "Chemical energy"], correctAnswer: "Electromagnetic induction", explanation: "Changing flux in rotating coil induces EMF." },
      { question: "Role of Slip Rings?", options: ["Stop rotation", "Allow continuous AC", "Convert to DC", "Lubrication"], correctAnswer: "Allow continuous AC", explanation: "They maintain connection without twisting wires." },
      { question: "Shape of output wave?", options: ["Square", "Sine", "Triangle", "Sawtooth"], correctAnswer: "Sine", explanation: "AC voltage varies sinusoidally with time." }
    ],
    sceneKey: "ac-generator",
    thumbnail: "https://images.unsplash.com/photo-1574631431026-64687d7b001d?auto=format&fit=crop&q=80&w=400",
    duration: 25,
    objectives: ["Mechanics of generator", "Energy conversion", "Understanding AC wave"],
    materials: ["Generator model", "Oscilloscope"],
    isPublished: true
  },
  {
    title: "Transformer — step up and step down",
    subject: "physics",
    class: 12,
    chapter: "Alternating Current",
    chapterNumber: 7,
    description: "Learn how mutual induction is used to increase or decrease AC voltage levels.",
    difficulty: "medium",
    tags: ["transformer", "AC", "induction"],
    steps: [
      { stepNumber: 1, title: "Core and Coils", description: "Observe Primary and Secondary coils on an iron core." },
      { stepNumber: 2, title: "Mutual Induction", description: "See how changing magnetic flux in primary links to secondary." },
      { stepNumber: 3, title: "Step Up", description: "Make Ns > Np and observe higher output voltage." },
      { stepNumber: 4, title: "Step Down", description: "Make Ns < Np and observe lower output voltage." },
      { stepNumber: 5, title: "Efficiency", description: "Analyze power loss through eddy currents and heat." }
    ],
    quiz: [
      { question: "Transformers work with:", options: ["DC only", "AC only", "Both", "Batteries"], correctAnswer: "AC only", explanation: "They require a changing magnetic field, which AC provides." },
      { question: "Step up transformer increases:", options: ["Power", "Current", "Voltage", "Frequency"], correctAnswer: "Voltage", explanation: "It increases voltage while decreasing current (for same power)." },
      { question: "Core is laminated to reduce:", options: ["Weight", "Eddy currents", "Cost", "Rust"], correctAnswer: "Eddy currents", explanation: "Lamination limits the loop size of induced parasite currents." }
    ],
    sceneKey: "transformer",
    thumbnail: "https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&q=80&w=400",
    duration: 20,
    objectives: ["Understand turns ratio", "Mutual induction", "Real-world apps"],
    materials: ["Soft iron core", "Two coils", "AC source"],
    isPublished: true
  },
  {
    title: "Photoelectric effect",
    subject: "physics",
    class: 12,
    chapter: "Dual Nature of Radiation and Matter",
    chapterNumber: 11,
    description: "Simulate the experiment that proved the particle nature of light using photons and electrons.",
    difficulty: "hard",
    tags: ["quantum", "photons", "Einstein"],
    steps: [
      { stepNumber: 1, title: "Light on Metal", description: "Shine a light on a photosensitive metal surface." },
      { stepNumber: 2, title: "Emission", description: "Observe electrons being ejected if frequency is high enough." },
      { stepNumber: 3, title: "Threshold Frequency", description: "Decrease frequency and see emission stop abruptly." },
      { stepNumber: 4, title: "Intensity Effect", description: "Increase intensity and see more electrons (but same speed)." },
      { stepNumber: 5, title: "Stopping Potential", description: "Apply a reverse voltage to find the max kinetic energy." }
    ],
    quiz: [
      { question: "Who explained this effect?", options: ["Newton", "Einstein", "Ohm", "Faraday"], correctAnswer: "Einstein", explanation: "Einstein applied the photon concept to explain it." },
      { question: "KE of electrons depends on:", options: ["Intensity", "Frequency", "Time", "Metal color"], correctAnswer: "Frequency", explanation: "Higher frequency photons have more energy to transfer." },
      { question: "Threshold frequency is:", options: ["Min frequency needed", "Max frequency allowed", "Avg frequency", "Zero"], correctAnswer: "Min frequency needed", explanation: "Below this frequency, no electrons are ejected regardless of intensity." }
    ],
    sceneKey: "photoelectric",
    thumbnail: "https://images.unsplash.com/photo-1532187875605-1ef6ec82114e?auto=format&fit=crop&q=80&w=400",
    duration: 30,
    objectives: ["Particle nature of light", "Determine Planck's constant", "Work function concept"],
    materials: ["Vacuum tube", "Metal plate", "Varying light source"],
    isPublished: true
  },
  {
    title: "Bohr's model of hydrogen atom",
    subject: "physics",
    class: 12,
    chapter: "Atoms",
    chapterNumber: 12,
    description: "Visualize electrons in discrete energy levels and the emission of photons during transitions.",
    difficulty: "medium",
    tags: ["atomic", "Bohr", "quantum"],
    steps: [
      { stepNumber: 1, title: "Orbit Visualization", description: "See circular orbits n=1, 2, 3..." },
      { stepNumber: 2, title: "Excitation", description: "Supply energy to jump an electron to a higher orbit." },
      { stepNumber: 3, title: "De-excitation", description: "Watch electron fall back and emit a photon." },
      { stepNumber: 4, title: "Spectral Lines", description: "Observe Lyman, Balmer, and Paschen series." },
      { stepNumber: 5, title: "Energy Calculation", description: "Verify E = -13.6/n^2 eV." }
    ],
    quiz: [
      { question: "What happens when electron falls to lower n?", options: ["Absorbs photon", "Emits photon", "Nothing", "Explodes"], correctAnswer: "Emits photon", explanation: "Energy difference is released as light." },
      { question: "Lowest energy state is called:", options: ["Sky state", "Ground state", "Zero state", "Dead state"], correctAnswer: "Ground state", explanation: "For n=1, it is the most stable and lowest energy state." },
      { question: "Bohr model is valid for:", options: ["All atoms", "Hydrogen-like atoms", "Only metals", "Gases only"], correctAnswer: "Hydrogen-like atoms", explanation: "It works for single-electron systems like H, He+, Li++." }
    ],
    sceneKey: "bohr-atom",
    thumbnail: "https://images.unsplash.com/photo-1554475901-4538ddfbccc2?auto=format&fit=crop&q=80&w=400",
    duration: 20,
    objectives: ["Quantization of energy", "Understanding spectra", "Atomic stability"],
    materials: ["Atomic simulator"],
    isPublished: true
  },
  {
    title: "Young's double slit experiment",
    subject: "physics",
    class: 12,
    chapter: "Wave Optics",
    chapterNumber: 10,
    description: "Demonstrate the wave nature of light through interference patterns.",
    difficulty: "hard",
    tags: ["optics", "interference", "waves"],
    steps: [
      { stepNumber: 1, title: "Coherent Source", description: "Use a single laser hitting two narrow slits." },
      { stepNumber: 2, title: "Wave Propagation", description: "Visualize the cylindrical waves emerging from slits." },
      { stepNumber: 3, title: "Interference Zone", description: "See waves overlapping on their way to the screen." },
      { stepNumber: 4, title: "Constructive/Destructive", description: "Identify bright (peak-peak) and dark (peak-trough) fringes." },
      { stepNumber: 5, title: "Measurement", description: "Calculate fringe width (β = λD/d)." }
    ],
    quiz: [
      { question: "Central fringe is always:", options: ["Dark", "Bright", "Blue", "Blurred"], correctAnswer: "Bright", explanation: "At the center, path difference is zero, causing constructive interference." },
      { question: "Doubling slit distance (d) makes fringes:", options: ["Wider", "Narrower", "Brighter", "Invisible"], correctAnswer: "Narrower", explanation: "β is inversely proportional to slit separation d." },
      { question: "What proves wave nature here?", options: ["Reflection", "Interference", "Rectilinear motion", "Heat"], correctAnswer: "Interference", explanation: "Particles wouldn't create fringes; waves do." }
    ],
    sceneKey: "young-double-slit",
    thumbnail: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=400",
    duration: 30,
    objectives: ["Wave interference", "Calculate wavelength", "Conditions for dark/bright"],
    materials: ["Laser", "Slits", "Screen"],
    isPublished: true
  },
  {
    title: "Diffraction through single slit",
    subject: "physics",
    class: 12,
    chapter: "Wave Optics",
    chapterNumber: 10,
    description: "Observe how light bends around edges when passing through a single narrow aperture.",
    difficulty: "hard",
    tags: ["optics", "diffraction", "waves"],
    steps: [
      { stepNumber: 1, title: "Setup Single Slit", description: "Project light through one adjustable narrow slit." },
      { stepNumber: 2, title: "Central Maximum", description: "Observe a broad, bright central fringe." },
      { stepNumber: 3, title: "Secondary Maxima", description: "Identify weaker bright fringes on both sides." },
      { stepNumber: 4, title: "Slit Width Change", description: "Narrow the slit further and watch the pattern spread out." },
      { stepNumber: 5, title: "Contrast with YDSE", description: "Compare pattern with the double-slit version." }
    ],
    quiz: [
      { question: "Central maximum width is:", options: ["Same as others", "Twice the others", "Half the others", "Constant"], correctAnswer: "Twice the others", explanation: "In single slit diffraction, the central max is much wider." },
      { question: "Diffraction is prominent when slit is:", options: ["Huge", "Comparable to wavelength", "Made of metal", "In water"], correctAnswer: "Comparable to wavelength", explanation: "Small aperture sizes relative to λ cause significant bending." },
      { question: "Why is the center bright?", options: ["Same path length", "Longer path", "Slit center is open", "Reflection"], correctAnswer: "Same path length", explanation: "Secondary wavelets from the whole slit meet in phase at the center." }
    ],
    sceneKey: "single-slit",
    thumbnail: "https://images.unsplash.com/photo-1510906594845-bc0974739cc4?auto=format&fit=crop&q=80&w=400",
    duration: 25,
    objectives: ["Define diffraction", "Calculate slit width", "Analyze intensity distribution"],
    materials: ["Variable slit", "Laser", "Intensity sensor"],
    isPublished: true
  },
  {
    title: "Polarisation of light",
    subject: "physics",
    class: 12,
    chapter: "Wave Optics",
    chapterNumber: 10,
    description: "Demonstrate that light is a transverse wave by restricting its vibrations to a single plane.",
    difficulty: "medium",
    tags: ["optics", "polarisation", "transverse waves"],
    steps: [
      { stepNumber: 1, title: "Unpolarised Light", description: "Visualize light waves vibrating in all directions." },
      { stepNumber: 2, title: "First Polariser", description: "Pass light through a grating; only vertical vibrations persist." },
      { stepNumber: 3, title: "Second Polariser (Analyzer)", description: "Add another filter and rotate it." },
      { stepNumber: 4, title: "Malus's Law", description: "Observe intensity drop to zero when filters are at 90 degrees." },
      { stepNumber: 5, title: "Applications", description: "Look through '3D glasses' or check 'sunglasses and phone screen'." }
    ],
    quiz: [
      { question: "Which waves can be polarised?", options: ["Transverse only", "Longitudinal only", "Both", "Neither"], correctAnswer: "Transverse only", explanation: "Longitudinal waves (like sound) vibrate in direction of travel, so they can't be filtered by orientation." },
      { question: "Law for intensity I = ?", options: ["I0 cosθ", "I0 cos^2θ", "I0 sinθ", "I0/2"], correctAnswer: "I0 cos^2θ", explanation: "Malus's Law relates intensity to the angle between polarisers." },
      { question: "Angle for total extinction?", options: ["0", "45", "90", "180"], correctAnswer: "90", explanation: "Crossed polaroid configuration blocks all light." }
    ],
    sceneKey: "polarisation",
    thumbnail: "https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?auto=format&fit=crop&q=80&w=400",
    duration: 20,
    objectives: ["Wave vibration planes", "Verify Malus Law", "Understand polaroids"],
    materials: ["Polarising sheets", "Light source", "Lux meter"],
    isPublished: true
  },
  {
    title: "Logic gates — AND, OR, NOT, NAND",
    subject: "physics",
    class: 12,
    chapter: "Semiconductor Electronics",
    chapterNumber: 14,
    description: "Build digital circuits using basic logic gates and verify their Truth Tables.",
    difficulty: "easy",
    tags: ["electronics", "digital", "logic gates"],
    steps: [
      { stepNumber: 1, title: "AND Gate", description: "Input (1,1) for output 1; any other gives 0." },
      { stepNumber: 2, title: "OR Gate", description: "Any input 1 gives output 1." },
      { stepNumber: 3, title: "NOT Gate", description: "Output is inverse of input." },
      { stepNumber: 4, title: "NAND Gate", description: "The 'Universal Gate'; AND followed by NOT." },
      { stepNumber: 5, title: "Combined Logic", description: "Build a mini half-adder circuit." }
    ],
    quiz: [
      { question: "Which is a universal gate?", options: ["AND", "OR", "NAND", "NOT"], correctAnswer: "NAND", explanation: "NAND (and NOR) can be used to construct all other logic gates." },
      { question: "AND gate output is 1 when inputs are:", options: ["0,0", "0,1", "1,0", "1,1"], correctAnswer: "1,1", explanation: "It only outputs high if both inputs are high." },
      { question: "Inverter is another name for:", options: ["OR gate", "NOT gate", "Switch", "Battery"], correctAnswer: "NOT gate", explanation: "It flips bit values (0 to 1, 1 to 0)." }
    ],
    sceneKey: "logic-gates",
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400",
    duration: 15,
    objectives: ["Truth table verification", "Learn binary logic", "Build circuits"],
    materials: ["Gate ICs", "LEDs", "Switches"],
    isPublished: true
  },
  {
    title: "p-n junction diode",
    subject: "physics",
    class: 12,
    chapter: "Semiconductor Electronics",
    chapterNumber: 14,
    description: "Understand how joining P-type and N-type semiconductors creates a component that allows current in only one direction.",
    difficulty: "medium",
    tags: ["electronics", "semiconductor", "diode"],
    steps: [
      { stepNumber: 1, title: "Form Junction", description: "Observe the diffusion of charges and formation of depletion layer." },
      { stepNumber: 2, title: "Forward Bias", description: "Connect P to + and N to -; watch current flow as depletion layer shrinks." },
      { stepNumber: 3, title: "Reverse Bias", description: "Connect P to - and N to +; see depletion layer grow and current stop." },
      { stepNumber: 4, title: "Knee Voltage", description: "Observe the sudden current increase after ~0.7V for Silicon." },
      { stepNumber: 5, title: "Rectification", description: "Use the diode to convert AC to 'bumpy' DC." }
    ],
    quiz: [
      { question: "Majority carriers in P-type?", options: ["Electrons", "Holes", "Neutrons", "Protons"], correctAnswer: "Holes", explanation: "P-type has excess positive vacancies called holes." },
      { question: "Depletion layer size in Forward Bias?", options: ["Stays same", "Increases", "Decreases", "Disappears"], correctAnswer: "Decreases", explanation: "External voltage narrows the barrier, facilitating conduction." },
      { question: "Ideal diode in reverse bias acts as:", options: ["Resistor", "Closed switch", "Open switch", "Speaker"], correctAnswer: "Open switch", explanation: "It has near-infinite resistance, blocking current." }
    ],
    sceneKey: "pn-junction",
    thumbnail: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=400",
    duration: 25,
    objectives: ["V-I characteristics", "Biasing concepts", "Rectification demo"],
    materials: ["Diode", "Power source", "Ammeter", "Breadboard"],
    isPublished: true
  },
  {
    title: "Nuclear fission chain reaction",
    subject: "physics",
    class: 12,
    chapter: "Nuclei",
    chapterNumber: 13,
    description: "Visualize how a single neutron splitting a Uranium-235 nucleus can trigger a self-sustaining energy release.",
    difficulty: "medium",
    tags: ["nuclear", "fission", "energy"],
    steps: [
      { stepNumber: 1, title: "Single Fission", description: "Hit U-235 with a slow neutron; see it split into Barium and Krypton." },
      { stepNumber: 2, title: "Neutron Multiplication", description: "Observe 2-3 neutrons released from the first split." },
      { stepNumber: 3, title: "Uncontrolled Reaction", description: "Watch neutrons hit other nuclei, leading to an exponential explosion." },
      { stepNumber: 4, title: "Controlled Reaction", description: "Insert Control Rods (boron/cadmium) to absorb excess neutrons." },
      { stepNumber: 5, title: "Energy Release", description: "Calculate mass defect and E=mc2 energy." }
    ],
    quiz: [
      { question: "Target nucleus for fission?", options: ["H-1", "He-4", "U-235", "Fe-56"], correctAnswer: "U-235", explanation: "Uranium-235 is the most common fissile isotope." },
      { question: "What controls the reaction?", options: ["Fuel rods", "Control rods", "Coolant", "Turbine"], correctAnswer: "Control rods", explanation: "By absorbing neutrons, they slow down or stop the chain." },
      { question: "Moderator's job?", options: ["Heat it up", "Slow down neutrons", "Kill radiation", "Add fuel"], correctAnswer: "Slow down neutrons", explanation: "Slow neutrons have a higher probability of causing fission." }
    ],
    sceneKey: "nuclear-fission",
    thumbnail: "https://images.unsplash.com/photo-1510906594845-bc0974739cc4?auto=format&fit=crop&q=80&w=400",
    duration: 20,
    objectives: ["Nuclear energy basics", "Chain reaction mechanism", "Safety mechanisms"],
    materials: ["Nuclear simulator"],
    isPublished: true
  },
  {
    title: "Radioactive decay",
    subject: "physics",
    class: 12,
    chapter: "Nuclei",
    chapterNumber: 13,
    description: "Explore the random nature of atomic decay and the concepts of Half-life and Activity.",
    difficulty: "medium",
    tags: ["nuclear", "decay", "radioactivity"],
    steps: [
      { stepNumber: 1, title: "Pure Sample", description: "Start with 1000 'hot' unstable atoms." },
      { stepNumber: 2, title: "Observe Decay", description: "Watch atoms randomly change to stable daughter atoms." },
      { stepNumber: 3, title: "Half-Life Check", description: "Record the time it takes for 500 atoms to decay." },
      { stepNumber: 4, title: "Activity Graph", description: "Plot N vs Time; see the exponential decay curve." },
      { stepNumber: 5, title: "Alpha/Beta/Gamma仿真", description: "Identify the different particles released during decay." }
    ],
    quiz: [
      { question: "Decay follows which statistics?", options: ["Linear", "Exponential", "Random", "Circular"], correctAnswer: "Exponential", explanation: "N = N0 * e^(-λt)." },
      { question: "Half-life of 1 hour; 100g becomes 25g in:", options: ["1 hour", "2 hours", "3 hours", "4 hours"], correctAnswer: "2 hours", explanation: "100 -> 50 (1st half-life) -> 25 (2nd half-life)." },
      { question: "Highly penetrating radiation?", options: ["Alpha", "Beta", "Gamma", "X-ray"], correctAnswer: "Gamma", explanation: "Gamma rays are high energy photons with no mass/charge." }
    ],
    sceneKey: "radioactive-decay",
    thumbnail: "https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?auto=format&fit=crop&q=80&w=400",
    duration: 25,
    objectives: ["Statistical nature of decay", "Calculate decay constant", "Hazard awareness"],
    materials: ["Geiger counter probe", "Simulator"],
    isPublished: true
  },
  // CHEMISTRY - CLASS 10
  {
    title: "Electrolysis of water",
    subject: "chemistry",
    class: 10,
    chapter: "Chemical Reactions and Equations",
    chapterNumber: 1,
    description: "Decompose water into Hydrogen and Oxygen gas using electric current.",
    difficulty: "medium",
    tags: ["electrochemistry", "decomposition", "water"],
    steps: [
      { stepNumber: 1, title: "Setup Apparartus", description: "Place two electrodes in a container of acidified water." },
      { stepNumber: 2, title: "Apply Voltage", description: "Connect to a 6V-9V battery." },
      { stepNumber: 3, title: "Observe Bubbles", description: "Watch gas bubbles form at both electrodes." },
      { stepNumber: 4, title: "Volume Comparison", description: "Note that gas at Cathode is twice the volume of gas at Anode." },
      { stepNumber: 5, title: "Gas Testing", description: "Identify Hydrogen by 'pop' sound and Oxygen by rekindling a splint." }
    ],
    quiz: [
      { question: "Gas evolved at the Cathode?", options: ["Oxygen", "Hydrogen", "Chlorine", "Nitrogen"], correctAnswer: "Hydrogen", explanation: "Reduction of H+ ions occurs at the cathode." },
      { question: "Ratio of H2 to O2 by volume?", options: ["1:1", "1:2", "2:1", "8:1"], correctAnswer: "2:1", explanation: "Water formula is H2O, yielding twice as much Hydrogen." },
      { question: "Why is acid added to water?", options: ["Increase volume", "Increase conductivity", "Change color", "Stop reaction"], correctAnswer: "Increase conductivity", explanation: "Pure water is a poor conductor; ions from acid help current flow." }
    ],
    sceneKey: "electrolysis-water",
    thumbnail: "https://images.unsplash.com/photo-1543083115-638c32cd3d58?auto=format&fit=crop&q=80&w=400",
    duration: 20,
    objectives: ["Decomposition reaction", "Electrochemistry basics", "Gas identification"],
    materials: ["Electrodes", "Battery", "Acidulated water", "Test tubes"],
    isPublished: true
  },
  {
    title: "Electrolysis of copper sulphate",
    subject: "chemistry",
    class: 10,
    chapter: "Metals and Non-metals",
    chapterNumber: 3,
    description: "Demonstrate electroplating and purification of copper.",
    difficulty: "medium",
    tags: ["electrochemistry", "plating", "copper"],
    steps: [
      { stepNumber: 1, title: "Prepare Solution", description: "Dissolve Copper Sulphate in water; observe blue color." },
      { stepNumber: 2, title: "Insert Cathode/Anode", description: "Use a clean metal object as cathode and copper plate as anode." },
      { stepNumber: 3, title: "Electrolysis", description: "Pass current through the solution." },
      { stepNumber: 4, title: "Observe Plating", description: "Watch the cathode get coated with a reddish-brown layer." },
      { stepNumber: 5, title: "Anode Dissolution", description: "Note that the copper anode gradually gets thinner." }
    ],
    quiz: [
      { question: "Reaction at cathode during plating?", options: ["Cu2+ + 2e- -> Cu", "Cu -> Cu2+ + 2e-", "2H2O -> O2 + 4H+", "None"], correctAnswer: "Cu2+ + 2e- -> Cu", explanation: "Copper ions gain electrons and deposit as solid metal." },
      { question: "Why does blue color persist?", options: ["It's paint", "Cu2+ ions are replenished from anode", "Water is blue", "Light effect"], correctAnswer: "Cu2+ ions are replenished from anode", explanation: "Rate of ion removal equals rate of ion addition from active anode." },
      { question: "Object to be plated is made the:", options: ["Cathode", "Anode", "Salt bridge", "Electrolyte"], correctAnswer: "Cathode", explanation: "Positive metal ions move towards the negative cathode." }
    ],
    sceneKey: "electrolysis-cuso4",
    thumbnail: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&q=80&w=400",
    duration: 25,
    objectives: ["Electroplating principles", "Faraday's impact", "Refining metals"],
    materials: ["CuSO4 solution", "Copper plate", "Battery", "Beaker"],
    isPublished: true
  },
  {
    title: "pH indicators — acids and bases",
    subject: "chemistry",
    class: 10,
    chapter: "Acids, Bases and Salts",
    chapterNumber: 2,
    description: "Test various household substances using Litmus, Phenolphthalein, and Universal Indicator.",
    difficulty: "easy",
    tags: ["pH", "indicators", "acids", "bases"],
    steps: [
      { stepNumber: 1, title: "Litmus Test", description: "Dip blue/red litmus into Lemon juice and Soap solution." },
      { stepNumber: 2, title: "Phenolphthalein", description: "Add a drop to acidic and basic samples." },
      { stepNumber: 3, title: "Universal Indicator", description: "Match the resulting color with the standard pH scale." },
      { stepNumber: 4, title: "Natural Indicator", description: "Use Turmeric or Red Cabbage juice as indicators." },
      { stepNumber: 5, title: "Data Analysis", description: "Categorize substances from pH 0 to 14." }
    ],
    quiz: [
      { question: "Acid turns blue litmus:", options: ["Red", "Blue", "Green", "Yellow"], correctAnswer: "Red", explanation: "Acids typically turn blue litmus paper red." },
      { question: "Phenolphthalein in base becomes:", options: ["Colorless", "Pink", "Blue", "Green"], correctAnswer: "Pink", explanation: "It is a standard indicator that turns deep pink in basic solutions." },
      { question: "pH of pure water?", options: ["0", "7", "14", "5"], correctAnswer: "7", explanation: "Pure water is neutral, having a pH of exactly 7." }
    ],
    sceneKey: "ph-indicators",
    thumbnail: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=400",
    duration: 15,
    objectives: ["Identify Acids/Bases", "Compare Indicator sensitivity", "Understand pH scale"],
    materials: ["Litmus paper", "Indicator solutions", "Beakers", "Test samples"],
    isPublished: true
  },
  {
    title: "Neutralisation reaction",
    subject: "chemistry",
    class: 10,
    chapter: "Acids, Bases and Salts",
    chapterNumber: 2,
    description: "Combine an acid and a base to produce salt and water.",
    difficulty: "easy",
    tags: ["reaction", "neutralisation", "salt"],
    steps: [
      { stepNumber: 1, title: "Measure Base", description: "Add 10ml of Sodium Hydroxide to a flask." },
      { stepNumber: 2, title: "Add Indicator", description: "Add Phenolphthalein (turns pink)." },
      { stepNumber: 3, title: "Titrate Acid", description: "Slowly add HCl drop by drop until color disappears." },
      { stepNumber: 4, title: "Heat Observation", description: "Touch the flask to feel it getting warm (exothermic)." },
      { stepNumber: 5, title: "Crystal Formation", description: "Evaporate the solution to obtain NaCl crystals." }
    ],
    quiz: [
      { question: "Base + Acid -> ?", options: ["Salt + Hydrogen", "Salt + Water", "Metal + Acid", "None"], correctAnswer: "Salt + Water", explanation: "Standard neutralisation produces salt and water." },
      { question: "Type of reaction heat-wise?", options: ["Endothermic", "Exothermic", "Isothermal", "None"], correctAnswer: "Exothermic", explanation: "Energy is released when H+ and OH- ions combine." },
      { question: "Salt from HCl + NaOH?", options: ["Sodium Carbonate", "Sodium Chloride", "Magnesium Sulphate", "Potassium Chloride"], correctAnswer: "Sodium Chloride", explanation: "Common table salt is formed from these reactants." }
    ],
    sceneKey: "neutralisation",
    thumbnail: "https://images.unsplash.com/photo-1543083115-638c32cd3d58?auto=format&fit=crop&q=80&w=400",
    duration: 20,
    objectives: ["Neutralisation mechanism", "Indicator use", "Exothermic nature"],
    materials: ["HCl", "NaOH", "Phenolphthalein", "Burette"],
    isPublished: true
  },
  {
    title: "Rusting of iron",
    subject: "chemistry",
    class: 10,
    chapter: "Chemical Reactions and Equations",
    chapterNumber: 1,
    description: "Investigate the conditions necessary for corrosion of iron.",
    difficulty: "easy",
    tags: ["corrosion", "oxidation", "iron"],
    steps: [
      { stepNumber: 1, title: "Setup 3 Tubes", description: "Place clean iron nails in three test tubes." },
      { stepNumber: 2, title: "Variable A", description: "Tube 1: Water and Air." },
      { stepNumber: 3, title: "Variable B", description: "Tube 2: Boiled water and oil (No air)." },
      { stepNumber: 4, title: "Variable C", description: "Tube 3: Anhydrous CaCl2 (No moisture)." },
      { stepNumber: 5, title: "Observation", description: "Wait 3 days and see that only Tube 1 shows rust." }
    ],
    quiz: [
      { question: "Chemical formula of rust?", options: ["FeO", "Fe2O3.xH2O", "Fe3O4", "FeCl3"], correctAnswer: "Fe2O3.xH2O", explanation: "Rust is hydrated ferric oxide." },
      { question: "Conditions for rusting?", options: ["Air only", "Water only", "Air and Water", "Vacuum"], correctAnswer: "Air and Water", explanation: "Both oxygen and moisture are essential for the corrosion of iron." },
      { question: "Preventive method?", options: ["Galvanisation", "Painting", "Alloying", "All of these"], correctAnswer: "All of these", explanation: "All these methods create barriers to prevent contact with air/moisture." }
    ],
    sceneKey: "rusting",
    thumbnail: "https://images.unsplash.com/photo-1547494491-030060e227a6?auto=format&fit=crop&q=80&w=400",
    duration: 15,
    objectives: ["Factors for corrosion", "Redox reaction", "Prevention techniques"],
    materials: ["Iron nails", "Test tubes", "Oil", "CaCl2"],
    isPublished: true
  },
  {
    title: "Crystal structure of NaCl",
    subject: "chemistry",
    class: 10,
    chapter: "Periodic Classification of Elements",
    chapterNumber: 5,
    description: "Explore the 3D lattice arrangement of Sodium and Chloride ions.",
    difficulty: "medium",
    tags: ["bonding", "lattice", "NaCl"],
    steps: [
      { stepNumber: 1, title: "Ionic Bond", description: "Observe electron transfer from Na to Cl." },
      { stepNumber: 2, title: "Lattice Setup", description: "Visualize the alternating Na+ and Cl- ions." },
      { stepNumber: 3, title: "Coordination Number", description: "Count that each Na+ is surrounded by 6 Cl-." },
      { stepNumber: 4, title: "Shape Analysis", description: "Identify the Face-Centered Cubic (FCC) framework." },
      { stepNumber: 5, title: "Macro View", description: "Zoom out to see the salt grain shape reflecting the lattice." }
    ],
    quiz: [
      { question: "Type of bond in NaCl?", options: ["Covalent", "Ionic", "Metallic", "Hydrogen"], correctAnswer: "Ionic", explanation: "Strong electrostatic attraction between oppositely charged ions." },
      { question: "Coordination number of Na+?", options: ["4", "6", "8", "12"], correctAnswer: "6", explanation: "In simple cubic NaCl lattice, each ion has 6 neighbors." },
      { question: "NaCl crystal shape?", options: ["Tetrahedral", "Cubic", "Hexagonal", "Needle"], correctAnswer: "Cubic", explanation: "It forms a repeating cubic structure." }
    ],
    sceneKey: "nacl-crystal",
    thumbnail: "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&q=80&w=400",
    duration: 15,
    objectives: ["Ionic bonding", "Lattice geometry", "Coordination numbers"],
    materials: ["Ball and stick models"],
    isPublished: true
  },
  {
    title: "Atomic structure",
    subject: "chemistry",
    class: 10,
    chapter: "Structure of the Atom",
    chapterNumber: 4,
    description: "Build an atom from scratch using protons, neutrons, and electrons.",
    difficulty: "easy",
    tags: ["atom", "electrons", "subatomic"],
    steps: [
      { stepNumber: 1, title: "The Nucleus", description: "Pack protons and neutrons in the center." },
      { stepNumber: 2, title: "Electron Shells", description: "Add electrons to K, L, M shells following 2n^2 rule." },
      { stepNumber: 3, title: "Valence Shell", description: "Identify the outermost electrons and their role in bonding." },
      { stepNumber: 4, title: "Isotopes", description: "Change neutron count and see how mass changes but element remains." },
      { stepNumber: 5, title: "Ion Formation", description: "Add/remove electrons to create positive and negative ions." }
    ],
    quiz: [
      { question: "Charge of a proton?", options: ["Negative", "Positive", "Neutral", "Double"], correctAnswer: "Positive", explanation: "Protons carry a fundamental positive charge (+1)." },
      { question: "Mass of atom is in:", options: ["Electrons", "Nucleus", "Shells", "Void"], correctAnswer: "Nucleus", explanation: "Protons and neutrons contain almost all the mass of an atom." },
      { question: "Octet rule refers to:", options: ["8 protons", "8 neutrons", "8 valence electrons", "8 shells"], correctAnswer: "8 valence electrons", explanation: "Atoms are most stable with a full outer shell of 8 electrons." }
    ],
    sceneKey: "atomic-structure",
    thumbnail: "https://images.unsplash.com/photo-1554475901-4538ddfbccc2?auto=format&fit=crop&q=80&w=400",
    duration: 20,
    objectives: ["Subatomic particles", "Electron configuration", "Isotope concepts"],
    materials: ["Atomic builder simulator"],
    isPublished: true
  },
  // CHEMISTRY - CLASS 12
  {
    title: "Crystal structures — BCC, FCC, Simple cubic",
    subject: "chemistry",
    class: 12,
    chapter: "The Solid State",
    chapterNumber: 1,
    description: "Compare unit cells and calculate packing efficiency in different metallic lattice systems.",
    difficulty: "medium",
    tags: ["solids", "lattice", "packing"],
    steps: [
      { stepNumber: 1, title: "Simple Cubic", description: "Align atoms only at the corners; calculate Z=1." },
      { stepNumber: 2, title: "Body-Centered (BCC)", description: "Add one atom in the center of the cube; Z=2." },
      { stepNumber: 3, title: "Face-Centered (FCC)", description: "Place atoms at centers of all faces; Z=4." },
      { stepNumber: 4, title: "Coordination Number", description: "Rotate and count the nearest neighbors (6, 8, 12)." },
      { stepNumber: 5, title: "Packing Efficiency", description: "Analyze the percentage of occupied space (52%, 68%, 74%)." }
    ],
    quiz: [
      { question: "Z (atoms per cell) for FCC?", options: ["1", "2", "4", "6"], correctAnswer: "4", explanation: "8*(1/8) corners + 6*(1/2) faces = 4." },
      { question: "Highest packing efficiency?", options: ["BCC", "FCC/HCP", "Simple Cubic", "Void"], correctAnswer: "FCC/HCP", explanation: "These systems occupy 74% of the unit cell volume." },
      { question: "Coordination number for BCC?", options: ["6", "8", "12", "4"], correctAnswer: "8", explanation: "The central atom touches all 8 corner atoms." }
    ],
    sceneKey: "crystal-structures",
    thumbnail: "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&q=80&w=400",
    duration: 25,
    objectives: ["Unit cell types", "Lattice math", "Packing concepts"],
    materials: ["Lattice models"],
    isPublished: true
  },
  {
    title: "Electrochemical cell — Daniel cell",
    subject: "chemistry",
    class: 12,
    chapter: "Electrochemistry",
    chapterNumber: 3,
    description: "Generate electricity from a chemical reaction using Zinc and Copper electrodes.",
    difficulty: "hard",
    tags: ["electrochemistry", "redox", "cell"],
    steps: [
      { stepNumber: 1, title: "Metal Half-Cells", description: "Place Zinc in ZnSO4 and Copper in CuSO4." },
      { stepNumber: 2, title: "Salt Bridge", description: "Connect the beakers with a KCl salt bridge." },
      { stepNumber: 3, title: "Voltmeter Check", description: "Note the standard potential of 1.10V." },
      { stepNumber: 4, title: "Electron Flow", description: "Visualize electrons moving from Anode(Zn) to Cathode(Cu)." },
      { stepNumber: 5, title: "Nernst Equation", description: "Vary concentrations and see how voltage changes." }
    ],
    quiz: [
      { question: "Role of Salt Bridge?", options: ["Stop reaction", "Provide current", "Maintain neutrality", "Aesthetics"], correctAnswer: "Maintain neutrality", explanation: "It allows ion flow to balance the built-up charge." },
      { question: "Standard potential (E0 cell) formula?", options: ["E_right - E_left", "E_left - E_right", "E_anode + E_cathode", "None"], correctAnswer: "E_right - E_left", explanation: "Cathode potential minus Anode potential." },
      { question: "Oxidation happens at:", options: ["Cathode", "Anode", "Salt bridge", "Wire"], correctAnswer: "Anode", explanation: "Anode is where electrons are lost (Oxidation)." }
    ],
    sceneKey: "daniel-cell",
    thumbnail: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&q=80&w=400",
    duration: 30,
    objectives: ["Galvanic cell basics", "Salt bridge function", "Nernst Equation application"],
    materials: ["Metal strips", "Salt bridge", "Multimeter"],
    isPublished: true
  },
  {
    title: "Electrolytic cell",
    subject: "chemistry",
    class: 12,
    chapter: "Electrochemistry",
    chapterNumber: 3,
    description: "Reverse a chemical reaction by applying an external voltage.",
    difficulty: "medium",
    tags: ["electrochemistry", "electrolysis"],
    steps: [
      { stepNumber: 1, title: "Single Container", description: "Place two electrodes in molten NaCl." },
      { stepNumber: 2, title: "Apply Power", description: "Connect to a source > E0 of the cell." },
      { stepNumber: 3, title: "Product Evolution", description: "Watch Chlorine gas at Anode and Sodium metal at Cathode." },
      { stepNumber: 4, title: "Faraday's Law", description: "Calculate mass of product based on charge passed." },
      { stepNumber: 5, title: "Comparison", description: "Differentiate from Galvanic cells (Energy used vs produced)." }
    ],
    quiz: [
      { question: "External power source required?", options: ["Yes", "No", "Only for start", "Sometimes"], correctAnswer: "Yes", explanation: "Electrolytic reactions are non-spontaneous." },
      { question: "Charge on Cathode here?", options: ["Positive", "Negative", "Neutral", "Varying"], correctAnswer: "Negative", explanation: "In electrolysis, cathode is connected to negative terminal of battery." },
      { question: "Faraday's constant approx value?", options: ["96500 C", "1000 C", "1.6e-19 C", "3.14"], correctAnswer: "96500 C", explanation: "Charge of 1 mole of electrons." }
    ],
    sceneKey: "electrolytic-cell",
    thumbnail: "https://images.unsplash.com/photo-1543083115-638c32cd3d58?auto=format&fit=crop&q=80&w=400",
    duration: 25,
    objectives: ["Electrolysis mechanism", "Faraday's laws of electrolysis", "Molten vs Aqueous products"],
    materials: ["Electrodes", "DC power source"],
    isPublished: true
  },
  {
    title: "Collision theory — reaction rate",
    subject: "chemistry",
    class: 12,
    chapter: "Chemical Kinetics",
    chapterNumber: 4,
    description: "Understand why most collisions don't lead to products and how temperature affects rates.",
    difficulty: "hard",
    tags: ["kinetics", "collisions", "activation energy"],
    steps: [
      { stepNumber: 1, title: "Elastic Collisions", description: "Watch molecules bounce off without reacting." },
      { stepNumber: 2, title: "Activation Energy", description: "Show the energy barrier molecules must overcome." },
      { stepNumber: 3, title: "Proper Orientation", description: "Show two molecules colliding the 'wrong' way and not reacting." },
      { stepNumber: 4, title: "Temperature Boost", description: "Increase temp and see more molecules reaching threshold." },
      { stepNumber: 5, title: "Catalyst Effect", description: "Add a catalyst to lower the activation energy barrier." }
    ],
    quiz: [
      { question: "Conditions for effective collision?", options: ["Energy only", "Orientation only", "Both", "None"], correctAnswer: "Both", explanation: "Need threshold energy AND correct spatial alignment." },
      { question: "Effect of 10-degree temp rise?", options: ["Rate halves", "Rate doubles", "No change", "Reaction stops"], correctAnswer: "Rate doubles", explanation: "Approximation for many chemical reactions." },
      { question: "Catalyst increases rate by:", options: ["Adding heat", "Lowering activation energy", "Increasing collisions", "Increasing mass"], correctAnswer: "Lowering activation energy", explanation: "It provides an alternate lower-energy pathway." }
    ],
    sceneKey: "collision-theory",
    thumbnail: "https://images.unsplash.com/photo-1532187875605-1ef6ec82114e?auto=format&fit=crop&q=80&w=400",
    duration: 20,
    objectives: ["Mechanism of reaction", "Activation energy", "Arrhenius concept"],
    materials: ["Molecular simulator"],
    isPublished: true
  },
  {
    title: "Molecular orbital theory — bonding",
    subject: "chemistry",
    class: 12,
    chapter: "Chemical Bonding",
    chapterNumber: 4,
    description: "See how atomic orbitals overlap to form Bonding and Anti-bonding orbitals.",
    difficulty: "hard",
    tags: ["quantum", "bonding", "MOT"],
    steps: [
      { stepNumber: 1, title: "Orbital Overlap", description: "Combine two 1s orbitals of Hydrogen." },
      { stepNumber: 2, title: "Sigma Bonding", description: "Observe high electron density between nuclei (Stability)." },
      { stepNumber: 3, title: "Sigma* Anti-bonding", description: "Observe a node with zero density between nuclei." },
      { stepNumber: 4, title: "Paramagnetism of O2", description: "Note unpaired electrons in Pi* orbitals." },
      { stepNumber: 5, title: "Bond Order", description: "Calculate (Bonding - Antibonding)/2." }
    ],
    quiz: [
      { question: "Energy of Bonding MO?", options: ["higher than atomic", "lower than atomic", "same", "zero"], correctAnswer: "lower than atomic", explanation: "Lower energy means higher stability." },
      { question: "O2 molecule is:", options: ["Diamagnetic", "Paramagnetic", "Ferromagnetic", "Neutral"], correctAnswer: "Paramagnetic", explanation: "Due to unpaired electrons in anti-bonding molecular orbitals." },
      { question: "Bond order of He2?", options: ["1", "2", "0.5", "0"], correctAnswer: "0", explanation: "Equal bonding and anti-bonding electrons means no net stability; doesn't exist." }
    ],
    sceneKey: "molecular-orbital",
    thumbnail: "https://images.unsplash.com/photo-1554475901-4538ddfbccc2?auto=format&fit=crop&q=80&w=400",
    duration: 30,
    objectives: ["MO energy levels", "Magnetic properties", "Calculate bond order"],
    materials: ["3D Orbital viewer"],
    isPublished: true
  },
  {
    title: "Hybridisation — sp, sp2, sp3",
    subject: "chemistry",
    class: 12,
    chapter: "Chemical Bonding",
    chapterNumber: 4,
    description: "Visualize the mixing of S and P orbitals to explain molecular shapes.",
    difficulty: "hard",
    tags: ["bonding", "hybridisation", "shapes"],
    steps: [
      { stepNumber: 1, title: "sp Hybridisation", description: "Mix 1s and 1p; form Linear shape (180 deg)." },
      { stepNumber: 2, title: "sp2 Hybridisation", description: "Mix 1s and 2p; form Trigonal Planar (120 deg)." },
      { stepNumber: 3, title: "sp3 Hybridisation", description: "Mix 1s and 3p; form Tetrahedral (109.5 deg)." },
      { stepNumber: 4, title: "Real Examples", description: "View Acetylene (sp), Ethylene (sp2), Methane (sp3)." },
      { stepNumber: 5, title: "Pi Bonding", description: "See leftover unhybridised p-orbitals forming side-to-side bonds." }
    ],
    quiz: [
      { question: "Geometry of sp3 hybridisation?", options: ["Linear", "Planar", "Tetrahedral", "Bent"], correctAnswer: "Tetrahedral", explanation: "4 hybrid orbitals orient as far as possible." },
      { question: "Bond angle in Ethene (C2H4)?", options: ["180", "120", "109.5", "90"], correctAnswer: "120", explanation: "Carbons are sp2 hybridised." },
      { question: "Hybridisation in H2O?", options: ["sp", "sp2", "sp3", "dsp2"], correctAnswer: "sp3", explanation: "Oxygen has 2 bonds and 2 lone pairs, using 4 sp3 orbitals." }
    ],
    sceneKey: "hybridisation",
    thumbnail: "https://images.unsplash.com/photo-1554475901-4538ddfbccc2?auto=format&fit=crop&q=80&w=400",
    duration: 25,
    objectives: ["Orbital mixing", "Shape determination", "Organic molecule bonding"],
    materials: ["Orbital simulator"],
    isPublished: true
  },
  {
    title: "VSEPR theory — molecular shapes",
    subject: "chemistry",
    class: 12,
    chapter: "Chemical Bonding",
    chapterNumber: 4,
    description: "Predict the geometry of molecules based on electron pair repulsion.",
    difficulty: "medium",
    tags: ["bonding", "VSEPR", "geometry"],
    steps: [
      { stepNumber: 1, title: "Repulsion Rule", description: "Observe that lone pairs repel more than bond pairs." },
      { stepNumber: 2, title: "CH4 vs NH3", description: "See how the lone pair in NH3 pushes the bonds closer." },
      { stepNumber: 3, title: "Bent Molecule", description: "Visualize water (H2O) with two lone pairs." },
      { stepNumber: 4, title: "Expanded Octet", description: "See PCl5 (Trigonal Bipyramidal) and SF6 (Octahedral)." },
      { stepNumber: 5, title: "Rule of thumb", description: "Minimize repulsion to find the most stable shape." }
    ],
    quiz: [
      { question: "Shape of NH3?", options: ["Tetrahedral", "Pyramidal", "Bent", "Linear"], correctAnswer: "Pyramidal", explanation: "Based on sp3 but with one lone pair." },
      { question: "SF6 molecular geometry?", options: ["Tetrahedral", "Octahedral", "Cubic", "Square Planar"], correctAnswer: "Octahedral", explanation: "6 bond pairs arrange symmetrically." },
      { question: "Greatest repulsion is between?", options: ["BP-BP", "LP-BP", "LP-LP", "None"], correctAnswer: "LP-LP", explanation: "Lone pairs occupy more space than bond pairs." }
    ],
    sceneKey: "vsepr-theory",
    thumbnail: "https://images.unsplash.com/photo-1554475901-4538ddfbccc2?auto=format&fit=crop&q=80&w=400",
    duration: 25,
    objectives: ["Predict shapes", "Understand lone pairs", "Bond angle trends"],
    materials: ["Molecule kit"],
    isPublished: true
  },
  {
    title: "Benzene structure — resonance",
    subject: "chemistry",
    class: 12,
    chapter: "Organic Chemistry",
    chapterNumber: 10,
    description: "Visualize the ring structure of Benzene and the delocalized Pi-cloud.",
    difficulty: "medium",
    tags: ["organic", "benzene", "resonance"],
    steps: [
      { stepNumber: 1, title: "Kekulé Ring", description: "Place 6 carbons in a hexagon with alternating doubles." },
      { stepNumber: 2, title: "Resonance Structures", description: "Switch double bond positions and see they are equivalent." },
      { stepNumber: 3, title: "Pi Cloud", description: "Visualize the continuous donut-shaped electron clouds above/below." },
      { stepNumber: 4, title: "Bond Lengths", description: "Measure and see all C-C bonds are of equal length (139 pm)." },
      { stepNumber: 5, title: "Stability", description: "Compare stability with hypothetical cyclohexatriene." }
    ],
    quiz: [
      { question: "Shape of benzene?", options: ["Planar hexagon", "Cubic", "Chain", "Folded"], correctAnswer: "Planar hexagon", explanation: "Sp2 hybridised carbons create a flat ring." },
      { question: "Nature of Pi electrons?", options: ["Localized", "Delocalized", "Stationary", "Solid"], correctAnswer: "Delocalized", explanation: "Electrons are shared across the whole ring." },
      { question: "Number of Pi electrons?", options: ["2", "4", "6", "12"], correctAnswer: "6", explanation: "Three double bonds contribute 6 electrons." }
    ],
    sceneKey: "benzene-resonance",
    thumbnail: "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&q=80&w=400",
    duration: 20,
    objectives: ["Aromaticity", "Lattice geometry", "Resonance energy"],
    materials: ["Orbital viewer"],
    isPublished: true
  },
  {
    title: "Chirality — optical isomers",
    subject: "chemistry",
    class: 12,
    chapter: "Organic Chemistry",
    chapterNumber: 10,
    description: "Explore mirror images and non-superimposable molecules that rotate plane-polarised light.",
    difficulty: "hard",
    tags: ["organic", "chirality", "isomers"],
    steps: [
      { stepNumber: 1, title: "Asymmetric Carbon", description: "Observe a carbon with 4 different groups attached." },
      { stepNumber: 2, title: "Mirror Image", description: "Create the reflection of the molecule." },
      { stepNumber: 3, title: "Superimposition Test", description: "Try to rotate and overlap them; note they don't fit." },
      { stepNumber: 4, title: "Light Rotation", description: "Pass polarised light through and watch it rotate (L or D)." },
      { stepNumber: 5, title: "Racemic Mixture", description: "Combine both and observe no net light rotation." }
    ],
    quiz: [
      { question: "Enantiomers are:", options: ["Structural isomers", "Non-superimposable mirror images", "Identical", "Salts"], correctAnswer: "Non-superimposable mirror images", explanation: "The foundational definition of chirality." },
      { question: "Rotate light clockwise?", options: ["Levo", "Dextro", "Meso", "Nadir"], correctAnswer: "Dextro", explanation: "Dextrorotatory (+) rotates light to the right." },
      { question: "Chiral center requirement?", options: ["4 same groups", "4 different groups", "Double bond", "Ring"], correctAnswer: "4 different groups", explanation: "Ensures no plane of symmetry exists." }
    ],
    sceneKey: "chirality",
    thumbnail: "https://images.unsplash.com/photo-1532187875605-1ef6ec82114e?auto=format&fit=crop&q=80&w=400",
    duration: 30,
    objectives: ["3D orientation", "Stereochemistry", "Optical activity"],
    materials: ["Molecular models"],
    isPublished: true
  },
  {
    title: "Galvanic corrosion",
    subject: "chemistry",
    class: 12,
    chapter: "Electrochemistry",
    chapterNumber: 3,
    description: "Watch how two different metals in contact corrode at different rates.",
    difficulty: "medium",
    tags: ["corrosion", "materials", "metals"],
    steps: [
      { stepNumber: 1, title: "Metal Pair", description: "Connect iron and copper in saltwater." },
      { stepNumber: 2, title: "Identify Anode", description: "The more reactive metal (iron) starts losing mass." },
      { stepNumber: 3, title: "Sacrificial Anode", description: "Attach Magnesium to iron and see iron stay protected." },
      { stepNumber: 4, title: "Circuit path", description: "Follow the ion flow in the electrolyte." },
      { stepNumber: 5, title: "Prevention", description: "Analyze the use of coatings and insulators." }
    ],
    quiz: [
      { question: "Which metal corrodes first?", options: ["Most reactive", "Least reactive", "Heaviest", "Shiny one"], correctAnswer: "Most reactive", explanation: "It acts as the anode in the electrochemical cell." },
      { question: "Saltwater effect?", options: ["Slows it down", "Accelerates it", "Stops it", "No effect"], correctAnswer: "Accelerates it", explanation: "Acts as a strong electrolyte facilitating ion movement." },
      { question: "Galvanisation uses which metal?", options: ["Gold", "Zinc", "Copper", "Mercury"], correctAnswer: "Zinc", explanation: "Zinc is more reactive and corrodes instead of the steel (sacrificial)." }
    ],
    sceneKey: "galvanic-corrosion",
    thumbnail: "https://images.unsplash.com/photo-1547494491-030060e227a6?auto=format&fit=crop&q=80&w=400",
    duration: 20,
    objectives: ["Reactivity series", "Maintenance engineering", "Cathodic protection"],
    materials: ["Metal samples", "Salt solution", "Wires"],
    isPublished: true
  },
  // BIOLOGY - CLASS 10
  {
    title: "Photosynthesis process",
    subject: "biology",
    class: 10,
    chapter: "Life Processes",
    chapterNumber: 6,
    description: "Visualize how plants use sunlight, water, and CO2 to create glucose and oxygen.",
    difficulty: "easy",
    tags: ["botany", "life processes", "photosynthesis"],
    steps: [
      { stepNumber: 1, title: "Light Absorption", description: "Watch chlorophyll in leaves capture sunlight." },
      { stepNumber: 2, title: "Water Transport", description: "Follow water from roots through xylem to the leaves." },
      { stepNumber: 3, title: "Gas Exchange", description: "See CO2 enter through stomata." },
      { stepNumber: 4, title: "Light Reaction", description: "Observe splitting of water molecules into oxygen and protons." },
      { stepNumber: 5, title: "Dark Reaction", description: "Observe carbon fixation into sugar (glucose)." }
    ],
    quiz: [
      { question: "Where does photosynthesis occur?", options: ["Mitochondria", "Chloroplast", "Nucleus", "Vacuole"], correctAnswer: "Chloroplast", explanation: "Specifically in the thylakoid and stroma of chloroplasts." },
      { question: "Gas released as by-product?", options: ["CO2", "Oxygen", "Nitrogen", "Hydrogen"], correctAnswer: "Oxygen", explanation: "O2 is released from the splitting of water molecules." },
      { question: "Pigment that captures sunlight?", options: ["Melanin", "Hemoglobin", "Chlorophyll", "Carotene"], correctAnswer: "Chlorophyll", explanation: "Chlorophyll is primarily responsible for light absorption." }
    ],
    sceneKey: "photosynthesis",
    thumbnail: "https://images.unsplash.com/photo-1501004318641-739e828d1c9e?auto=format&fit=crop&q=80&w=400",
    duration: 15,
    objectives: ["Photosynthesis steps", "Raw materials needed", "End products analysis"],
    materials: ["Potted plant", "Light source", "Iodine solution"],
    isPublished: true
  },
  {
    title: "Human digestive system",
    subject: "biology",
    class: 10,
    chapter: "Life Processes",
    chapterNumber: 6,
    description: "Follow the journey of food through the alimentary canal and see how nutrients are absorbed.",
    difficulty: "medium",
    tags: ["human anatomy", "life processes", "digestion"],
    steps: [
      { stepNumber: 1, title: "Mouth and Esophagus", description: "Mechanical breakdown and movement by peristalsis." },
      { stepNumber: 2, title: "Stomach Action", description: "Mixing with gastric juices and HCl for protein breakdown." },
      { stepNumber: 3, title: "Liver and Pancreas", description: "Observe bile and pancreatic enzymes entering the duodenum." },
      { stepNumber: 4, title: "Small Intestine", description: "Absorption of nutrients through villi into the bloodstream." },
      { stepNumber: 5, title: "Large Intestine", description: "Water absorption and waste preparation." }
    ],
    quiz: [
      { question: "Where does most absorption happen?", options: ["Stomach", "Small Intestine", "Large Intestine", "Esophagus"], correctAnswer: "Small Intestine", explanation: "Villi provide a massive surface area for nutrient absorption." },
      { question: "Role of Bile juice?", options: ["Protein digestion", "Fat emulsification", "Carbohydrate split", "Kill bacteria"], correctAnswer: "Fat emulsification", explanation: "Bile breaks large fat globules into smaller ones for lipase action." },
      { question: "Alimentary canal length approx?", options: ["2m", "5m", "9m", "15m"], correctAnswer: "9m", explanation: "The entire path from mouth to anus is about 9 meters long." }
    ],
    sceneKey: "digestive-system",
    thumbnail: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=400",
    duration: 25,
    objectives: ["Organs of digestion", "Enzymatic actions", "Absorption mechanism"],
    materials: ["Anatomy model"],
    isPublished: true
  },
  {
    title: "Neuron and nerve impulse",
    subject: "biology",
    class: 10,
    chapter: "Control and Coordination",
    chapterNumber: 7,
    description: "Observe how information is transmitted electrically through a nerve cell.",
    difficulty: "medium",
    tags: ["nervous system", "cell", "neuroscience"],
    steps: [
      { stepNumber: 1, title: "Neuron Anatomy", description: "Identify Cell body, Dendrites, and Axon." },
      { stepNumber: 2, title: "Input Trigger", description: "See dendrites receiving a chemical signal." },
      { stepNumber: 3, title: "Action Potential", description: "Watch electrical wave travel down the axon." },
      { stepNumber: 4, title: "Myelin Sheath Role", description: "Observe faster signal hopping (Saltatory conduction)." },
      { stepNumber: 5, title: "Synaptic Gap", description: "Observe chemicals (neurotransmitters) crossing to the next neuron." }
    ],
    quiz: [
      { question: "Branch-like inputs of neuron?", options: ["Axon", "Dendrites", "Nucleus", "Vesicle"], correctAnswer: "Dendrites", explanation: "Dendrites receive incoming signals from other neurons." },
      { question: "Signal travels fastest in:", options: ["Myelinated axon", "Non-myelinated axon", "Dendrite", "Node"], correctAnswer: "Myelinated axon", explanation: "Myelin acts as an insulator, allowing signals to 'jump'." },
      { question: "Gap between two neurons?", options: ["Bridge", "Synapse", "Link", "Void"], correctAnswer: "Synapse", explanation: "The synapse is the functional junction between neurons." }
    ],
    sceneKey: "neuron-impulse",
    thumbnail: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=400",
    duration: 20,
    objectives: ["Neuron structure", "Signal transmission", "Reflex arc basics"],
    materials: ["Microscope view", "Impulse simulator"],
    isPublished: true
  },
  {
    title: "Mitosis — cell division",
    subject: "biology",
    class: 10,
    chapter: "How do Organisms Reproduce?",
    chapterNumber: 8,
    description: "Observe the process where one cell divides into two identical daughter cells.",
    difficulty: "hard",
    tags: ["genetics", "cell division", "mitosis"],
    steps: [
      { stepNumber: 1, title: "Prophase", description: "Chromosomes condense and spindle forms." },
      { stepNumber: 2, title: "Metaphase", description: "Chromosomes align at the equatorial plate." },
      { stepNumber: 3, title: "Anaphase", description: "Sister chromatids pull apart to opposite poles." },
      { stepNumber: 4, title: "Telophase", description: "Nuclear membranes reform around separated sets." },
      { stepNumber: 5, title: "Cytokinesis", description: "Physical splitting of the cytoplasm into two cells." }
    ],
    quiz: [
      { question: "Stage where chromosomes align?", options: ["Prophase", "Metaphase", "Anaphase", "Interphase"], correctAnswer: "Metaphase", explanation: "Meta- means middle; chromosomes line up in the middle." },
      { question: "Result of mitosis?", options: ["2 identical cells", "4 different cells", "1 large cell", "No cells"], correctAnswer: "2 identical cells", explanation: "Mitosis preserves the chromosome number." },
      { question: "Type of cells using mitosis?", options: ["Sperm cells", "Egg cells", "Somatic (body) cells", "None"], correctAnswer: "Somatic (body) cells", explanation: "Used for growth and repair of regular body tissues." }
    ],
    sceneKey: "mitosis",
    thumbnail: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=400",
    duration: 30,
    objectives: ["Identify mitosis phases", "Understand DNA replication", "Growth and repair concepts"],
    materials: ["Onion root tip slide", "Virtual microscope"],
    isPublished: true
  },
  {
    title: "DNA double helix structure",
    subject: "biology",
    class: 10,
    chapter: "Heredity and Evolution",
    chapterNumber: 9,
    description: "Explore the molecular structure of the blueprint of life.",
    difficulty: "medium",
    tags: ["genetics", "DNA", "molecules"],
    steps: [
      { stepNumber: 1, title: "Double Helix", description: "Observe the twisted ladder shape." },
      { stepNumber: 2, title: "Sugar-Phosphate Backbone", description: "Identify the continuous rails of the ladder." },
      { stepNumber: 3, title: "Base Pairing", description: "Zoom in on A-T and G-C hydrogen bonds." },
      { stepNumber: 4, title: "Anti-parallel strands", description: "Notice the 5' to 3' and 3' to 5' directions." },
      { stepNumber: 5, title: "Genetic Code", description: "See how sequences of bases form genes." }
    ],
    quiz: [
      { question: "Adenine pairs with:", options: ["Cytosine", "Guanine", "Thymine", "Uracil"], correctAnswer: "Thymine", explanation: "A always pairs with T in DNA." },
      { question: "Type of bond between bases?", options: ["Ionic", "Hydrogen", "Covalent", "Metallic"], correctAnswer: "Hydrogen", explanation: "Weak hydrogen bonds allow the helix to unzip for copying." },
      { question: "Who proposed the model in 1953?", options: ["Mendel", "Darwin", "Watson & Crick", "Newton"], correctAnswer: "Watson & Crick", explanation: "They deduced the structure based on X-ray data from Franklin." }
    ],
    sceneKey: "dna-helix",
    thumbnail: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=400",
    duration: 20,
    objectives: ["DNA structure basics", "Complementary base pairing", "Gene definition"],
    materials: ["3D DNA model"],
    isPublished: true
  },
  // BIOLOGY - CLASS 12
  {
    title: "DNA replication",
    subject: "biology",
    class: 12,
    chapter: "Molecular Basis of Inheritance",
    chapterNumber: 6,
    description: "Witness the semi-conservative process of copying a DNA molecule.",
    difficulty: "hard",
    tags: ["genetics", "DNA", "replication"],
    steps: [
      { stepNumber: 1, title: "Unwinding", description: "Helicase enzyme unzips the double helix." },
      { stepNumber: 2, title: "Primer Addition", description: "Primase adds RNA primers to start the process." },
      { stepNumber: 3, title: "Polymerisation", description: "DNA Polymerase adds nucleotides in 5' to 3' direction." },
      { stepNumber: 4, title: "Leading and Lagging", description: "Observe continuous synthesis vs Okazaki fragments." },
      { stepNumber: 5, title: "Ligation", description: "DNA Ligase seals the fragments into a continuous strand." }
    ],
    quiz: [
      { question: "Which enzyme 'unzips' DNA?", options: ["Polymerase", "Helicase", "Ligase", "Amylase"], correctAnswer: "Helicase", explanation: "Helicase breaks hydrogen bonds between bases." },
      { question: "Replication is said to be:", options: ["Conservative", "Semi-conservative", "Dispersive", "Random"], correctAnswer: "Semi-conservative", explanation: "Each new DNA molecule has one old and one new strand." },
      { question: "Direction of DNA synthesis?", options: ["3' to 5'", "5' to 3'", "Any direction", "Circular"], correctAnswer: "5' to 3'", explanation: "Polymerase can only add nucleotides to the 3' end." }
    ],
    sceneKey: "dna-replication",
    thumbnail: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=400",
    duration: 30,
    objectives: ["Enzymatic roles", "Semi-conservative model", "Okazaki fragments"],
    materials: ["Molecular animation"],
    isPublished: true
  },
  {
    title: "Transcription — DNA to mRNA",
    subject: "biology",
    class: 12,
    chapter: "Molecular Basis of Inheritance",
    chapterNumber: 6,
    description: "Learn how the genetic code is copied from DNA into a mobile mRNA message.",
    difficulty: "hard",
    tags: ["genetics", "RNA", "transcription"],
    steps: [
      { stepNumber: 1, title: "Initiation", description: "RNA Polymerase binds to the promoter region." },
      { stepNumber: 2, title: "Elongation", description: "Building an mRNA strand complementary to the DNA template." },
      { stepNumber: 3, title: "Termination", description: "Reaching the end signal and releasing the RNA." },
      { stepNumber: 4, title: "Splicing", description: "Removing introns and joining exons in eukaryotes." },
      { stepNumber: 5, title: "Export", description: "mRNA moving out of the nucleus into the cytoplasm." }
    ],
    quiz: [
      { question: "Enzyme responsible for mRNA?", options: ["DNA Polymerase", "RNA Polymerase", "Ribosome", "tRNA"], correctAnswer: "RNA Polymerase", explanation: "It reads the DNA and synthesizes RNA." },
      { question: "Base substituted for Thymine in RNA?", options: ["Adenine", "Guanine", "Uracil", "Cytosine"], correctAnswer: "Uracil", explanation: "RNA uses Uracil (U) instead of Thymine (T)." },
      { question: "Where does this occur in humans?", options: ["Cytoplasm", "Nucleus", "Ribosome", "Golgi"], correctAnswer: "Nucleus", explanation: "The DNA from which it is copied stays protected in the nucleus." }
    ],
    sceneKey: "transcription",
    thumbnail: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=400",
    duration: 25,
    objectives: ["Central Dogma Part 1", "mRNA processing", "Promoter concept"],
    materials: ["Biomolecule simulator"],
    isPublished: true
  },
  {
    title: "Translation — protein synthesis",
    subject: "biology",
    class: 12,
    chapter: "Molecular Basis of Inheritance",
    chapterNumber: 6,
    description: "The final step where mRNA instructions are used by ribosomes to build a protein.",
    difficulty: "hard",
    tags: ["genetics", "proteins", "ribosome"],
    steps: [
      { stepNumber: 1, title: "Ribosome Assembly", description: "Small and large subunits clamp onto the mRNA." },
      { stepNumber: 2, title: "tRNA Matching", description: "tRNA molecules bringing specific amino acids based on codons." },
      { stepNumber: 3, title: "Peptide Bond", description: "Joining amino acids into a growing chain." },
      { stepNumber: 4, title: "Translocation", description: "Ribosome moving along the mRNA 'tape'." },
      { stepNumber: 5, title: "Folding", description: "Watch the finished chain fold into a functional 3D protein." }
    ],
    quiz: [
      { question: "The 'factory' for protein synthesis?", options: ["Nucleus", "Ribosome", "Lysosome", "Vacuole"], correctAnswer: "Ribosome", explanation: "Ribosomes are the sites of protein translation." },
      { question: "3-base sequence on mRNA?", options: ["Anti-codon", "Codon", "Gene", "Exon"], correctAnswer: "Codon", explanation: "A codon codes for one specific amino acid." },
      { question: "Molecule that carries amino acids?", options: ["mRNA", "tRNA", "rRNA", "snRNA"], correctAnswer: "tRNA", explanation: "Transport RNA (tRNA) bridges the gap between code and chemistry." }
    ],
    sceneKey: "translation",
    thumbnail: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=400",
    duration: 30,
    objectives: ["Genetic code deciphering", "Protein structure basics", "Ribosome function"],
    materials: ["3D molecular visuals"],
    isPublished: true
  },
  {
    title: "Heart — blood circulation",
    subject: "biology",
    class: 12,
    chapter: "Human Physiology",
    chapterNumber: 18,
    description: "A detailed look at the 4-chambered human heart and double circulation.",
    difficulty: "medium",
    tags: ["human anatomy", "physiology", "heart"],
    steps: [
      { stepNumber: 1, title: "Identify Chambers", description: "Locate Left/Right Atria and Ventricles." },
      { stepNumber: 2, title: "Pulmonary Loop", description: "Follow blood from Right Ventricle to Lungs and back to Left Atrium." },
      { stepNumber: 3, title: "Systemic Loop", description: "Watch oxygenated blood leave the Left Ventricle for the body." },
      { stepNumber: 4, title: "Valve Operation", description: "Observe Tricuspid and Mitral valves preventing backflow." },
      { stepNumber: 5, title: "The Heartbeat", description: "Follow the electrical signal from SA node to AV node." }
    ],
    quiz: [
      { question: "Which side pumps oxygenated blood?", options: ["Right", "Left", "Both", "Top only"], correctAnswer: "Left", explanation: "The left ventricle pumps oxygen-rich blood to the entire body." },
      { question: "Thickest chamber wall?", options: ["Right Atrium", "Right Ventricle", "Left Atrium", "Left Ventricle"], correctAnswer: "Left Ventricle", explanation: "It needs high pressure to pump blood to systemic circulation." },
      { question: "Normal heartbeat trigger?", options: ["Brain signal", "SA Node (Pacemaker)", "Nerve impulse", "Muscle stretch"], correctAnswer: "SA Node (Pacemaker)", explanation: "The sinoatrial node generates rhythmic electrical impulses." }
    ],
    sceneKey: "heart-circulation",
    thumbnail: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=400",
    duration: 25,
    objectives: ["Cardiac cycle", "Path of blood", "Valve significance"],
    materials: ["Heart 3D model"],
    isPublished: true
  },
  {
    title: "Nephron — urine formation",
    subject: "biology",
    class: 12,
    chapter: "Human Physiology",
    chapterNumber: 19,
    description: "Zoom into the functional unit of the kidney to see filtration and reabsorption.",
    difficulty: "hard",
    tags: ["human anatomy", "excretion", "kidney"],
    steps: [
      { stepNumber: 1, title: "Glomerular Filtration", description: "Watch blood being filtered under high pressure." },
      { stepNumber: 2, title: "Proximal Tubule", description: "Reabsorption of glucose, salts, and water." },
      { stepNumber: 3, title: "Loop of Henle", description: "Creating a salt concentration gradient in the kidney." },
      { stepNumber: 4, title: "Distal Tubule", description: "Selective secretion of ions and pH balancing." },
      { stepNumber: 5, title: "Collecting Duct", description: "Final concentration of urine under ADH control." }
    ],
    quiz: [
      { question: "Unit of the kidney?", options: ["Neuron", "Nephron", "Alveoli", "Villi"], correctAnswer: "Nephron", explanation: "Each kidney has about a million nephrons." },
      { question: "Cup-shaped part of nephron?", options: ["Glomerulus", "Bowman’s Capsule", "Loop of Henle", "Ureter"], correctAnswer: "Bowman’s Capsule", explanation: "It surrounds the glomerulus and catches the filtrate." },
      { question: "Primary waste removed?", options: ["Oxygen", "Glucose", "Urea", "Blood cells"], correctAnswer: "Urea", explanation: "Kidneys filter out nitrogenous wastes like urea from the blood." }
    ],
    sceneKey: "nephron",
    thumbnail: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=400",
    duration: 30,
    objectives: ["Filtration vs Excretion", "Counter-current mechanism", "Hormonal control"],
    materials: ["Kidney anatomy software"],
    isPublished: true
  },
  {
    title: "Synapse — neurotransmitter release",
    subject: "biology",
    class: 12,
    chapter: "Human Physiology",
    chapterNumber: 21,
    description: "A microscopic view of how signals jump from one neuron to another.",
    difficulty: "hard",
    tags: ["neuroscience", "synapse", "cell communication"],
    steps: [
      { stepNumber: 1, title: "Signal Arrival", description: "Action potential reaches the axon terminal." },
      { stepNumber: 2, title: "Calcium Entry", description: "Observe calcium channels opening and triggering vesicles." },
      { stepNumber: 3, title: "Exocytosis", description: "Vesicles fusing with membrane to release neurotransmitters." },
      { stepNumber: 4, title: "Receptor Binding", description: "Chemicals attaching to the next neuron and opening its channels." },
      { stepNumber: 5, title: "Cleanup", description: "Reuptake or enzymatic breakdown of the messengers." }
    ],
    quiz: [
      { question: "Charge-carrying ions for trigger?", options: ["Na+", "K+", "Ca2+", "Cl-"], correctAnswer: "Ca2+", explanation: "Calcium ions are essential for vesicle release." },
      { question: "Chemical messenger example?", options: ["Insulin", "Adrenaline", "Acetylcholine", "Thyroxine"], correctAnswer: "Acetylcholine", explanation: "A common neurotransmitter at neuromuscular junctions." },
      { question: "Signal type in synapse?", options: ["Electrical", "Chemical", "Mechanical", "Magnetic"], correctAnswer: "Chemical", explanation: "Information crosses the gap via chemical molecules." }
    ],
    sceneKey: "synapse",
    thumbnail: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=400",
    duration: 20,
    objectives: ["Chemical signaling", "Vesicle dynamics", "Drug impact on brain"],
    materials: ["Synapse animation"],
    isPublished: true
  },
  {
    title: "Meiosis — cell division",
    subject: "biology",
    class: 12,
    chapter: "Cell Cycle and Cell Division",
    chapterNumber: 10,
    description: "The reduction division that creates sperm and egg cells for sexual reproduction.",
    difficulty: "hard",
    tags: ["genetics", "reproduction", "meiosis"],
    steps: [
      { stepNumber: 1, title: "Prophase I - Crossing Over", description: "Chromosomes exchange genetic material (Shuffling)." },
      { stepNumber: 2, title: "Meiosis I", description: "Homologous pairs separate into two cells." },
      { stepNumber: 3, title: "Meiosis II", description: "Sister chromatids separate (similar to mitosis)." },
      { stepNumber: 4, title: "Resulting Cells", description: "Note that 4 haploid (n) cells are formed." },
      { stepNumber: 5, title: "Genetic Variation", description: "Contrast with parent cell to see unique combinations." }
    ],
    quiz: [
      { question: "Chromosomes in meiosis daughter cells?", options: ["Double", "Same", "Half", "Zero"], correctAnswer: "Half", explanation: "It reduces 2n to n so that fertilization restores 2n." },
      { question: "Crossing over occurs in:", options: ["Mitosis", "Meiosis I", "Meiosis II", "Interphase"], correctAnswer: "Meiosis I", explanation: "Specifically during Prophase I." },
      { question: "Significance of meiosis?", options: ["Growth", "Genetic diversity", "Cloning", "Wound healing"], correctAnswer: "Genetic diversity", explanation: "Shuffling and independent assortment create unique offspring." }
    ],
    sceneKey: "meiosis",
    thumbnail: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=400",
    duration: 35,
    objectives: ["Reduction division", "Understand Crossing over", "Sexual vs Asexual reproduction"],
    materials: ["Microscope slides"],
    isPublished: true
  },
  {
    title: "Mendelian inheritance — monohybrid cross",
    subject: "biology",
    class: 12,
    chapter: "Principles of Inheritance and Variation",
    chapterNumber: 5,
    description: "Simulate Mendel's pea plant experiment for a single trait like height.",
    difficulty: "medium",
    tags: ["genetics", "Mendel", "inheritance"],
    steps: [
      { stepNumber: 1, title: "P Generation", description: "Cross Pure Tall (TT) with Pure Dwarf (tt)." },
      { stepNumber: 2, title: "F1 Generation", description: "Observe that all offspring are Tall (Tt; Dominance)." },
      { stepNumber: 3, title: "Selfing F1", description: "Cross F1 plants with themselves (Tt x Tt)." },
      { stepNumber: 4, title: "Punnett Square", description: "Visualize the meeting of gametes." },
      { stepNumber: 5, title: "F2 Ratios", description: "Observe 3:1 physical ratio and 1:2:1 genetic ratio." }
    ],
    quiz: [
      { question: "F2 Phenotypic ratio?", options: ["1:1", "3:1", "9:3:3:1", "ALL SAME"], correctAnswer: "3:1", explanation: "3 Tall and 1 Dwarf plant are typically produced." },
      { question: "Term for both alleles being same (TT)?", options: ["Heterozygous", "Homozygous", "Dominant", "Recessive"], correctAnswer: "Homozygous", explanation: "Homo- means same." },
      { question: "Which law is proven in F1?", options: ["Law of Dominance", "Law of Segregation", "Independent Assortment", "Evolution"], correctAnswer: "Law of Dominance", explanation: "The dominant trait hides the recessive one in F1." }
    ],
    sceneKey: "mendelian-mono",
    thumbnail: "https://images.unsplash.com/photo-1501004318641-739e828d1c9e?auto=format&fit=crop&q=80&w=400",
    duration: 20,
    objectives: ["Mendel's Laws", "Predict inheritance", "Genotype vs Phenotype"],
    materials: ["Punnett square simulator"],
    isPublished: true
  },
  {
    title: "Dihybrid cross",
    subject: "biology",
    class: 12,
    chapter: "Principles of Inheritance and Variation",
    chapterNumber: 5,
    description: "Analyze how two different traits (like seed color and shape) are inherited independently.",
    difficulty: "hard",
    tags: ["genetics", "Mendel", "inheritance"],
    steps: [
      { stepNumber: 1, title: "P Generation", description: "Round-Yellow (RRYY) x Wrinkled-Green (rryy)." },
      { stepNumber: 2, title: "F1 Results", description: "All are Round-Yellow (RrYy)." },
      { stepNumber: 3, title: "16-Cell Punnett", description: "Map out all combinations for F2." },
      { stepNumber: 4, title: "Identify New Combos", description: "Find Round-Green and Wrinkled-Yellow types." },
      { stepNumber: 5, title: "Verify Ratios", description: "Observe the 9:3:3:1 classic phenotypic ratio." }
    ],
    quiz: [
      { question: "F2 phenotypic ratio?", options: ["3:1", "9:3:3:1", "1:2:1", "1:1:1:1"], correctAnswer: "9:3:3:1", explanation: "Standard ratio for two independent traits." },
      { question: "Proves which law?", options: ["Dominance", "Segregation", "Independent Assortment", "Unit factors"], correctAnswer: "Independent Assortment", explanation: "Traits are not linked unless they are on the same chromosome." },
      { question: "Number of genotypes in F2?", options: ["3", "4", "9", "16"], correctAnswer: "9", explanation: "While there are 16 cells, many share the same genotype." }
    ],
    sceneKey: "mendelian-di",
    thumbnail: "https://images.unsplash.com/photo-1501004318641-739e828d1c9e?auto=format&fit=crop&q=80&w=400",
    duration: 30,
    objectives: ["Law of Independent Assortment", "Complex Punnett squares", "Probability in genetics"],
    materials: ["Large pea garden simulator"],
    isPublished: true
  },
  {
    title: "Ecosystem energy flow — food chain",
    subject: "biology",
    class: 12,
    chapter: "Ecosystem",
    chapterNumber: 14,
    description: "Follow the energy of the sun through producers and consumers.",
    difficulty: "easy",
    tags: ["ecology", "environment", "food chain"],
    steps: [
      { stepNumber: 1, title: "Producers", description: "Observe plants converting light into biomass." },
      { stepNumber: 2, title: "Primary Consumers", description: "Herbivores eating plants (Rabbit)." },
      { stepNumber: 3, title: "Secondary Consumers", description: "Carnivores eating herbivores (Snake)." },
      { stepNumber: 4, title: "Decomposers", description: "Fungi and bacteria breaking down waste." },
      { stepNumber: 5, title: "10% Rule", description: "Observe how 90% of energy is lost at each level." }
    ],
    quiz: [
      { question: "Ultimate source of energy?", options: ["Plants", "Soil", "Sun", "Water"], correctAnswer: "Sun", explanation: "Almost all ecosystems rely on solar energy." },
      { question: "Energy lost at each level approx?", options: ["10%", "50%", "90%", "0%"], correctAnswer: "90%", explanation: "Only about 10% is passed on to the next level (Lindeman's law)." },
      { question: "Base of any food pyramid?", options: ["Carnivores", "Producers", "Herbivores", "Lions"], correctAnswer: "Producers", explanation: "They fix energy for the entire community." }
    ],
    sceneKey: "ecosystem-energy",
    thumbnail: "https://images.unsplash.com/photo-1501004318641-739e828d1c9e?auto=format&fit=crop&q=80&w=400",
    duration: 15,
    objectives: ["Trophic levels", "Energy loss", "Ecosystem balance"],
    materials: ["Virtual ecosystem"],
    isPublished: true
  }
];

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');
    
    await Experiment.deleteMany();
    console.log('Cleared existing experiments.');
    
    await Experiment.insertMany(experiments);
    console.log(`Added ${experiments.length} experiments across Physics, Chemistry, and Biology.`);
    
    // Note: To be continued with other batches...
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedDB();
