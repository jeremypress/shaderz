import * as THREE from "three"; // ThreeJS
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"; // Orbit controls

import vertex from "./shaders/vertex.glsl"; // A shader that handles the processing of individual vertices
import fragment from "./shaders/fragment.glsl"; // A shader that handles the processing of colors

let controls: OrbitControls;
let material: THREE.ShaderMaterial;
let renderer: THREE.WebGLRenderer;
let scene: THREE.Scene;
let geometry: THREE.PlaneGeometry;
let camera: THREE.Camera;

const data = {
  mouse: { x: 0, y: 0, k: 0.01 },
  progress: 0,
  speed: 0.05,
};

function animate() {
  requestAnimationFrame(animate);

  /** Update uniform values */
  material.uniforms.uTime.value += data.speed;

  controls.update();
  renderer.render(scene, camera);
}

export default () => {
  /** Create a renderer */
  const canvas = document.querySelector("#canvas");
  console.log(document);
  console.log(canvas);
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: false,
  });
  renderer.setPixelRatio(window.devicePixelRatio); // Set device pixel ratio
  renderer.setSize(window.innerWidth, window.innerHeight); // Resize renderer
  renderer.setClearColor("#0F111A", 1); // WebGL background color

  /** Setup a perspective camera */
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.001,
    1000
  );
  camera.position.set(0, 0, 2);

  /** Setup a camera controller */
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  /** Setup a scene */
  scene = new THREE.Scene();

  /** Generate a plane geometry */
  geometry = new THREE.PlaneGeometry(1, 1, 32, 32);

  /** Create a material rendered with custom shaders */
  material = new THREE.ShaderMaterial({
    extensions: {
      derivatives: "#extention GL_OES_standard_derivatives : enable",
    },
    uniforms: {
      // uAspectRatio: { value: new THREE.Vector2(1, 1) },
      // uMouse:       { value: new THREE.Vector2(data.mouse.x, data.mouse.y) },
      // uProgress:    { value: data.progress },
      // uTexture:     { value: texture },
      uTime: { value: 0 },
    },
    side: THREE.DoubleSide,
    wireframe: true,
    // transparent: true,
    vertexShader: vertex,
    fragmentShader: fragment,
  });

  /** Setup a triangular polygon mesh */
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  /** Window resize event handler */
  const resize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.aspect = window.innerWidth / window.innerHeight;
    // camera.fov = 2 * (180 / Math.PI) * Math.atan(1 / (2 * camera.position.z)) // Move the camera to fit a mesh to the screen
    // camera.fov = 2 * Math.atan((window.innerHeight / 2) / camera.position.z) * (180 / Math.PI) // Make the dimensions of the canvas the same as the document (1 === 1px)
    camera.updateProjectionMatrix();
  };
  resize();
  window.addEventListener("resize", resize);

  animate();
};
