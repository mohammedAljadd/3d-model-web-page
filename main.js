import * as THREE from 'three';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Renderer
const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({antialias: true, canvas});

// Better resolution
renderer.setSize( window.innerWidth, window.innerHeight );





// Setup a camera
const fov = 75;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);


// Controls
const controls = new OrbitControls( camera, renderer.domElement );


// Seeing the house from a good angle
camera.position.set(-15, -15, 20);
camera.lookAt(0, 0, 0);

controls.update(); //controls.update() must be called after any manual changes to the camera's transform

// Our scene
const scene = new THREE.Scene();


// To load obj files
const objLoader = new OBJLoader();

// Fetch obj files from express
fetch('http://localhost:3000/obj-files')
  .then(res => res.json())
  .then(files => {

    for(const file of files){
        const objPath = "exports/"+file;
        objLoader.load(objPath, (root) => {
            const material = new THREE.MeshStandardMaterial({color: 0xed0713});
            root.scale.setScalar(0.001);
            
            // Travserse group children (Mesh)
            root.traverse(child => {
                if(child.isMesh){
                    child.material = material;
                }
            })

            scene.add(root);
        });

    }
  }
);


// Add light
const color = 0xFFFFFF;
const intensity = 100;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(-15, -15, 20);
scene.add(light);

function animate() {

	requestAnimationFrame( animate );


	renderer.render( scene, camera );

}

animate();