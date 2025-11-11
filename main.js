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

    this.px = 0;
    this.py = 0;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  getChange() {
    if (!this.held) return [0, 0];

    const dx = this.x - this.px;
    const dy = this.y - this.py;
    this.px = this.x;
    this.py = this.y;

    return [dx, dy];
  }

  click(event) {
    this.held = true;
    this.button = event.button;
    this.setPosition(event.offsetX, event.offsetY);
    this.px = event.offsetX;
    this.py = event.offsetY;
  }

  move(event) {
    this.setPosition(event.offsetX, event.offsetY);
  }

  release(event) {
    this.held = false;
    this.setPosition(event.offsetX, event.offsetY);
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

  rotate(dx, dy) {
    const scale = 0.01;
    this.mesh.rotation.x += scale * dy;
    this.mesh.rotation.y += scale * dx;
  }
}

const origami = new Origami(1, 1);
scene.add(origami.mesh);

const mouse = new Mouse();

camera.position.z = 5;

function animate() {
  const [mdx, mdy] = mouse.getChange();
  origami.rotate(mdx, mdy);

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