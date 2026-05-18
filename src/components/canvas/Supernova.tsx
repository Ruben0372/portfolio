'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore, roomKeyframes } from '@/lib/scroll-store';

const PARTICLE_COUNT = 150;

const vertexShader = `
  uniform float uTime;
  uniform float uIntensity;
  attribute float aBand;
  attribute float aPhase;
  attribute float aSpeed;
  varying float vAlpha;

  void main() {
    float t = uTime * 0.15 * aSpeed;

    // Breathing radius pulse (~4s cycle)
    float breath = 1.0 + sin(uTime * 0.4) * 0.15 * uIntensity;

    // Orbital bands — particles stay in coherent streams
    float bandAngle = aBand * 6.2832 + t * 0.3;
    float elevation = aPhase * 3.1416 - 1.5708;
    float radius = (1.2 + sin(aPhase * 3.0 + t * 0.2) * 0.4) * breath;

    vec3 pos = vec3(
      radius * cos(bandAngle) * cos(elevation),
      radius * sin(elevation) + sin(t * 0.1 + aPhase * 2.0) * 0.1,
      radius * sin(bandAngle) * cos(elevation)
    );

    vAlpha = (0.08 + 0.25 * uIntensity) * (0.6 + 0.4 * sin(t * 0.5 + aPhase * 6.28));

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    float dist = max(-mvPosition.z, 2.0);
    gl_PointSize = (1.5 + 1.0 * uIntensity) * (25.0 / dist);
  }
`;

const fragmentShader = `
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;
    float alpha = (1.0 - d * d) * vAlpha;
    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
  }
`;

export function Supernova() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const bands = new Float32Array(PARTICLE_COUNT);
    const phases = new Float32Array(PARTICLE_COUNT);
    const speeds = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
      bands[i] = Math.random();  // Which orbital band
      phases[i] = Math.random(); // Position within band
      speeds[i] = 0.6 + Math.random() * 0.8;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aBand', new THREE.BufferAttribute(bands, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    geo.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    const { roomIndex, insideCluster } = useStore.getState();

    let intensity = 0.3;
    if (roomIndex === 0 || roomIndex === 5) intensity = 0.8;
    if (roomIndex === 2) intensity = 0.4;
    if (insideCluster) intensity = 0.15;

    materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    materialRef.current.uniforms.uIntensity.value = intensity;
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{ uTime: { value: 0 }, uIntensity: { value: 0.8 } }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
