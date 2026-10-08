import * as THREE from 'three';

// ===================== USTAWIENIA =====================
const HALF = 0.5;          // połowa rozmiaru klocka
const MOVE_SPEED = 7;      // maksymalna prędkość pozioma
const ACCEL = 40;          // przyspieszenie
const JUMP_SPEED = 9;      // prędkość początkowa skoku
const GRAVITY = 25;        // grawitacja
const KILL_Y = -25;        // poniżej tej wysokości klocek "spadł"
const EPS = 1e-4;
const GAME_KEYS = ['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

export class Game {
  /**
   * @param {HTMLElement} container  element, do którego trafi canvas
   * @param {{playerColor?: string, onFall?: (falls:number)=>void, onRespawn?: ()=>void}} callbacks
   */
  constructor(container, { playerColor = '#ff4d6d', onFall = () => {}, onRespawn = () => {} } = {}) {
    this.container = container;
    this.playerColor = playerColor;
    this.onFall = onFall;
    this.onRespawn = onRespawn;

    this.spawn = new THREE.Vector3(0, 2, 0);
    this.pos = this.spawn.clone();
    this.vel = new THREE.Vector3();
    this.onGround = false;
    this.dead = false;
    this.falls = 0;
    this.keys = {};
    this.solids = [];
    this.running = false;
    this.rafId = 0;
    this.respawnTimer = 0;
    this.lastTime = 0;

    this._initScene();
    this._buildWorld();
    this._initPlayer();
    this._bindEvents();
    this._resize();
  }

  // ---------- inicjalizacja ----------
  _initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0b1020);
    this.scene.fog = new THREE.Fog(0x0b1020, 25, 70);

    this.camera = new THREE.PerspectiveCamera(60, 1, 0.1, 200);
    this.camera.position.set(0, 10, 12);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(this.renderer.domElement);

    this.scene.add(new THREE.HemisphereLight(0xbfd4ff, 0x223344, 0.8));
    this.sun = new THREE.DirectionalLight(0xffffff, 0.9);
    this.sun.position.set(10, 20, 8);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048);
    Object.assign(this.sun.shadow.camera, { left: -20, right: 20, top: 20, bottom: -20, near: 1, far: 60 });
    this.scene.add(this.sun);
    this.scene.add(this.sun.target);
  }

  _addSolid(w, h, d, x, y, z, color) {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      new THREE.MeshStandardMaterial({ color, roughness: 0.8 })
    );
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.scene.add(mesh);
    this.solids.push({
      min: new THREE.Vector3(x - w / 2, y - h / 2, z - d / 2),
      max: new THREE.Vector3(x + w / 2, y + h / 2, z + d / 2),
    });
  }

  _buildWorld() {
    this._addSolid(24, 1, 24, 0, -0.5, 0, 0x3a7d44);     // główna plansza (góra y = 0)
    this._addSolid(3, 1, 3, 5, 0.5, -4, 0xc8553d);       // niski klocek
    this._addSolid(3, 1, 3, 5, 1.5, -8, 0xe0a030);       // wyższy klocek
    this._addSolid(2, 2, 6, -6, 1, 2, 0x5b6ee1);         // ściana
    this._addSolid(3, 0.5, 3, -6, 2.25, -6, 0x9b59b6);   // mała platforma
    this._addSolid(4, 1, 4, 15, 1, 0, 0x2aa198);         // platforma za przepaścią

    const grid = new THREE.GridHelper(24, 24, 0x000000, 0x000000);
    grid.material.opacity = 0.15;
    grid.material.transparent = true;
    grid.position.y = 0.01;
    this.scene.add(grid);
  }

  _initPlayer() {
    this.player = new THREE.Mesh(
      new THREE.BoxGeometry(HALF * 2, HALF * 2, HALF * 2),
      new THREE.MeshStandardMaterial({ color: new THREE.Color(this.playerColor), roughness: 0.4 })
    );
    this.player.castShadow = true;
    this.scene.add(this.player);
  }

  // ---------- zdarzenia ----------
  _bindEvents() {
    this._onKeyDown = (e) => {
      if (GAME_KEYS.includes(e.code)) e.preventDefault(); // bez przewijania strony
      this.keys[e.code] = true;
      if (e.code === 'KeyR') this.respawn();
    };
    this._onKeyUp = (e) => { this.keys[e.code] = false; };
    this._onBlur = () => { this.keys = {}; };

    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('keyup', this._onKeyUp);
    window.addEventListener('blur', this._onBlur);

    this._resizeObserver = new ResizeObserver(() => this._resize());
    this._resizeObserver.observe(this.container);
  }

  _resize() {
    const w = Math.max(this.container.clientWidth, 1);
    const h = Math.max(this.container.clientHeight, 1);
    this.renderer.setSize(w, h, false); // rozmiar CSS ustawia stylesheet (100%)
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  // ---------- kolizje ----------
  _intersects(s) {
    const p = this.pos;
    return (
      p.x + HALF > s.min.x + EPS && p.x - HALF < s.max.x - EPS &&
      p.y + HALF > s.min.y + EPS && p.y - HALF < s.max.y - EPS &&
      p.z + HALF > s.min.z + EPS && p.z - HALF < s.max.z - EPS
    );
  }

  _moveAxis(axis, amount) {
    this.pos[axis] += amount;
    for (const s of this.solids) {
      if (!this._intersects(s)) continue;
      this.pos[axis] = amount > 0 ? s.min[axis] - HALF : s.max[axis] + HALF;
      if (axis === 'y' && amount < 0) this.onGround = true;
      this.vel[axis] = 0;
    }
  }

  // ---------- logika ----------
  respawn() {
    clearTimeout(this.respawnTimer);
    this.pos.copy(this.spawn);
    this.vel.set(0, 0, 0);
    this.dead = false;
    this.player.visible = true;
    this.onRespawn();
  }

  _update(dt) {
    const k = this.keys;
    let ix = 0, iz = 0;
    if (k.KeyA || k.ArrowLeft) ix -= 1;
    if (k.KeyD || k.ArrowRight) ix += 1;
    if (k.KeyW || k.ArrowUp) iz -= 1;
    if (k.KeyS || k.ArrowDown) iz += 1;
    const len = Math.hypot(ix, iz) || 1;
    ix /= len; iz /= len;

    const step = ACCEL * dt;
    this.vel.x += THREE.MathUtils.clamp(ix * MOVE_SPEED - this.vel.x, -step, step);
    this.vel.z += THREE.MathUtils.clamp(iz * MOVE_SPEED - this.vel.z, -step, step);

    if (k.Space && this.onGround) {
      this.vel.y = JUMP_SPEED;
      this.onGround = false;
    }
    this.vel.y -= GRAVITY * dt;

    this.onGround = false;
    this._moveAxis('x', this.vel.x * dt);
    this._moveAxis('z', this.vel.z * dt);
    this._moveAxis('y', this.vel.y * dt);

    if (ix || iz) {
      let diff = Math.atan2(ix, iz) - this.player.rotation.y;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      this.player.rotation.y += diff * Math.min(1, dt * 12);
    }

    if (this.pos.y < KILL_Y) {
      this.dead = true;
      this.falls++;
      this.player.visible = false;
      this.onFall(this.falls);
      this.respawnTimer = setTimeout(() => this.respawn(), 1200);
    }
  }

  _frame = (now) => {
    if (!this.running) return;
    this.rafId = requestAnimationFrame(this._frame);

    const dt = Math.min((now - this.lastTime) / 1000, 1 / 30);
    this.lastTime = now;

    if (!this.dead) this._update(dt);
    this.player.position.copy(this.pos);

    const { pos, camera, sun } = this;
    const desired = new THREE.Vector3(pos.x, Math.max(pos.y, -4) + 9, pos.z + 11);
    camera.position.lerp(desired, 1 - Math.exp(-dt * 5));
    camera.lookAt(pos.x, Math.max(pos.y, -8), pos.z);

    sun.position.set(pos.x + 10, 20, pos.z + 8);
    sun.target.position.set(pos.x, 0, pos.z);

    this.renderer.render(this.scene, camera);
  };

  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(this._frame);
  }

  // Sprzątanie – wywołaj przy opuszczeniu widoku (onBeforeUnmount)
  destroy() {
    this.running = false;
    cancelAnimationFrame(this.rafId);
    clearTimeout(this.respawnTimer);
    window.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('keyup', this._onKeyUp);
    window.removeEventListener('blur', this._onBlur);
    this._resizeObserver.disconnect();

    this.scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) o.material.dispose();
    });
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}