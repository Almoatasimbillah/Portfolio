/* =========================================================
   entry.js → js/avatar.bundle.js
   The hero: a real Blender-built 3D character (rigid head-split GLB,
   models/hero_tracking.glb) whose head + eyes follow the cursor.
   Ported from the React Three Fiber build (portfolio-3d) to vanilla
   three.js so the site stays build-free and CSP stays script-src 'self'.

   Fallback chain (decided up front, cheapest wins):
   · fine pointer + WebGL + motion OK  → live tracking character
   · motion OK but touch / no WebGL    → hero_narrative.webm loop (alpha)
   · Safari (no alpha WebM) / reduced  → static poster PNG
   ========================================================= */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const stage = document.getElementById('avatar-stage');
const section = document.getElementById('avatar-section');
if (!stage) throw new Error('avatar-stage missing');

const GLB_URL = 'models/hero_tracking.glb';
const VIDEO_URL = 'videos/hero_narrative.webm';
const POSTER_URL = 'images/hero_poster.png';

/* tracking limits (radians) — head capped so the neck seam stays inside
   the collar; the EYES carry the rest of the look (like real people) */
const HEAD_YAW_MAX = 0.19;
const HEAD_PITCH_MAX = 0.1;
const EYE_YAW_EXTRA = 0.28;
const EYE_PITCH_EXTRA = 0.12;

/* test hooks: /?mx=0.8&my=-0.2 forces the pointer, /?blink=1 holds the
   eyelids closed — both for headless proof shots */
const params = new URLSearchParams(window.location.search);
const forcedX = parseFloat(params.get('mx') ?? '');
const forcedY = parseFloat(params.get('my') ?? '');
const forcedBlink = params.get('blink') === '1';

const loaderEl = stage.querySelector('.avatar-loader');
const loaderLabel = loaderEl ? loaderEl.querySelector('.loader-label') : null;
const errorEl = stage.querySelector('.avatar-error');

function hideLoader() {
  if (loaderEl) loaderEl.classList.add('is-done');
}

function loaderProgress(loaded, total) {
  if (!loaderLabel || !total) return;
  if (!loaderLabel.dataset.base) loaderLabel.dataset.base = loaderLabel.textContent;
  const pct = Math.min(99, Math.round((loaded / total) * 100));
  loaderLabel.textContent = `${loaderLabel.dataset.base} · ${pct}%`;
}

/* ---------- capability gate ---------- */

function webglOK() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;
const wideEnough = window.matchMedia('(min-width: 821px)').matches;
// Safari plays VP9 but not alpha WebM — the character would sit in a black box.
const isSafari = /^((?!chrome|chromium|android|edg).)*safari/i.test(navigator.userAgent);
const webmOK = !isSafari && document.createElement('video').canPlayType('video/webm; codecs="vp9"') !== '';

/* ---------- fallbacks (video loop → static poster) ---------- */

function mountPoster() {
  const img = document.createElement('img');
  img.src = POSTER_URL;
  img.alt = '';
  img.className = 'avatar-fallback avatar-fallback-img';
  img.decoding = 'async';
  stage.appendChild(img);
  hideLoader();
  window.__avatar = { mode: 'poster' };
}

function mountVideo() {
  const v = document.createElement('video');
  v.className = 'avatar-fallback avatar-fallback-video';
  v.muted = true;
  v.loop = true;
  v.autoplay = true;
  v.playsInline = true;
  v.setAttribute('muted', '');
  v.setAttribute('playsinline', '');
  v.src = VIDEO_URL;
  v.addEventListener('error', () => { v.remove(); mountPoster(); }, { once: true });
  stage.appendChild(v);
  const p = v.play();
  if (p) p.catch(() => {});
  hideLoader();
  window.__avatar = { mode: 'video' };
}

function mountFallback() {
  if (webmOK && !reducedMotion) mountVideo();
  else mountPoster();
}

if (reducedMotion || !finePointer || !wideEnough || !webglOK()) {
  mountFallback();
} else {
  mountLive();
}

/* ---------- the live scene (port of portfolio-3d Scene.tsx) ---------- */

function mountLive() {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 0.16, 1.6);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
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
  new ResizeObserver(resize).observe(stage);
  window.addEventListener('resize', resize);

  /* image-based environment (generated, no network): gives skin, hair and
     eyes soft real-world reflections — without it dielectrics read as clay */
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.5;
  pmrem.dispose();

  /* lights — same rig + intensities as the tuned R3F scene, but hued to the
     site's mint/midnight palette instead of the old purple stage */
  const amb = new THREE.AmbientLight('#9ec4b8', 0.1);
  scene.add(amb);

  const spot = new THREE.SpotLight('#e9f5f0', 72);
  spot.position.set(0, 5.5, 2.0);
  spot.angle = 0.55;
  spot.penumbra = 0.95;
  spot.distance = 20;
  spot.castShadow = true;
  spot.shadow.mapSize.set(1024, 1024);
  const spotTarget = new THREE.Object3D();
  spotTarget.position.set(0, 0.45, 0);
  scene.add(spotTarget);
  spot.target = spotTarget;
  scene.add(spot);

  const key = new THREE.PointLight('#ffd9b0', 4.2, 7);   // warm face key
  key.position.set(1.0, 0.9, 2.2);
  scene.add(key);
  const rimL = new THREE.PointLight('#7dd3c0', 2.6, 9);  // mint rim (accent)
  rimL.position.set(-3.5, 1.2, 1);
  scene.add(rimL);
  const rimR = new THREE.PointLight('#6ea8d8', 1.8, 9);  // cool ice rim
  rimR.position.set(3.2, 0.8, 0.5);
  scene.add(rimR);
  const back = new THREE.PointLight('#2f5a4e', 3, 10);   // deep teal separation
  back.position.set(0, 2.5, -3.5);
  scene.add(back);

  /* lights warm up over the first moments so the host "steps into the light" */
  const baseIntensity = [
    [amb, 0.1], [spot, 72], [key, 4.2], [rimL, 2.6], [rimR, 1.8], [back, 3],
  ];
  let litAt = 0;

  const group = new THREE.Group();
  group.position.set(0.05, -0.92, 0);
  scene.add(group);

  // ground catcher: the stage spot casts a soft blob under him — without it
  // he reads as floating in the void
  const catcher = new THREE.Mesh(
    new THREE.CircleGeometry(1.4, 48),
    new THREE.ShadowMaterial({ opacity: 0.32 }),
  );
  catcher.rotation.x = -Math.PI / 2;
  catcher.position.set(0.05, -0.925, 0);
  catcher.receiveShadow = true;
  scene.add(catcher);

  const pivots = {};
  const headWorldPos = new THREE.Vector3(0, 0.62, 0);
  const blinkMeshes = [];   // meshes carrying the 'blink' morph target
  let ready = false;

  new GLTFLoader().load(
    GLB_URL,
    (gltf) => {
      fixMaterials(gltf.scene);
      gltf.scene.traverse((obj) => {
        if (obj.name === 'HeadPivot') pivots.head = obj;
        if (obj.name === 'EyePivotL') pivots.eyeL = obj;
        if (obj.name === 'EyePivotR') pivots.eyeR = obj;
        if (obj.isMesh && obj.morphTargetDictionary &&
            obj.morphTargetDictionary.blink !== undefined) {
          blinkMeshes.push({ mesh: obj, idx: obj.morphTargetDictionary.blink });
        }
      });
      group.add(gltf.scene);
      ready = true;
      litAt = performance.now();
      snapCamera();
      hideLoader();
      window.__avatar = { mode: 'live' };
    },
    (e) => loaderProgress(e.loaded, e.total),
    (err) => {
      console.error('[avatar] GLB load failed:', err);
      renderer.setAnimationLoop(null);
      renderer.domElement.remove();
      if (errorEl) errorEl.classList.add('is-shown');
      mountFallback();
    },
  );

  /* exported-material fixes — same recipe as portfolio-3d CharacterTracking */
  function fixMaterials(root) {
    root.traverse((obj) => {
      if (!obj.isMesh) return;
      obj.castShadow = true;
      obj.receiveShadow = true;
      obj.frustumCulled = false;

      // hair gets a dedicated PHYSICAL material: anisotropic highlights that
      // stretch along the strands (a round specular blob reads as clay)
      if (/hair/.test(obj.name.toLowerCase())) {
        const old = Array.isArray(obj.material) ? obj.material[0] : obj.material;
        // tuned for the culturalibre swept style: anisotropic highlights that
        // stretch along the strand clumps (a plain round specular blob is
        // what reads as clay/plastic). roughness up + clearcoat OFF + lower
        // envMap — the earlier 0.45/clearcoat0.1 combo under the stage spot
        // read as wet gel/wax, not dry hair.
        const phys = new THREE.MeshPhysicalMaterial({
          map: old.map || null,
          color: new THREE.Color(old.map ? '#453931' : '#2a1e16'),
          roughness: 0.6,
          metalness: 0,
          alphaTest: 0.5,
          transparent: false,
          depthWrite: true,
          side: THREE.DoubleSide,
        });
        phys.envMapIntensity = 0.26;
        phys.anisotropy = 0.55;
        phys.clearcoat = 0;
        obj.material = phys;
        return;
      }

      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      for (const mat of mats) {
        const std = mat;
        const label = `${mat.name} ${obj.name}`.toLowerCase();
        const isHair = /hair/.test(label);
        const needsAlpha = /eyelash|eyebrow/.test(label) || isHair;
        const isEye = /high-poly|eyemesh/.test(label) && !needsAlpha;
        const isCloth = /suit|shoe|clothes|jacket|tie|shirt/.test(label);
        const isSkin = /human\.(body|ears|lips|fingernails)|headpiece|skin/.test(label);
        const isTeeth = /teeth/.test(label);

        if (needsAlpha) {
          std.transparent = true;
          std.alphaTest = 0.4;
          std.depthWrite = true;
        } else {
          std.transparent = false;
          std.opacity = 1;
          std.alphaTest = 0;
          std.depthWrite = true;
          std.side = THREE.FrontSide;
        }

        if (isCloth) {
          std.roughness = 1.0;
          std.metalness = 0;
          std.envMapIntensity = 0;
          std.roughnessMap = null;
          std.metalnessMap = null;
          if (std.normalScale) std.normalScale.set(0.5, 0.5);
          if ('sheen' in std) std.sheen = 0;
          if ('clearcoat' in std) std.clearcoat = 0;
          if ('specularIntensity' in std) std.specularIntensity = 0;
        }
        if (isSkin) {
          std.roughness = 0.68;
          std.metalness = 0;
          std.envMapIntensity = 0.16;
        }
        if (isTeeth) {
          std.roughness = 0.5;
          std.metalness = 0;
        }
        if (isHair) {
          // TINT the strand texture dark instead of replacing it, so the
          // per-strand tonal variation survives (flat color = the clay look)
          std.color = new THREE.Color(std.map ? '#4a3d33' : '#2a1e16');
          std.transparent = false;
          std.alphaTest = 0.5;
          std.depthWrite = true;
          std.side = THREE.DoubleSide;
          std.roughness = 0.6;
          std.metalness = 0;
          std.envMapIntensity = 0.26;
        }
        if (isEye) {
          std.color = new THREE.Color('#ffffff');
          std.roughness = 0.22;
          std.metalness = 0;
          std.envMapIntensity = 0.55;
          std.transparent = false;
          std.alphaTest = 0.5;   // cuts the cornea disc so the iris shows
          std.depthWrite = true;
          std.side = THREE.FrontSide;
        }
        std.needsUpdate = true;
      }
    });
  }

  /* ---------- pointer (matches R3F's normalized pointer) ---------- */
  let px = 0;
  let py = 0;
  let lastMove = performance.now();
  window.addEventListener('mousemove', (e) => {
    px = (e.clientX / window.innerWidth) * 2 - 1;
    py = -(e.clientY / window.innerHeight) * 2 + 1;
    lastMove = performance.now();
  }, { passive: true });
  if (!Number.isNaN(forcedX)) px = forcedX;
  if (!Number.isNaN(forcedY)) py = forcedY;

  /* ---------- camera rig — fixed frontal bust, X anchored ---------- */
  const goalPos = new THREE.Vector3();
  const goalTgt = new THREE.Vector3().copy(headWorldPos);
  const curTgt = new THREE.Vector3().copy(headWorldPos);

  function cameraGoals() {
    const ax = 0.05;
    const ay = headWorldPos.y - 0.12;
    const az = headWorldPos.z;
    goalTgt.set(ax, ay, az);
    goalPos.set(ax + px * 0.1, ay + 0.08 + py * 0.05, az + 1.16);
  }

  function snapCamera() {
    if (pivots.head) pivots.head.getWorldPosition(headWorldPos);
    cameraGoals();
    camera.position.copy(goalPos);
    curTgt.copy(goalTgt);
    camera.lookAt(curTgt);
  }

  /* ---------- frame loop ---------- */
  let last = performance.now();
  let t = 0;
  let running = true;
  let blinkAt = 0;   // next blink timestamp (ms); 0 = schedule on first frame

  function frame() {
    const now = performance.now();
    const delta = Math.min((now - last) / 1000, 0.5);
    last = now;
    t += delta;
    if (!Number.isNaN(forcedX)) px = forcedX;
    if (!Number.isNaN(forcedY)) py = forcedY;

    // damp factor — framerate-independent
    const k = 1 - Math.pow(0.0005, Math.min(delta, 0.1));

    // idle gaze wander — after 4s without pointer movement he starts looking
    // around the room instead of freezing (real people don't hold a stare).
    // The damped targets make the hand-off between modes seamless.
    let gx = px;
    let gy = py;
    if (Number.isNaN(forcedX) && performance.now() - lastMove > 4000) {
      const w = t * 0.3;
      gx = Math.sin(w) * 0.5 + Math.sin(w * 0.37 + 0.9) * 0.25;
      gy = Math.sin(w * 0.49 + 1.7) * 0.2;
    }

    if (ready) {
      // lights warm up over ~1.6s after the model lands
      const w = Math.min((performance.now() - litAt) / 1600, 1);
      const ease = w * w * (3 - 2 * w);
      for (const [light, base] of baseIntensity) light.intensity = base * (0.25 + 0.75 * ease);

      // head + eyes chase the gaze target (eyes lead, head follows)
      const yaw = THREE.MathUtils.clamp(gx * 0.24, -HEAD_YAW_MAX, HEAD_YAW_MAX);
      const pitch = THREE.MathUtils.clamp(-gy * 0.14, -HEAD_PITCH_MAX, HEAD_PITCH_MAX);
      if (pivots.head) {
        const h = pivots.head;
        h.rotation.y += (yaw - h.rotation.y) * k;
        h.rotation.x += (pitch + Math.sin(t * 1.1) * 0.006 - h.rotation.x) * k;
        h.rotation.z += (yaw * -0.12 - h.rotation.z) * k; // sympathetic tilt
        h.getWorldPosition(headWorldPos);
      }
      const ke = Math.min(k * 1.6, 1);
      const eyaw = THREE.MathUtils.clamp(gx * 0.5, -EYE_YAW_EXTRA, EYE_YAW_EXTRA);
      const epitch = THREE.MathUtils.clamp(-gy * 0.3, -EYE_PITCH_EXTRA, EYE_PITCH_EXTRA);
      for (const name of ['eyeL', 'eyeR']) {
        const e = pivots[name];
        if (!e) continue;
        e.rotation.y += (eyaw - e.rotation.y) * ke;
        e.rotation.x += (epitch - e.rotation.x) * ke;
      }

      // natural blinking via the GLB 'blink' morph: ~70ms close, 40ms hold,
      // 110ms open, every 2.2–6s with the occasional double blink
      let blink = 0;
      if (forcedBlink) {
        blink = 1;
      } else if (blinkMeshes.length) {
        const bms = performance.now();
        if (blinkAt === 0) blinkAt = bms + 1400; // first blink soon after load
        const bt = bms - blinkAt;
        if (bt >= 0) {
          if (bt < 70) blink = bt / 70;
          else if (bt < 110) blink = 1;
          else if (bt < 220) blink = 1 - (bt - 110) / 110;
          else {
            blink = 0;
            blinkAt = bms + (Math.random() < 0.14
              ? 260                                  // quick double blink
              : 2200 + Math.random() * 3800);
          }
        }
      }
      for (const b of blinkMeshes) {
        b.mesh.morphTargetInfluences[b.idx] = blink;
      }

      // idle breathing — tiny sway + bob so he never reads as frozen
      group.rotation.y = Math.sin(t * 0.4) * 0.01;
      group.position.y = -0.92 + Math.sin(t * 1.3) * 0.004;
      // entrance: he settles into place as the lights come up (no pop-in)
      group.scale.setScalar(0.985 + 0.015 * ease);
    }

    // camera drifts with the pointer — time-based damp
    cameraGoals();
    const ck = 1 - Math.pow(0.002, delta);
    camera.position.lerp(goalPos, ck);
    curTgt.lerp(goalTgt, ck);
    camera.lookAt(curTgt);

    renderer.render(scene, camera);
  }
  renderer.setAnimationLoop(frame);

  /* pause when the hero scrolls out of view — no wasted GPU below the fold */
  if (section && 'IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      const visible = entries[0].isIntersecting;
      if (visible && !running) {
        running = true;
        last = performance.now(); // swallow the pause so damp doesn't jump
        renderer.setAnimationLoop(frame);
      } else if (!visible && running) {
        running = false;
        renderer.setAnimationLoop(null);
      }
    }, { threshold: 0.02 }).observe(section);
  }
}
