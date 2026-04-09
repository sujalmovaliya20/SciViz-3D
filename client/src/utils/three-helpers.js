import * as THREE from 'three';

/**
 * Creates a standard physical material with SciViz theme
 */
export const createSciMaterial = (color = 0x00e5ff, emissive = 0x000000) => {
  return new THREE.MeshPhysicalMaterial({
    color: color,
    metalness: 0.9,
    roughness: 0.1,
    emissive: emissive,
    emissiveIntensity: 0.5,
    transparent: true,
    opacity: 0.9
  });
};

/**
 * Format quiz score
 */
export const formatScore = (score) => {
  return `${(score * 100).toFixed(0)}%`;
};
