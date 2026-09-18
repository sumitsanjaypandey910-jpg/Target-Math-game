import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface UnderwaterBackground3DProps {
  interactive?: boolean;
  density?: 'normal' | 'subtle';
  className?: string;
}

export const UnderwaterBackground3D: React.FC<UnderwaterBackground3DProps> = ({
  interactive = true,
  density = 'normal',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x042244, 0.032);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      60
    );
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // Ambient & Directional Sunbeam Lighting
    const ambientLight = new THREE.AmbientLight(0x0e5a96, 1.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0x7dd3fc, 2.2);
    sunLight.position.set(-5, 15, 8);
    scene.add(sunLight);

    const bottomGlow = new THREE.PointLight(0x06b6d4, 1.2, 20);
    bottomGlow.position.set(0, -8, 2);
    scene.add(bottomGlow);

    // 1. CREATE 3D DRIFTING SEAWEED
    // Each strand is a segmented 3D ribbon anchored at the seabed with true 3D fluid sway
    interface SeaweedBlade {
      mesh: THREE.Mesh;
      initialPositions: Float32Array;
      height: number;
      swaySpeed: number;
      swayAmpX: number;
      swayAmpZ: number;
      phase: number;
    }

    const seaweedBlades: SeaweedBlade[] = [];
    const seaweedGroup = new THREE.Group();
    scene.add(seaweedGroup);

    // Colors: subtle translucent kelp tones to complement 2D artwork without clash
    const seaweedColors = [
      0x10b981, // Emerald
      0x059669, // Deep kelp
      0x34d399, // Seafoam
      0x047857, // Forest seaweed
      0x0d9488, // Teal kelp
    ];

    const bladeConfigs = [
      // Left cluster (deep and foreground)
      { x: -5.8, y: -8.5, z: -2.0, h: 9.5, w: 0.55, col: seaweedColors[0], speed: 1.2, ampX: 0.7, ampZ: 0.35 },
      { x: -5.1, y: -8.8, z: -1.2, h: 8.2, w: 0.48, col: seaweedColors[1], speed: 1.4, ampX: 0.65, ampZ: 0.4 },
      { x: -4.4, y: -9.0, z: -3.5, h: 10.5, w: 0.6, col: seaweedColors[3], speed: 1.0, ampX: 0.85, ampZ: 0.5 },
      { x: -6.2, y: -8.6, z: 0.5, h: 7.5, w: 0.4, col: seaweedColors[2], speed: 1.6, ampX: 0.55, ampZ: 0.3 },

      // Mid-left subtle accent
      { x: -2.8, y: -9.2, z: -4.0, h: 7.0, w: 0.35, col: seaweedColors[4], speed: 1.3, ampX: 0.5, ampZ: 0.3 },

      // Mid-right accent
      { x: 2.2, y: -9.2, z: -4.2, h: 6.8, w: 0.35, col: seaweedColors[0], speed: 1.1, ampX: 0.45, ampZ: 0.35 },

      // Right cluster
      { x: 4.6, y: -8.8, z: -1.5, h: 8.8, w: 0.52, col: seaweedColors[1], speed: 1.3, ampX: 0.7, ampZ: 0.4 },
      { x: 5.3, y: -8.6, z: -2.5, h: 10.2, w: 0.58, col: seaweedColors[3], speed: 0.95, ampX: 0.8, ampZ: 0.5 },
      { x: 5.9, y: -8.4, z: 0.2, h: 7.8, w: 0.45, col: seaweedColors[2], speed: 1.5, ampX: 0.6, ampZ: 0.3 },
      { x: 3.8, y: -9.0, z: -3.0, h: 8.0, w: 0.4, col: seaweedColors[4], speed: 1.2, ampX: 0.55, ampZ: 0.35 },
    ];

    bladeConfigs.forEach((cfg, idx) => {
      const segY = 18;
      const segX = 2;
      const geom = new THREE.PlaneGeometry(cfg.w, cfg.h, segX, segY);
      // Shift pivot to bottom of blade
      geom.translate(0, cfg.h / 2, 0);

      // Clean up any microscopic negative values near 0 from floating-point translation
      const posAttr = geom.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < posAttr.count; i++) {
        const yVal = posAttr.getY(i);
        if (Math.abs(yVal) < 1e-6) {
          posAttr.setY(i, 0);
        }
      }
      geom.computeBoundingSphere();

      // Clone original vertex coordinates for continuous procedural sway
      const initialPositions = new Float32Array(posAttr.array);

      const mat = new THREE.MeshPhongMaterial({
        color: cfg.col,
        emissive: 0x022c22,
        specular: 0x6ee7b7,
        shininess: 35,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75,
        depthWrite: false,
      });

      const mesh = new THREE.Mesh(geom, mat);
      mesh.frustumCulled = false;
      mesh.position.set(cfg.x, cfg.y, cfg.z);
      mesh.rotation.y = (idx * 0.4) - 0.5;
      seaweedGroup.add(mesh);

      seaweedBlades.push({
        mesh,
        initialPositions,
        height: cfg.h,
        swaySpeed: cfg.speed,
        swayAmpX: cfg.ampX,
        swayAmpZ: cfg.ampZ,
        phase: idx * 0.8,
      });
    });

    // 2. CREATE 3D TRANSLUCENT GLOSSY BUBBLES
    // Rising 3D spheres with natural buoyant wobble & specular refraction
    interface FloatingBubble {
      mesh: THREE.Mesh;
      baseX: number;
      baseZ: number;
      y: number;
      speedY: number;
      radius: number;
      wobbleSpeed: number;
      wobbleAmp: number;
      phase: number;
    }

    const bubbles: FloatingBubble[] = [];
    const bubbleGroup = new THREE.Group();
    scene.add(bubbleGroup);

    const bubbleCount = density === 'normal' ? 24 : 14;
    const bubbleGeometry = new THREE.SphereGeometry(1, 20, 20);

    // 3D Glass Bubble Material with fresnel shine
    const bubbleMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xcffafe,
      transmission: 0.88,
      opacity: 0.7,
      transparent: true,
      roughness: 0.08,
      ior: 1.15,
      metalness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });

    for (let i = 0; i < bubbleCount; i++) {
      const radius = 0.14 + Math.random() * 0.34;
      const mesh = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
      mesh.scale.setScalar(radius);

      const baseX = (Math.random() - 0.5) * 11;
      const baseZ = -6 + Math.random() * 8;
      const startY = -9 + Math.random() * 18;

      mesh.position.set(baseX, startY, baseZ);
      bubbleGroup.add(mesh);

      bubbles.push({
        mesh,
        baseX,
        baseZ,
        y: startY,
        speedY: 0.018 + Math.random() * 0.026 + radius * 0.015,
        radius,
        wobbleSpeed: 1.2 + Math.random() * 1.5,
        wobbleAmp: 0.2 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // 3. 3D GLOWING WATER SUSPENDED PARTICLES (Marine Snow / Plankton)
    const particleCount = 80;
    const particleGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3 + 0] = (Math.random() - 0.5) * 14;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      particlePositions[i * 3 + 2] = -8 + Math.random() * 10;

      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.004,
        y: 0.003 + Math.random() * 0.007,
        z: (Math.random() - 0.5) * 0.004,
      });
    }

    particleGeom.setAttribute(
      'position',
      new THREE.BufferAttribute(particlePositions, 3)
    );
    particleGeom.computeBoundingSphere();

    // Circular particle texture
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      gradient.addColorStop(0.35, 'rgba(165, 243, 252, 0.6)');
      gradient.addColorStop(1, 'rgba(14, 165, 233, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const particleMat = new THREE.PointsMaterial({
      size: 0.18,
      map: particleTexture,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeom, particleMat);
    particles.frustumCulled = false;
    scene.add(particles);

    // 4. SUBTLE 3D DEEP OCEAN FISH SILHOUETTES
    // 3 distant fish swimming gently in background depth (z = -12)
    interface DistantFish {
      group: THREE.Group;
      x: number;
      y: number;
      z: number;
      speed: number;
      wiggleSpeed: number;
      tailMesh: THREE.Mesh;
    }

    const fishList: DistantFish[] = [];
    const fishGroup = new THREE.Group();
    scene.add(fishGroup);

    const fishMat = new THREE.MeshBasicMaterial({
      color: 0x052e4d,
      transparent: true,
      opacity: 0.32,
    });

    for (let f = 0; f < 3; f++) {
      const fishSubGroup = new THREE.Group();
      
      // Body: flattened cone/capsule
      const bodyGeom = new THREE.ConeGeometry(0.2, 0.75, 8);
      bodyGeom.rotateZ(Math.PI / 2);
      const bodyMesh = new THREE.Mesh(bodyGeom, fishMat);
      fishSubGroup.add(bodyMesh);

      // Tail fin
      const tailGeom = new THREE.BufferGeometry();
      const vertices = new Float32Array([
        -0.35, 0, 0,
        -0.65, 0.22, 0,
        -0.65, -0.22, 0,
      ]);
      tailGeom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      tailGeom.computeVertexNormals();
      tailGeom.computeBoundingSphere();
      const tailMesh = new THREE.Mesh(tailGeom, fishMat);
      fishSubGroup.add(tailMesh);

      const initX = -8 + f * 5.5 + (Math.random() - 0.5) * 2;
      const initY = -2 + f * 2.2 + (Math.random() - 0.5);
      const initZ = -10 - Math.random() * 3;

      fishSubGroup.position.set(initX, initY, initZ);
      fishGroup.add(fishSubGroup);

      fishList.push({
        group: fishSubGroup,
        x: initX,
        y: initY,
        z: initZ,
        speed: 0.012 + Math.random() * 0.008,
        wiggleSpeed: 5 + Math.random() * 2,
        tailMesh,
      });
    }

    // Interactive mouse / touch parallax target
    let targetCameraX = 0;
    let targetCameraY = 0;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!interactive) return;
      let clientX = 0;
      let clientY = 0;

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const rect = container.getBoundingClientRect();
      const normX = ((clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((clientY - rect.top) / rect.height) * 2 - 1);

      targetCameraX = normX * 0.8;
      targetCameraY = normY * 0.5;
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    // Handle Resize smoothly via ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width <= 0 || height <= 0) return;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }
    });
    resizeObserver.observe(container);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth camera parallax
      camera.position.x += (targetCameraX - camera.position.x) * 0.035;
      camera.position.y += (targetCameraY - camera.position.y) * 0.035;
      camera.lookAt(0, 0, 0);

      // 1. Procedural 3D Seaweed Sway
      seaweedBlades.forEach((blade) => {
        const posAttr = blade.mesh.geometry.attributes.position as THREE.BufferAttribute;
        const arr = posAttr.array as Float32Array;
        const orig = blade.initialPositions;

        const count = posAttr.count;
        for (let i = 0; i < count; i++) {
          const origY = orig[i * 3 + 1];
          // Clamp safely to [0, 1] to prevent negative base in Math.pow
          const safeY = Math.max(0, origY);
          const heightRatio = Math.min(1, safeY / (blade.height || 1));
          // Quadratic influence so tip sways freely while roots are securely anchored
          const bendFactor = heightRatio > 0 ? Math.pow(heightRatio, 1.6) : 0;

          const time = elapsedTime * blade.swaySpeed + blade.phase;
          // Fluid organic wave combining dual harmonics
          const swayX =
            (Math.sin(time + origY * 0.5) * 0.75 +
              Math.sin(time * 0.5 + origY * 0.25) * 0.25) *
            blade.swayAmpX *
            bendFactor;

          const swayZ =
            (Math.cos(time * 0.85 + origY * 0.4) * 0.8 +
              Math.sin(time * 0.3) * 0.2) *
            blade.swayAmpZ *
            bendFactor;

          arr[i * 3 + 0] = orig[i * 3 + 0] + (Number.isFinite(swayX) ? swayX : 0);
          arr[i * 3 + 2] = orig[i * 3 + 2] + (Number.isFinite(swayZ) ? swayZ : 0);
        }

        posAttr.needsUpdate = true;
      });

      // 2. Rising & Wobbling 3D Bubbles
      bubbles.forEach((b) => {
        b.y += b.speedY;
        // Loop back to bottom when reaching the surface
        if (b.y > 9) {
          b.y = -9.5;
          b.baseX = (Math.random() - 0.5) * 11;
        }

        const wobbleTime = elapsedTime * b.wobbleSpeed + b.phase;
        const currentX = b.baseX + Math.sin(wobbleTime) * b.wobbleAmp;
        const currentZ = b.baseZ + Math.cos(wobbleTime * 0.8) * (b.wobbleAmp * 0.6);

        b.mesh.position.set(currentX, b.y, currentZ);

        // Subtle squash/stretch as bubble rises through water pressure
        const stretch = 1 + Math.sin(wobbleTime * 1.5) * 0.08;
        b.mesh.scale.set(b.radius / Math.sqrt(stretch), b.radius * stretch, b.radius / Math.sqrt(stretch));
      });

      // 3. Floating Marine Snow Particles
      const pArr = particleGeom.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        pArr[i * 3 + 1] += particleVelocities[i].y;
        pArr[i * 3 + 0] += Math.sin(elapsedTime * 0.8 + i) * 0.003;
        pArr[i * 3 + 2] += Math.cos(elapsedTime * 0.6 + i) * 0.002;

        // Reset if float out of bounds
        if (pArr[i * 3 + 1] > 8) {
          pArr[i * 3 + 1] = -8;
          pArr[i * 3 + 0] = (Math.random() - 0.5) * 14;
        }
      }
      particleGeom.attributes.position.needsUpdate = true;

      // 4. Distant Swimming Fish
      fishList.forEach((fish) => {
        fish.x += fish.speed;
        if (fish.x > 8.5) {
          fish.x = -8.5;
          fish.y = -2 + Math.random() * 4;
        }

        fish.group.position.x = fish.x;
        fish.group.position.y = fish.y + Math.sin(elapsedTime * 1.5 + fish.z) * 0.12;

        // Tail waggle
        const waggle = Math.sin(elapsedTime * fish.wiggleSpeed);
        fish.tailMesh.rotation.y = waggle * 0.4;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Clean up Three.js resources
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      resizeObserver.disconnect();

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      // Dispose geometries and materials
      bubbleGeometry.dispose();
      bubbleMaterial.dispose();
      particleGeom.dispose();
      particleMat.dispose();
      particleTexture.dispose();
      fishMat.dispose();

      seaweedBlades.forEach((b) => {
        b.mesh.geometry.dispose();
        (b.mesh.material as THREE.Material).dispose();
      });

      renderer.dispose();
    };
  }, [interactive, density]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ zIndex: 1 }}
    />
  );
};
