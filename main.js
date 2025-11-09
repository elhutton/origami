import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

class Origami {
  constructor(width, height) {
    this.vertices = [
      -1.0, -1.0, 1.0,
      1.0, -1.0, 1.0,
      1.0, 1.0, 1.0,
      -1.0, 1.0, 1.0,
    ];

    this.faces = [
      0, 1, 2,
      0, 2, 3
    ];

    this.mesh = this.createMesh();
  }

  createMesh() {
    const triangles = [];

    for (let index of this.faces) {
      triangles.push(...this.vertices.slice(index * 3, index * 3 + 3));
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

camera.position.z = 5;

function animate() {
  origami.render();

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);