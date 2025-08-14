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
camera.position.set(0, -35, 10);
camera.lookAt(0, 0, 0);
controls.update(); //controls.update() must be called after any manual changes to the camera's transform

// Our scene
const scene = new THREE.Scene();

// Add axis helpers
const axesHelper = new THREE.AxesHelper(45);
scene.add(axesHelper);

// To load GLTF file of house
const gltfLoader = new GLTFLoader();
const file = "5_all_doors_sep.gltf";


// Doors are named like this :

// First floor : Front_Door, Inner_Door, Back_Door, Side_Door
// Second floor : Top_Left_Door, Top_Inner_Door_Left, Top_Inner_Door_Right, Top_Right_Door
const angle = Math.PI / 2.5;
// Choose parts to apply texture of brick wall
const wallParts = ["Waende_OG", "Waende_EG"];

const wallTexture = new THREE.TextureLoader().load(
  'textures/brick_red.jpg');

wallTexture.wrapS = THREE.RepeatWrapping;
wallTexture.wrapT = THREE.RepeatWrapping;

wallTexture.rotation = Math.PI / 2; 
wallTexture.repeat.set(50, 50);
var wallMaterial = new THREE.MeshStandardMaterial( { map: wallTexture } );

const dachTexture = new THREE.TextureLoader().load(
  'textures/dach_texture.png');

dachTexture.wrapS = THREE.RepeatWrapping;
dachTexture.wrapT = THREE.RepeatWrapping;

dachTexture.rotation = Math.PI / 2; 
dachTexture.repeat.set(15, 15);
var dachMaterial = new THREE.MeshStandardMaterial( { map: dachTexture } );



const doorTexture = new THREE.TextureLoader().load(
  'textures/door.png');

doorTexture.wrapS = THREE.RepeatWrapping;
doorTexture.wrapT = THREE.RepeatWrapping;

doorTexture.rotation = Math.PI / 2; 
doorTexture.repeat.set(1, 1);


var doorMaterial = new THREE.MeshStandardMaterial( { map: doorTexture } );



 

// Store all door pivots in an object
const doorPivots = {};

let house;


gltfLoader.load(file, (gltf) => {
  house = gltf.scene;
  
  // Travserse group children (Mesh)
  house.traverse(child => {

    
    
    if(child.isMesh){
      child.visible = true;

      if(wallParts.includes(child.name)){
        child.material = wallMaterial;
        child.visible = true;
         
      }

      

      else if(child.name === 'F_Glas'){
        const material = new THREE.MeshStandardMaterial({color: 0xffffff, transparent: true, opacity: 0.5});
        child.material = material;
      }

      else if (child.name === 'Dach'){
        child.material = dachMaterial;
      }

      else if (child.name === 'Wege'){
        const material = new THREE.MeshStandardMaterial({color: 0x5e5d5b});
        child.material = material;
      }
      else if (child.name === 'Platten_Eingang'){
        const material = new THREE.MeshStandardMaterial({color: 0xdbdbdb});
        child.material = material;
      }

      else if (child.name === 'mauer'){
        const material = new THREE.MeshStandardMaterial({color: 0xdbdbdb});
        child.material = material;
        child.visible = true;
      }
      

      else if (child.name.includes('Door')){
        child.material = doorMaterial;
        child.visible = true;
      }



      
      

      

      else{
        const material = new THREE.MeshStandardMaterial({color: 0x3b3434});
        if(child.name==="Treppe"){
          child.visible = true;
        }
        //console.log(child.name);
      child.material = material;
      }
    }
  })

  house.name = 'house';


  doorPivotSetup('Front_Door');
  doorPivotSetup('Back_Door');
  doorPivotSetup('Inner_Door');
  doorPivotSetup('Top_Inner_Door_Left');
  
  

  scene.add(house);
  });
function doorPivotSetup(doorName) {
  if (!house) return null;

  const door = house.getObjectByName(doorName);
  
  if (!door) return null;

  // Pivot group
  const doorPivot = new THREE.Group();
  
  // To get accurate bounding box
  door.updateMatrixWorld();

  // Door's bbox
  const bbox = new THREE.Box3().setFromObject(door);
  
  // Hinge point
  const hingePosition = new THREE.Vector3(
    bbox.min.x,
    bbox.min.y,
    (bbox.min.z + bbox.max.z) / 2 
  );


  
  // converts hingePositin from world coordinates to the house local coordinates
  house.worldToLocal(hingePosition);
  
  
  // Setting pivoot position in the house’s local coordinates
  doorPivot.position.copy(hingePosition);
  
  
  // door original position
  const doorOriginalPosition = door.position.clone();
  
  // temporarily
  house.remove(door);
  
  
  // Adjustong the door position relativly to pivot
  door.position.copy(doorOriginalPosition).sub(hingePosition);
  
  
  // Add door to pivot, after that we  pivot to house
  doorPivot.add(door);
  house.add(doorPivot);

  doorPivots[doorName] = doorPivot;
  
  return doorPivot;
}


// Add sky stars
const MAX_POINTS = 1000;

const bufferGeometry = new THREE.BufferGeometry();

const positions = new Float32Array( MAX_POINTS * 3 );
bufferGeometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );

const drawCount = 1000; 
bufferGeometry.setDrawRange( 0, drawCount );


for ( let i = 0; i < MAX_POINTS; i ++ ) {
    

    const x = ( Math.random() - 0.5 ) * 2000;
    const y = ( Math.random() - 0.5 ) * 2000;
    const z = ( Math.random() ) * 500 + 300;
    positions[i * 3] = x;
    positions[i * 3 + 1] = y; 
    positions[i * 3 + 2] = z;

    

}

// https://threejs.org/docs/#api/en/materials/PointsMaterial
const pointsMaterial = new THREE.PointsMaterial({ color: 0xfffaba, size: 1.5, sizeAttenuation: false  // to keep stars same size at distance or not
});

const starField = new THREE.Points(bufferGeometry, pointsMaterial);


// Adding the moon for night view
let moon_radius = 8;
let moon_x = 0;
let moon_y = 1000; 
let moon_z = 700;

const moonGeometry = new THREE.SphereGeometry(moon_radius, 32, 16);
const moonMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff
});
const moon = new THREE.Mesh(moonGeometry, moonMaterial);

moon.position.set(moon_x, moon_y, moon_z);


// Add sun
let sun_radius = 14;
let sun_x = -100;
let sun_y = 1000; 
let sun_z = 700;

const sunGeometry = new THREE.SphereGeometry(sun_radius, 32, 16);
const sunMaterial = new THREE.MeshBasicMaterial({
  color: 0xf0e80c
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);

sun.position.set(sun_x, sun_y, sun_z);
scene.add(sun);



// Ambient light 
const light = new THREE.AmbientLight( 0x404040 );
light.intensity = 10;
scene.add(light);


// Add bulb lights
const bulbLight1 = new THREE.PointLight(0xf7f181, 1, 5);
bulbLight1.intensity = 50;
bulbLight1.position.set(5, -2, 7);

const bulbLight2 = new THREE.PointLight(0xf7f181, 1, 5);
bulbLight2.intensity = 50;
bulbLight2.position.set(-1, -2, 7);

const bulbLight3 = new THREE.PointLight(0xf7f181, 1, 10);
bulbLight3.intensity = 50;
bulbLight3.position.set(3, -2, 3);



const bulbLight4 = new THREE.PointLight(0xf7f181, 1, 10);
bulbLight4.intensity = 50;
bulbLight4.position.set(-2, -2, 3);


const bulbLight5 = new THREE.PointLight(0xf7f181, 1, 10);
bulbLight5.intensity = 50;
bulbLight5.position.set(-4, -2, 3);





// Even listners
document.getElementById('topView').addEventListener('click', () => {
    camera.position.set(0, 0, 35);
    controls.update();
});

document.getElementById('frontView').addEventListener('click', () => {
    camera.position.set(0, -20, 5);
    controls.update();
});


document.getElementById('backView').addEventListener('click', () => {
    camera.position.set(0, 20, 5);
    camera.up.set(0, 0, 1); // camera got flipped
    controls.update();

});





const animateButton = document.getElementById('animateSceen');

let isAnimating = false;

animateButton.addEventListener('click', () => {
  isAnimating = !isAnimating;
  animateButton.textContent = isAnimating ? 'Stop Animation' : 'Animate';
});



const walkthroughSteps = [
  { position: new THREE.Vector3(3.5, -7, 2), target: new THREE.Vector3(3.5, 7, 2), action: 'openFrontDoor' },
  { position: new THREE.Vector3(3.5, -2.4, 2), target: new THREE.Vector3(3.5, 5, 2), action: 'openInnerDoor' },
  { position: new THREE.Vector3(3.5, 0, 2), target: new THREE.Vector3(-2, 2, 2), action: 'openInnerDoor' },
  { position: new THREE.Vector3(1, 0, 2), target: new THREE.Vector3(1, 5, 3), action: 'Look up stairs' },
  { position: new THREE.Vector3(1, 5, 3), target: new THREE.Vector3(-1, -5, 4), action: 'Claim up first stairs' },
  { position: new THREE.Vector3(0, 5, 3), target: new THREE.Vector3(0, -5, 4), action: 'Look up second stairs' },
  { position: new THREE.Vector3(0, 2, 5), target: new THREE.Vector3(2, -2, 5), action: 'Claim up second stairs' },
  { position: new THREE.Vector3(0, 2, 5), target: new THREE.Vector3(2, -2, 5), action: 'open_Top_Inner_Door_Left' },
  { position: new THREE.Vector3(1, 0, 5), target: new THREE.Vector3(1, -10, 5), action: 'Get close to Top Room' },
  { position: new THREE.Vector3(1, 0, 5), target: new THREE.Vector3(1, -10, 5), action: 'close_Top_Inner_Door_Left' },
  { position: new THREE.Vector3(1, -1, 5), target: new THREE.Vector3(-2.5, -10, 5), action: 'inspect top room' },
  { position: new THREE.Vector3(1, -1, 5), target: new THREE.Vector3(1, 10, 5), action: 'open_Top_Inner_Door_Left' },
  { position: new THREE.Vector3(0, 5, 3), target: new THREE.Vector3(2, -5, 3), action: 'claim down second stairs' },
  { position: new THREE.Vector3(1, 0, 2), target: new THREE.Vector3(2, 5, 2), action: 'claim down first stairs' },
  { position: new THREE.Vector3(3, 0, 2), target: new THREE.Vector3(3, 5, 2), action: 'Look at back door' },
  { position: new THREE.Vector3(3, 0, 2), target: new THREE.Vector3(3, 5, 2), action: 'openBackDoor' },
  { position: new THREE.Vector3(3, 5, 2), target: new THREE.Vector3(3, 10, 2), action: 'Go out from Back' },
  
  
];

let currentStep = 0;

document.getElementById('walkthorw').addEventListener('click', () => {

    

    const step = walkthroughSteps[currentStep];
    console.log(currentStep, " ", step.action);
    // Move camera
    camera.position.copy(step.position);
    controls.target.copy(step.target);
    camera.up.set(0, 0, 1); 
    controls.update();

    if (step.action) {
        const button = document.getElementById(step.action);
        if (button) button.click();
        else if(step.action==='open_Top_Inner_Door_Left'){
          const doorPivot = doorPivots["Top_Inner_Door_Left"];
 
          doorPivot.rotation.z = -angle;
 
          console.log("iner");
        }

        else if(step.action==='close_Top_Inner_Door_Left'){
          const doorPivot = doorPivots["Top_Inner_Door_Left"];
 
          doorPivot.rotation.z = angle;
 
          console.log("iner");
        }
    }

    currentStep = (currentStep + 1) % walkthroughSteps.length;
});




const daynightButton = document.getElementById('toggleDayNight');
let itsDay = true;
daynightButton.addEventListener('click', () => {
  if (itsDay) {
    light.intensity = 1;
    renderer.setClearColor(0x051654, 1) ;
    scene.add(starField);
    scene.add(moon);
    scene.remove(sun);
    scene.add(bulbLight1);
    scene.add(bulbLight2);
    scene.add(bulbLight3);
    scene.add(bulbLight4);
    scene.add(bulbLight5);
    daynightButton.textContent = 'Switch to Day';
  } else {
   
    scene.remove(starField);

    renderer.setClearColor( 0x91daff, 1);
    light.intensity = 5;
    scene.remove(bulbLight1);
    scene.remove(bulbLight2);
    scene.remove(bulbLight3);
    scene.remove(bulbLight4);
    scene.remove(bulbLight5);
    
    scene.remove(moon);
    
     scene.add(sun);
    daynightButton.textContent = 'Switch to Night';
  }
  itsDay = !itsDay;
});








const openFrontDoorButton = document.getElementById('openFrontDoor');
let isDoorClosed = true;
openFrontDoorButton.addEventListener('click', () => {
const doorPivot = doorPivots["Front_Door"];
  if(!doorPivot) {
    console.warn('Door pivot not initialized yet');
    return;
  }


  if (isDoorClosed) {
    doorPivot.rotation.z = angle;
    isDoorClosed = false;
    openFrontDoorButton.textContent = 'Close Front Door';
  } else {
    doorPivot.rotation.z = 0;
    isDoorClosed = true;
    openFrontDoorButton.textContent = 'Open Front Door';
  }
});

const openBackDoorButton = document.getElementById('openBackDoor');
let isBackDoorClosed = true;
openBackDoorButton.addEventListener('click', () => {
const doorPivot = doorPivots["Back_Door"];
  if(!doorPivot) {
    console.warn('Door pivot not initialized yet');
    return;
  }


  if (isBackDoorClosed) {
    doorPivot.rotation.z = angle;
    isBackDoorClosed = false;
    openBackDoorButton.textContent = 'Close Back Door';
  } else {
    doorPivot.rotation.z = 0;
    isBackDoorClosed = true;
    openBackDoorButton.textContent = 'Open Back Door';
  }
});



const openInnerDoorButton = document.getElementById('openInnerDoor');
let isInnerDoorClosed = true;

openInnerDoorButton.addEventListener('click', () => {
  const doorPivot = doorPivots["Inner_Door"];
  if(!doorPivot) {
    console.warn('Door pivot not initialized yet');
    return;
  }

  if (isInnerDoorClosed) {
    doorPivot.rotation.z = angle;
    isInnerDoorClosed = false;
    openInnerDoorButton.textContent = 'Close Inner Door';
  } else {
    doorPivot.rotation.z = 0;
    isInnerDoorClosed = true;
    openInnerDoorButton.textContent = 'Open Inner Door';
  }
});

const texture = new THREE.TextureLoader().load( "textures/grass-min.png" );
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set( 100, 100 );

// Create a flat surface
const geometry = new THREE.PlaneGeometry( 1000, 1000 );
const material = new THREE.MeshStandardMaterial({ map: texture });
const plane = new THREE.Mesh( geometry, material );

scene.add( plane );




// Responsive canvas
function resize() {

	const container = renderer.domElement.parentNode; // canvas parent node, col-10
 
	if( container ) {

  
		const width = container.offsetWidth;
		const height = container.offsetHeight;

		renderer.setSize( width, height );

		camera.aspect = width / height;
		camera.updateProjectionMatrix();

	}

}

window.addEventListener( 'resize', resize );

function animate() {

	requestAnimationFrame( animate );

   if (isAnimating && house) {
        house.rotation.z += 0.01; 
    }

	renderer.render( scene, camera );

}

animate();



