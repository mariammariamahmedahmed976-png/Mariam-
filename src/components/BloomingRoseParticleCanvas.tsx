import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Sparkles, Play, Pause, RotateCcw, Eye, Sliders, Volume2, VolumeX } from 'lucide-react';

interface BloomingRoseParticleCanvasProps {
  bloomValue?: number; // 0 to 1
  onBloomChange?: (val: number) => void;
  className?: string;
  autoPlayBloom?: boolean;
}

// Generate circular radial soft glow particle texture procedurally (no 404 external asset)
function createParticleTexture(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
  gradient.addColorStop(0.2, 'rgba(165, 243, 252, 0.9)'); // bright cyan core
  gradient.addColorStop(0.5, 'rgba(56, 189, 248, 0.5)');  // electric blue
  gradient.addColorStop(0.8, 'rgba(37, 99, 235, 0.15)'); // deep blue halo
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export const BloomingRoseParticleCanvas: React.FC<BloomingRoseParticleCanvasProps> = ({
  bloomValue: externalBloom,
  onBloomChange,
  className = '',
  autoPlayBloom = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [bloomProgress, setBloomProgress] = useState<number>(externalBloom ?? 0.85);
  const [isAutoBlooming, setIsAutoBlooming] = useState<boolean>(autoPlayBloom);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioError, setAudioError] = useState<boolean>(false);

  // Sync external prop if provided
  useEffect(() => {
    if (externalBloom !== undefined) {
      setBloomProgress(externalBloom);
    }
  }, [externalBloom]);

  const bloomRef = useRef<number>(bloomProgress);
  bloomRef.current = bloomProgress;

  const isAutoBloomingRef = useRef<boolean>(isAutoBlooming);
  isAutoBloomingRef.current = isAutoBlooming;

  // Audio control
  const toggleAudio = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio('/assets/aistudio/rose_surprise_soundtrack.mp3');
      audio.loop = true;
      audioRef.current = audio;
    }

    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlayingAudio(true);
        setAudioError(false);
      }).catch((err) => {
        console.warn('Audio play prevented or file issue:', err);
        setAudioError(true);
      });
    }
  }, [isPlayingAudio]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 550;

    // Software WebGL probe
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, 0.04);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 5.8);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 3.2;
    controls.maxDistance = 8.5;
    controls.maxPolarAngle = Math.PI / 2 + 0.15; // Don't flip below soil
    controls.target.set(0, 0.2, 0);

    const particleTexture = createParticleTexture();

    // ==========================================
    // 1. SOIL BED PARTICLES (Horizontal mound)
    // ==========================================
    const soilCount = isSoftwareGl ? 800 : 1600;
    const soilPositions = new Float32Array(soilCount * 3);
    const soilColors = new Float32Array(soilCount * 3);

    for (let i = 0; i < soilCount; i++) {
      const i3 = i * 3;
      // Mound curve: higher in middle, tapering at sides
      const x = (Math.random() - 0.5) * 5.6;
      const z = (Math.random() - 0.5) * 2.8;
      const distFromCenter = Math.sqrt(x * x + z * z);
      const moundHeight = Math.max(0, 1 - distFromCenter / 3.0) * 0.35;
      const y = -2.15 + moundHeight + (Math.random() - 0.5) * 0.18;

      soilPositions[i3] = x;
      soilPositions[i3 + 1] = y;
      soilPositions[i3 + 2] = z;

      // Color variation: deep blues, cyans, silver dust
      const rand = Math.random();
      if (rand < 0.45) {
        // Deep midnight blue / sapphire
        soilColors[i3] = 0.05 + Math.random() * 0.1;
        soilColors[i3 + 1] = 0.15 + Math.random() * 0.2;
        soilColors[i3 + 2] = 0.45 + Math.random() * 0.35;
      } else if (rand < 0.85) {
        // Cyan sparkling dust
        soilColors[i3] = 0.1 + Math.random() * 0.2;
        soilColors[i3 + 1] = 0.6 + Math.random() * 0.35;
        soilColors[i3 + 2] = 0.9 + Math.random() * 0.1;
      } else {
        // Sparkling white/silver stardust
        soilColors[i3] = 0.8 + Math.random() * 0.2;
        soilColors[i3 + 1] = 0.9 + Math.random() * 0.1;
        soilColors[i3 + 2] = 1.0;
      }
    }

    const soilGeo = new THREE.BufferGeometry();
    soilGeo.setAttribute('position', new THREE.BufferAttribute(soilPositions, 3));
    soilGeo.setAttribute('color', new THREE.BufferAttribute(soilColors, 3));

    const soilMat = new THREE.PointsMaterial({
      size: 0.055,
      map: particleTexture,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.85,
    });
    const soilPoints = new THREE.Points(soilGeo, soilMat);
    scene.add(soilPoints);

    // ==========================================
    // 2. STEM & LEAVES PARTICLES
    // ==========================================
    const stemCount = isSoftwareGl ? 600 : 1200;
    const stemPositions = new Float32Array(stemCount * 3);
    const stemOriginalPositions = new Float32Array(stemCount * 3);
    const stemColors = new Float32Array(stemCount * 3);

    for (let i = 0; i < stemCount; i++) {
      const i3 = i * 3;
      const t = i / stemCount; // 0 at soil, 1 at flower base
      const y = -2.0 + t * 2.45;
      // Organic S-curve for stem
      const curveX = Math.sin(t * Math.PI * 1.2) * 0.16 - Math.sin(t * Math.PI * 2.4) * 0.06;
      const curveZ = Math.cos(t * Math.PI) * 0.08;

      // Radial thickness (slightly thicker at base)
      const radius = 0.035 + (1 - t) * 0.02;
      const angle = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * radius;

      const px = curveX + Math.cos(angle) * r;
      const py = y;
      const pz = curveZ + Math.sin(angle) * r;

      stemPositions[i3] = px;
      stemPositions[i3 + 1] = py;
      stemPositions[i3 + 2] = pz;

      stemOriginalPositions[i3] = px;
      stemOriginalPositions[i3 + 1] = py;
      stemOriginalPositions[i3 + 2] = pz;

      // Stem color: bright neon cyan/emerald-blue gradient
      stemColors[i3] = 0.05 + t * 0.15;
      stemColors[i3 + 1] = 0.55 + t * 0.4;
      stemColors[i3 + 2] = 0.95 + t * 0.05;
    }

    const stemGeo = new THREE.BufferGeometry();
    stemGeo.setAttribute('position', new THREE.BufferAttribute(stemPositions, 3));
    stemGeo.setAttribute('color', new THREE.BufferAttribute(stemColors, 3));

    const stemMat = new THREE.PointsMaterial({
      size: 0.06,
      map: particleTexture,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.9,
    });
    const stemPoints = new THREE.Points(stemGeo, stemMat);
    scene.add(stemPoints);

    // Leaves: Left and Right
    const leafCount = isSoftwareGl ? 800 : 1600;
    const leafPositions = new Float32Array(leafCount * 3);
    const leafColors = new Float32Array(leafCount * 3);

    for (let i = 0; i < leafCount; i++) {
      const i3 = i * 3;
      const isLeft = i % 2 === 0;
      const u = Math.random(); // 0 (stem junction) to 1 (leaf tip)
      const v = (Math.random() - 0.5) * 2; // -1 to 1 leaf width

      // Leaf shape formula: tear drop arch
      const leafWidthFactor = Math.sin(u * Math.PI) * (1 - u * 0.3) * 0.32;
      const length = 0.85;

      const sign = isLeft ? -1 : 1;
      const attachY = isLeft ? -1.15 : -0.85;
      const attachX = isLeft ? -0.06 : 0.08;

      // Arc out and down
      const lx = sign * (u * length);
      const ly = attachY + Math.sin(u * 1.5) * 0.25 - u * 0.35 + v * leafWidthFactor * 0.15;
      const lz = v * leafWidthFactor;

      leafPositions[i3] = attachX + lx;
      leafPositions[i3 + 1] = ly;
      leafPositions[i3 + 2] = lz;

      // Vibrant cyan-electric blue leaf color with bright edges
      const isEdge = Math.abs(v) > 0.75;
      if (isEdge) {
        leafColors[i3] = 0.2;
        leafColors[i3 + 1] = 0.9;
        leafColors[i3 + 2] = 1.0;
      } else {
        leafColors[i3] = 0.05 + u * 0.15;
        leafColors[i3 + 1] = 0.45 + (1 - Math.abs(v)) * 0.35;
        leafColors[i3 + 2] = 0.85 + u * 0.15;
      }
    }

    const leafGeo = new THREE.BufferGeometry();
    leafGeo.setAttribute('position', new THREE.BufferAttribute(leafPositions, 3));
    leafGeo.setAttribute('color', new THREE.BufferAttribute(leafColors, 3));

    const leafMat = new THREE.PointsMaterial({
      size: 0.05,
      map: particleTexture,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.85,
    });
    const leafPoints = new THREE.Points(leafGeo, leafMat);
    scene.add(leafPoints);

    // ==========================================
    // 3. BLOOMING ROSE PETALS (Closed Bud -> Full Bloom)
    // ==========================================
    // We compute two states for each particle:
    // closedPosition (bud tightly furled) and openPosition (rose petals unfurled outwards)
    const petalCount = isSoftwareGl ? 3200 : 6400;
    const currentPetalPositions = new Float32Array(petalCount * 3);
    const closedPositions = new Float32Array(petalCount * 3);
    const openPositions = new Float32Array(petalCount * 3);
    const petalColors = new Float32Array(petalCount * 3);

    // 4 Layers of petals:
    // Layer 0: Core / bud center (4 tight inner spiral petals)
    // Layer 1: Inner middle (5 petals)
    // Layer 2: Outer middle (6 petals)
    // Layer 3: Outermost flared petals (7 broad curling petals)
    const layers = [
      { petalNum: 4, radius: 0.22, height: 0.65, tiltClosed: 0.05, tiltOpen: 0.25, colorType: 'violet' },
      { petalNum: 5, radius: 0.42, height: 0.75, tiltClosed: 0.12, tiltOpen: 0.55, colorType: 'sapphire' },
      { petalNum: 6, radius: 0.65, height: 0.85, tiltClosed: 0.20, tiltOpen: 0.90, colorType: 'cyan' },
      { petalNum: 7, radius: 0.88, height: 0.80, tiltClosed: 0.28, tiltOpen: 1.35, colorType: 'bright_cyan' },
    ];

    let particleIdx = 0;
    const particlesPerPetal = Math.floor(petalCount / (4 + 5 + 6 + 7));

    layers.forEach((layer, layerIdx) => {
      for (let p = 0; p < layer.petalNum; p++) {
        // Base angle for this petal around flower axis
        const baseAngle = (p / layer.petalNum) * Math.PI * 2 + layerIdx * 0.55;

        for (let k = 0; k < particlesPerPetal && particleIdx < petalCount; k++) {
          const i3 = particleIdx * 3;

          // Petal local UV coordinates:
          // u: height along petal (0 at receptacle, 1 at tip)
          // v: lateral sweep across petal (-1 to +1)
          const u = Math.pow(Math.random(), 0.85); // denser towards base & mid
          const v = (Math.random() - 0.5) * 2;

          // Petal profile width: narrow at base, widest at u=0.6, tapering to round tip
          const widthCurve = Math.sin(u * Math.PI) * (1 + u * 0.2);
          const petalWidth = widthCurve * (0.18 + layerIdx * 0.08);

          // Lateral curve (curls like a shell/petal cup)
          const cupDepth = (1 - v * v) * 0.08 * (layerIdx + 1);

          // ------------------------------------
          // State A: Closed Bud Position
          // ------------------------------------
          const budR = (0.08 + layerIdx * 0.04) * (1 - u * 0.4) + cupDepth * 0.5;
          const budTilt = layer.tiltClosed * u;
          const budAngle = baseAngle + v * 0.4 * widthCurve;
          const budX = Math.cos(budAngle) * budR + Math.cos(baseAngle) * budTilt * 0.2;
          const budZ = Math.sin(budAngle) * budR + Math.sin(baseAngle) * budTilt * 0.2;
          const budY = 0.45 + u * layer.height * 0.9;

          closedPositions[i3] = budX;
          closedPositions[i3 + 1] = budY;
          closedPositions[i3 + 2] = budZ;

          // ------------------------------------
          // State B: Open Full Blossom Position
          // ------------------------------------
          const openR = (0.12 + u * layer.radius) * Math.sin(u * 1.8);
          const flare = Math.pow(u, 1.4) * layer.tiltOpen;
          const openAngle = baseAngle + v * petalWidth * 2.2;
          const openX = Math.cos(openAngle) * (openR + flare);
          const openZ = Math.sin(openAngle) * (openR + flare);
          // Petal arch: rises then curves gracefully outwards/downwards at tip
          const openY = 0.45 + Math.sin(u * 1.7) * layer.height - (flare * 0.25);

          openPositions[i3] = openX;
          openPositions[i3 + 1] = openY;
          openPositions[i3 + 2] = openZ;

          // Initial interpolation based on bloomRef.current
          const b = bloomRef.current;
          currentPetalPositions[i3] = THREE.MathUtils.lerp(budX, openX, b);
          currentPetalPositions[i3 + 1] = THREE.MathUtils.lerp(budY, openY, b);
          currentPetalPositions[i3 + 2] = THREE.MathUtils.lerp(budZ, openZ, b);

          // Color palette (Matching the video: deep violet inner core, radiant electric cyan outer petals)
          if (layer.colorType === 'violet') {
            // Radiant violet-magenta-indigo core
            petalColors[i3] = 0.55 + Math.random() * 0.35;
            petalColors[i3 + 1] = 0.15 + Math.random() * 0.25;
            petalColors[i3 + 2] = 0.95;
          } else if (layer.colorType === 'sapphire') {
            // Sapphire to vivid azure blue
            petalColors[i3] = 0.15 + Math.random() * 0.25;
            petalColors[i3 + 1] = 0.35 + Math.random() * 0.35;
            petalColors[i3 + 2] = 0.98;
          } else if (layer.colorType === 'cyan') {
            // Luminous electric cyan
            petalColors[i3] = 0.05 + Math.random() * 0.2;
            petalColors[i3 + 1] = 0.75 + Math.random() * 0.25;
            petalColors[i3 + 2] = 1.0;
          } else {
            // Outer bright cyan with glowing white/diamond highlights
            const isTip = u > 0.85 || Math.abs(v) > 0.85;
            if (isTip) {
              petalColors[i3] = 0.75 + Math.random() * 0.25;
              petalColors[i3 + 1] = 0.92 + Math.random() * 0.08;
              petalColors[i3 + 2] = 1.0;
            } else {
              petalColors[i3] = 0.1 + Math.random() * 0.25;
              petalColors[i3 + 1] = 0.8 + Math.random() * 0.2;
              petalColors[i3 + 2] = 1.0;
            }
          }

          particleIdx++;
        }
      }
    });

    // Fill remaining if any
    while (particleIdx < petalCount) {
      const i3 = particleIdx * 3;
      closedPositions[i3] = 0;
      closedPositions[i3 + 1] = 0.5;
      closedPositions[i3 + 2] = 0;
      openPositions[i3] = 0;
      openPositions[i3 + 1] = 0.6;
      openPositions[i3 + 2] = 0;
      currentPetalPositions[i3] = 0;
      currentPetalPositions[i3 + 1] = 0.55;
      currentPetalPositions[i3 + 2] = 0;
      petalColors[i3] = 0.9;
      petalColors[i3 + 1] = 0.8;
      petalColors[i3 + 2] = 0.2;
      particleIdx++;
    }

    const petalGeo = new THREE.BufferGeometry();
    petalGeo.setAttribute('position', new THREE.BufferAttribute(currentPetalPositions, 3));
    petalGeo.setAttribute('color', new THREE.BufferAttribute(petalColors, 3));

    const petalMat = new THREE.PointsMaterial({
      size: 0.065,
      map: particleTexture,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.95,
    });
    const petalPoints = new THREE.Points(petalGeo, petalMat);
    scene.add(petalPoints);

    // ==========================================
    // 4. SACRED GEOMETRY ORBITAL RINGS (Atom / Celestial rings)
    // ==========================================
    // As seen in the video: dotted particle rings encircling the flower head
    const ringGroup = new THREE.Group();
    ringGroup.position.set(0, 0.9, 0);

    const ringCount = 3;
    const particlesPerRing = isSoftwareGl ? 200 : 400;

    for (let r = 0; r < ringCount; r++) {
      const ringGeo = new THREE.BufferGeometry();
      const ringPos = new Float32Array(particlesPerRing * 3);
      const ringCol = new Float32Array(particlesPerRing * 3);

      const radius = 1.15 + r * 0.12;

      for (let j = 0; j < particlesPerRing; j++) {
        const theta = (j / particlesPerRing) * Math.PI * 2;
        const j3 = j * 3;

        // Subtle wobble on ring
        const wobble = Math.sin(theta * 8) * 0.02;

        ringPos[j3] = Math.cos(theta) * (radius + wobble);
        ringPos[j3 + 1] = 0;
        ringPos[j3 + 2] = Math.sin(theta) * (radius + wobble);

        // Color: shimmering cyan-white celestial stardust
        const isStar = j % 15 === 0;
        if (isStar) {
          ringCol[j3] = 1.0;
          ringCol[j3 + 1] = 1.0;
          ringCol[j3 + 2] = 1.0;
        } else {
          ringCol[j3] = 0.2 + (r * 0.1);
          ringCol[j3 + 1] = 0.75;
          ringCol[j3 + 2] = 1.0;
        }
      }

      ringGeo.setAttribute('position', new THREE.BufferAttribute(ringPos, 3));
      ringGeo.setAttribute('color', new THREE.BufferAttribute(ringCol, 3));

      const ringMat = new THREE.PointsMaterial({
        size: 0.045,
        map: particleTexture,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        opacity: 0.75,
      });

      const ringMesh = new THREE.Points(ringGeo, ringMat);

      // Incline rings at characteristic angles like the video
      if (r === 0) {
        ringMesh.rotation.x = Math.PI * 0.25;
        ringMesh.rotation.y = Math.PI * 0.15;
      } else if (r === 1) {
        ringMesh.rotation.x = -Math.PI * 0.35;
        ringMesh.rotation.z = Math.PI * 0.2;
      } else {
        ringMesh.rotation.y = Math.PI * 0.45;
        ringMesh.rotation.z = -Math.PI * 0.15;
      }

      ringGroup.add(ringMesh);
    }

    scene.add(ringGroup);

    // ==========================================
    // 5. AMBIENT DRIFTING PARTICLES (Cosmic Motes)
    // ==========================================
    const motesCount = isSoftwareGl ? 200 : 450;
    const motesPos = new Float32Array(motesCount * 3);
    const motesVel = new Float32Array(motesCount * 3);
    const motesCol = new Float32Array(motesCount * 3);

    for (let i = 0; i < motesCount; i++) {
      const i3 = i * 3;
      motesPos[i3] = (Math.random() - 0.5) * 4.0;
      motesPos[i3 + 1] = -2.0 + Math.random() * 4.2;
      motesPos[i3 + 2] = (Math.random() - 0.5) * 3.5;

      motesVel[i3] = (Math.random() - 0.5) * 0.003;
      motesVel[i3 + 1] = 0.002 + Math.random() * 0.006; // drift upward
      motesVel[i3 + 2] = (Math.random() - 0.5) * 0.003;

      motesCol[i3] = 0.3 + Math.random() * 0.4;
      motesCol[i3 + 1] = 0.7 + Math.random() * 0.3;
      motesCol[i3 + 2] = 1.0;
    }

    const motesGeo = new THREE.BufferGeometry();
    motesGeo.setAttribute('position', new THREE.BufferAttribute(motesPos, 3));
    motesGeo.setAttribute('color', new THREE.BufferAttribute(motesCol, 3));

    const motesMat = new THREE.PointsMaterial({
      size: 0.04,
      map: particleTexture,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.65,
    });
    const motesPoints = new THREE.Points(motesGeo, motesMat);
    scene.add(motesPoints);

    // ==========================================
    // ANIMATION LOOP
    // ==========================================
    let frameId = 0;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Auto-bloom oscillation if active
      if (isAutoBloomingRef.current) {
        // Smooth sine wave between 0.15 (bud) and 1.0 (full bloom)
        const targetVal = 0.575 + Math.sin(elapsedTime * 0.45) * 0.425;
        // Damp toward target
        bloomRef.current = THREE.MathUtils.damp(bloomRef.current, targetVal, 2.5, 0.016);
        setBloomProgress(bloomRef.current);
        if (onBloomChange) {
          onBloomChange(bloomRef.current);
        }
      }

      const currentBloom = bloomRef.current;
      const petalPosAttr = petalGeo.attributes.position as THREE.BufferAttribute;
      const petalArr = petalPosAttr.array as Float32Array;

      // Gentle organic breathing sway on petals
      const swayX = Math.sin(elapsedTime * 1.2) * 0.02;
      const swayY = Math.cos(elapsedTime * 1.6) * 0.015;

      for (let i = 0; i < petalCount; i++) {
        const i3 = i * 3;
        const cx = closedPositions[i3];
        const cy = closedPositions[i3 + 1];
        const cz = closedPositions[i3 + 2];

        const ox = openPositions[i3];
        const oy = openPositions[i3 + 1];
        const oz = openPositions[i3 + 2];

        // Organic ease curve for bloom
        const eased = Math.min(1, Math.max(0, currentBloom));
        petalArr[i3] = THREE.MathUtils.lerp(cx, ox, eased) + swayX * (cy - 0.4);
        petalArr[i3 + 1] = THREE.MathUtils.lerp(cy, oy, eased) + swayY;
        petalArr[i3 + 2] = THREE.MathUtils.lerp(cz, oz, eased);
      }
      petalPosAttr.needsUpdate = true;

      // Rotate celestial rings
      ringGroup.rotation.y = elapsedTime * 0.22;
      ringGroup.rotation.x = Math.sin(elapsedTime * 0.3) * 0.15;
      ringGroup.children.forEach((child, idx) => {
        child.rotation.z = elapsedTime * (0.15 + idx * 0.08) * (idx % 2 === 0 ? 1 : -1);
      });

      // Ambient drifting motes update
      const motesPosAttr = motesGeo.attributes.position as THREE.BufferAttribute;
      const mArr = motesPosAttr.array as Float32Array;
      for (let i = 0; i < motesCount; i++) {
        const i3 = i * 3;
        mArr[i3] += motesVel[i3];
        mArr[i3 + 1] += motesVel[i3 + 1];
        mArr[i3 + 2] += motesVel[i3 + 2];

        // Wrap around height
        if (mArr[i3 + 1] > 2.2) {
          mArr[i3 + 1] = -2.0;
          mArr[i3] = (Math.random() - 0.5) * 3.5;
          mArr[i3 + 2] = (Math.random() - 0.5) * 3.0;
        }
      }
      motesPosAttr.needsUpdate = true;

      controls.update();
      renderer.render(scene, camera);

      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 600;
      const h = container.clientHeight || 550;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      particleTexture.dispose();
      soilGeo.dispose();
      soilMat.dispose();
      stemGeo.dispose();
      stemMat.dispose();
      leafGeo.dispose();
      leafMat.dispose();
      petalGeo.dispose();
      petalMat.dispose();
      ringGroup.clear();
      motesGeo.dispose();
      motesMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleManualBloomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setIsAutoBlooming(false);
    setBloomProgress(val);
    if (onBloomChange) {
      onBloomChange(val);
    }
  };

  const handleTriggerFullBloom = () => {
    setIsAutoBlooming(false);
    setBloomProgress(1.0);
    if (onBloomChange) {
      onBloomChange(1.0);
    }
  };

  const handleResetBud = () => {
    setIsAutoBlooming(false);
    setBloomProgress(0.05);
    if (onBloomChange) {
      onBloomChange(0.05);
    }
  };

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Three.js Canvas Mount */}
      <div
        ref={containerRef}
        className="w-full h-[420px] sm:h-[520px] lg:h-[580px] cursor-grab active:cursor-grabbing rounded-2xl overflow-hidden relative"
      />

      {/* Floating Interactive Controls Bar (Zero code shown, sleek futuristic blue controls) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-xl bg-slate-950/85 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-3 sm:p-4 shadow-[0_0_30px_rgba(6,182,212,0.25)] flex flex-col gap-3">
        {/* Bloom Slider & Indicator */}
        <div className="flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-cyan-300 font-semibold">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Rose Bloom Level</span>
          </div>

          <div className="flex items-center gap-2 flex-1 max-w-xs">
            <span className="text-[10px] text-slate-400">Bud</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={bloomProgress}
              onChange={handleManualBloomChange}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
              aria-label="Rose bloom level"
            />
            <span className="text-[10px] text-cyan-300">Full Bloom</span>
          </div>

          <span className="text-xs font-mono font-bold text-sky-400 tabular-nums">
            {Math.round(bloomProgress * 100)}%
          </span>
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-blue-950/70">
          {/* Audio Soundtrack Play/Pause */}
          <button
            onClick={toggleAudio}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isPlayingAudio
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
            }`}
            title="Toggle rose soundtrack music"
          >
            {isPlayingAudio ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>Pause Music</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                <span>Rose Music 🎵</span>
              </>
            )}
          </button>

          {/* Auto Bloom Animation Toggle */}
          <button
            onClick={() => setIsAutoBlooming(!isAutoBlooming)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isAutoBlooming
                ? 'bg-blue-600/30 text-sky-300 border border-sky-400/60 shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
            }`}
          >
            {isAutoBlooming ? (
              <>
                <Pause className="w-3.5 h-3.5 text-sky-400" />
                <span>Pause Bloom</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-sky-400" />
                <span>Auto Bloom ✦</span>
              </>
            )}
          </button>

          {/* Instant Full Blossom Action */}
          <button
            onClick={handleTriggerFullBloom}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Bloom Now 🌸</span>
          </button>

          {/* Reset to Bud */}
          <button
            onClick={handleResetBud}
            className="p-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-all cursor-pointer"
            title="Reset to Bud"
            aria-label="Reset to bud"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
