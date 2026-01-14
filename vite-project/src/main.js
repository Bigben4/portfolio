import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Steampunk Moon Scene
// - Moon with textured surface
// - Steampunk gear cluster and pipework
// - Starfield and subtle volumetric fog
// - Parallax via scroll

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x07050a);
scene.fog = new THREE.FogExp2(0x07050a, 0.0008);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 5000);
camera.position.set(0, 12, 80);

const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('.bg'), antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.maxPolarAngle = Math.PI * 0.9;

// Lights: warm key + cool rim for that steampunk contrast
const ambient = new THREE.AmbientLight(0x3b3b4f, 0.6);
scene.add(ambient);

const keyLight = new THREE.DirectionalLight(0xffddcc, 1.1);
keyLight.position.set(20, 30, 10);
scene.add(keyLight);

const rimLight = new THREE.PointLight(0x6fd8ff, 0.6, 200);
rimLight.position.set(-40, -10, 40);
scene.add(rimLight);

// Texture loader
const loader = new THREE.TextureLoader();

// Moon
const moonRadius = 18;
const moonGeo = new THREE.SphereGeometry(moonRadius, 128, 128);
const moonMap = loader.load('icons/c27c5113-c349-4de3-9ed9-2f69dd86af5b.jpg');
const moonNormal = loader.load('icons/integration_instructions_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg');
const moonMat = new THREE.MeshStandardMaterial({
    map: moonMap,
    normalMap: moonNormal,
    metalness: 0.05,
    roughness: 0.9,
});
const moon = new THREE.Mesh(moonGeo, moonMat);
moon.position.set(-6, 6, -30);
scene.add(moon);

// Large background sphere (starfield) - if a generated texture is present it will add depth
let bgSphere;
loader.load('public/photos/space-bg.jpg', (tex) => {
    const bgMat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide });
    const bgGeo = new THREE.SphereGeometry(1500, 32, 32);
    bgSphere = new THREE.Mesh(bgGeo, bgMat);
    scene.add(bgSphere);
}, undefined, () => {
    // on error: fallback to subtle star points (we still create points below)
});

// Starfield points
function createStarfield(count = 1200, spread = 1200) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * spread;
        positions[i3 + 1] = (Math.random() - 0.5) * spread * 0.6;
        positions[i3 + 2] = (Math.random() - 0.5) * spread;

        const v = 0.8 + Math.random() * 0.4;
        colors[i3] = v;
        colors[i3 + 1] = v;
        colors[i3 + 2] = v;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({ size: 1.8, vertexColors: true, opacity: 0.95, transparent: true });
    const points = new THREE.Points(geometry, material);
    points.position.set(0, 0, -200);
    scene.add(points);
    return points;
}
const stars = createStarfield();

// Steampunk gear cluster
const gearGroup = new THREE.Group();
gearGroup.position.set(20, -6, -20);
scene.add(gearGroup);

function createGear(radius = 6, tube = 1.2, teeth = 18, color = 0xb87333) {
    const tor = new THREE.TorusGeometry(radius, tube, 16, teeth * 4);
    const mat = new THREE.MeshStandardMaterial({ color, metalness: 0.9, roughness: 0.35 });
    const ring = new THREE.Mesh(tor, mat);

    // add teeth as small boxes
    const teethGroup = new THREE.Group();
    for (let i = 0; i < teeth; i++) {
        const box = new THREE.BoxGeometry(tube * 0.6, tube * 1.6, tube * 0.6);
        const tooth = new THREE.Mesh(box, mat);
        const angle = (i / teeth) * Math.PI * 2;
        const x = Math.cos(angle) * (radius + tube * 0.2);
        const y = Math.sin(angle) * (radius + tube * 0.2);
        tooth.position.set(x, y, 0);
        tooth.lookAt(0, 0, 0);
        teethGroup.add(tooth);
    }

    const gear = new THREE.Group();
    gear.add(ring);
    gear.add(teethGroup);
    return gear;
}

// Add multiple interleaved gears with different sizes
const bigGear = createGear(9, 1.6, 30, 0x7a4b2e);
bigGear.position.set(0, 0, 0);
gearGroup.add(bigGear);

const midGear = createGear(5.6, 1.2, 20, 0xb06b2c);
midGear.position.set(-12, -6, 1);
gearGroup.add(midGear);

const smallGear = createGear(3.6, 0.9, 14, 0xc27a3a);
smallGear.position.set(10, 8, 2);
gearGroup.add(smallGear);

// pipework: a few cylinders connecting gears
function createPipe(length = 18, radius = 0.8, color = 0x3b3b3b) {
    const geo = new THREE.CylinderGeometry(radius, radius, length, 16);
    const mat = new THREE.MeshStandardMaterial({ color, metalness: 0.85, roughness: 0.4 });
    const pipe = new THREE.Mesh(geo, mat);
    return pipe;
}
const pipe1 = createPipe(28, 0.8, 0x2f2f2f);
pipe1.position.set(-6, -4, -2);
pipe1.rotation.z = Math.PI * 0.14;
gearGroup.add(pipe1);

const pipe2 = createPipe(22, 0.6, 0x2f2f2f);
pipe2.position.set(14, 2, -1);
pipe2.rotation.z = -Math.PI * 0.3;
gearGroup.add(pipe2);

// Steam/emissive sparks near the pipes
function createSparks(count = 60) {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        pos[i3] = 20 + (Math.random() - 0.5) * 8;
        pos[i3 + 1] = -6 + Math.random() * 8;
        pos[i3 + 2] = (Math.random() - 0.5) * 8;
        col[i3] = 1.0;
        col[i3 + 1] = 0.5 + Math.random() * 0.5;
        col[i3 + 2] = 0.1;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const mat = new THREE.PointsMaterial({ size: 2.4, vertexColors: true, transparent: true, opacity: 0.95 });
    const sparks = new THREE.Points(geo, mat);
    scene.add(sparks);
    return sparks;
}
const sparks = createSparks();

// Responsive resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Scroll parallax: move camera and background subtly
function onScroll() {
    const t = document.body.getBoundingClientRect().top;
    // move camera slightly for parallax
    camera.position.z = 80 + t * -0.02;
    camera.position.x = t * -0.0008;
    // move background sphere if present
    if (bgSphere) bgSphere.position.y = t * -0.02;
}
document.body.onscroll = onScroll;

// Animation loop
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    const dt = clock.getDelta();
    const t = clock.getElapsedTime();

    // moon rotation
    moon.rotation.y += dt * 0.03;
    moon.rotation.x += dt * 0.002;

    // gear rotations (interlocking feel)
    bigGear.rotation.z += dt * 0.08;
    midGear.rotation.z -= dt * 0.12;
    smallGear.rotation.z += dt * 0.16;

    // sparks drift upward slightly
    sparks.rotation.y = Math.sin(t * 0.6) * 0.02;
    // twinkle stars by modulating material size
    stars.material.size = 1.2 + Math.sin(t * 1.4) * 0.6;

    controls.update();
    renderer.render(scene, camera);
}
animate();

// Expose for debug (optional)
window.__STEAMPUNK_SCENE = { scene, camera, renderer };

