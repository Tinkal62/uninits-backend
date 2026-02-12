// canvas.js - Cosmic Particle Background


// At the very beginning of canvas.js
if (window.innerWidth <= 768) {
  console.log('Mobile detected, skipping canvas initialization');
  // Don't initialize canvas on mobile
  if (typeof initCanvas !== 'undefined') {
    initCanvas = function() {
      console.log('Canvas disabled on mobile');
    };
  }
}


// Fixed values
const PARTICLE_COUNT = 3000;
const PARTICLE_SPEED = 30;
const GLOW_INTENSITY = 2;

// Main variables
let scene, camera, renderer, particleSystem;
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let particles;
let clock = new THREE.Clock();
let lastMouseMoveTime = Date.now();

// Initialize Three.js scene
function initParticleSystem() {
  console.log("Initializing particle system...");
  
  // Create scene
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 100, 1000);
  
  // Create camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
  camera.position.z = 500;
  
  // Create renderer
  renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true,
    powerPreference: "high-performance"
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  
  // Add to DOM
  const canvasContainer = document.getElementById('canvas-container');
  if (canvasContainer) {
    canvasContainer.appendChild(renderer.domElement);
  } else {
    console.error("canvas-container element not found!");
    return;
  }
  
  // Create particle system
  createParticles();
  
  // Add event listeners
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('touchmove', onTouchMove, { passive: false });
  window.addEventListener('resize', onWindowResize);
  
  // Start animation loop
  animate();
}

// Create particle system
function createParticles() {
  // Define particle colors (cyan → blue → purple theme)
  const colors = [
    new THREE.Color(0x00ffff), // Cyan
    new THREE.Color(0x0066ff), // Deep blue
    new THREE.Color(0x00aaff), // Bright blue
    new THREE.Color(0xaa00ff), // Purple
    new THREE.Color(0x5400ff)  // Deep purple
  ];
  
  // Create particle geometry
  const geometry = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(PARTICLE_COUNT * 3);
  const particleProperties = new Float32Array(PARTICLE_COUNT * 3);
  
  // Initialize particles
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const radius = Math.random() * 400 + 100;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    
    const i3 = i * 3;
    particlePositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    particlePositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    particlePositions[i3 + 2] = radius * Math.cos(phi);
    
    // Store properties
    particleProperties[i * 3] = Math.random() * 1.2 + 0.8;
    particleProperties[i * 3 + 1] = Math.random() * 0.4 + 0.6;
    particleProperties[i * 3 + 2] = Math.floor(Math.random() * colors.length);
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  
  // Create particle material
  const material = new THREE.PointsMaterial({
    size: 1.0 + (GLOW_INTENSITY * 0.15),
    vertexColors: true,
    transparent: true,
    opacity: 0.4 + (GLOW_INTENSITY * 0.03),
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  
  // Create color attribute
  const colorArray = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const colorIndex = particleProperties[i * 3 + 2];
    const color = colors[colorIndex];
    
    const i3 = i * 3;
    colorArray[i3] = color.r;
    colorArray[i3 + 1] = color.g;
    colorArray[i3 + 2] = color.b;
  }
  
  geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
  
  // Create particle system
  particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);
  
  particles = particleSystem.geometry.attributes.position.array;
  particleSystem.userData.properties = particleProperties;
}

// Mouse move event handler
function onMouseMove(event) {
  lastMouseMoveTime = Date.now();
  mouseX = (event.clientX - windowHalfX) * 0.3;
  mouseY = (event.clientY - windowHalfY) * 0.3;
}

// Touch move event handler
function onTouchMove(event) {
  if (event.touches.length === 1) {
    event.preventDefault();
    lastMouseMoveTime = Date.now();
    
    const touch = event.touches[0];
    mouseX = (touch.clientX - windowHalfX) * 0.3;
    mouseY = (touch.clientY - windowHalfY) * 0.3;
  }
}

// Window resize handler
function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  const time = clock.getElapsedTime();
  const delta = clock.getDelta();
  
  // Smooth mouse movement
  targetX += (mouseX - targetX) * 0.03;
  targetY += (mouseY - targetY) * 0.03;
  
  // Check idle time
  const idleTime = Date.now() - lastMouseMoveTime;
  const isIdle = idleTime > 3000;
  
  const particleProperties = particleSystem.userData.properties;
  
  // Update particles
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    const propIndex = i * 3;
    const speedFactor = particleProperties[propIndex + 1];
    
    // Calculate distance to cursor
    const dx = targetX - particles[i3];
    const dy = targetY - particles[i3 + 1];
    const dz = 0 - particles[i3 + 2];
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
    
    const force = 1 / (distance * 0.01 + 1);
    
    // Ambient motion when idle
    let ambientX = 0, ambientY = 0, ambientZ = 0;
    if (isIdle) {
      ambientX = Math.sin(time * 0.3 + i) * 0.3;
      ambientY = Math.cos(time * 0.2 + i) * 0.3;
      ambientZ = Math.sin(time * 0.4 + i) * 0.2;
    }
    
    // Apply movement
    particles[i3] += (dx * force * 0.015 * PARTICLE_SPEED * speedFactor + ambientX) * delta * 60;
    particles[i3 + 1] += (dy * force * 0.015 * PARTICLE_SPEED * speedFactor + ambientY) * delta * 60;
    particles[i3 + 2] += (dz * force * 0.01 * PARTICLE_SPEED * speedFactor + ambientZ) * delta * 60;
    
    // Add subtle chaos
    const chaos = 0.05;
    particles[i3] += (Math.random() - 0.5) * chaos;
    particles[i3 + 1] += (Math.random() - 0.5) * chaos;
    particles[i3 + 2] += (Math.random() - 0.5) * chaos;
    
    // Boundary check
    const maxDistance = 700;
    const particleDistance = Math.sqrt(
      particles[i3] * particles[i3] + 
      particles[i3 + 1] * particles[i3 + 1] + 
      particles[i3 + 2] * particles[i3 + 2]
    );
    
    if (particleDistance > maxDistance) {
      particles[i3] *= 0.98;
      particles[i3 + 1] *= 0.98;
      particles[i3 + 2] *= 0.98;
    }
  }
  
  // Update geometry
  particleSystem.geometry.attributes.position.needsUpdate = true;
  
  // Gentle camera movement
  camera.position.x = Math.sin(time * 0.05) * 30;
  camera.position.y = Math.cos(time * 0.03) * 20;
  camera.lookAt(0, 0, 0);
  
  // Render scene
  renderer.render(scene, camera);
}

// Simple initialization
function initCanvas() {
  // Check if Three.js is loaded
  if (typeof THREE === 'undefined') {
    console.error("Three.js is not loaded!");
    return;
  }
  
  // Check if container exists
  const canvasContainer = document.getElementById('canvas-container');
  if (!canvasContainer) {
    console.error("Canvas container not found!");
    return;
  }
  
  // Initialize particle system
  try {
    initParticleSystem();
    console.log("Particle system initialized successfully");
  } catch (error) {
    console.error("Error initializing particle system:", error);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCanvas);
} else {
  // DOM already loaded
  initCanvas();
}