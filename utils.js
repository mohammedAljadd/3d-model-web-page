import * as THREE from 'three';

export function loadAudio(file, loop = true, volume = 0.5, listener) {
    const audioLoader = new THREE.AudioLoader();
    const sound = new THREE.Audio(listener);
    audioLoader.load(file, buffer => {
        sound.setBuffer(buffer);
        sound.setLoop(loop);
        sound.setVolume(volume);
    });
    return sound;
}


export function prepareTextureMaterial(file, repeatFactor){
    const texture = new THREE.TextureLoader().load(file);
    
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    
    texture.rotation = Math.PI / 2; 
    texture.repeat.set(repeatFactor, repeatFactor);
    var material = new THREE.MeshStandardMaterial( { map: texture } );
    return material;
}



export function doorPivotSetup(doorName, house, doorPivots) {
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



export function createSphere(color, x, y, z, radius){
    
    const geometry = new THREE.SphereGeometry(radius, 32, 16);
    const material = new THREE.MeshBasicMaterial({
      color: color
    });
    const mesh = new THREE.Mesh(geometry, material);
    
    mesh.position.set(x, y, z);
    return mesh;
}


export function toggleOpenDoor(doorPosition, doorPivots, angle){
    // doorPosition : Front, Inner, Back
    const button = document.getElementById('open'+doorPosition+'Door');
    let isDoorClosed = true;
    button.addEventListener('click', () => {
    const doorPivot = doorPivots[doorPosition+"_Door"];
    if(!doorPivot) {
        console.warn('Door pivot not initialized yet');
        return;
    }


    if (isDoorClosed) {
        
        doorPivot.rotation.z = angle;
        isDoorClosed = false;
        button.textContent = 'Close '+ doorPosition+ ' Door';
    } else {
        doorPivot.rotation.z = 0;
        isDoorClosed = true;
        button.textContent = 'Open '+ doorPosition+ ' Door';
    }
    });
}


export function createLampost(x, y, lampHight){
    const postGeometry = new THREE.BoxGeometry(0.3, 0.3, lampHight);
    const postMaterial = new THREE.MeshStandardMaterial({color: 0xf5dedc});
    const lampPost = new THREE.Mesh(postGeometry, postMaterial);
    lampPost.position.set(x, y, lampHight/2);
    return lampPost;
}