import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadAudio, prepareTextureMaterial, doorPivotSetup, createSphere, toggleOpenDoor} from './utils.js';


// ------------------------------------------------- Base config for Three.js -----------------------------------------------------------
// Renderer
const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
renderer.shadowMap.enabled = true;
renderer.setClearColor( 0x1aa4eb, 1);

// For better resolution
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
// must be called after any manual changes to the camera's transform
controls.update(); 





// ------------------------------------------------- Prepre Audios used -----------------------------------------------------------
// Create an audio listener
const listener = new THREE.AudioListener();
camera.add( listener );


// Prepare sounds for : night, rain, thunderstorm
const nightSound = loadAudio('audios/Nights_sound.mp3', true, 0.5, listener);
const rainSound = loadAudio('audios/rain_sound.mp3', true, 0.5, listener);
const thunderSound = loadAudio('audios/thunder_sound.mp3', false, 0.5, listener);




// Our scene
const scene = new THREE.Scene();










// Choosen parts to apply texture of brick wall
const wallParts = ["Waende_OG", "Waende_EG"];



// ------------------------------------------------ Textures -------------------------------------------------------------
// Wall texture
var wallMaterial = prepareTextureMaterial('textures/brick_red.jpg', 50)

// Dach texture
var dachMaterial = prepareTextureMaterial('textures/dach_texture.png', 15)

// Door texture
var doorMaterial = prepareTextureMaterial('textures/door.png', 1)

// Grass texture
const grassTexture = prepareTextureMaterial("textures/grass-min.png", 100)
const geometry = new THREE.PlaneGeometry( 1000, 1000 );
const plane = new THREE.Mesh( geometry, grassTexture );
scene.add( plane );


 




// ------------------------------------------------- Load the 3d Model -----------------------------------------------------------
// gltf file of the 3d Model
const gltfLoader = new GLTFLoader();
const file = "house.gltf";

// Store all door pivots in an object, serve to properly rotate doors
const doorPivots = {};
let house;


gltfLoader.load(file, (gltf) => {
  house = gltf.scene;
  
  // Travserse group children (Mesh)
  house.traverse(child => {

    
    if(child.isMesh){
      child.visible = true;

      // To revent light from goign thow objects : https://threejs-journey.com/lessons/shadows#how-to-activate-shadows
      child.castShadow = true;
      child.receiveShadow = true;

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
      child.material = material;
      }
    }
  })
  
  

  house.name = 'house';


  // Prepare pivots for doors
  doorPivotSetup('Front_Door', house, doorPivots);
  doorPivotSetup('Back_Door', house, doorPivots);
  doorPivotSetup('Inner_Door', house, doorPivots);
  doorPivotSetup('Top_Inner_Door_Left', house, doorPivots);
  
  
  scene.add(house);
});



// ---------------------------------------------------- Sky Stars ----------------------------------------------------

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




// ---------------------------------------------------- Rains ----------------------------------------------------
const rains_points = 1000;
const rainrGeometry = new THREE.BufferGeometry();
const rainPositions = new Float32Array( MAX_POINTS * 3 * 2); // each line has two points
rainrGeometry.setAttribute( 'position', new THREE.BufferAttribute( rainPositions, 3 ) );

for ( let i = 0; i < rains_points; i ++ ) {
    const x = ( Math.random() - 0.5 ) * 200;
    const y = ( Math.random() - 0.5 ) * 200;
    const z = ( Math.random() ) * 50 + 30;
    // Point above
    rainPositions[i * 6] = x;
    rainPositions[i * 6 + 1] = y; 
    rainPositions[i * 6 + 2] = z;
    // Point bellow
    rainPositions[i * 6 + 3] = x; 
    rainPositions[i * 6 + 1 + 3] = y; 
    rainPositions[i * 6 + 2 + 3] = z - 2.5; // lengh of line
}
const rainMaterial = new THREE.LineBasicMaterial({ color: 0x96dafa, transparent: true, opacity: 0.75
});

const rain = new THREE.LineSegments(rainrGeometry, rainMaterial);


// ---------------------------------------------------- Thunderstormes ----------------------------------------------------
// Thunderstormes : connected white lines
const thunderPoints = 20;
const thunderMaterial = new THREE.LineBasicMaterial( { color: 0xd7effa } );
const thunderGeometry = new THREE.BufferGeometry();
const thnderpositions = new Float32Array( thunderPoints * 3 ); 
thunderGeometry.setAttribute( 'position', new THREE.BufferAttribute( thnderpositions, 3 ) );
thunderGeometry.setDrawRange( 0, thunderPoints );
const thunderLine = new THREE.Line( thunderGeometry, thunderMaterial );
scene.add( thunderLine );
const positionAttribute = thunderLine.geometry.getAttribute( 'position' );
thunderLine.geometry.setDrawRange( 0, 0 );





// Add Sun and Moon
const moon = createSphere(0xffffff, 0, 700, 500, 6);
const sun = createSphere(0xf0e80c,  -100, 1000, 700, 12);
scene.add(sun);


// Ambient light 
const light = new THREE.AmbientLight( 0x404040 );
light.intensity = 10;
scene.add(light);


// Add bulb lights
// Need to activate shadow to prevent light from goign thorw objects : https://threejs-journey.com/lessons/shadows#how-to-activate-shadows
const bulbColor = 0xf7f181;
const bulbConfigs = [
  { intensity: 50, distance: 3, position: [4.5, -2, 5.5] }, // top right
  { intensity: 50, distance: 5, position: [-0.7, -2, 6] }, // top left
  { intensity: 25, distance: 10, position: [3, -5, 3] }, // Porch light
  { intensity: 50, distance: 10, position: [-5.5, -4.5, 3] }, // left bottom room
  { intensity: 50, distance: 10, position: [-5.5, 1, 3] }, // left bottom back room
  { intensity: 50, distance: 10, position: [-2, -2.8, 2] },
  { intensity: 50, distance: 10, position: [1, 0, 2] }, // left bottom back room
  { intensity: 50, distance: 20, position: [0, 0, 8] }, // look at second stairs
  { intensity: 30, distance: 10, position: [3, 2, 2] }, // left bottom back room
  { intensity: 30, distance: 10, position: [3.5, -2, 2] }, // near inner door
];

const bulbLights = bulbConfigs.map(config => {
  const light = new THREE.PointLight(bulbColor, 1, config.distance);
  light.intensity = config.intensity;
  light.position.set(...config.position);
  light.castShadow = true;
  return light;
});


// ----------------------------------------------------------- Even listners -----------------------------------------------------------

// --- Views controll
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



// --- Animation controll
const animateButton = document.getElementById('animateSceen');
let isAnimating = false;
animateButton.addEventListener('click', () => {
  isAnimating = !isAnimating;
  animateButton.textContent = isAnimating ? 'Stop Animation' : 'Animate';
});



// --- House Toor controll
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

// Angle of rotation of the door
const angle = Math.PI / 2.5;
document.getElementById('walkthorw').addEventListener('click', () => {

    const step = walkthroughSteps[currentStep];
    
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
        }

        else if(step.action==='close_Top_Inner_Door_Left'){
          const doorPivot = doorPivots["Top_Inner_Door_Left"];
          doorPivot.rotation.z = angle;
        }
    }

    currentStep = (currentStep + 1) % walkthroughSteps.length;
});


// --- Night view
const daynightButton = document.getElementById('toggleDayNight');
let itsDay = true;
daynightButton.addEventListener('click', () => {

  if(dayEveningButton.textContent === 'Switch to Day'){
    dayEveningButton.click();
  }

  if (itsDay) {
    light.intensity = 1;
    renderer.setClearColor(0x051654, 1) ;
    scene.add(starField);
    scene.add(moon);
    scene.remove(sun);
    bulbLights.forEach(light => scene.add(light));
    nightSound.play();
    daynightButton.textContent = 'Switch to Day';
  } 
  else {
    scene.remove(starField);
    renderer.setClearColor( 0x91daff, 1);
    light.intensity = 5;
    bulbLights.forEach(light => scene.remove(light));
    scene.remove(moon);
    nightSound.pause();
    scene.add(sun);
    daynightButton.textContent = 'Switch to Night';
  }
  itsDay = !itsDay;
});



// --- Evening view
const dayEveningButton = document.getElementById('toggleDayEvening');
let isDay = true;
dayEveningButton.addEventListener('click', () => {

  if(daynightButton.textContent === 'Switch to Day'){
    daynightButton.click();
  }

  if (isDay) {
    light.intensity = 3;
    renderer.setClearColor(0x2f51cc, 1) ;
    dayEveningButton.textContent = 'Switch to Day';
    sun.position.z -= 500;
    sun.material.color.set(0xbf8d04);
  } 
  else {
    renderer.setClearColor( 0x91daff, 1);
    light.intensity = 5;
    sun.position.z += 500;
    dayEveningButton.textContent = 'Switch to Evening';
    sun.material.color.set(0xf0e80c);
  }
  isDay = !isDay;
});


// --- Toggle Open door Controll
toggleOpenDoor('Front', doorPivots, angle);

toggleOpenDoor('Inner', doorPivots, angle);

toggleOpenDoor('Back', doorPivots, angle);


// --- Rain Controll
const rainItButton = document.getElementById('rainIt');
let isRaining = false;
rainItButton.addEventListener('click', () => {

  if (isRaining) {
    isRaining = false;
    scene.remove(rain);
    rainSound.pause();
    rainItButton.textContent = 'Start Rain';
  } else {
    isRaining = true;
    scene.add(rain);
    rainSound.play();
    rainItButton.textContent = 'Stop Rain';
  }
});



// --- Thunderstormes Controll
let showThunderstormes = false;
const thunderButton = document.getElementById('startThunderstorm');

thunderButton.addEventListener('click', () => {
  showThunderstormes = true;
let x = 0, y = 1000, z = 700;

for ( let i = 0; i < positionAttribute.count; i ++ ) {
    
    positionAttribute.setXYZ( i, x, y, z );

    x += ( Math.random() - 0.5 ) * 100;
    y += ( Math.random() - 0.5 ) * 30;
    z += -( Math.random() ) * 100;

}
thunderSound.play();
positionAttribute.needsUpdate = true;

});



// Make canvas responsive
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



// To controll thunderstormes
let thunderCounter = 0;
let currentThunderPoints = 0;
let nFrames = 3; // show a thunder line each nFrames
let thunderDuration = 5;


// Animation function
function animate() {
    requestAnimationFrame(animate);

    if (isAnimating && house) {
        house.rotation.z += 0.01; 
    }

    thunderCounter += 1;
    if (thunderCounter >= nFrames && currentThunderPoints < thunderPoints + thunderDuration && showThunderstormes) {
        currentThunderPoints++;
        thunderLine.geometry.setDrawRange(0, currentThunderPoints);
        thunderCounter = 0; // Reset counter
    }
    else if(currentThunderPoints>=thunderPoints){
      currentThunderPoints = 0;
      showThunderstormes = false;
      thunderLine.geometry.setDrawRange(0, 0);
    }

    if (isRaining) {
        const positions = rain.geometry.attributes.position.array;
        for (let i = 0; i < rains_points; i++) {
            positions[i * 6 + 2] -= 0.6;
            positions[i * 6 + 5] -= 0.6;
            
            if (positions[i * 6 + 5] <= 0) {
                positions[i * 6 + 2] = Math.random() * 50 + 20;
                positions[i * 6 + 5] = positions[i * 6 + 2] - 2.5;
            }
        }
        rain.geometry.attributes.position.needsUpdate = true;
    }

    renderer.render(scene, camera);
}

animate();