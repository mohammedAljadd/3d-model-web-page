import * as THREE from 'three';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';


// Renderer
const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({antialias: true, canvas});

// Setup a camera
const fov = 75;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

// Seeing the house from a good angle
camera.position.set(-15, -15, 20);
camera.lookAt(0, 0, 0);


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
        console.log(objPath)
        objLoader.load(objPath, (root) => {
            scene.add(root);
        });

    }
  }
);


renderer.render(scene, camera);

