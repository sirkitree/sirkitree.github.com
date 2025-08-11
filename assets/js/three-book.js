// ESM three.js module with OrbitControls via CDN
import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';

function clampDevicePixelRatio(maxRatio) {
  const ratio = Math.min(window.devicePixelRatio || 1, maxRatio);
  return isFinite(ratio) ? ratio : 1;
}

function createBookMesh({ frontUrl, backUrl, spineUrl }) {
  // Book dimensions in arbitrary units
  const width = 1.0; // cover width
  const height = 1.5; // cover height
  const depth = 0.08; // thickness

  const geometry = new THREE.BoxGeometry(width, height, depth);

  const loader = new THREE.TextureLoader();
  const front = frontUrl ? new THREE.MeshStandardMaterial({ map: loader.load(frontUrl) }) : new THREE.MeshStandardMaterial({ color: 0x334155 });
  const back = backUrl ? new THREE.MeshStandardMaterial({ map: loader.load(backUrl) }) : new THREE.MeshStandardMaterial({ color: 0x1f2937 });
  const spine = spineUrl ? new THREE.MeshStandardMaterial({ map: loader.load(spineUrl) }) : new THREE.MeshStandardMaterial({ color: 0x111827 });
  const pages = new THREE.MeshStandardMaterial({ color: 0xe5e7eb, roughness: 0.9, metalness: 0.0 });

  // Box material order: [px, nx, py, ny, pz, nz]
  // Map: right, left, top, bottom, front, back
  const materials = [
    pages, // px (right) — page edge
    spine, // nx (left) — spine (so spine is on the left when viewing the front cover)
    pages, // py (top)
    pages, // ny (bottom)
    front, // pz (front cover)
    back   // nz (back cover)
  ];

  const mesh = new THREE.Mesh(geometry, materials);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function init() {
  const container = document.getElementById('book3d');
  if (!container) return;

  // Progressive enhancement: bail out on missing WebGL
  const gl = document.createElement('canvas').getContext('webgl2') || document.createElement('canvas').getContext('webgl');
  if (!gl) {
    container.innerHTML = '<div style="display:grid;place-items:center;height:100%"><img alt="Book cover" src="' + (container.dataset.coverFront || '') + '" style="max-width:100%;max-height:100%"/></div>';
    return;
  }

  const scene = new THREE.Scene();
  // Allow page to override background via data attribute (e.g., data-bg="#f6f5f2")
  const bgAttr = (container.dataset.bg || container.dataset.background || '').trim();
  const defaultBg = 0x0b0f14;
  const bgColor = bgAttr ? new THREE.Color(bgAttr) : new THREE.Color(defaultBg);
  scene.background = bgColor;

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(1.8, 1.2, 2.2);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.shadowMap.enabled = true;
  renderer.setPixelRatio(clampDevicePixelRatio(1.8));
  // Ensure the canvas clears to the same background color
  renderer.setClearColor(bgColor, 1);
  container.appendChild(renderer.domElement);

  // Lighting
  const hemi = new THREE.HemisphereLight(0xffffff, 0x111111, 0.8);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffffff, 1.0);
  key.position.set(3, 4, 2);
  key.castShadow = true;
  scene.add(key);

  // Ground for subtle shadow
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.ShadowMaterial({ opacity: bgAttr ? 0.28 : 0.15 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.8;
  ground.receiveShadow = true;
  scene.add(ground);

  // Book
  const book = createBookMesh({
    frontUrl: container.dataset.coverFront,
    backUrl: container.dataset.coverBack,
    spineUrl: container.dataset.coverSpine
  });
  // Optional initial rotations from data attributes
  const degToRad = (deg) => (Number(deg) || 0) * Math.PI / 180;
  if (container.dataset.rotateY) {
    book.rotation.y = degToRad(container.dataset.rotateY);
  }
  if (container.dataset.rotateX) {
    book.rotation.x = degToRad(container.dataset.rotateX);
  }
  scene.add(book);

  // Compute a fit distance for framing the book, unless an explicit camera distance is provided
  const box = new THREE.Box3().setFromObject(book);
  const sphere = new THREE.Sphere();
  box.getBoundingSphere(sphere);
  const fitMultiplier = 1.3;
  const vFov = THREE.MathUtils.degToRad(camera.fov);
  const fitDistance = (sphere.radius * fitMultiplier) / Math.sin(vFov / 2);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 1.5;
  controls.maxDistance = 4.0;
  controls.target.set(0, 0, 0);

  // Auto-rotate gently (configurable)
  const autoRotateAttr = container.dataset.autorotate;
  const shouldAutoRotate = autoRotateAttr === undefined || autoRotateAttr === '' || autoRotateAttr === 'true';
  controls.autoRotate = shouldAutoRotate;
  controls.autoRotateSpeed = 0.6;
  if (!shouldAutoRotate) {
    controls.enableRotate = false;
  }

  // Optional camera spherical positioning to expose spine clearly
  const azimuthDeg = Number(container.dataset.cameraAzimuth || container.dataset.azimuth || -35);
  const elevationDeg = Number(container.dataset.cameraElevation || container.dataset.elevation || 12);
  const distance = Number(container.dataset.cameraDistance || container.dataset.distance || fitDistance);
  const theta = THREE.MathUtils.degToRad(azimuthDeg); // around Y axis
  const phi = Math.PI / 2 - THREE.MathUtils.degToRad(elevationDeg); // from Y axis
  const spherical = new THREE.Spherical(distance, phi, theta);
  camera.position.setFromSpherical(spherical);
  camera.lookAt(controls.target);

  function resize() {
    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    renderer.setSize(width, height, false);
    camera.aspect = width / Math.max(1, height);
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  let running = true;
  const observer = new IntersectionObserver((entries) => {
    running = entries.some(e => e.isIntersecting);
  }, { threshold: 0.1 });
  observer.observe(container);

  document.addEventListener('visibilitychange', () => {
    running = document.visibilityState === 'visible';
  });

  function animate() {
    if (running) {
      controls.update();
      renderer.render(scene, camera);
    }
    requestAnimationFrame(animate);
  }
  animate();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}


