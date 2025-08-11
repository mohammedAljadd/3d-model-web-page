import * as THREE from 'three';



// Setup a camera
const fov = 75;
const aspect = window.innerWidth / window.innerHeight;  // the canvas default
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(-15, -15, 20);
camera.lookAt(0, 0, 0);

// To see object from above
camera.position.z = 10;


//