import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Sprout } from "lucide-react";

function getStatusClass(item) {
  const soil = Number(item.soil_moisture);
  const temp = Number(item.temperature);

  if (soil < 25 || temp > 33) return "critical";
  if (soil < 40 || temp > 31) return "warning";
  return "normal";
}

const COLORS = {
  normal: {
    soil: 0x7c4a24,
    top: 0x22c55e,
    plant: 0x65a30d,
    accent: 0xa3e635,
  },
  warning: {
    soil: 0x7c4a24,
    top: 0xfacc15,
    plant: 0xb45309,
    accent: 0xfde047,
  },
  critical: {
    soil: 0x7c4a24,
    top: 0xef4444,
    plant: 0x7f1d1d,
    accent: 0xf87171,
  },
};

function createTextSprite(text, status) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 80;

  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.fillStyle = "rgba(6, 78, 59, 0.9)";
    ctx.fillRect(0, 8, 256, 56);

    ctx.strokeStyle =
      status === "critical"
        ? "#ef4444"
        : status === "warning"
        ? "#facc15"
        : "#22c55e";

    ctx.lineWidth = 5;
    ctx.strokeRect(0, 8, 256, 56);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 30px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 128, 38);
  }

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
  });

  const sprite = new THREE.Sprite(material);
  sprite.scale.set(1.9, 0.6, 1);

  return sprite;
}

function createRiceCluster(status) {
  const cluster = new THREE.Group();

  const bladeColor =
    status === "normal"
      ? 0x65a30d
      : status === "warning"
      ? 0xb45309
      : 0x7f1d1d;

  const youngLeafColor =
    status === "normal"
      ? 0xa3e635
      : status === "warning"
      ? 0xfacc15
      : 0xef4444;

  const bladeCount = status === "normal" ? 8 : status === "warning" ? 6 : 4;

  for (let b = 0; b < bladeCount; b++) {
    const bladeHeight =
      status === "normal"
        ? 0.78 + Math.random() * 0.34
        : status === "warning"
        ? 0.55 + Math.random() * 0.24
        : 0.34 + Math.random() * 0.18;

    const blade = new THREE.Mesh(
      new THREE.CylinderGeometry(0.018, 0.034, bladeHeight, 6),
      new THREE.MeshStandardMaterial({
        color: b % 2 === 0 ? bladeColor : youngLeafColor,
        roughness: 0.72,
      })
    );

    blade.position.y = bladeHeight / 2;
    blade.rotation.x = (Math.random() - 0.5) * 0.45;
    blade.rotation.z = (Math.random() - 0.5) * 0.65;
    blade.castShadow = true;

    cluster.add(blade);

    const tip = new THREE.Mesh(
      new THREE.ConeGeometry(0.045, 0.2, 6),
      new THREE.MeshStandardMaterial({
        color: youngLeafColor,
        roughness: 0.65,
      })
    );

    tip.position.y = bladeHeight + 0.06;
    tip.rotation.x = blade.rotation.x;
    tip.rotation.z = blade.rotation.z;
    tip.castShadow = true;

    cluster.add(tip);
  }

  cluster.userData.isRice = true;
  cluster.userData.phase = Math.random() * Math.PI * 2;

  return cluster;
}

function createTree() {
  const tree = new THREE.Group();

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.13, 0.18, 0.95, 10),
    new THREE.MeshStandardMaterial({
      color: 0x7c4a24,
      roughness: 0.8,
    })
  );
  trunk.position.y = 0.48;
  trunk.castShadow = true;
  tree.add(trunk);

  const leafMaterial = new THREE.MeshStandardMaterial({
    color: 0x16a34a,
    roughness: 0.65,
  });

  const leaf1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 16, 12),
    leafMaterial
  );
  leaf1.position.set(0, 1.15, 0);
  leaf1.castShadow = true;

  const leaf2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.45, 16, 12),
    leafMaterial
  );
  leaf2.position.set(-0.28, 1.35, 0.05);
  leaf2.castShadow = true;

  const leaf3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.45, 16, 12),
    leafMaterial
  );
  leaf3.position.set(0.28, 1.32, -0.05);
  leaf3.castShadow = true;

  tree.add(leaf1, leaf2, leaf3);
  tree.userData.isTree = true;
  tree.userData.phase = Math.random() * Math.PI * 2;

  return tree;
}

function createHouse() {
  const house = new THREE.Group();

  const wall = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 1.15, 1.6),
    new THREE.MeshStandardMaterial({
      color: 0xf5deb3,
      roughness: 0.7,
    })
  );
  wall.position.y = 0.58;
  wall.castShadow = true;
  wall.receiveShadow = true;
  house.add(wall);

  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(1.45, 0.9, 4),
    new THREE.MeshStandardMaterial({
      color: 0xb45309,
      roughness: 0.7,
    })
  );
  roof.position.y = 1.45;
  roof.rotation.y = Math.PI / 4;
  roof.castShadow = true;
  house.add(roof);

  const door = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.7, 0.04),
    new THREE.MeshStandardMaterial({
      color: 0x78350f,
      roughness: 0.8,
    })
  );
  door.position.set(0, 0.35, 0.83);
  house.add(door);

  const windowMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0ea5e9,
    emissiveIntensity: 0.25,
    roughness: 0.25,
  });

  const window1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.32, 0.28, 0.04),
    windowMat
  );
  window1.position.set(-0.55, 0.72, 0.83);

  const window2 = window1.clone();
  window2.position.x = 0.55;

  house.add(window1, window2);

  return house;
}

function createWindmill() {
  const windmill = new THREE.Group();

  const tower = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.28, 2.0, 12),
    new THREE.MeshStandardMaterial({
      color: 0xe5e7eb,
      roughness: 0.62,
    })
  );
  tower.position.y = 1;
  tower.castShadow = true;
  windmill.add(tower);

  const head = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.45, 0.35),
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.55,
    })
  );
  head.position.set(0, 2.1, 0);
  head.castShadow = true;
  windmill.add(head);

  const bladeGroup = new THREE.Group();
  bladeGroup.position.set(0, 2.1, 0.24);

  const bladeMat = new THREE.MeshStandardMaterial({
    color: 0x16a34a,
    roughness: 0.5,
  });

  for (let i = 0; i < 4; i++) {
    const blade = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 1.05, 0.045),
      bladeMat
    );
    blade.position.y = 0.52;
    blade.rotation.z = (Math.PI / 2) * i;
    blade.castShadow = true;
    bladeGroup.add(blade);
  }

  windmill.add(bladeGroup);
  windmill.userData.blades = bladeGroup;
  windmill.userData.isWindmill = true;

  return windmill;
}

function createSun3D() {
  const sunGroup = new THREE.Group();

  const sunCore = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 32, 24),
    new THREE.MeshBasicMaterial({
      color: 0xfacc15,
    })
  );

  const sunGlow = new THREE.Mesh(
    new THREE.SphereGeometry(0.95, 32, 24),
    new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.35,
    })
  );

  sunGroup.add(sunGlow, sunCore);
  sunGroup.position.set(-8, 8, -7);
  sunGroup.userData.isSun = true;

  return sunGroup;
}

function createCloud() {
  const cloud = new THREE.Group();

  const mat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.9,
    transparent: true,
    opacity: 0.88,
  });

  const c1 = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 12), mat);
  const c2 = new THREE.Mesh(new THREE.SphereGeometry(0.58, 16, 12), mat);
  const c3 = new THREE.Mesh(new THREE.SphereGeometry(0.44, 16, 12), mat);
  const c4 = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 12), mat);

  c1.position.set(-0.55, 0, 0);
  c2.position.set(0, 0.12, 0);
  c3.position.set(0.55, 0, 0);
  c4.position.set(0.18, -0.18, 0.1);

  cloud.add(c1, c2, c3, c4);
  cloud.userData.isCloud = true;
  cloud.userData.speed = 0.004 + Math.random() * 0.004;
  cloud.userData.startX = 0;

  return cloud;
}

function createBird() {
  const bird = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 10, 8),
    new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.6,
    })
  );

  const wingMat = new THREE.MeshStandardMaterial({
    color: 0x1f2937,
    roughness: 0.6,
  });

  const wing1 = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.035, 0.08), wingMat);
  const wing2 = wing1.clone();

  wing1.position.x = -0.18;
  wing2.position.x = 0.18;

  bird.add(body, wing1, wing2);
  bird.userData.leftWing = wing1;
  bird.userData.rightWing = wing2;
  bird.userData.isBird = true;
  bird.userData.speed = 0.018 + Math.random() * 0.01;
  bird.userData.phase = Math.random() * Math.PI * 2;

  return bird;
}

function Farm3DModel({ sensors = [] }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 900;
    const height = 540;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeef7ef);
    scene.fog = new THREE.Fog(0xeef7ef, 20, 55);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(11, 9, 14);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
    });

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    mount.innerHTML = "";
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.minDistance = 7;
    controls.maxDistance = 34;
    controls.maxPolarAngle = Math.PI / 2.15;
    controls.target.set(0, 0.8, 0);
    controls.update();

    const ambient = new THREE.AmbientLight(0xffffff, 1.7);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xffffff, 3);
    sun.position.set(10, 15, 8);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.camera.left = -18;
    sun.shadow.camera.right = 18;
    sun.shadow.camera.top = 18;
    sun.shadow.camera.bottom = -18;
    scene.add(sun);

    const greenLight = new THREE.PointLight(0x22c55e, 1.6, 22);
    greenLight.position.set(-8, 5, -5);
    scene.add(greenLight);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 26),
      new THREE.MeshStandardMaterial({
        color: 0x8ccf62,
        roughness: 0.88,
      })
    );

    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const waterMaterial = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.25,
      metalness: 0.2,
      transparent: true,
      opacity: 0.72,
    });

    const waterLine1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.05, 16),
      waterMaterial
    );
    waterLine1.position.set(-0.2, 0.06, 0);
    waterLine1.receiveShadow = true;
    scene.add(waterLine1);

    const waterLine2 = new THREE.Mesh(
      new THREE.BoxGeometry(16, 0.05, 0.18),
      waterMaterial
    );
    waterLine2.position.set(0, 0.07, 0);
    waterLine2.receiveShadow = true;
    scene.add(waterLine2);

    const borderMaterial = new THREE.MeshStandardMaterial({
      color: 0x5c3b1e,
      roughness: 0.8,
    });

    const farmBase = new THREE.Mesh(
      new THREE.BoxGeometry(18, 0.45, 14),
      new THREE.MeshStandardMaterial({
        color: 0x7b4a25,
        roughness: 0.85,
      })
    );

    farmBase.position.y = -0.25;
    farmBase.receiveShadow = true;
    farmBase.castShadow = true;
    scene.add(farmBase);

    const data =
      sensors.length > 0
        ? sensors.slice(0, 8)
        : Array.from({ length: 8 }).map((_, index) => ({
            id: index + 1,
            area: `Petak ${index + 1}`,
            temperature: [24, 25, 23, 26, 24, 22, 27, 23][index],
            soil_moisture: [65, 72, 60, 55, 65, 75, 62, 70][index],
            humidity: [70, 72, 68, 64, 70, 75, 66, 71][index],
            light: [760, 720, 810, 840, 700, 650, 790, 730][index],
            pump_status:
              index === 0 || index === 4 || index === 5 ? "ON" : "OFF",
          }));

    const plotGroups = [];
    const waterDrops = [];
    const animatedAssets = [];
    const cols = 4;
    const gapX = 4.2;
    const gapZ = 4.3;

    const house = createHouse();
    house.position.set(7.2, 0.15, -5.3);
    house.rotation.y = -0.45;
    scene.add(house);

    const windmill = createWindmill();
    windmill.position.set(-7.4, 0.05, -5.6);
    windmill.rotation.y = 0.55;
    scene.add(windmill);
    animatedAssets.push(windmill);

    const sun3D = createSun3D();
    scene.add(sun3D);
    animatedAssets.push(sun3D);

    const treePositions = [
      [-9.2, 0, -5.8],
      [-8.4, 0, -3.9],
      [-8.7, 0, 5.4],
      [8.5, 0, -2.8],
      [8.8, 0, 4.7],
      [6.8, 0, 5.8],
    ];

    treePositions.forEach(([x, y, z]) => {
      const tree = createTree();
      tree.position.set(x, y, z);
      const scale = 0.8 + Math.random() * 0.45;
      tree.scale.set(scale, scale, scale);
      scene.add(tree);
      animatedAssets.push(tree);
    });

    const cloudPositions = [
      [-6, 7, -8],
      [1.5, 8, -9],
      [7, 7.4, -7.5],
    ];

    cloudPositions.forEach(([x, y, z], index) => {
      const cloud = createCloud();
      cloud.position.set(x, y, z);
      cloud.scale.setScalar(1.2 + index * 0.15);
      cloud.userData.startX = x;
      scene.add(cloud);
      animatedAssets.push(cloud);
    });

    for (let i = 0; i < 5; i++) {
      const bird = createBird();
      bird.position.set(-7 + i * 2.4, 5.6 + Math.random() * 1.2, -6.5);
      scene.add(bird);
      animatedAssets.push(bird);
    }

    data.forEach((sensor, index) => {
      const status = getStatusClass(sensor);
      const color = COLORS[status];

      const col = index % cols;
      const row = Math.floor(index / cols);

      const x = (col - 1.5) * gapX;
      const z = (row - 0.5) * gapZ;

      const group = new THREE.Group();
      group.position.set(x, 0, z);

      const soilHeight = 0.55;

      const soil = new THREE.Mesh(
        new THREE.BoxGeometry(3.35, soilHeight, 3.25),
        new THREE.MeshStandardMaterial({
          color: color.soil,
          roughness: 0.78,
        })
      );

      soil.position.y = soilHeight / 2;
      soil.castShadow = true;
      soil.receiveShadow = true;
      group.add(soil);

      const top = new THREE.Mesh(
        new THREE.BoxGeometry(3.35, 0.12, 3.25),
        new THREE.MeshStandardMaterial({
          color: color.top,
          roughness: 0.65,
          emissive: color.top,
          emissiveIntensity: 0.06,
        })
      );

      top.position.y = soilHeight + 0.07;
      top.castShadow = true;
      top.receiveShadow = true;
      group.add(top);

      const borderA = new THREE.Mesh(
        new THREE.BoxGeometry(3.55, 0.18, 0.18),
        borderMaterial
      );
      borderA.position.set(0, soilHeight + 0.18, 1.72);
      group.add(borderA);

      const borderB = borderA.clone();
      borderB.position.z = -1.72;
      group.add(borderB);

      const borderC = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.18, 3.55),
        borderMaterial
      );
      borderC.position.set(1.78, soilHeight + 0.18, 0);
      group.add(borderC);

      const borderD = borderC.clone();
      borderD.position.x = -1.78;
      group.add(borderD);

      const riceClusterCount =
        status === "normal" ? 18 : status === "warning" ? 13 : 8;

      for (let i = 0; i < riceClusterCount; i++) {
        const px = -1.25 + (i % 6) * 0.5;
        const pz = -1.05 + Math.floor(i / 6) * 0.65;

        const cluster = createRiceCluster(status);
        cluster.position.set(px, soilHeight + 0.13, pz);

        group.add(cluster);
      }

      if (sensor.pump_status === "ON") {
        for (let i = 0; i < 8; i++) {
          const drop = new THREE.Mesh(
            new THREE.SphereGeometry(0.055, 10, 10),
            new THREE.MeshStandardMaterial({
              color: 0x38bdf8,
              emissive: 0x0ea5e9,
              emissiveIntensity: 0.35,
              transparent: true,
              opacity: 0.85,
            })
          );

          drop.position.set(
            x + (Math.random() - 0.5) * 2.1,
            1 + Math.random() * 1.4,
            z + (Math.random() - 0.5) * 2.1
          );

          drop.userData = {
            startY: drop.position.y,
            speed: 0.015 + Math.random() * 0.018,
            baseX: drop.position.x,
            baseZ: drop.position.z,
            phase: Math.random() * Math.PI * 2,
          };

          scene.add(drop);
          waterDrops.push(drop);
        }
      }

      const sensorBox = new THREE.Mesh(
        new THREE.BoxGeometry(0.45, 0.32, 0.45),
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 0.5,
        })
      );

      sensorBox.position.set(1.05, soilHeight + 0.55, 1.05);
      sensorBox.castShadow = true;
      group.add(sensorBox);

      const sensorPole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.035, 0.8, 8),
        new THREE.MeshStandardMaterial({
          color: 0x64748b,
          roughness: 0.65,
        })
      );

      sensorPole.position.set(1.05, soilHeight + 0.22, 1.05);
      group.add(sensorPole);

      const label = createTextSprite(sensor.area || `Petak ${index + 1}`, status);
      label.position.set(0, 2.15, 0);
      group.add(label);

      group.userData.sensor = sensor;

      scene.add(group);
      plotGroups.push(group);
    });

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const selectRing = new THREE.Mesh(
      new THREE.RingGeometry(1.9, 2.08, 64),
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide,
      })
    );

    selectRing.rotation.x = -Math.PI / 2;
    selectRing.position.y = 0.82;
    selectRing.visible = false;
    scene.add(selectRing);

    const infoBox = document.createElement("div");
    infoBox.className = "farm3d-tooltip";
    infoBox.style.display = "none";
    mount.appendChild(infoBox);

    const handleClick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();

      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const hits = raycaster.intersectObjects(scene.children, true);

      const plotHit = hits.find((hit) => {
        let obj = hit.object;

        while (obj.parent) {
          if (plotGroups.includes(obj.parent)) return true;
          obj = obj.parent;
        }

        return false;
      });

      if (plotHit) {
        let selectedGroup = plotHit.object;

        while (selectedGroup.parent && !plotGroups.includes(selectedGroup)) {
          selectedGroup = selectedGroup.parent;
        }

        const sensor = selectedGroup.userData.sensor;

        selectRing.position.x = selectedGroup.position.x;
        selectRing.position.z = selectedGroup.position.z;
        selectRing.visible = true;

        infoBox.style.display = "block";
        infoBox.innerHTML = `
          <strong>${sensor.area}</strong>
          <span>Suhu: ${sensor.temperature}°C</span>
          <span>Tanah: ${sensor.soil_moisture}%</span>
          <span>Udara: ${sensor.humidity}%</span>
          <span>Cahaya: ${sensor.light} lx</span>
          <span>Pompa: ${sensor.pump_status}</span>
        `;
      }
    };

    renderer.domElement.addEventListener("click", handleClick);

    let frameId;
    let t = 0;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      t += 0.016;

      plotGroups.forEach((group, groupIndex) => {
        group.children.forEach((child, childIndex) => {
          if (child.userData?.isRice) {
            child.rotation.z =
              Math.sin(t * 1.8 + child.userData.phase + groupIndex) * 0.08;
            child.rotation.x =
              Math.cos(t * 1.4 + child.userData.phase + childIndex) * 0.035;
          }
        });
      });

      waterDrops.forEach((drop) => {
        drop.position.y -= drop.userData.speed;

        drop.position.x =
          drop.userData.baseX + Math.sin(t * 2 + drop.userData.phase) * 0.08;

        if (drop.position.y < 0.85) {
          drop.position.y = drop.userData.startY;
        }
      });

      animatedAssets.forEach((asset) => {
        if (asset.userData?.isWindmill && asset.userData.blades) {
          asset.userData.blades.rotation.z += 0.08;
        }

        if (asset.userData?.isTree) {
          asset.rotation.z = Math.sin(t * 1.2 + asset.userData.phase) * 0.035;
        }

        if (asset.userData?.isSun) {
          const glow = asset.children[0];
          glow.scale.setScalar(1 + Math.sin(t * 1.8) * 0.08);
          asset.rotation.y += 0.002;
        }

        if (asset.userData?.isCloud) {
          asset.position.x += asset.userData.speed;

          if (asset.position.x > 9) {
            asset.position.x = -9;
          }
        }

        if (asset.userData?.isBird) {
          asset.position.x += asset.userData.speed;
          asset.position.y += Math.sin(t * 3 + asset.userData.phase) * 0.004;

          asset.userData.leftWing.rotation.z =
            Math.sin(t * 8 + asset.userData.phase) * 0.7;
          asset.userData.rightWing.rotation.z =
            -Math.sin(t * 8 + asset.userData.phase) * 0.7;

          if (asset.position.x > 9) {
            asset.position.x = -9;
            asset.position.y = 5.4 + Math.random() * 1.4;
          }
        }
      });

      selectRing.material.opacity = 0.45 + Math.abs(Math.sin(t * 2.4)) * 0.35;

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const newWidth = mount.clientWidth || 900;
      const newHeight = 540;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);

      renderer.domElement.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);

      controls.dispose();
      renderer.dispose();

      mount.innerHTML = "";
    };
  }, [sensors]);

  return (
    <div className="farm3d-shell">
      <div className="farm3d-toolbar">
        <div>
          <strong>Interactive 3D Farm Model</strong>
          <span>
            Drag untuk putar · Scroll untuk zoom · Klik petak untuk detail
          </span>
        </div>
      </div>

      <div ref={mountRef} className="farm3d-canvas-wrap">
        {sensors.length === 0 && (
          <div className="farm3d-empty">
            <Sprout size={42} />
            <strong>Menunggu data sensor...</strong>
            <p>Pastikan backend berjalan dan data sensor sudah tersedia.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Farm3DModel;