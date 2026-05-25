import { useEffect, useRef } from "react";
import * as THREE from "three";

function getStatusClass(item) {
  const soil = Number(item.soil_moisture);
  const temp = Number(item.temperature);

  if (soil < 25 || temp > 33) return "critical";
  if (soil < 40 || temp > 31) return "warning";
  return "normal";
}

const COLORS = {
  normal: {
    top: 0x22c55e,
    side: 0x166534,
    plant: 0x16a34a,
  },
  warning: {
    top: 0xfacc15,
    side: 0xca8a04,
    plant: 0x854d0e,
  },
  critical: {
    top: 0xef4444,
    side: 0x991b1b,
    plant: 0x7f1d1d,
  },
};

function Farm3D({ sensors = [], onSelectPetak }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || sensors.length === 0) return;

    const canvas = canvasRef.current;
    const parent = canvas.parentElement;
    const width = parent?.clientWidth || 800;
    const height = 460;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0a160e, 1);
    renderer.shadowMap.enabled = true;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a160e, 0.035);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 8, 12);
    camera.lookAt(0, 0, 0);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
    sunLight.position.set(8, 10, 6);
    sunLight.castShadow = true;
    scene.add(sunLight);

    const greenLight = new THREE.PointLight(0x22c55e, 1.8, 18);
    greenLight.position.set(-6, 4, -5);
    scene.add(greenLight);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(28, 24),
      new THREE.MeshStandardMaterial({
        color: 0x0f2416,
        roughness: 0.9,
      })
    );

    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const grid = new THREE.GridHelper(24, 24, 0x1f7a3a, 0x10391f);
    scene.add(grid);

    const plots = [];
    const cols = 4;
    const gap = 2.5;
    const rows = Math.ceil(sensors.length / cols);

    sensors.forEach((sensor, index) => {
      const status = getStatusClass(sensor);
      const color = COLORS[status];

      const col = index % cols;
      const row = Math.floor(index / cols);

      const x = (col - (cols - 1) / 2) * gap;
      const z = (row - (rows - 1) / 2) * gap;

      const soil = Number(sensor.soil_moisture);
      const heightBox = 0.35 + (soil / 100) * 1.5;

      const group = new THREE.Group();
      group.position.set(x, 0, z);

      const base = new THREE.Mesh(
        new THREE.BoxGeometry(1.9, heightBox, 1.9),
        new THREE.MeshStandardMaterial({
          color: color.side,
          roughness: 0.7,
          metalness: 0.05,
        })
      );

      base.position.y = heightBox / 2;
      base.castShadow = true;
      base.receiveShadow = true;
      group.add(base);

      const top = new THREE.Mesh(
        new THREE.BoxGeometry(1.9, 0.08, 1.9),
        new THREE.MeshStandardMaterial({
          color: color.top,
          roughness: 0.5,
          emissive: color.top,
          emissiveIntensity: 0.12,
        })
      );

      top.position.y = heightBox + 0.04;
      top.castShadow = true;
      group.add(top);

      const plantCount = status === "normal" ? 5 : status === "warning" ? 3 : 1;

      for (let i = 0; i < plantCount; i++) {
        const px = (Math.random() - 0.5) * 1.1;
        const pz = (Math.random() - 0.5) * 1.1;
        const plantHeight =
          status === "normal" ? 0.55 : status === "warning" ? 0.38 : 0.22;

        const stem = new THREE.Mesh(
          new THREE.CylinderGeometry(0.025, 0.035, plantHeight, 8),
          new THREE.MeshStandardMaterial({
            color: color.plant,
          })
        );

        stem.position.set(px, heightBox + plantHeight / 2, pz);
        stem.castShadow = true;
        group.add(stem);

        const leaf = new THREE.Mesh(
          new THREE.SphereGeometry(0.13, 12, 8),
          new THREE.MeshStandardMaterial({
            color: color.top,
            roughness: 0.6,
          })
        );

        leaf.position.set(px, heightBox + plantHeight + 0.08, pz);
        leaf.scale.set(1.2, 0.55, 1);
        leaf.castShadow = true;
        group.add(leaf);
      }

      const labelCanvas = document.createElement("canvas");
      labelCanvas.width = 160;
      labelCanvas.height = 48;

      const ctx = labelCanvas.getContext("2d");

      if (ctx) {
        ctx.fillStyle = "rgba(0,0,0,0.62)";
        ctx.fillRect(0, 6, 160, 36);

        ctx.fillStyle =
          status === "critical"
            ? "#fecaca"
            : status === "warning"
            ? "#fef3c7"
            : "#bbf7d0";

        ctx.font = "bold 22px Arial";
        ctx.textAlign = "center";
        ctx.fillText(sensor.area || `Petak ${index + 1}`, 80, 31);
      }

      const labelTexture = new THREE.CanvasTexture(labelCanvas);

      const label = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: labelTexture,
          transparent: true,
          depthTest: false,
        })
      );

      label.scale.set(1.35, 0.42, 1);
      label.position.set(0, heightBox + 1, 0);
      group.add(label);

      group.userData.sensor = sensor;

      scene.add(group);

      plots.push({
        group,
        base,
        top,
        sensor,
        heightBox,
      });
    });

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const ring = new THREE.Mesh(
      new THREE.RingGeometry(1.1, 1.22, 48),
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
      })
    );

    ring.rotation.x = -Math.PI / 2;
    ring.visible = false;
    scene.add(ring);

    const handleClick = (event) => {
      const rect = canvas.getBoundingClientRect();

      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const hits = raycaster.intersectObjects(
        plots.flatMap((item) => [item.base, item.top])
      );

      if (hits.length > 0) {
        const found = plots.find(
          (item) => item.base === hits[0].object || item.top === hits[0].object
        );

        if (found) {
          ring.position.set(
            found.group.position.x,
            found.heightBox + 0.1,
            found.group.position.z
          );

          ring.visible = true;

          if (onSelectPetak) {
            onSelectPetak(found.sensor);
          }
        }
      }
    };

    canvas.addEventListener("click", handleClick);

    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    let theta = 0.35;
    let phi = 1.05;
    let radius = 13;

    const updateCamera = () => {
      camera.position.x = radius * Math.sin(phi) * Math.sin(theta);
      camera.position.y = radius * Math.cos(phi);
      camera.position.z = radius * Math.sin(phi) * Math.cos(theta);
      camera.lookAt(0, 0.3, 0);
    };

    updateCamera();

    const handleMouseDown = (event) => {
      isDragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
    };

    const handleMouseMove = (event) => {
      if (!isDragging) return;

      theta -= (event.clientX - lastX) * 0.008;
      phi += (event.clientY - lastY) * 0.006;

      phi = Math.max(0.35, Math.min(1.45, phi));

      lastX = event.clientX;
      lastY = event.clientY;

      updateCamera();
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleWheel = (event) => {
      radius += event.deltaY * 0.018;
      radius = Math.max(6, Math.min(20, radius));
      updateCamera();
      event.preventDefault();
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    let frameId;
    let time = 0;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      time += 0.016;

      plots.forEach((plot, index) => {
        plot.group.position.y = Math.sin(time + index * 0.4) * 0.035;
      });

      ring.material.opacity = 0.45 + Math.sin(time * 3) * 0.25;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const newWidth = parent?.clientWidth || 800;
      const newHeight = 460;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);

      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("wheel", handleWheel);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("resize", handleResize);

      renderer.dispose();
    };
  }, [sensors, onSelectPetak]);

  if (sensors.length === 0) {
    return (
      <div className="canvas-empty">
        <Sprout size={42} />
        <strong>Menunggu data sensor...</strong>
        <p>Pastikan backend berjalan dan endpoint /api/sensors mengirim data.</p>
      </div>
    );
  }

  return (
    <div className="lahan-3d-wrap">
      <canvas ref={canvasRef} className="lahan-3d-canvas" />

      <div className="lahan-legend">
        <span className="leg normal">Normal</span>
        <span className="leg warning">Waspada</span>
        <span className="leg critical">Kritis</span>
      </div>
    </div>
  );
}

export default Farm3D;