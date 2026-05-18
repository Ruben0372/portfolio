'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollStore } from '@/lib/scroll-store';
import { smoothstep } from '@/lib/three-utils';

const PARTICLE_COUNT = 200;

const vertexShader = `
  uniform float uTime;
  uniform float uIntensity;
  attribute float aRandom;
  attribute float aSpeed;
  varying float vAlpha;

  void main() {
    float t = uTime * aSpeed;
    float radius = 1.5 + sin(t + aRandom * 6.28) * 0.5 * uIntensity;
    float theta = position.x;
    float phi = position.y;
    vec3 pos = vec3(
      radius * sin(theta) * cos(phi),
      radius * sin(theta) * sin(phi),
      radius * cos(theta)
    );
    pos += vec3(
      sin(t * 1.3 + aRandom * 3.14) * 0.3,
      cos(t * 0.7 + aRandom * 5.0) * 0.3,
      sin(t * 1.1 + aRandom * 2.0) * 0.3
    ) * uIntensity;

    vAlpha = (0.1 + 0.4 * uIntensity) * (0.5 + 0.5 * sin(t + aRandom * 6.28));
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    float dist = max(-mvPosition.z, 1.0);
    gl_PointSize = (2.0 + 2.0 * uIntensity) * (150.0 / dist);
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
  const meshRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const randoms = new Float32Array(PARTICLE_COUNT);
    const speeds = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3]     = Math.random() * Math.PI * 2;
      positions[i * 3 + 1] = Math.random() * Math.PI * 2;
      positions[i * 3 + 2] = 0;
      randoms[i] = Math.random();
      speeds[i] = 0.3 + Math.random() * 0.7;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));
    geo.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    const scroll = useScrollStore.getState().scroll;

    let intensity = 0.3;
    if (scroll < 0.15) {
      intensity = 1.0 - smoothstep(0.05, 0.15, scroll) * 0.7;
    } else if (scroll > 0.90) {
      intensity = 0.3 + smoothstep(0.90, 1.0, scroll) * 0.7;
    } else if (scroll >= 0.30 && scroll < 0.65) {
      intensity = 0.5;
    }

    materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    materialRef.current.uniforms.uIntensity.value = intensity;
  });

  return (
    <points ref={meshRef} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uIntensity: { value: 1.0 },
        }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
