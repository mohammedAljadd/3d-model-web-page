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
camera.position.set(3, -10, 5);
camera.lookAt(0, 0, 0);

controls.update(); //controls.update() must be called after any manual changes to the camera's transform

// Our scene
const scene = new THREE.Scene();

// Add axis helpers
const axesHelper = new THREE.AxesHelper(45);
scene.add(axesHelper);

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
const spotLight = new THREE.SpotLight(0xffffff, 250);
spotLight.position.set(15, -50, 20);
spotLight.decay = 1;
spotLight.distance=75;
spotLight.penumbra = 0.1
spotLight.angle = Math.PI / 8;



scene.add(spotLight.target);







// Even listners
const intensitySlider = document.getElementById('intensity');
const intensityDisplay = document.getElementById('intensityValue');

intensitySlider.addEventListener('input', () => {
  const value = Number(intensitySlider.value);
  intensityDisplay.textContent = value;
  spotLight.intensity = value;  
});


const lightXSlider = document.getElementById('lightX');
const lightXDisplay = document.getElementById('lightXValue');

lightXSlider.addEventListener('input', () => {
  const value = Number(lightXSlider.value);
  lightXDisplay.textContent = value;
  spotLight.position.x = value;  
});


const lightYSlider = document.getElementById('lightY');
const lightYDisplay = document.getElementById('lightYValue');

lightYSlider.addEventListener('input', () => {
  const value = Number(lightYSlider.value);
  lightYDisplay.textContent = value;
  spotLight.position.y = value;  
});



const lightZSlider = document.getElementById('lightZ');
const lightZDisplay = document.getElementById('lightZValue');

lightZSlider.addEventListener('input', () => {
  const value = Number(lightZSlider.value);
  lightZDisplay.textContent = value;
  spotLight.position.z = value;  
});


// Add helper to better position the spotlight
const helper = new THREE.SpotLightHelper(spotLight);
scene.add(helper);

scene.add(spotLight);



function animate() {

	requestAnimationFrame( animate );

  helper.update();
	renderer.render( scene, camera );

}

animate();
