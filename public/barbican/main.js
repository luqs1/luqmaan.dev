import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

// ============================================================ curated facts
const ESTATE_INFO = {
  kicker: 'THE ESTATE',
  name: 'The Barbican Estate',
  stats: [['BUILT', '1965–76'], ['HOMES', '≈2,000'], ['LISTED', 'GII 2001']],
  body: 'A city within a city, raised on a pedestrian podium above Cripplegate — a ward flattened in a single night of the Blitz in December 1940. Chamberlin, Powell & Bon’s masterplan knits terrace blocks, three of Europe’s tallest residential towers, an arts centre, two schools, a medieval church and a lake into one continuous brutalist landscape of bush-hammered concrete.',
  foot: 'CLICK ANY BUILDING TO EXPLORE',
};

const INFO = {
  'Shakespeare Tower': { kicker: 'TOWER', year: '1976', body: 'The middle of the three triangular towers, named for the playwright who lodged in Cripplegate. 42 storeys of serrated balconies — among the tallest residential buildings in Europe when completed.' },
  'Cromwell Tower': { kicker: 'TOWER', year: '1973', body: 'The first of the three towers to be completed, standing beside the Barbican Centre and Silk Street. Oliver Cromwell was married in St Giles’ church below in 1620.' },
  'Lauderdale Tower': { kicker: 'TOWER', year: '1974', body: 'The westernmost tower, guarding the Aldersgate corner of the podium. Like its siblings, its plan is a rounded triangle with three flats per floor and jagged cantilevered balconies.' },
  'Gilbert House': { kicker: 'TERRACE BLOCK', year: '1976', body: 'The estate’s great flourish — an entire apartment block carried across the lake on giant concrete columns, so the water and gardens flow uninterrupted beneath it.' },
  'Andrewes House': { kicker: 'TERRACE BLOCK', year: '1971', body: 'The long southern terrace overlooking the lake, named after Lancelot Andrewes, vicar of St Giles’ and a translator of the King James Bible.' },
  'Speed House': { kicker: 'TERRACE BLOCK', year: '1969', body: 'The first block finished — the estate’s pioneer residents moved in here in 1969, while the rest of the site was still a building yard.' },
  'Willoughby House': { kicker: 'TERRACE BLOCK', year: '1972', body: 'Runs north–south along the Moor Lane edge of the estate, its barrel-vaulted roofline silhouetted against the towers of Moorgate.' },
  'Defoe House': { kicker: 'TERRACE BLOCK', year: '1972', body: 'Faces the gardens south of Beech Street, named for Daniel Defoe, born nearby in Fore Street. Its flats look over the lawns toward the lake.' },
  'Ben Jonson House': { kicker: 'TERRACE BLOCK', year: '1973', body: 'The longest block on the estate, striding along the northern edge above Beech Street’s road tunnel on massive piers.' },
  'Breton House': { kicker: 'TERRACE BLOCK', year: '1973', body: 'North-east terrace block beside Cromwell Tower, named after Nicholas Breton, Elizabethan poet of Red Cross Street.' },
  'Thomas More House': { kicker: 'TERRACE BLOCK', year: '1973', body: 'The western terrace beside Aldersgate, named for the saint and Lord Chancellor born on Milk Street. Overlooks Thomas More Garden, the estate’s largest private lawn.' },
  'Mountjoy House': { kicker: 'TERRACE BLOCK', year: '1972', body: 'Sits on the podium above the remains of London’s Roman and medieval wall. Christopher Mountjoy was Shakespeare’s Huguenot landlord.' },
  'Seddon House': { kicker: 'TERRACE BLOCK', year: '1972', body: 'South-west block stepping down toward the school and the wall walk, named after George Seddon, the great Georgian cabinet-maker of Aldersgate.' },
  'Bunyan Court': { kicker: 'TERRACE BLOCK', year: '1976', body: 'One of the three north-western courts raised over Beech Street, named for John Bunyan, who preached — and died — in the neighbourhood.' },
  'John Trundle Court': { kicker: 'TERRACE BLOCK', year: '1976', body: 'North-western court named after the Barbican bookseller who published the first quarto of Hamlet in 1603.' },
  'Bryer Court': { kicker: 'TERRACE BLOCK', year: '1976', body: 'The third of the north-western courts, above the Beech Street tunnel, named for the gold refiners W. Bryer & Sons whose frieze survives nearby.' },
  'Brandon Mews': { kicker: 'MEWS', year: '1972', body: 'A low run of mews flats tucked behind Willoughby House at podium level, one of the estate’s quietest corners.' },
  'Wallside': { kicker: 'TERRACE', year: '1974', body: 'A short terrace raised directly along the line of London Wall — its gardens incorporate a genuine bastion of the Roman city wall.' },
  'The Postern': { kicker: 'TERRACE', year: '1974', body: 'Named for the small gate that once pierced the city wall here, this low terrace flanks the Wallside gardens.' },
  'Frobisher Crescent': { kicker: 'CRESCENT', year: '1982', body: 'The curved crescent crowning the Barbican Centre, named for the Elizabethan explorer Martin Frobisher, buried at St Giles’. Originally offices, converted to flats in 2016.' },
  'Barbican Arts Centre': { kicker: 'ARTS CENTRE', year: '1982', body: 'Opened by the Queen in 1982 and declared “one of the wonders of the modern world” — Europe’s largest performing-arts centre, mostly buried beneath the podium: concert hall, two theatres, cinemas, galleries and library.' },
  'Barbican Conservatory': { kicker: 'CONSERVATORY', year: '1984', body: 'London’s second-largest conservatory after Kew, wrapped ingeniously around the theatre’s fly tower. Home to some 1,500 species of plants — and resident terrapins.' },
  'St Giles-without-Cripplegate': { kicker: 'CHURCH · C.1394', year: '1394', body: 'The medieval parish church that survived the Great Fire and (barely) the Blitz. Oliver Cromwell married here in 1620; John Milton was buried here in 1674. Now marooned magnificently in a sea of concrete.' },
  'Guildhall School of Music and Drama': { kicker: 'CONSERVATOIRE', year: '1977', body: 'The City’s conservatoire, folded into the estate beside the arts centre on Silk Street.' },
  'Milton Court': { kicker: 'CONSERVATOIRE', year: '2013', body: 'The Guildhall School’s concert-hall and theatre annexe, with a residential tower above — a 21st-century addition to the Barbican quarter.' },
  'The Heron': { kicker: 'TOWER · CONTEXT', year: '2013', body: 'The 36-storey residential tower above Milton Court — a glassy neighbour the Barbican’s concrete predates by four decades.' },
  'Blake Tower': { kicker: 'TOWER', year: '1968', body: 'Built as Y.M.C.A. hostel to serve the estate, converted into Barbican flats in 2017 — the estate’s “fourth tower”.' },
  'City of London School for Girls': { kicker: 'SCHOOL', year: '1969', body: 'The girls’ school occupies its own island in the south-west of the estate, between the lake and the wall walk.' },
  'Great Arthur House': { kicker: 'GOLDEN LANE · 1957', year: '1957', body: 'Not Barbican but its dress rehearsal: the centrepiece of Chamberlin, Powell & Bon’s earlier Golden Lane Estate, with its famous golden curved roof canopy.' },
  'Crescent House': { kicker: 'GOLDEN LANE · 1962', year: '1962', body: 'The Corbusian street block of the Golden Lane Estate along Goswell Road — the stylistic bridge between Golden Lane and the Barbican proper.' },
};

// blocks that get procedural barrel-vault roofs
const VAULT_BLOCKS = new Set([
  'Andrewes House', 'Defoe House', 'Speed House', 'Willoughby House', 'Gilbert House',
  'Ben Jonson House', 'Breton House', 'Thomas More House', 'Mountjoy House', 'Seddon House',
  'Bunyan Court', 'John Trundle Court', 'Bryer Court', 'Wallside', 'Brandon Mews',
]);
const TOWERS = new Set(['Shakespeare Tower', 'Cromwell Tower', 'Lauderdale Tower']);
const LABELLED = ['Shakespeare Tower', 'Cromwell Tower', 'Lauderdale Tower',
  'Barbican Arts Centre', 'St Giles-without-Cripplegate', 'Gilbert House'];

// estate boundary (rough, for tinting unnamed pieces)
const ESTATE = { x0: -290, x1: 140, z0: -230, z1: 140 };
const inEstate = (x, z) => x > ESTATE.x0 && x < ESTATE.x1 && z > ESTATE.z0 && z < ESTATE.z1;

// ============================================================ renderer / scene
const app = document.getElementById('app');
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
app.appendChild(renderer.domElement);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(innerWidth, innerHeight);
labelRenderer.domElement.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:5;';
document.body.appendChild(labelRenderer.domElement);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xcfd6d8, 700, 2400);

const camera = new THREE.PerspectiveCamera(46, innerWidth / innerHeight, 1, 6000);
camera.position.set(-900, 700, 900);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.maxPolarAngle = 1.52;
controls.minDistance = 30;
controls.maxDistance = 1600;
controls.target.set(-70, 10, -30);

// lights
const hemi = new THREE.HemisphereLight(0xcdd9e4, 0x6b6257, 0.75);
scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff2df, 2.6);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -520; sun.shadow.camera.right = 520;
sun.shadow.camera.top = 520; sun.shadow.camera.bottom = -520;
sun.shadow.camera.near = 50; sun.shadow.camera.far = 2200;
sun.shadow.bias = -0.0004;
scene.add(sun, sun.target);

// ============================================================ shared shader
const nightU = { value: 0 };
const timeU = { value: 0 };
const shaderMats = [];

function concreteMaterial(color, winStrength) {
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.93, metalness: 0.03 });
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uNight = nightU;
    sh.uniforms.uWin = { value: winStrength };
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vWPos; varying vec3 vWNorm;')
      .replace('#include <worldpos_vertex>', `#include <worldpos_vertex>
        vWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
        vWNorm = normalize(mat3(modelMatrix) * objectNormal);`);
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
        varying vec3 vWPos; varying vec3 vWNorm;
        uniform float uNight; uniform float uWin;
        float hash21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
      {
        float wallness = 1.0 - smoothstep(0.35, 0.6, abs(vWNorm.y));
        float u = mix(vWPos.x, vWPos.z, step(abs(vWNorm.z), abs(vWNorm.x)));
        float fh = 3.05, fw = 2.4;
        vec2 cell = vec2(floor(u / fw), floor(vWPos.y / fh));
        vec2 f = vec2(fract(u / fw), fract(vWPos.y / fh));
        // ribbon glazing: continuous strip per floor with slim mullions,
        // heavy concrete spandrel band below (the balcony-front look)
        float mullion = step(0.07, f.x) * step(f.x, 0.93);
        float wy = step(0.50, f.y) * step(f.y, 0.90);
        float win = mullion * wy * wallness * uWin * step(1.2, vWPos.y);
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.21, 0.23, 0.25), win * 0.55);
        float lit = step(hash21(cell * 0.731 + floor(vWPos.zx * 0.021)), 0.4) * uNight;
        totalEmissiveRadiance += vec3(1.0, 0.68, 0.34) * win * lit * 1.7;
        diffuseColor.rgb *= mix(0.72, 1.0, clamp(vWPos.y / 9.0, 0.0, 1.0));
      }`);
    mat.userData.shader = sh;
    shaderMats.push(sh);
  };
  mat.customProgramCacheKey = () => 'concrete';
  return mat;
}

const COL = {
  barbican: 0x9c9184,
  context: 0x8e969c,
  church: 0xb6a98e,
  glass: 0x9fb5ad,
};

// ============================================================ geometry helpers
function ringToShapePts(ring) {
  return ring.map(([x, z]) => new THREE.Vector2(x, -z));
}

function buildExtrude(rec, h, minH) {
  const shape = new THREE.Shape(ringToShapePts(rec.outer[0]));
  for (const hole of rec.holes) shape.holes.push(new THREE.Path(ringToShapePts(hole)));
  const geo = new THREE.ExtrudeGeometry(shape, { depth: h - minH, bevelEnabled: false });
  geo.rotateX(-Math.PI / 2);
  if (minH) geo.translate(0, minH, 0);
  geo.computeVertexNormals();
  return geo;
}

function pointInRing(x, z, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, zi] = ring[i], [xj, zj] = ring[j];
    if (zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) inside = !inside;
  }
  return inside;
}

// oriented long axis of a footprint (direction of its longest edge)
function longAxis(ring) {
  let best = 0, ang = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    const dx = ring[i + 1][0] - ring[i][0], dz = ring[i + 1][1] - ring[i][1];
    const l = dx * dx + dz * dz;
    if (l > best) { best = l; ang = Math.atan2(dz, dx); }
  }
  return ang;
}

function obb(ring, ang) {
  const c = Math.cos(ang), s = Math.sin(ang);
  let minD = 1e9, maxD = -1e9, minP = 1e9, maxP = -1e9;
  for (const [x, z] of ring) {
    const d = x * c + z * s, p = -x * s + z * c;
    if (d < minD) minD = d; if (d > maxD) maxD = d;
    if (p < minP) minP = p; if (p > maxP) maxP = p;
  }
  return { minD, maxD, minP, maxP, c, s };
}

// procedural barrel-vault row along a block's roof
function vaultGeometries(ring, roofY) {
  const ang = longAxis(ring);
  const { minD, maxD, minP, maxP, c, s } = obb(ring, ang);
  const W = maxP - minP;
  const r = Math.min(2.6, W * 0.16);
  if (r < 1.1) return [];
  const step = r * 2.06;
  const n = Math.floor((maxD - minD) / step);
  const pMid = (minP + maxP) / 2;
  const out = [];
  for (let i = 0; i < n; i++) {
    const d = minD + (i + 0.75) * step;
    const x = d * c - pMid * s, z = d * s + pMid * c;
    if (!pointInRing(x, z, ring)) continue;
    // sample ends to trim overhang on L-shaped blocks
    const ex1 = d * c - (pMid + W * 0.3) * s, ez1 = d * s + (pMid + W * 0.3) * c;
    const ex2 = d * c - (pMid - W * 0.3) * s, ez2 = d * s + (pMid - W * 0.3) * c;
    const full = pointInRing(ex1, ez1, ring) && pointInRing(ex2, ez2, ring);
    const len = (full ? 0.88 : 0.45) * W;
    const g = new THREE.CylinderGeometry(r, r, len, 14, 1, false, 0, Math.PI);
    g.rotateZ(Math.PI / 2);           // axis along X, arc over top
    g.rotateY(-(ang + Math.PI / 2));  // axis across the block
    g.translate(x, roofY, z);
    out.push(g);
  }
  return out;
}

// three vault pods crowning each tower
function towerCrown(ring, roofY) {
  let cx = 0, cz = 0;
  for (const [x, z] of ring) { cx += x; cz += z; }
  cx /= ring.length; cz /= ring.length;
  const out = [];
  // find the 3 longest edges — the triangle sides
  const edges = [];
  for (let i = 0; i < ring.length - 1; i++) {
    const dx = ring[i + 1][0] - ring[i][0], dz = ring[i + 1][1] - ring[i][1];
    edges.push({ l: dx * dx + dz * dz, mx: (ring[i][0] + ring[i + 1][0]) / 2, mz: (ring[i][1] + ring[i + 1][1]) / 2, ang: Math.atan2(dz, dx) });
  }
  edges.sort((a, b) => b.l - a.l);
  for (const e of edges.slice(0, 3)) {
    const px = e.mx + (cx - e.mx) * 0.42, pz = e.mz + (cz - e.mz) * 0.42;
    const g = new THREE.CylinderGeometry(3.4, 3.4, 13, 14, 1, false, 0, Math.PI);
    g.rotateZ(Math.PI / 2);
    g.rotateY(-e.ang);
    g.translate(px, roofY + 1.2, pz);
    out.push(g);
    const plinth = new THREE.BoxGeometry(13, 2.6, 7.4);
    plinth.rotateY(-e.ang);
    plinth.translate(px, roofY + 0.3, pz);
    out.push(plinth);
  }
  return out;
}

// ============================================================ build the city
const interactive = [];
const labelObjects = [];

fetch('./assets/site-data.json').then(r => r.json()).then(build);

function defaultHeight(rec) {
  if (rec.h != null) return rec.h;
  if (TOWERS.has(rec.name)) return 123;
  if (rec.part) return 6;
  return inEstate(...centroid(rec.outer[0])) ? 10 : 14;
}

function centroid(ring) {
  let x = 0, z = 0;
  for (const p of ring) { x += p[0]; z += p[1]; }
  return [x / ring.length, z / ring.length];
}

function build(data) {
  buildGround(data);
  buildBuildings(data);
  buildRoads(data);
  buildTrees(data);
  buildFountains(data);
  setTime(parseFloat(slider.value));
  document.getElementById('loader').classList.add('done');
  flyTo(VIEWS.overview, 2.2);
  showEstate();
}

function buildBuildings(data) {
  const mergeStatic = { barbican: [], context: [] };

  for (const rec of data.buildings) {
    const h = defaultHeight(rec);
    let minH = rec.minH || 0;
    if (minH >= h) minH = 0;
    const [cx, cz] = centroid(rec.outer[0]);
    const estate = inEstate(cx, cz);
    const info = INFO[rec.name];

    let geo;
    try { geo = buildExtrude(rec, h, minH); } catch { continue; }

    const extras = [];
    if (rec.name && VAULT_BLOCKS.has(rec.name)) extras.push(...vaultGeometries(rec.outer[0], h));
    if (rec.name && TOWERS.has(rec.name)) extras.push(...towerCrown(rec.outer[0], h));
    if (rec.name === 'Gilbert House' && minH > 3) {
      // stilts down into the lake
      const ang = longAxis(rec.outer[0]);
      const { minD, maxD, minP, maxP, c, s } = obb(rec.outer[0], ang);
      const pMid = (minP + maxP) / 2, L = maxD - minD;
      const nCol = 7;
      for (let i = 0; i < nCol; i++) {
        const d = minD + ((i + 0.5) / nCol) * L;
        for (const off of [-6, 6]) {
          const x = d * c - (pMid + off) * s, z = d * s + (pMid + off) * c;
          const col = new THREE.CylinderGeometry(1.05, 1.05, minH, 10);
          col.translate(x, minH / 2, z);
          extras.push(col);
        }
      }
    }
    if (rec.name === 'St Giles-without-Cripplegate') {
      // church tower at the west end
      const ang = longAxis(rec.outer[0]);
      const { minD, maxD, minP, maxP, c, s } = obb(rec.outer[0], ang);
      const pMid = (minP + maxP) / 2;
      const westD = (Math.cos(ang) >= 0 ? minD : maxD) + (Math.cos(ang) >= 0 ? 4 : -4);
      const x = westD * c - pMid * s, z = westD * s + pMid * c;
      const t = new THREE.BoxGeometry(7.5, 22, 7.5); t.translate(x, 11, z); extras.push(t);
      const cap = new THREE.CylinderGeometry(0.4, 3.4, 5, 8); cap.translate(x, 24.5, z); extras.push(cap);
    }

    if (extras.length) {
      const ni = (g) => (g.index ? g.toNonIndexed() : g);
      const merged = BufferGeometryUtils.mergeGeometries([geo, ...extras].map(ni), false);
      if (merged) geo = merged;
      else console.warn('extras merge failed:', rec.name, rec.id);
    }

    if (rec.name) {
      const isTower = TOWERS.has(rec.name);
      const color = rec.name === 'St Giles-without-Cripplegate' ? COL.church
        : rec.name === 'Barbican Conservatory' ? COL.glass
        : estate ? COL.barbican : COL.context;
      const mat = concreteMaterial(color, estate ? 0.95 : 0.75);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = mesh.receiveShadow = true;
      mesh.userData = { name: rec.name, info, h, levels: rec.levels, estate };
      scene.add(mesh);
      interactive.push(mesh);
      if (LABELLED.includes(rec.name) && !labelObjects.some(l => l.userData.n === rec.name)) {
        const div = document.createElement('div');
        div.className = 'bldg-label';
        div.textContent = rec.name.toUpperCase();
        const lab = new CSS2DObject(div);
        lab.position.set(cx, h + (isTower ? 14 : 10), cz);
        lab.userData.n = rec.name;
        scene.add(lab);
        labelObjects.push(lab);
      }
    } else {
      mergeStatic[estate ? 'barbican' : 'context'].push(geo);
    }
  }

  for (const key of ['barbican', 'context']) {
    if (!mergeStatic[key].length) continue;
    const geo = BufferGeometryUtils.mergeGeometries(mergeStatic[key], false);
    const mesh = new THREE.Mesh(geo, concreteMaterial(COL[key], key === 'barbican' ? 0.85 : 0.6));
    mesh.castShadow = mesh.receiveShadow = true;
    scene.add(mesh);
  }
}

function flatPoly(items, y, color, opts = {}) {
  const geos = items.map(item => {
    const outer = item.outer || item;
    const shape = new THREE.Shape(ringToShapePts(outer));
    for (const hole of item.holes || []) shape.holes.push(new THREE.Path(ringToShapePts(hole)));
    const g = new THREE.ShapeGeometry(shape);
    g.rotateX(-Math.PI / 2);
    g.translate(0, y, 0);
    return g;
  });
  const geo = BufferGeometryUtils.mergeGeometries(geos, false);
  const mat = new THREE.MeshStandardMaterial({ color, roughness: opts.rough ?? 0.95, metalness: opts.metal ?? 0 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.receiveShadow = true;
  scene.add(mesh);
  return mesh;
}

let waterMat;
function buildGround(data) {
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(2600, 64).rotateX(-Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: 0x777167, roughness: 1 })
  );
  ground.receiveShadow = true;
  scene.add(ground);

  if (data.gardens.length) flatPoly(data.gardens, 0.05, 0x5c7247);

  // lake — animated water
  const waterMesh = flatPoly(data.water, 0.14, 0x2e5a58, { rough: 0.12, metal: 0.35 });
  waterMat = waterMesh.material;
  waterMat.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = timeU;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vWp;')
      .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvWp = (modelMatrix * vec4(transformed,1.0)).xyz;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vWp; uniform float uTime;')
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
        normal = normalize(normal + 0.08 * vec3(
          sin(vWp.x * 0.7 + uTime * 1.3) + sin(vWp.z * 1.1 + uTime * 0.9),
          0.0,
          cos(vWp.z * 0.8 + uTime * 1.1) + cos(vWp.x * 1.3 - uTime * 0.7)));`);
  };

  // elevated pedestrian plazas (the podium highwalk decks)
  const up = data.plazas.filter(p => p.up).map(p => p.ring);
  const dn = data.plazas.filter(p => !p.up).map(p => p.ring);
  if (dn.length) flatPoly(dn, 0.1, 0x8a6e56);
  if (up.length) {
    const m = flatPoly(up, 6.6, 0x97735a);
    m.castShadow = true;
  }
}

function buildRoads(data) {
  const groundSegs = [], highSegs = [];
  for (const rd of data.roads) {
    const w = rd.w / 2, y = rd.up ? 6.7 : 0.12;
    const bucket = rd.up ? highSegs : groundSegs;
    for (let i = 0; i < rd.pts.length - 1; i++) {
      const [x1, z1] = rd.pts[i], [x2, z2] = rd.pts[i + 1];
      const dx = x2 - x1, dz = z2 - z1;
      const l = Math.hypot(dx, dz);
      if (l < 0.3) continue;
      const nx = -dz / l * w, nz = dx / l * w;
      bucket.push(
        x1 + nx, y, z1 + nz, x2 + nx, y, z2 + nz, x2 - nx, y, z2 - nz,
        x1 + nx, y, z1 + nz, x2 - nx, y, z2 - nz, x1 - nx, y, z1 - nz
      );
    }
  }
  const mk = (arr, color) => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3));
    const n = new Float32Array(arr.length);
    for (let i = 1; i < n.length; i += 3) n[i] = 1;
    g.setAttribute('normal', new THREE.BufferAttribute(n, 3));
    const mesh = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color, roughness: 0.98 }));
    mesh.receiveShadow = true;
    scene.add(mesh);
  };
  mk(groundSegs, 0x54504a);
  mk(highSegs, 0xa17e5f);
}

function buildTrees(data) {
  const n = data.trees.length;
  if (!n) return;
  const trunkG = new THREE.CylinderGeometry(0.35, 0.5, 3.4, 6);
  trunkG.translate(0, 1.7, 0);
  const canG = new THREE.IcosahedronGeometry(2.6, 1);
  canG.scale(1, 0.85, 1);
  canG.translate(0, 4.6, 0);
  const trunks = new THREE.InstancedMesh(trunkG, new THREE.MeshStandardMaterial({ color: 0x5d4632, roughness: 1 }), n);
  const cans = new THREE.InstancedMesh(canG, new THREE.MeshStandardMaterial({ color: 0x51683c, roughness: 0.95 }), n);
  const m = new THREE.Matrix4();
  const c = new THREE.Color();
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  data.trees.forEach(([x, z], i) => {
    const s = 0.75 + rnd() * 0.75;
    m.makeScale(s, s * (0.9 + rnd() * 0.4), s).setPosition(x, 0, z);
    trunks.setMatrixAt(i, m);
    cans.setMatrixAt(i, m);
    cans.setColorAt(i, c.setHSL(0.26 + rnd() * 0.06, 0.35 + rnd() * 0.15, 0.3 + rnd() * 0.1));
  });
  trunks.castShadow = cans.castShadow = true;
  scene.add(trunks, cans);
}

let jets = [];
function buildFountains(data) {
  if (!data.water.length) return;
  // biggest water polygon = the lake
  let lake = data.water[0].outer || data.water[0], best = 0;
  for (const item of data.water) {
    const w = item.outer || item;
    let a = 0;
    for (let i = 0; i < w.length - 1; i++) a += w[i][0] * w[i + 1][1] - w[i + 1][0] * w[i][1];
    if (Math.abs(a) > best) { best = Math.abs(a); lake = w; }
  }
  let minX = 1e9, maxX = -1e9, minZ = 1e9, maxZ = -1e9;
  for (const [x, z] of lake) {
    minX = Math.min(minX, x); maxX = Math.max(maxX, x);
    minZ = Math.min(minZ, z); maxZ = Math.max(maxZ, z);
  }
  const zRow = minZ + (maxZ - minZ) * 0.4;
  const mat = new THREE.MeshBasicMaterial({ color: 0xeef4f2, transparent: true, opacity: 0.55 });
  for (let i = 0; i < 8; i++) {
    const x = minX + ((i + 1.5) / 10) * (maxX - minX);
    if (!pointInRing(x, zRow, lake)) continue;
    const jet = new THREE.Mesh(new THREE.ConeGeometry(0.5, 4.4, 8), mat);
    jet.geometry.translate(0, 2.2, 0);
    jet.position.set(x, 0.1, zRow);
    jet.userData.phase = i * 1.3;
    scene.add(jet);
    jets.push(jet);
  }
}

// ============================================================ sky / time
const skyDay = new THREE.Color(0xbfd3da), skyDusk = new THREE.Color(0xd98a55), skyNight = new THREE.Color(0x121828);
const sunDay = new THREE.Color(0xfff2df), sunDusk = new THREE.Color(0xff9a55);
const slider = document.getElementById('time-slider');
const readout = document.getElementById('time-readout');
const glyph = document.getElementById('sun-glyph');
const bg = new THREE.Color();

function setTime(t) {
  const frac = THREE.MathUtils.clamp((t - 5.6) / (21.4 - 5.6), 0, 1);
  const elev = Math.sin(frac * Math.PI) * 61; // deg
  const azim = THREE.MathUtils.lerp(78, 282, frac); // east → west
  const el = THREE.MathUtils.degToRad(Math.max(elev, 2));
  const az = THREE.MathUtils.degToRad(azim);
  sun.position.set(Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el)).multiplyScalar(900);
  const dayness = THREE.MathUtils.smoothstep(elev, 0, 14);
  const duskness = 1 - THREE.MathUtils.smoothstep(elev, 8, 26);
  nightU.value = 1 - THREE.MathUtils.smoothstep(elev, -2, 9);
  sun.intensity = 2.7 * dayness + 0.22 * (1 - dayness);
  sun.color.copy(sunDay).lerp(sunDusk, duskness);
  if (nightU.value > 0.7) sun.color.setHex(0x8fa3c8); // moonlight
  hemi.intensity = 0.34 + 0.66 * dayness;
  bg.copy(skyNight).lerp(skyDusk, THREE.MathUtils.clamp(dayness * 2, 0, 1) * duskness)
    .lerp(skyDay, dayness * (1 - duskness * 0.75));
  scene.background = bg;
  scene.fog.color.copy(bg);
  renderer.toneMappingExposure = 0.95 + 0.2 * dayness;
  const hh = Math.floor(t), mm = Math.round((t - hh) * 60);
  readout.textContent = `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  glyph.textContent = nightU.value > 0.6 ? '☾' : '☀';
}
slider.addEventListener('input', () => setTime(parseFloat(slider.value)));

// ============================================================ camera presets
const VIEWS = {
  overview: { pos: [10, 400, 430], tgt: [-70, 0, -40] },
  lakeside: { pos: [-25, 14, -32], tgt: [75, 10, 48] },
  podium:   { pos: [-18, 14, 108], tgt: [-130, 50, -90] },
  towers:   { pos: [40, 150, 30], tgt: [-110, 85, -105] },
};
let flight = null;
window.__setView = (px, py, pz, tx, ty, tz) => {
  camera.position.set(px, py, pz);
  controls.target.set(tx, ty, tz);
};
function flyTo(v, dur = 1.4) {
  flight = {
    t: 0, dur,
    p0: camera.position.clone(), p1: new THREE.Vector3(...v.pos),
    t0: controls.target.clone(), t1: new THREE.Vector3(...v.tgt),
  };
}
document.querySelectorAll('.view-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    flyTo(VIEWS[btn.dataset.view]);
  });
});

// toggles
document.getElementById('tog-labels').addEventListener('click', (e) => {
  const on = e.currentTarget.classList.toggle('is-active');
  labelObjects.forEach(l => (l.visible = on));
});
document.getElementById('tog-shadows').addEventListener('click', (e) => {
  renderer.shadowMap.enabled = e.currentTarget.classList.toggle('is-active');
  scene.traverse(o => { if (o.material) o.material.needsUpdate = true; });
});

// ============================================================ picking / panel
const ray = new THREE.Raycaster();
const mouse = new THREE.Vector2(-2, -2);
const tip = document.getElementById('tip');
let hovered = null, px = 0, py = 0, downAt = null;

addEventListener('pointermove', (e) => {
  px = e.clientX; py = e.clientY;
  mouse.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
});
renderer.domElement.addEventListener('pointerdown', (e) => (downAt = [e.clientX, e.clientY]));
renderer.domElement.addEventListener('pointerup', (e) => {
  if (!downAt) return;
  const moved = Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]);
  downAt = null;
  if (moved > 6) return;
  if (hovered) showBuilding(hovered.userData);
  else showEstate();
});

const panel = document.getElementById('panel');
const el = (id) => document.getElementById(id);
function renderStats(rows) {
  el('panel-stats').innerHTML = rows
    .map(([k, v]) => `<div class="cell"><div class="k">${k}</div><div class="v">${v}</div></div>`)
    .join('');
}
function showEstate() {
  panel.classList.remove('has-building');
  el('panel-kicker').textContent = ESTATE_INFO.kicker;
  el('panel-name').textContent = ESTATE_INFO.name;
  renderStats(ESTATE_INFO.stats);
  el('panel-body').textContent = ESTATE_INFO.body;
  el('panel-foot').textContent = ESTATE_INFO.foot;
}
function showBuilding(ud) {
  panel.classList.add('has-building');
  const info = ud.info;
  el('panel-kicker').textContent = info?.kicker || (ud.estate ? 'BARBICAN ESTATE' : 'CITY CONTEXT');
  el('panel-name').textContent = ud.name;
  renderStats([
    ['HEIGHT', `${Math.round(ud.h)} M`],
    ['STOREYS', ud.levels ?? '—'],
    ['YEAR', info?.year ?? '—'],
  ]);
  el('panel-body').textContent = info?.body || 'No dossier on this one — an unremarkable neighbour of the estate. Footprint and height from OpenStreetMap.';
  el('panel-foot').textContent = ud.estate ? 'GRADE II LISTED ENSEMBLE' : 'OUTSIDE THE LISTED ESTATE';
}
document.getElementById('panel-close').addEventListener('click', showEstate);

// ============================================================ loop
const clock = new THREE.Clock();
function tick() {
  requestAnimationFrame(tick);
  const dt = clock.getDelta();
  timeU.value += dt;

  if (flight) {
    flight.t += dt / flight.dur;
    const k = flight.t >= 1 ? 1 : 1 - Math.pow(1 - flight.t, 3);
    camera.position.lerpVectors(flight.p0, flight.p1, k);
    controls.target.lerpVectors(flight.t0, flight.t1, k);
    if (flight.t >= 1) flight = null;
  }
  controls.update();

  // hover pick
  ray.setFromCamera(mouse, camera);
  const hits = ray.intersectObjects(interactive, false);
  const hit = hits[0]?.object || null;
  if (hit !== hovered) {
    if (hovered) { hovered.material.emissive.setHex(0x000000); hovered.material.emissiveIntensity = 1; }
    hovered = hit;
    if (hovered) {
      hovered.material.emissive.setHex(0xff4d00);
      hovered.material.emissiveIntensity = 0.22;
      tip.textContent = hovered.userData.name.toUpperCase();
      tip.classList.add('on');
      renderer.domElement.style.cursor = 'pointer';
    } else {
      tip.classList.remove('on');
      renderer.domElement.style.cursor = '';
    }
  }
  if (hovered) { tip.style.left = px + 'px'; tip.style.top = py + 'px'; }

  for (const j of jets) {
    const s = 0.75 + 0.3 * Math.sin(timeU.value * 2.6 + j.userData.phase);
    j.scale.set(1, s, 1);
  }

  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}
tick();

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  labelRenderer.setSize(innerWidth, innerHeight);
});
