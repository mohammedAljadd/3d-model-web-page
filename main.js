import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
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


// To load GLTF files
const gltfLoader = new GLTFLoader();

// Fetch .gltf files from express
fetch('http://localhost:3000/obj-files')
  .then(res => res.json())
  .then(files => {

    for(const file of files){
        const objPath = "gltf_files/"+file;
        
        gltfLoader.load(objPath, (gltf) => {
            const root = gltf.scene;

            const material = new THREE.MeshStandardMaterial({color: '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')});
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
const intensity = 2;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(-15, -15, 20);
scene.add(light);

function animate() {

	requestAnimationFrame( animate );


	renderer.render( scene, camera );

}

animate();