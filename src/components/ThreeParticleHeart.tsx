import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ThreeParticleHeartProps {
  isBursting?: boolean;
  className?: string;
  onHeartFormed?: () => void;
  interactive?: boolean;
}

export const ThreeParticleHeart: React.FC<ThreeParticleHeartProps> = ({
  isBursting = false,
  className = '',
  onHeartFormed,
  interactive = true,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const isBurstingRef = useRef(isBursting);
  const [formationProgress, setFormationProgress] = useState(0);

  useEffect(() => {
    isBurstingRef.current = isBursting;
  }, [isBursting]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // --- 1. Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.0018);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, 0, 72);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Transparent so parent pure black shows
    container.appendChild(renderer.domElement);

    // --- 2. Generate High-Res Soft Glowing Particle Sprite Texture ---
    const createParticleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d')!;

      const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.18, 'rgba(0, 240, 255, 0.95)');
      grad.addColorStop(0.42, 'rgba(56, 189, 248, 0.75)');
      grad.addColorStop(0.72, 'rgba(37, 99, 235, 0.25)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    const particleTexture = createParticleTexture();

    // Generate Glowing Base Pool Texture
    const createPoolGlowTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d')!;

      const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      grad.addColorStop(0.2, 'rgba(0, 240, 255, 0.8)');
      grad.addColorStop(0.5, 'rgba(37, 99, 235, 0.4)');
      grad.addColorStop(0.8, 'rgba(29, 78, 216, 0.15)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    const poolGlowTexture = createPoolGlowTexture();

    // --- 3. Build Volumetric 3D Heart Geometry ---
    // Mathematically accurate symmetrical heart with volumetric thickness (Z-dimension)
    const HEART_PARTICLE_COUNT = 3800;
    const heartPositions = new Float32Array(HEART_PARTICLE_COUNT * 3);
    const targetPositions = new Float32Array(HEART_PARTICLE_COUNT * 3);
    const initialPositions = new Float32Array(HEART_PARTICLE_COUNT * 3);
    const heartColors = new Float32Array(HEART_PARTICLE_COUNT * 3);
    const heartSizes = new Float32Array(HEART_PARTICLE_COUNT);
    const heartPhases = new Float32Array(HEART_PARTICLE_COUNT);
    const heartVelocities = new Float32Array(HEART_PARTICLE_COUNT * 3);

    // Color Palette matching the exact reference video
    const PALETTE = [
      new THREE.Color('#00f0ff'), // Electric cyan
      new THREE.Color('#38bdf8'), // Vibrant sky blue
      new THREE.Color('#60a5fa'), // Bright blue
      new THREE.Color('#93c5fd'), // Light ice blue
      new THREE.Color('#2563eb'), // Royal blue
      new THREE.Color('#ffffff'), // White starlight highlight
      new THREE.Color('#1d4ed8'), // Deep blue
    ];

    for (let i = 0; i < HEART_PARTICLE_COUNT; i++) {
      const idx = i * 3;

      // Parametric angle t in [-PI, PI]
      const t = Math.PI * 2 * Math.random() - Math.PI;

      // Standard heart equation
      // x = 16 sin^3(t)
      // y = 13 cos(t) - 5 cos(2t) - 2 cos(3t) - cos(4t)
      const baseHeartX = 16 * Math.pow(Math.sin(t), 3);
      const baseHeartY =
        13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t);

      // Volume shell layering:
      // Distribute points both along the crisp perimeter and into the volumetric core
      const isPerimeter = Math.random() < 0.65;
      const radiusScale = isPerimeter
        ? 0.96 + Math.random() * 0.08 // Dense bright outer silhouette
        : Math.pow(Math.random(), 0.7) * 0.95; // Volumetric inner filling

      // 3D thickness (Z depth):
      // The upper lobes are thickest (fuller 3D curves), tapering smoothly down to the sharp bottom tip
      const normalizedY = (baseHeartY + 17) / 32; // ~ [0 to 1]
      const maxZThickness = Math.max(0.2, Math.sin(normalizedY * Math.PI)) * 7.5;
      const zOffset = (Math.random() - 0.5) * 2 * maxZThickness * radiusScale;

      // Natural stardust jitter
      const jitter = (Math.random() - 0.5) * 0.5;

      const finalX = baseHeartX * radiusScale * 1.15 + jitter;
      const finalY = (baseHeartY * radiusScale * 1.15 + 4) + jitter; // Center higher so base pool fits underneath
      const finalZ = zOffset;

      targetPositions[idx] = finalX;
      targetPositions[idx + 1] = finalY;
      targetPositions[idx + 2] = finalZ;

      // Start scattered far outward for the organic assembly animation
      const scatterDist = 45 + Math.random() * 80;
      const scatterAngle = Math.random() * Math.PI * 2;
      const scatterElev = (Math.random() - 0.5) * Math.PI;
      initialPositions[idx] = Math.cos(scatterAngle) * Math.cos(scatterElev) * scatterDist;
      initialPositions[idx + 1] = Math.sin(scatterElev) * scatterDist;
      initialPositions[idx + 2] = Math.sin(scatterAngle) * Math.cos(scatterElev) * scatterDist;

      heartPositions[idx] = initialPositions[idx];
      heartPositions[idx + 1] = initialPositions[idx + 1];
      heartPositions[idx + 2] = initialPositions[idx + 2];

      heartVelocities[idx] = 0;
      heartVelocities[idx + 1] = 0;
      heartVelocities[idx + 2] = 0;

      // Colors:
      // Perimeter and center front have brighter cyan/white highlights
      let chosenColor: THREE.Color;
      if (Math.random() < 0.22) {
        chosenColor = PALETTE[0]; // #00f0ff
      } else if (Math.random() < 0.45) {
        chosenColor = PALETTE[1]; // #38bdf8
      } else if (Math.random() < 0.65) {
        chosenColor = PALETTE[2]; // #60a5fa
      } else if (Math.random() < 0.8) {
        chosenColor = PALETTE[3]; // #93c5fd
      } else if (Math.random() < 0.92) {
        chosenColor = PALETTE[4]; // #2563eb
      } else {
        chosenColor = PALETTE[5]; // White starlight
      }

      heartColors[idx] = chosenColor.r;
      heartColors[idx + 1] = chosenColor.g;
      heartColors[idx + 2] = chosenColor.b;

      heartSizes[i] = Math.random() * 1.8 + 1.2;
      heartPhases[i] = Math.random() * Math.PI * 2;
    }

    const heartGeometry = new THREE.BufferGeometry();
    heartGeometry.setAttribute('position', new THREE.BufferAttribute(heartPositions, 3));
    heartGeometry.setAttribute('color', new THREE.BufferAttribute(heartColors, 3));

    const heartMaterial = new THREE.PointsMaterial({
      size: 1.8,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.1, // Starts faint and ramps up
    });

    const heartPoints = new THREE.Points(heartGeometry, heartMaterial);
    scene.add(heartPoints);

    // --- 4. The Glowing Cyan Swirling Energy Platform (Directly beneath the heart) ---
    // Horizontal swirling pool of particles as seen in reference video
    const POOL_PARTICLE_COUNT = 1400;
    const poolPositions = new Float32Array(POOL_PARTICLE_COUNT * 3);
    const poolColors = new Float32Array(POOL_PARTICLE_COUNT * 3);
    const poolSpeeds = new Float32Array(POOL_PARTICLE_COUNT);
    const poolRadii = new Float32Array(POOL_PARTICLE_COUNT);
    const poolAngles = new Float32Array(POOL_PARTICLE_COUNT);

    const POOL_Y = -18.5; // Exactly below the pointed tip of the heart

    for (let i = 0; i < POOL_PARTICLE_COUNT; i++) {
      const idx = i * 3;
      // Elliptical distribution
      const r = Math.pow(Math.random(), 0.6) * 16.5; // Radius up to 16.5 units
      const angle = Math.random() * Math.PI * 2;

      poolRadii[i] = r;
      poolAngles[i] = angle;
      // Inner particles swirl faster (vortex physics)
      poolSpeeds[i] = (0.015 + (16.5 - r) * 0.0025) * (Math.random() < 0.05 ? -1 : 1);

      // Horizontal elliptical plane: X is wider, Z is narrower
      poolPositions[idx] = Math.cos(angle) * r * 1.5;
      poolPositions[idx + 1] = POOL_Y + (Math.random() - 0.5) * 0.9;
      poolPositions[idx + 2] = Math.sin(angle) * r * 0.55;

      // Color gradation: pure white-cyan in center, fading to deep sapphire blue at outer rim
      const normR = r / 16.5;
      let pColor: THREE.Color;
      if (normR < 0.25) {
        pColor = new THREE.Color('#ffffff');
      } else if (normR < 0.55) {
        pColor = new THREE.Color('#00f0ff');
      } else if (normR < 0.8) {
        pColor = new THREE.Color('#38bdf8');
      } else {
        pColor = new THREE.Color('#1d4ed8');
      }

      poolColors[idx] = pColor.r;
      poolColors[idx + 1] = pColor.g;
      poolColors[idx + 2] = pColor.b;
    }

    const poolGeometry = new THREE.BufferGeometry();
    poolGeometry.setAttribute('position', new THREE.BufferAttribute(poolPositions, 3));
    poolGeometry.setAttribute('color', new THREE.BufferAttribute(poolColors, 3));

    const poolMaterial = new THREE.PointsMaterial({
      size: 1.6,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.85,
    });

    const poolPoints = new THREE.Points(poolGeometry, poolMaterial);
    scene.add(poolPoints);

    // Glowing Plane beneath the pool for deep volumetric neon bloom
    const poolPlaneGeo = new THREE.PlaneGeometry(38, 16);
    const poolPlaneMat = new THREE.MeshBasicMaterial({
      map: poolGlowTexture,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const poolGlowPlane = new THREE.Mesh(poolPlaneGeo, poolPlaneMat);
    poolGlowPlane.position.set(0, POOL_Y, 0);
    poolGlowPlane.rotation.x = Math.PI / 2;
    scene.add(poolGlowPlane);

    // Secondary intense center bright ring
    const innerRingGeo = new THREE.RingGeometry(0.1, 7, 64);
    const innerRingMat = new THREE.MeshBasicMaterial({
      map: poolGlowTexture,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRing.position.set(0, POOL_Y + 0.1, 0);
    innerRing.rotation.x = Math.PI / 2;
    scene.add(innerRing);

    // --- 5. Electric Tendrils / Lightning Filaments shooting from Pool to Heart ---
    const TENDRIL_COUNT = 60;
    const tendrilPositions = new Float32Array(TENDRIL_COUNT * 3);
    const tendrilColors = new Float32Array(TENDRIL_COUNT * 3);
    const tendrilData: {
      startX: number;
      startY: number;
      startZ: number;
      targetX: number;
      targetY: number;
      targetZ: number;
      ctrlX: number;
      ctrlY: number;
      ctrlZ: number;
      t: number;
      speed: number;
    }[] = [];

    for (let i = 0; i < TENDRIL_COUNT; i++) {
      const idx = i * 3;
      tendrilPositions[idx] = 0;
      tendrilPositions[idx + 1] = POOL_Y;
      tendrilPositions[idx + 2] = 0;

      tendrilColors[idx] = 0.5;
      tendrilColors[idx + 1] = 0.95;
      tendrilColors[idx + 2] = 1.0;

      const randomTargetIdx = Math.floor(Math.random() * HEART_PARTICLE_COUNT) * 3;
      tendrilData.push({
        startX: (Math.random() - 0.5) * 14,
        startY: POOL_Y,
        startZ: (Math.random() - 0.5) * 6,
        targetX: targetPositions[randomTargetIdx],
        targetY: targetPositions[randomTargetIdx + 1],
        targetZ: targetPositions[randomTargetIdx + 2],
        ctrlX: (Math.random() - 0.5) * 18,
        ctrlY: (POOL_Y + targetPositions[randomTargetIdx + 1]) / 2 + (Math.random() - 0.5) * 5,
        ctrlZ: (Math.random() - 0.5) * 10,
        t: Math.random(),
        speed: 0.02 + Math.random() * 0.03,
      });
    }

    const tendrilGeometry = new THREE.BufferGeometry();
    tendrilGeometry.setAttribute('position', new THREE.BufferAttribute(tendrilPositions, 3));
    tendrilGeometry.setAttribute('color', new THREE.BufferAttribute(tendrilColors, 3));

    const tendrilMaterial = new THREE.PointsMaterial({
      size: 2.2,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.9,
    });

    const tendrilPoints = new THREE.Points(tendrilGeometry, tendrilMaterial);
    scene.add(tendrilPoints);

    // --- 6. Ambient Drifting Stardust & Sparkling Escaping Particles ---
    const DUST_COUNT = 300;
    const dustPositions = new Float32Array(DUST_COUNT * 3);
    const dustColors = new Float32Array(DUST_COUNT * 3);
    const dustVelocities = new Float32Array(DUST_COUNT * 3);

    for (let i = 0; i < DUST_COUNT; i++) {
      const idx = i * 3;
      dustPositions[idx] = (Math.random() - 0.5) * 60;
      dustPositions[idx + 1] = (Math.random() - 0.5) * 50;
      dustPositions[idx + 2] = (Math.random() - 0.5) * 35;

      dustVelocities[idx] = (Math.random() - 0.5) * 0.04;
      dustVelocities[idx + 1] = Math.random() * 0.05 + 0.01; // Gently float upward
      dustVelocities[idx + 2] = (Math.random() - 0.5) * 0.04;

      const c = Math.random() > 0.4 ? new THREE.Color('#00f0ff') : new THREE.Color('#38bdf8');
      dustColors[idx] = c.r;
      dustColors[idx + 1] = c.g;
      dustColors[idx + 2] = c.b;
    }

    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    dustGeometry.setAttribute('color', new THREE.BufferAttribute(dustColors, 3));

    const dustMaterial = new THREE.PointsMaterial({
      size: 1.4,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.6,
    });

    const dustPoints = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dustPoints);

    // --- 7. Mouse & Touch Holographic Interaction ---
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!interactive) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      mouse.targetX = (clientX / window.innerWidth - 0.5) * 2;
      mouse.targetY = -(clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    // --- 8. Animation Loop ---
    let startTime = performance.now();
    let animId: number;
    let burstProgress = 0;
    let formation = 0;
    let hasNotifiedFormed = false;

    const animate = (now: number) => {
      animId = requestAnimationFrame(animate);

      const elapsed = (now - startTime) * 0.001;

      // Formation interpolation (0 to 1 over ~2.8s)
      if (formation < 1) {
        formation = Math.min(1, formation + 0.012);
        setFormationProgress(formation);
        heartMaterial.opacity = 0.1 + formation * 0.85;

        if (formation >= 0.98 && !hasNotifiedFormed) {
          hasNotifiedFormed = true;
          if (onHeartFormed) onHeartFormed();
        }
      }

      // Smooth mouse follow (gentle 3D yaw/pitch)
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Base rotation and subtle breathing
      const idleYaw = Math.sin(elapsed * 0.6) * 0.12 + mouse.x * 0.35;
      const idlePitch = Math.cos(elapsed * 0.5) * 0.06 + mouse.y * 0.2;

      heartPoints.rotation.y = idleYaw;
      heartPoints.rotation.x = idlePitch;

      // --- Heartbeat pulse calculation ---
      // Authentic lub-dub double beat rhythm
      const beatCycle = (elapsed * 1.25) % 1.0;
      let pulseScale = 1.0;
      if (beatCycle < 0.12) {
        // First thump (systolic)
        pulseScale = 1.0 + Math.sin((beatCycle / 0.12) * Math.PI) * 0.07;
      } else if (beatCycle >= 0.18 && beatCycle < 0.32) {
        // Second thump (diastolic)
        const sub = (beatCycle - 0.18) / 0.14;
        pulseScale = 1.0 + Math.sin(sub * Math.PI) * 0.045;
      }

      // Light wave passing through the heart ($y$ wave)
      const wavePhase = elapsed * 3.2;

      // Update Heart Particles
      const posAttr = heartGeometry.attributes.position as THREE.BufferAttribute;
      const colAttr = heartGeometry.attributes.color as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;
      const colArr = colAttr.array as Float32Array;

      // Handle Surprise Burst
      if (isBurstingRef.current) {
        burstProgress = Math.min(1.5, burstProgress + 0.025);
      } else {
        burstProgress = Math.max(0, burstProgress - 0.02);
      }

      for (let i = 0; i < HEART_PARTICLE_COUNT; i++) {
        const idx = i * 3;
        const tx = targetPositions[idx];
        const ty = targetPositions[idx + 1];
        const tz = targetPositions[idx + 2];

        // Formation lerp
        const currentFormX = initialPositions[idx] + (tx - initialPositions[idx]) * Math.min(1, formation * 1.08);
        const currentFormY = initialPositions[idx + 1] + (ty - initialPositions[idx + 1]) * Math.min(1, formation * 1.08);
        const currentFormZ = initialPositions[idx + 2] + (tz - initialPositions[idx + 2]) * Math.min(1, formation * 1.08);

        // Apply heartbeat scale
        let px = currentFormX * pulseScale;
        let py = currentFormY * pulseScale;
        let pz = currentFormZ * pulseScale;

        // Apply burst explosion and re-gather if bursting
        if (burstProgress > 0) {
          const burstDist = Math.sin(burstProgress * Math.PI) * 22;
          const dirLen = Math.sqrt(tx * tx + ty * ty + tz * tz) || 1;
          px += (tx / dirLen) * burstDist;
          py += (ty / dirLen) * burstDist;
          pz += (tz / dirLen) * burstDist;
        }

        // Slight organic oscillation
        const phase = heartPhases[i];
        px += Math.sin(elapsed * 2 + phase) * 0.12;
        py += Math.cos(elapsed * 2.2 + phase) * 0.12;

        posArr[idx] = px;
        posArr[idx + 1] = py;
        posArr[idx + 2] = pz;

        // Cyan light wave brightening
        const wave = Math.sin((ty * 0.22 - wavePhase));
        const waveBrightness = wave > 0.75 ? (wave - 0.75) * 4.0 : 0;

        const baseR = heartColors[idx];
        const baseG = heartColors[idx + 1];
        const baseB = heartColors[idx + 2];

        // Highlight wave crests in bright electric cyan / starlight
        colArr[idx] = Math.min(1.0, baseR + waveBrightness * 0.6);
        colArr[idx + 1] = Math.min(1.0, baseG + waveBrightness * 0.8);
        colArr[idx + 2] = Math.min(1.0, baseB + waveBrightness * 0.9);
      }
      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;

      // Update Swirling Pool Particles
      const poolPosAttr = poolGeometry.attributes.position as THREE.BufferAttribute;
      const poolPosArr = poolPosAttr.array as Float32Array;

      for (let i = 0; i < POOL_PARTICLE_COUNT; i++) {
        const idx = i * 3;
        poolAngles[i] += poolSpeeds[i];
        const r = poolRadii[i];
        const ang = poolAngles[i];

        poolPosArr[idx] = Math.cos(ang) * r * 1.5;
        poolPosArr[idx + 2] = Math.sin(ang) * r * 0.55;
      }
      poolPosAttr.needsUpdate = true;

      // Pulse the glowing base plane
      poolPlaneMat.opacity = 0.5 + Math.sin(elapsed * 2.5) * 0.18;
      innerRingMat.opacity = 0.75 + Math.sin(elapsed * 3.0) * 0.2;

      // Update Electric Tendrils
      const tendPosAttr = tendrilGeometry.attributes.position as THREE.BufferAttribute;
      const tendPosArr = tendPosAttr.array as Float32Array;

      for (let i = 0; i < TENDRIL_COUNT; i++) {
        const idx = i * 3;
        const d = tendrilData[i];
        d.t += d.speed;

        if (d.t >= 1) {
          d.t = 0;
          d.startX = (Math.random() - 0.5) * 14;
          d.startY = POOL_Y;
          d.startZ = (Math.random() - 0.5) * 6;
          const rTarget = Math.floor(Math.random() * HEART_PARTICLE_COUNT) * 3;
          d.targetX = targetPositions[rTarget];
          d.targetY = targetPositions[rTarget + 1];
          d.targetZ = targetPositions[rTarget + 2];
          d.ctrlX = (d.startX + d.targetX) / 2 + (Math.random() - 0.5) * 14;
          d.ctrlY = (d.startY + d.targetY) / 2 + (Math.random() - 0.5) * 6;
          d.ctrlZ = (d.startZ + d.targetZ) / 2 + (Math.random() - 0.5) * 10;
        }

        // Quadratic bezier arc: B(t) = (1-t)^2 P0 + 2(1-t)t P1 + t^2 P2
        const t = d.t;
        const invT = 1 - t;
        tendPosArr[idx] = invT * invT * d.startX + 2 * invT * t * d.ctrlX + t * t * d.targetX;
        tendPosArr[idx + 1] = invT * invT * d.startY + 2 * invT * t * d.ctrlY + t * t * d.targetY;
        tendPosArr[idx + 2] = invT * invT * d.startZ + 2 * invT * t * d.ctrlZ + t * t * d.targetZ;
      }
      tendPosAttr.needsUpdate = true;

      // Update Ambient Dust
      const dustPosAttr = dustGeometry.attributes.position as THREE.BufferAttribute;
      const dustPosArr = dustPosAttr.array as Float32Array;

      for (let i = 0; i < DUST_COUNT; i++) {
        const idx = i * 3;
        dustPosArr[idx] += dustVelocities[idx];
        dustPosArr[idx + 1] += dustVelocities[idx + 1];
        dustPosArr[idx + 2] += dustVelocities[idx + 2];

        // Wrap around floating volume
        if (dustPosArr[idx + 1] > 35) {
          dustPosArr[idx + 1] = -25;
          dustPosArr[idx] = (Math.random() - 0.5) * 50;
          dustPosArr[idx + 2] = (Math.random() - 0.5) * 30;
        }
      }
      dustPosAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    // --- 9. Resize Handling ---
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      heartGeometry.dispose();
      heartMaterial.dispose();
      poolGeometry.dispose();
      poolMaterial.dispose();
      poolPlaneGeo.dispose();
      poolPlaneMat.dispose();
      innerRingGeo.dispose();
      innerRingMat.dispose();
      tendrilGeometry.dispose();
      tendrilMaterial.dispose();
      dustGeometry.dispose();
      dustMaterial.dispose();
      particleTexture.dispose();
      poolGlowTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{ touchAction: 'none' }}
    />
  );
};
