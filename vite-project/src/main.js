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
const controls = new OrbitControls(camera, document.body);



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

    controls.update(); // required when enableDamping or autoRotate is used

    renderer.render(scene, camera);
}

animate();

// add starts
function addStar() {
    const starTexture = new THREE.TextureLoader().load('icons/integration_instructions_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg')
    const star = new THREE.Mesh(
        new THREE.BoxGeometry(5,5,5),
        new THREE.MeshBasicMaterial({ map: starTexture})
    );

    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(200));
    
    star.position.set(x, y, z);
    scene.add(star);
}

Array(300).fill().forEach(addStar);

// background image
const spaceTexture = new THREE.TextureLoader().load('icons/pexels-francesco-ungaro-998641.jpg');
scene.background = spaceTexture;


const devtexture = new THREE.TextureLoader().load('icons/integration_instructions_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg');
const dev = new THREE.Mesh(
new THREE.BoxGeometry(3,3,3),
new THREE.MeshBasicMaterial({ map: devtexture})
)
scene.add(dev);

const moonTexture = new THREE.TextureLoader().load('icons/c27c5113-c349-4de3-9ed9-2f69dd86af5b.jpg');
const  moon = new THREE.Mesh(
    new THREE.SphereGeometry(10,10,10),
    new THREE.MeshStandardMaterial({map: moonTexture})
)
scene.add(moon);

moon.position.z = 40;
moon.position.setX(-10);


// move camera while scrolling page
function movecamera(){
     const t = document.body.getBoundingClientRect().top;
        moon.rotation.x += 0.05;
        moon.rotation.y += 0.075;
        moon.rotation.z += 0.05;
        dev.rotation.y += 0.01;
        dev.rotation.z += 0.01;
        
        camera.position.z = t * -0.01;
        camera.position.x = t * -0.0002;
        camera.position.y = t * -0.0002;
};

document.body.onscroll = movecamera;
