/* =========================================================
   avatar.js — Three.js 3D avatar with mouse-following head + eyes
   · loads a glTF/glb model from data-src on #avatar-stage
   · mint key light + warm ivory fill matching the editorial palette
   · soft head rotation + independent eye tracking (Ready Player Me rigs)
   · idle breathing when the cursor is far / not present
   · pauses when off-screen (IntersectionObserver)
   · falls back gracefully if the model fails to load
   ========================================================= */

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const stage = document.getElementById('avatar-stage');
if (!stage) throw new Error('avatar-stage missing');

const fill   = stage.querySelector('[data-avatar-fill]');
const loader = stage.querySelector('.avatar-loader');
const err    = stage.querySelector('.avatar-error');

const AVATAR_URL = stage.dataset.src;
if (!AVATAR_URL) {
  if (err) err.classList.add('is-shown');
}

/* ---------- scene ---------- */
const scene = new THREE.Scene();
scene.background = null;

// Camera framing is computed once the model loads (so it works for any GLB)
const camera = new THREE.PerspectiveCamera(32, 1, 0.05, 50);
camera.position.set(0, 1.0, 3.0);
camera.lookAt(0, 0.95, 0);

const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true,
  powerPreference: 'high-performance',
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
stage.appendChild(renderer.domElement);

function resize() {
  const w = stage.clientWidth;
  const h = stage.clientHeight;
  if (!w || !h) return;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
resize();
const ro = new ResizeObserver(resize);
ro.observe(stage);

/* ---------- lighting — dramatic but matching the editorial palette ---------- */
const hemi = new THREE.HemisphereLight(0xE8EEF4, 0x0B0F1A, 0.75);
scene.add(hemi);

// strong ivory key from the front-right (the "studio key light")
const key = new THREE.DirectionalLight(0xE8EEF4, 2.2);
key.position.set(2.0, 2.5, 2.2);
scene.add(key);

// mint fill from the left to wrap the face
const fillL = new THREE.DirectionalLight(0x7DD3C0, 1.1);
fillL.position.set(-2.4, 1.2, 1.6);
scene.add(fillL);

// mint rim from behind for separation from the background
const rim = new THREE.DirectionalLight(0x7DD3C0, 1.8);
rim.position.set(0, 1.6, -2.5);
scene.add(rim);

// subtle floor bounce
const bounce = new THREE.PointLight(0x7DD3C0, 0.6, 6);
bounce.position.set(0, 0.1, 1.5);
scene.add(bounce);

const ambient = new THREE.AmbientLight(0x232B3E, 0.6);
scene.add(ambient);

/* ---------- model load ---------- */
let model = null;
let pivot = null;          // wraps `model` for whole-body rotation when no bones
let modelCenter = null;    // world position of model centre
let headBone = null, neckBone = null;
let leftEye = null, rightEye = null;

const gltfLoader = new GLTFLoader();
let visible = true;

// Force-hide the loader after 8 s so it never gets stuck visually
// even if the model is slow / network is flaky.
const loaderTimeout = setTimeout(() => {
  if (loader && !loader.classList.contains('is-done')) {
    loader.classList.add('is-done');
    console.warn('[avatar] loader timed out — hiding spinner');
  }
}, 8000);

if (AVATAR_URL) {
  console.log('[avatar] loading', AVATAR_URL);
  gltfLoader.load(
    AVATAR_URL,
    (gltf) => {
      model = gltf.scene;

      // Frame on head/shoulders — RPM avatars are ~1.7m tall.
      model.position.set(0, 0, 0);
      model.scale.setScalar(1);

      model.traverse((obj) => {
        if (obj.isMesh) {
          obj.castShadow = false;
          obj.receiveShadow = false;
          // keep skin texture warm without going saturated
          if (obj.material && 'roughness' in obj.material) {
            obj.material.roughness = Math.min(0.85, obj.material.roughness ?? 0.7);
          }
        }
        if (obj.isBone) {
          // RPM rigs commonly use these names
          const n = obj.name;
          if (n === 'Head' || n === 'mixamorigHead')  headBone = obj;
          if (n === 'Neck' || n === 'mixamorigNeck')  neckBone = obj;
          if (n === 'LeftEye'  || n === 'mixamorigLeftEye'  || n === 'eyeL') leftEye  = obj;
          if (n === 'RightEye' || n === 'mixamorigRightEye' || n === 'eyeR') rightEye = obj;
        }
      });

      /* ---------- auto-frame & static-mesh fallback ---------- */
      // Apply a Y rotation so the model faces the camera.
      // Source of truth, in priority order:
      //   1. ?rotate=NNN in the URL (live tweaking)
      //   2. data-rotate-y on the stage element
      //   3. 0
      const urlRotate = new URLSearchParams(location.search).get('rotate');
      const rotateDeg = urlRotate != null
        ? parseFloat(urlRotate)
        : parseFloat(stage.dataset.rotateY || '0');
      const rotateY = (rotateDeg || 0) * Math.PI / 180;
      if (rotateY) model.rotation.y = rotateY;
      window.__avatarRotate = (deg) => {
        const r = (deg || 0) * Math.PI / 180;
        if (pivot) pivot.rotation.y = r; else model.rotation.y = r;
        console.log('[avatar] rotated to', deg, 'deg');
      };

      const box = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3(); box.getSize(size);
      const center = new THREE.Vector3(); box.getCenter(center);
      modelCenter = center.clone();

      // If the GLB has no head bone, wrap the model in a pivot at the
      // model's centre so it can rotate around its own waist instead of
      // its feet (otherwise the whole body would swing wildly).
      if (!headBone) {
        pivot = new THREE.Group();
        pivot.position.copy(center);
        model.position.sub(center);   // recentre the model under the pivot
        pivot.add(model);
        scene.add(pivot);
      } else {
        scene.add(model);
      }

      // Camera: head-and-shoulders framed shot (cinematic close-ish)
      // Aim for roughly 65% of the model height visible (head + chest).
      const targetView = size.y * 0.62;
      const fov = camera.fov * Math.PI / 180;
      const distance = (targetView / 2) / Math.tan(fov / 2) + size.z * 0.6;
      // Look at the upper third of the model (where the head sits)
      const lookY = center.y + size.y * 0.32;
      camera.position.set(0, lookY, distance);
      camera.lookAt(0, lookY, 0);
      camera.updateProjectionMatrix();

      // Expose lookY for the breathing offset
      window.__avatarLookY = lookY;

      // expose debug info so we can inspect from the console
      window.__avatarDebug = {
        bones: [],
        headBone, neckBone, leftEye, rightEye,
        model, pivot, size, center,
        scene, camera, renderer,
        forceRender: () => renderer.render(scene, camera),
      };
      model.traverse(o => { if (o.isBone) window.__avatarDebug.bones.push(o.name); });

      // hide the loader
      clearTimeout(loaderTimeout);
      if (loader) loader.classList.add('is-done');
      stage.classList.add('is-loaded');
      console.log('[avatar] loaded · bones:', !!headBone, 'eyes:', !!leftEye, !!rightEye, 'size.y:', size.y.toFixed(2));
    },
    (xhr) => {
      if (xhr.total && fill) {
        fill.style.width = (xhr.loaded / xhr.total * 100).toFixed(1) + '%';
      }
    },
    (e) => {
      console.warn('[avatar] load failed:', e);
      clearTimeout(loaderTimeout);
      if (err) err.classList.add('is-shown');
      if (loader) loader.classList.add('is-done');
    },
  );
}

/* ---------- mouse target ---------- */
// We track the cursor anywhere on the page, not just over the stage.
// Coordinates are normalized to the *stage center* so the avatar
// behaves like a portrait looking at the room.
let mx = 0, my = 0;            // smoothed
let tx = 0, ty = 0;            // target
let lastMouseTime = 0;

function onMove(e) {
  const r = stage.getBoundingClientRect();
  const cx = r.left + r.width * 0.5;
  const cy = r.top  + r.height * 0.5;
  // Normalize to roughly [-1, 1] but allow the page span to extend a bit
  const span = Math.max(window.innerWidth, window.innerHeight) * 0.6;
  tx = Math.max(-1, Math.min(1, (e.clientX - cx) / span));
  ty = Math.max(-1, Math.min(1, (e.clientY - cy) / span));
  lastMouseTime = performance.now();
}
window.addEventListener('pointermove', onMove, { passive: true });
window.addEventListener('mousemove',  onMove, { passive: true });

/* ---------- pause when off-screen ---------- */
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    visible = entries[0]?.isIntersecting ?? true;
  }, { threshold: 0.02 });
  io.observe(stage);
}

/* ---------- render loop ---------- */
const clock = new THREE.Clock();

function tick() {
  requestAnimationFrame(tick);
  if (!visible) return;

  // Smooth target → current
  mx += (tx - mx) * 0.075;
  my += (ty - my) * 0.075;

  const t = clock.getElapsedTime();
  const sinceMouse = performance.now() - lastMouseTime;

  // Drift to a slow side-look when the user hasn't moved the mouse in a while
  let driftX = 0, driftY = 0;
  if (sinceMouse > 1500) {
    driftX = Math.sin(t * 0.4) * 0.18;
    driftY = Math.sin(t * 0.27 + 1.4) * 0.05;
    mx += (driftX - mx) * 0.02;
    my += (driftY - my) * 0.02;
  }

  // Subtle breathing on Y (apply to whichever wrapper exists)
  const breath = Math.sin(t * 1.4) * 0.005;
  if (pivot) {
    pivot.position.y = (modelCenter ? modelCenter.y : 0) + breath;
  } else if (model) {
    model.position.y = breath;
  }

  // STATIC-MESH FALLBACK — no head bone means rotate the whole body.
  // Pivot lives at the model centre so the rotation looks natural
  // (waist-up turn instead of a foot-pivoted swing).
  if (pivot && !headBone) {
    const yaw   =  mx * 0.55;
    const pitch = -my * 0.22;
    pivot.rotation.y = THREE.MathUtils.lerp(pivot.rotation.y, yaw,   0.14);
    pivot.rotation.x = THREE.MathUtils.lerp(pivot.rotation.x, pitch, 0.14);
  } else if (model) {
    // (rigged model) very slow ambient body sway
    model.rotation.y = Math.sin(t * 0.25) * 0.025;
  }

  // Head follows but with a softer range than the eyes
  if (headBone) {
    const yawTarget   =  mx *  0.55;   // left-right
    const pitchTarget = -my *  0.30;   // up-down
    headBone.rotation.y = THREE.MathUtils.lerp(headBone.rotation.y, yawTarget,   0.18);
    headBone.rotation.x = THREE.MathUtils.lerp(headBone.rotation.x, pitchTarget, 0.18);
  }
  if (neckBone) {
    // Share a fraction of the head turn through the neck
    neckBone.rotation.y = THREE.MathUtils.lerp(neckBone.rotation.y, mx * 0.18, 0.18);
  }

  // Eyes track more sharply, more range — this is the "watching" effect.
  if (leftEye && rightEye) {
    const eyeYaw   =  mx *  0.85;
    const eyePitch = -my *  0.45;
    leftEye.rotation.y  = THREE.MathUtils.lerp(leftEye.rotation.y,  eyeYaw,   0.30);
    leftEye.rotation.x  = THREE.MathUtils.lerp(leftEye.rotation.x,  eyePitch, 0.30);
    rightEye.rotation.y = THREE.MathUtils.lerp(rightEye.rotation.y, eyeYaw,   0.30);
    rightEye.rotation.x = THREE.MathUtils.lerp(rightEye.rotation.x, eyePitch, 0.30);
  }

  renderer.render(scene, camera);
}
tick();
