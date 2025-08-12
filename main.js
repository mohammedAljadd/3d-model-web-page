import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';



// File paths



// Renderer
const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
renderer.setClearColor( 0x91daff, 1);

// Better resolution
renderer.setSize( window.innerWidth, window.innerHeight );





// Setup a camera
const fov = 75;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 2000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);


// Controls
const controls = new OrbitControls( camera, renderer.domElement );


// Seeing the house from a good angle
camera.position.set(-10, -25, 20);
camera.lookAt(0, 0, 0);

controls.update(); //controls.update() must be called after any manual changes to the camera's transform

// Our scene
const scene = new THREE.Scene();

// Add axis helpers
const axesHelper = new THREE.AxesHelper(45);
scene.add(axesHelper);

// To load GLTF files
const gltfLoader = new GLTFLoader();

const file = "house.gltf";

gltfLoader.load(file, (gltf) => {
  const root = gltf.scene;

  root.scale.setScalar(0.001);
  
  // Travserse group children (Mesh)
  root.traverse(child => {
    const material = new THREE.MeshStandardMaterial({color: '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')});
  
    if(child.isMesh){
      child.material = material;
    }
  })

  scene.add(root);
  });





// Add light
const spotLight = new THREE.SpotLight(0xffffff, 250);
spotLight.position.set(15, -50, 20);
spotLight.decay = 1;
spotLight.distance=75;
spotLight.penumbra = 0.1;
const degrees = 35;
spotLight.angle = degrees * (Math.PI / 180);



scene.add(spotLight.target);


// Ambient light 
const light = new THREE.AmbientLight( 0x404040 );
light.intensity = 2;
scene.add( light );




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



const lightAngleSlider = document.getElementById('lightAngle');
const lightAngleDisplay = document.getElementById('lightAngleValue');

lightAngleSlider.addEventListener('input', () => {
  const value = Number(lightAngleSlider.value);
  lightAngleDisplay.textContent = value;
  spotLight.angle = value * (Math.PI / 180); 
});


document.getElementById('topView').addEventListener('click', () => {
    camera.position.set(0, 0, 35);
    controls.update();
});

document.getElementById('frontView').addEventListener('click', () => {
    camera.position.set(0, -35, 5);
    controls.update();
});



// Add helper to better position the spotlight
const helper = new THREE.SpotLightHelper(spotLight);
scene.add(helper);

scene.add(spotLight);


const texture = new THREE.TextureLoader().load( "textures/grass-min.png" );
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set( 100, 100 );

// Create a flat surface
const geometry = new THREE.PlaneGeometry( 1000, 1000 );
const material = new THREE.MeshStandardMaterial({ map: texture });
const plane = new THREE.Mesh( geometry, material );

scene.add( plane );



function animate() {

	requestAnimationFrame( animate );

  helper.update();
	renderer.render( scene, camera );

}

animate();

