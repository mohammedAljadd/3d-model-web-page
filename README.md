# ⬢ HouseViz3D

3D interactive house visualization built with `Three.js`, that allows users to explore a detailed house model with lighting, weather effects, and immersive controls.

![Three.js](https://img.shields.io/badge/Three.js-r179-cyan)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-green)
![Status](https://img.shields.io/badge/Status-Live%20Demo-brightgreen)



## 🌟 Features

### 🏠 Interactive 3D Model

- **3D house model** : Includes two floors with rooms, walls, stairs, and glass windows
- **Realistic textures** : Brick walls, roof tiles, wooden doors, and grass terrain
- **Door controllers** : Open and close multiple doors `independently`


### 🎥 Dynamic Camera System

- **View Modes** : Switch between Front, Top, and Back views
- **Orbit Controls** : Camera movement with mouse controls
- **Guided House Tour** : Automated walkthrough from the front door to the back of the house

### 🌤️ Weather & Lighting Effects


- **Day Cycle** : Clear sky and bright sun
- **Evening Mode** :Warm golden-hour lighting
- **Night Cycle** : Moonlit sky with stars
- **Rain System** : Animated rainfall with ambient sound effects
- **Thunderstorm** : Lightning flashes with thunder sounds

### 🔊 Audio Integration

- **Night Sounds**:Iinsect sounds for nighttime atmosphere
- **Rain**: rainfall sound
- **Thunderstorm**: Thunder sound effects

## 🛠️ Technologies Used

- **Three.js (r128)**: Primary framework used for rendering the 3D house model
- **Bootstrap 5**: For styling of the interface


## 🚀 Getting Started


### Prerequisites

 - **Node.js v22.11.0**
 - **npm 11.4.2**

### Installation


#### 1. Clone the repository:

```bash
git clone https://github.com/mohammedAljadd/3d-model-web-page
cd 3d-model-web-page
```

#### 2. Install packages:

```bash
npm install
```

#### 3. Run server:

```bash
npx vite
```

#### 4. Open URL
- Navigate to http://localhost:5173/


## File Structure

```
3d-model-web-page/
├── index.html          # Main HTML file
├── main.js             # Three.js application
├── utils.js            # Utility functions
├── house.gltf          # 3D house model (.gltf)
├── textures/           # Texture assets
├── audios/             # Audio files
└── favicon_io/         # Favicon assets
```
## 📜 Guide

- **Door Controls** :

  - Open Front Door: Main entrance access
  - Open Inner Door: Interior door between rooms
  - Open Back Door: Rear exit of the house

- **View Controls** :

  - Top View: See the entire house from above
  - Front View: Look at the house from the front side
  - Back View: View the house from the Back side

- **Weather Controls** :

  - Start Rain: Activates animated rainfall with sound
  - Start Thunderstorm: Lightning and thunder effects

- **Time Controls** :

  - Switch to Evening: Golden hour lighting
  - Switch to Night: Night mode with interior lighting and stars

- **Special Features** :

  - Animate: Rotate the house 360°
  - House Tour: Automated guided walkthrough of rooms and floors


## 🏠 3D Model

The house model used in this project is based on the [**Civitas Modular House 3x3 LV1-001**](https://grabcad.com/library/civitas-modular-house-3x3-lv1-001-1) from GrabCAD.


### 🔧 Pre-processing in Blender

Before importing into Three.js, the model was optimized and modified in Blender to improve performance and interactivity:

- **Separate Doors** – The original model treated all doors as a single object. They were separated into individual objects to enable proper opening and closing animations.

- **UV Mapping for Textures** – Applied UV mapping to walls, doors, and the roof to ensure textures display correctly in the 3D scene.

- **Rescaling** – The model was very large in Three.js coordinates, so it was scaled down by 0.001 in Blender. (This scaling could also be done directly in Three.js if preferred.)

- **Format Conversion** – Instead of working with 24 separate .obj files, the model was combined and exported as a single .glTF file for better loading performance and easier asset management.


## ✨ See it in Action

[Live Demo](https://mohammedaljadd.github.io/3d-model-web-page/)


## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📧 Contact

Mohammed Al Jadd


**LinkedIn:** [@aljadd](https://www.linkedin.com/in/aljadd)

**GitHub:** [@mohammedAljadd](https://github.com/mohammedAljadd)


