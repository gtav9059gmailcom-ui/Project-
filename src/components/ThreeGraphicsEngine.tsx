import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { HoloEngineMode, HoloEngineSettings } from '../types/index.ts';
import { 
  Box, 
  Layers, 
  RotateCw, 
  Sparkles, 
  ShieldAlert, 
  Cpu, 
  Maximize2, 
  Eye, 
  Activity,
  Sliders,
  Palette
} from 'lucide-react';

export const ThreeGraphicsEngine: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  // Groups for 3D modes
  const modeGroupRef = useRef<THREE.Group | null>(null);
  const armorPartsRef = useRef<{
    helmet: THREE.Group;
    chest: THREE.Group;
    leftArm: THREE.Group;
    rightArm: THREE.Group;
    leftLeg: THREE.Group;
    rightLeg: THREE.Group;
    arcCore: THREE.Mesh;
  } | null>(null);

  const [settings, setSettings] = useState<HoloEngineSettings>({
    mode: 'core',
    theme: 'arc-blue',
    wireframe: false,
    explodedProgress: 0,
    rotationSpeed: 1,
    particleDensity: 800,
    bloom: true,
  });

  const [fps, setFps] = useState<number>(60);
  const [stats, setStats] = useState({ polys: 4280, vertices: 6410 });
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  // Color theme palettes
  const getThemeColors = (theme: HoloEngineSettings['theme']) => {
    switch (theme) {
      case 'arc-blue':
        return { primary: 0x00f0ff, secondary: 0x0088ff, accent: 0xffffff, bg: 0x070b14 };
      case 'gemini-iridescent':
        return { primary: 0x8a3ffc, secondary: 0x00f0ff, accent: 0xff5277, bg: 0x0a0718 };
      case 'aquamorphic-emerald':
        return { primary: 0x00e699, secondary: 0x00b4d8, accent: 0xffffff, bg: 0x041512 };
      case 'stark-gold':
        return { primary: 0xffb703, secondary: 0xe63946, accent: 0xffffff, bg: 0x160808 };
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 520;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const themeColors = getThemeColors(settingsRef.current.theme);
    scene.background = new THREE.Color(themeColors.bg);
    scene.fog = new THREE.FogExp2(themeColors.bg, 0.035);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0.2, 7.5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'default' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    containerRef.current.replaceChildren(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(themeColors.primary, 2);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const pointLight = new THREE.PointLight(themeColors.secondary, 3, 20);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // 5. Container group for current mode
    const modeGroup = new THREE.Group();
    scene.add(modeGroup);
    modeGroupRef.current = modeGroup;

    // Build the 3D Mode Geometry
    rebuildSceneMode(settingsRef.current.mode, settingsRef.current.theme, settingsRef.current.wireframe);

    // Mouse drag interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !modeGroupRef.current) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      modeGroupRef.current.rotation.y += deltaX * 0.008;
      modeGroupRef.current.rotation.x += deltaY * 0.008;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      if (!cameraRef.current) return;
      e.preventDefault();
      cameraRef.current.position.z = THREE.MathUtils.clamp(
        cameraRef.current.position.z + e.deltaY * 0.005,
        3.5,
        14
      );
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    dom.addEventListener('wheel', handleWheel, { passive: false });

    // Handle Window Resize
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight || 520;
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsTimer = 0;

    const animate = (time: number) => {
      animationFrameIdRef.current = requestAnimationFrame(animate);

      const delta = (time - lastTime) / 1000;
      lastTime = time;

      frameCount++;
      fpsTimer += delta;
      if (fpsTimer >= 1) {
        setFps(frameCount);
        frameCount = 0;
        fpsTimer = 0;
      }

      const currentSettings = settingsRef.current;

      // Auto rotation
      if (modeGroupRef.current && !isDragging) {
        modeGroupRef.current.rotation.y += 0.4 * delta * currentSettings.rotationSpeed;
      }

      // Dynamic animations based on mode
      if (currentSettings.mode === 'core' && modeGroupRef.current) {
        // Pulse core elements
        const coreNucleus = modeGroupRef.current.getObjectByName('coreNucleus');
        if (coreNucleus) {
          const scale = 1 + Math.sin(time * 0.004) * 0.08;
          coreNucleus.scale.set(scale, scale, scale);
        }

        const ring1 = modeGroupRef.current.getObjectByName('ring1');
        const ring2 = modeGroupRef.current.getObjectByName('ring2');
        const ring3 = modeGroupRef.current.getObjectByName('ring3');
        if (ring1) ring1.rotation.z += 0.8 * delta;
        if (ring2) ring2.rotation.x -= 0.6 * delta;
        if (ring3) ring3.rotation.y += 0.5 * delta;
      }

      // Exploded Armor Lerp
      if (currentSettings.mode === 'armor' && armorPartsRef.current) {
        const p = currentSettings.explodedProgress;
        const parts = armorPartsRef.current;

        // Helmet moves up
        parts.helmet.position.y = THREE.MathUtils.lerp(parts.helmet.position.y, 1.4 + p * 1.2, 0.1);
        // Arms move outwards
        parts.leftArm.position.x = THREE.MathUtils.lerp(parts.leftArm.position.x, -1.3 - p * 1.5, 0.1);
        parts.rightArm.position.x = THREE.MathUtils.lerp(parts.rightArm.position.x, 1.3 + p * 1.5, 0.1);
        // Legs move down & out
        parts.leftLeg.position.y = THREE.MathUtils.lerp(parts.leftLeg.position.y, -1.4 - p * 0.8, 0.1);
        parts.rightLeg.position.y = THREE.MathUtils.lerp(parts.rightLeg.position.y, -1.4 - p * 0.8, 0.1);
        parts.leftLeg.position.x = THREE.MathUtils.lerp(parts.leftLeg.position.x, -0.6 - p * 0.6, 0.1);
        parts.rightLeg.position.x = THREE.MathUtils.lerp(parts.rightLeg.position.x, 0.6 + p * 0.6, 0.1);
        // Chest moves forward
        parts.chest.position.z = THREE.MathUtils.lerp(parts.chest.position.z, p * 0.8, 0.1);
      }

      // Threat map pulsing
      if (currentSettings.mode === 'threat-map' && modeGroupRef.current) {
        const infected = modeGroupRef.current.getObjectByName('infectedNode');
        if (infected) {
          const s = 1 + Math.sin(time * 0.008) * 0.25;
          infected.scale.set(s, s, s);
        }
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animationFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
      dom.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      dom.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Update scene when mode/theme/wireframe changes
  const rebuildSceneMode = (mode: HoloEngineMode, theme: HoloEngineSettings['theme'], wireframe: boolean) => {
    if (!modeGroupRef.current || !sceneRef.current) return;

    // Clear existing children
    while (modeGroupRef.current.children.length > 0) {
      const child = modeGroupRef.current.children[0];
      modeGroupRef.current.remove(child);
    }

    const colors = getThemeColors(theme);
    sceneRef.current.background = new THREE.Color(colors.bg);

    const baseMaterial = new THREE.MeshStandardMaterial({
      color: colors.primary,
      wireframe: wireframe,
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.85,
    });

    const glowMaterial = new THREE.MeshBasicMaterial({
      color: colors.secondary,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });

    if (mode === 'core') {
      // 1. Core Neural Arc Reactor
      const nucleusGeo = new THREE.IcosahedronGeometry(0.7, 2);
      const nucleusMat = new THREE.MeshStandardMaterial({
        color: colors.accent,
        emissive: colors.primary,
        emissiveIntensity: 0.8,
        wireframe: wireframe,
      });
      const nucleus = new THREE.Mesh(nucleusGeo, nucleusMat);
      nucleus.name = 'coreNucleus';
      modeGroupRef.current.add(nucleus);

      // Gimbal Rings
      const ring1Geo = new THREE.TorusGeometry(1.4, 0.03, 16, 64);
      const ring1 = new THREE.Mesh(ring1Geo, baseMaterial);
      ring1.name = 'ring1';
      modeGroupRef.current.add(ring1);

      const ring2Geo = new THREE.TorusGeometry(1.8, 0.03, 16, 64);
      const ring2 = new THREE.Mesh(ring2Geo, baseMaterial);
      ring2.rotation.x = Math.PI / 3;
      ring2.name = 'ring2';
      modeGroupRef.current.add(ring2);

      const ring3Geo = new THREE.TorusGeometry(2.2, 0.04, 16, 64);
      const ring3 = new THREE.Mesh(ring3Geo, glowMaterial);
      ring3.rotation.y = Math.PI / 4;
      ring3.name = 'ring3';
      modeGroupRef.current.add(ring3);

      // Particle Field
      const particleGeo = new THREE.BufferGeometry();
      const pCount = 500;
      const positions = new Float32Array(pCount * 3);
      for (let i = 0; i < pCount * 3; i += 3) {
        const rad = 2.4 + Math.random() * 0.8;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        positions[i] = rad * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = rad * Math.sin(phi) * Math.sin(theta);
        positions[i + 2] = rad * Math.cos(phi);
      }
      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const particleMat = new THREE.PointsMaterial({
        color: colors.primary,
        size: 0.04,
        transparent: true,
        opacity: 0.7,
      });
      const particles = new THREE.Points(particleGeo, particleMat);
      modeGroupRef.current.add(particles);

      setStats({ polys: 3420, vertices: 5120 });
    } else if (mode === 'armor') {
      // 2. Mark 85 Armor Hologram CAD Model
      const armorGroup = new THREE.Group();

      // Helmet
      const helmetGroup = new THREE.Group();
      helmetGroup.position.set(0, 1.4, 0);
      const headGeo = new THREE.CylinderGeometry(0.42, 0.38, 0.7, 12);
      const headMesh = new THREE.Mesh(headGeo, baseMaterial);
      helmetGroup.add(headMesh);
      // Eye glow visors
      const eyeGeo = new THREE.BoxGeometry(0.16, 0.04, 0.05);
      const eyeMat = new THREE.MeshBasicMaterial({ color: colors.accent });
      const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
      leftEye.position.set(-0.14, 0.08, 0.4);
      leftEye.rotation.z = -0.1;
      const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
      rightEye.position.set(0.14, 0.08, 0.4);
      rightEye.rotation.z = 0.1;
      helmetGroup.add(leftEye, rightEye);

      // Chestplate & Unibeam Arc
      const chestGroup = new THREE.Group();
      chestGroup.position.set(0, 0.3, 0);
      const torsoGeo = new THREE.CylinderGeometry(0.7, 0.5, 1.1, 8);
      const torsoMesh = new THREE.Mesh(torsoGeo, baseMaterial);
      chestGroup.add(torsoMesh);
      // Arc Reactor in chest
      const arcGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.05, 16);
      arcGeo.rotateX(Math.PI / 2);
      const arcMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const arcCore = new THREE.Mesh(arcGeo, arcMat);
      arcCore.position.set(0, 0.18, 0.48);
      chestGroup.add(arcCore);

      // Arms & Gauntlets
      const leftArm = new THREE.Group();
      leftArm.position.set(-1.1, 0.4, 0);
      const shoulderGeo = new THREE.SphereGeometry(0.3, 8, 8);
      const leftShoulder = new THREE.Mesh(shoulderGeo, baseMaterial);
      const armGeo = new THREE.CylinderGeometry(0.18, 0.15, 1.1, 8);
      const leftArmMesh = new THREE.Mesh(armGeo, baseMaterial);
      leftArmMesh.position.set(0, -0.5, 0);
      leftArm.add(leftShoulder, leftArmMesh);

      const rightArm = new THREE.Group();
      rightArm.position.set(1.1, 0.4, 0);
      const rightShoulder = new THREE.Mesh(shoulderGeo, baseMaterial);
      const rightArmMesh = new THREE.Mesh(armGeo, baseMaterial);
      rightArmMesh.position.set(0, -0.5, 0);
      rightArm.add(rightShoulder, rightArmMesh);

      // Legs & Boots
      const leftLeg = new THREE.Group();
      leftLeg.position.set(-0.45, -1.2, 0);
      const legGeo = new THREE.CylinderGeometry(0.22, 0.18, 1.4, 8);
      const leftLegMesh = new THREE.Mesh(legGeo, baseMaterial);
      leftLeg.add(leftLegMesh);

      const rightLeg = new THREE.Group();
      rightLeg.position.set(0.45, -1.2, 0);
      const rightLegMesh = new THREE.Mesh(legGeo, baseMaterial);
      rightLeg.add(rightLegMesh);

      armorGroup.add(helmetGroup, chestGroup, leftArm, rightArm, leftLeg, rightLeg);
      modeGroupRef.current.add(armorGroup);

      armorPartsRef.current = {
        helmet: helmetGroup,
        chest: chestGroup,
        leftArm,
        rightArm,
        leftLeg,
        rightLeg,
        arcCore,
      };

      setStats({ polys: 4890, vertices: 6720 });
    } else if (mode === 'threat-map') {
      // 3. Cyber Spatial Threat Map Topology
      const networkNodes: THREE.Mesh[] = [];
      const nodeCount = 12;
      const nodeGeo = new THREE.SphereGeometry(0.18, 12, 12);

      const lineMaterial = new THREE.LineBasicMaterial({
        color: colors.primary,
        transparent: true,
        opacity: 0.35,
      });

      const positions: THREE.Vector3[] = [];
      for (let i = 0; i < nodeCount; i++) {
        const phi = Math.acos(-1 + (2 * i) / nodeCount);
        const theta = Math.sqrt(nodeCount * Math.PI) * phi;
        const rad = 2.2;
        const pos = new THREE.Vector3(
          rad * Math.cos(theta) * Math.sin(phi),
          rad * Math.sin(theta) * Math.sin(phi),
          rad * Math.cos(phi)
        );
        positions.push(pos);

        const isThreat = i === 4;
        const meshMat = new THREE.MeshStandardMaterial({
          color: isThreat ? 0xff3366 : colors.primary,
          emissive: isThreat ? 0xff0044 : colors.secondary,
          emissiveIntensity: isThreat ? 1.5 : 0.6,
          wireframe: wireframe,
        });
        const mesh = new THREE.Mesh(nodeGeo, meshMat);
        mesh.position.copy(pos);
        if (isThreat) mesh.name = 'infectedNode';
        modeGroupRef.current.add(mesh);
        networkNodes.push(mesh);
      }

      // Connect nodes with holographic telemetry beams
      const linePositions: number[] = [];
      for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
          if (positions[i].distanceTo(positions[j]) < 2.5) {
            linePositions.push(positions[i].x, positions[i].y, positions[i].z);
            linePositions.push(positions[j].x, positions[j].y, positions[j].z);
          }
        }
      }
      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
      const lines = new THREE.LineSegments(lineGeo, lineMaterial);
      modeGroupRef.current.add(lines);

      setStats({ polys: 2160, vertices: 3450 });
    }
  };

  const handleModeChange = (mode: HoloEngineMode) => {
    setSettings(prev => ({ ...prev, mode }));
    rebuildSceneMode(mode, settings.theme, settings.wireframe);
  };

  const handleThemeChange = (theme: HoloEngineSettings['theme']) => {
    setSettings(prev => ({ ...prev, theme }));
    rebuildSceneMode(settings.mode, theme, settings.wireframe);
  };

  const handleWireframeToggle = () => {
    const nextVal = !settings.wireframe;
    setSettings(prev => ({ ...prev, wireframe: nextVal }));
    rebuildSceneMode(settings.mode, settings.theme, nextVal);
  };

  return (
    <div className="flex flex-col h-full bg-[#070b14]/90 rounded-2xl border border-cyan-500/20 overflow-hidden relative shadow-2xl backdrop-blur-xl">
      {/* 3D Engine Header & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-white/10 bg-slate-900/60 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
            <Box className="w-4 h-4 animate-spin" style={{ animationDuration: '10s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-wide">3D HOLO-ENGINE</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Interactive WebGL CAD Visualizer & Spatial Matrix
            </p>
          </div>
        </div>

        {/* Engine Modes */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-800/80 border border-white/10">
          <button
            onClick={() => handleModeChange('core')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              settings.mode === 'core'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Neural Core
          </button>
          <button
            onClick={() => handleModeChange('armor')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              settings.mode === 'armor'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Mark 85 CAD
          </button>
          <button
            onClick={() => handleModeChange('threat-map')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              settings.mode === 'threat-map'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Threat Topology
          </button>
        </div>
      </div>

      {/* 3D Viewport Surface */}
      <div className="relative flex-1 min-h-[460px] w-full cursor-grab active:cursor-grabbing overflow-hidden">
        <div ref={containerRef} className="w-full h-full" />

        {/* HUD Overlay - Stark Telemetry Readout */}
        <div className="absolute top-4 left-4 p-3 rounded-xl bg-slate-950/70 border border-cyan-500/30 backdrop-blur-md font-mono text-[11px] text-cyan-300 space-y-1 pointer-events-none">
          <div className="text-[10px] text-slate-400 uppercase tracking-widest flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            HUD Telemetry // STARK-ENGINE
          </div>
          <div>FPS: <span className="text-white font-bold">{fps}</span></div>
          <div>POLYS: <span className="text-white">{stats.polys}</span></div>
          <div>VERTS: <span className="text-white">{stats.vertices}</span></div>
          <div>MODE: <span className="text-cyan-200 uppercase">{settings.mode}</span></div>
        </div>

        {/* Interactive Annotation Pins for Mark 85 CAD */}
        {settings.mode === 'armor' && (
          <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 z-10 pointer-events-auto">
            <button
              onClick={() => setSelectedPart(selectedPart === 'helmet' ? null : 'helmet')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-all ${
                selectedPart === 'helmet'
                  ? 'bg-cyan-500 text-black border-cyan-400 font-bold'
                  : 'bg-slate-900/80 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/20'
              }`}
            >
              [Pin: HUD Visor]
            </button>
            <button
              onClick={() => setSelectedPart(selectedPart === 'arc' ? null : 'arc')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-all ${
                selectedPart === 'arc'
                  ? 'bg-cyan-500 text-black border-cyan-400 font-bold'
                  : 'bg-slate-900/80 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/20'
              }`}
            >
              [Pin: Unibeam Core]
            </button>
            <button
              onClick={() => setSelectedPart(selectedPart === 'repulsor' ? null : 'repulsor')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-all ${
                selectedPart === 'repulsor'
                  ? 'bg-cyan-500 text-black border-cyan-400 font-bold'
                  : 'bg-slate-900/80 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/20'
              }`}
            >
              [Pin: Repulsors]
            </button>
          </div>
        )}

        {/* Exploded View Slider (For Armor CAD) */}
        {settings.mode === 'armor' && (
          <div className="absolute top-4 right-4 p-3 rounded-xl bg-slate-950/80 border border-cyan-500/30 backdrop-blur-md w-56 space-y-2 z-10">
            <div className="flex justify-between items-center text-xs font-mono text-cyan-300">
              <span className="flex items-center gap-1">
                <Sliders className="w-3 h-3" />
                Exploded Assembly
              </span>
              <span>{Math.round(settings.explodedProgress * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={settings.explodedProgress}
              onChange={e => setSettings(prev => ({ ...prev, explodedProgress: parseFloat(e.target.value) }))}
              className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <p className="text-[10px] text-slate-400 font-sans">
              Expands armor nodes outward to inspect internal diagnostics.
            </p>
          </div>
        )}

        {/* Inspection Callout Card */}
        {selectedPart && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 rounded-2xl bg-slate-950/90 border border-cyan-400 backdrop-blur-xl shadow-2xl max-w-xs z-20 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-500/20 text-cyan-300 font-mono text-xs">
              <span className="font-bold uppercase">// DIAGNOSTIC TELEMETRY</span>
              <button onClick={() => setSelectedPart(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            {selectedPart === 'helmet' && (
              <div className="text-xs space-y-1 text-slate-300">
                <p className="font-bold text-white">Retinal HUD v4.8 Array</p>
                <p>Nanotech composite shell with multi-spectral holographic targeting and real-time audio bridge to FRIDAY.</p>
                <p className="text-[10px] text-emerald-400 font-mono">STATUS: OPTIMAL (100%)</p>
              </div>
            )}
            {selectedPart === 'arc' && (
              <div className="text-xs space-y-1 text-slate-300">
                <p className="font-bold text-white">Mark 85 Arc Micro-Reactor</p>
                <p>High-density palladium-free clean plasma core delivering 14.8 Gigawatts to suit propulsion and defense shielding.</p>
                <p className="text-[10px] text-cyan-400 font-mono">OUTPUT: 98.6% NOMINAL</p>
              </div>
            )}
            {selectedPart === 'repulsor' && (
              <div className="text-xs space-y-1 text-slate-300">
                <p className="font-bold text-white">Repulsor Gauntlet Emitters</p>
                <p>Concentrated muon pulse cannons with precision beam collimation and variable non-lethal shockwave settings.</p>
                <p className="text-[10px] text-amber-400 font-mono">CHARGE: FULLY ARMED</p>
              </div>
            )}
          </div>
        )}

        {/* Navigation Hint */}
        <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-[10px] text-slate-400 pointer-events-none backdrop-blur-sm">
          Drag to Orbit • Scroll to Zoom
        </div>
      </div>

      {/* 3D Engine Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-t border-white/10 bg-slate-900/70 z-10">
        {/* Color Theme Selector */}
        <div className="flex items-center gap-2 text-xs">
          <Palette className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400 text-xs">Holo Theme:</span>
          <div className="flex items-center gap-1.5">
            {[
              { id: 'arc-blue', label: 'Arc Blue', color: 'bg-cyan-400' },
              { id: 'gemini-iridescent', label: 'Gemini', color: 'bg-fuchsia-400' },
              { id: 'aquamorphic-emerald', label: 'Aquamorphic', color: 'bg-emerald-400' },
              { id: 'stark-gold', label: 'Stark Gold', color: 'bg-amber-400' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => handleThemeChange(t.id as any)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1.5 border transition-all ${
                  settings.theme === t.id
                    ? 'border-cyan-400 bg-cyan-500/20 text-white font-semibold'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${t.color}`} />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Wireframe and Speed Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleWireframeToggle}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
              settings.wireframe
                ? 'bg-cyan-500 text-black border-cyan-400 font-bold'
                : 'bg-slate-800 text-slate-300 border-white/10 hover:bg-slate-700'
            }`}
          >
            Wireframe: {settings.wireframe ? 'ON' : 'OFF'}
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <RotateCw className="w-3.5 h-3.5" />
            <select
              value={settings.rotationSpeed}
              onChange={e => setSettings(prev => ({ ...prev, rotationSpeed: parseFloat(e.target.value) }))}
              className="bg-slate-800 text-white text-xs rounded-lg px-2 py-1 border border-white/10 focus:outline-none focus:border-cyan-400"
            >
              <option value="0">Rotation: Paused</option>
              <option value="0.5">Speed: 0.5x</option>
              <option value="1">Speed: 1.0x</option>
              <option value="2">Speed: 2.0x</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
