import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// scene, camera, enderer, lights
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

let mixer;
let lowerSignMesh;

const loader = new GLTFLoader();
loader.load('./assets/sign.glb', (glb) => {
    console.log('Model loaded successfully:', glb);

    glb.scene.traverse((child) => {
        if (child.isMesh) 
        {
            child.material = child.material.clone();
        }
    });

    const traverseArmature = (object) => {
        if (object.isMesh && object.name === 'button') 
        {
            lowerSignMesh = object;
            object.userData.onClick = () => {
                action.reset();
                action.play();
            };
        }
    };

    glb.scene.traverse((child) => {
        if (child.isObject3D && child.name === 'Armature') 
        {
            child.traverse(traverseArmature);
        }
    });

    scene.add(glb.scene);
    mixer = new THREE.AnimationMixer(glb.scene);
    const action = mixer.clipAction(glb.animations[0]);

    action.setLoop(THREE.LoopOnce, 1);

}, undefined, (error) => {
    console.error('Error loading model:', error);
});

//camera position
camera.position.z = 1.5;
camera.position.x = 0
camera.position.y = 1;

let lastTime = 0;
const animate = (time) => {
    const deltaTime = time - lastTime;
    lastTime = time;

    requestAnimationFrame(animate);
    
    if (mixer) mixer.update(deltaTime / 1000);
    renderer.render(scene, camera);
};

// Handle window resize
const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
};

// Listen for window resize events
window.addEventListener('resize', handleResize);

const onClick = (event) => {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) 
    {
        const clickedObject = intersects[0].object;
        if (clickedObject.userData.onClick) 
        {
            clickedObject.userData.onClick();
        }
    }
};

document.addEventListener('click', onClick);

animate();

//background image
const textureLoader = new THREE.TextureLoader();
scene.background = textureLoader.load('./assets/green.png');
