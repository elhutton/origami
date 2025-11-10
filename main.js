import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

class Mouse {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.held = false;
    this.button = 0;
  }

  click(event) {
    this.held = true;
    this.button = event.button;
    this.x = event.offsetX;
    this.y = event.offsetY;
  }

  move(event) {
    this.x = event.offsetX;
    this.y = event.offsetY;
  }

  release(event) {
    this.held = false;
    this.x = event.offsetX;
    this.y = event.offsetY;
  }
}

class Origami {
  constructor(width, height) {
    this.vertices = [
      -1.0, -1.0, 1.0,
      1.0, -1.0, 1.0,
      1.0, 1.0, 1.0,
      -1.0, 1.0, 1.0,
    ];

    this.faces = [
      [0, 1, 2, 3]
    ];

    this.mesh = this.createMesh();
  }

  triangulateFace(face) {
    const triangles = [];

    for (let i = 1; i < face.length; i++) {
      triangles.push(face[0], face[i], face[i + 1]);
    }

    return triangles;
  }

  createMesh() {
    const triangles = [];

    for (let face of this.faces) {
      const triangulated = this.triangulateFace(face);
      for (let index of triangulated) {
        triangles.push(...this.vertices.slice(index * 3, index * 3 + 3));
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(triangles), 3));

    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    material.side = THREE.DoubleSide;
    const mesh = new THREE.Mesh(geometry, material);

    return mesh;
  }

  render() {
    this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.01;
  }
}

const origami = new Origami(1, 1);
scene.add(origami.mesh);

const mouse = new Mouse();

camera.position.z = 5;

function animate() {
  origami.render();

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

renderer.domElement.addEventListener("mousedown", function(event) {
  mouse.click(event);
});

renderer.domElement.addEventListener("mousemove", function (event) {
  mouse.move(event);
});

renderer.domElement.addEventListener("mouseup", function (event) {
  mouse.release(event);
});