
import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Scene container for all objects
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// Renderer: use the canvas with class `bg` from the HTML
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('.bg'),
});

// Setup renderer and camera
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 30;

// Add a torus to the scene
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

// adding light
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff, 1); // soft ambient light
scene.add( pointLight, ambientLight);
 

// adding helper
const lighthelper = new THREE.PointLightHelper(pointLight,1);
const gridhelper = new THREE.GridHelper(200, 50);
scene.add(lighthelper, gridhelper)


// orbit controls
const controll = new OrbitControls(camera, renderer.domElement);



// Handle resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    torus.rotation.x += 0.01;
    torus.rotation.y += 0.005;
    torus.rotation.z += 0.01;
    controll.update();
    renderer.render(scene, camera);
}

animate();





