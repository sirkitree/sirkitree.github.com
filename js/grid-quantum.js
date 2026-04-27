// Quantum Weave background grid.
// Per-row InstancedMesh for hexagons + one merged LineSegments per row for the
// connecting threads. 30fps cap; movement uses real delta-time (clamped so RAF
// resume after a tab/Spaces switch doesn't snap rows forward).
(async () => {
    const THREE = await import('https://cdn.skypack.dev/three@0.136.0');

    const canvas = document.querySelector('#grid-canvas');
    if (!canvas) {
        console.error('Quantum grid: Canvas not found');
        return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: false,
        powerPreference: 'high-performance'
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const colors = {
      electricBlue: 0x00d4ff,
      violet: 0x9d00ff,
      silver: 0xc0c0ff,
      cyan: 0x00ffff,
      magenta: 0xff00ff
    };

    const gridSize = 30;
    const cellSize = 1;
    const rowCount = 30;
    const rowDepth = cellSize * rowCount;
    const edgeDepth = 8;

    const voxelGeometry = new THREE.CylinderGeometry(
        cellSize * 0.5, cellSize * 0.5, cellSize * 0.4, 6, 1
    );

    // Single shared base material — each row clones it for per-row opacity.
    const baseVoxelMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });

    const baseThreadMaterial = new THREE.LineBasicMaterial({
      color: colors.electricBlue,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending
    });

    scene.add(new THREE.AmbientLight(0xffffff, 0.2));
    const mainLight = new THREE.PointLight(colors.cyan, 0.6, 50);
    mainLight.position.set(0, 5, 10);
    scene.add(mainLight);

    const randomOffsets = [];
    const randomSpeeds = [];
    const randomAmplitudes = [];
    for (let i = 0; i < rowCount * edgeDepth * 2; i++) {
      randomOffsets.push(Math.random() * Math.PI * 2);
      randomSpeeds.push(0.03 + Math.random() * 0.22);
      randomAmplitudes.push(0.4 + Math.random() * 0.6);
    }

    const colorOptions = [
      new THREE.Color(colors.cyan),
      new THREE.Color(colors.magenta),
      new THREE.Color(colors.electricBlue)
    ];

    const rows = [];
    const tempMatrix = new THREE.Matrix4();

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      const voxelMaterial = baseVoxelMaterial.clone();
      const instancedMesh = new THREE.InstancedMesh(voxelGeometry, voxelMaterial, gridSize);
      instancedMesh.frustumCulled = false;

      const voxelData = new Array(gridSize);
      const threadVerts = [];

      for (let i = 0; i < gridSize; i++) {
        const x = -gridSize / 2 + i;
        const distance = Math.abs(x / (gridSize / 4));
        const baseHeight = Math.max(0.1, distance * 0.8);

        let xPos = x * cellSize;
        if (rowIndex % 2 !== 0) xPos += cellSize * 0.5;

        const distanceFromEdge = Math.min(
          Math.abs(x + gridSize / 2),
          Math.abs(x - (gridSize / 2 - 1))
        );
        const isEdge = distanceFromEdge < edgeDepth;

        let edgeIndex = -1;
        let edgeFactorPow = 0;
        if (isEdge) {
          const isLeftSide = x < 0;
          const columnFromEdge = isLeftSide
            ? Math.abs(x + gridSize / 2)
            : Math.abs(x - (gridSize / 2 - 1));
          edgeIndex = rowIndex * edgeDepth * 2
            + (isLeftSide ? columnFromEdge : edgeDepth + columnFromEdge);
          edgeFactorPow = Math.pow(8 - (columnFromEdge / edgeDepth), 0.7);
        }

        voxelData[i] = {
          xPos, baseHeight,
          xPosition: distance,
          isEdge, edgeIndex, edgeFactorPow
        };

        tempMatrix.makeScale(1, baseHeight, 1);
        tempMatrix.setPosition(xPos, 0, 0);
        instancedMesh.setMatrixAt(i, tempMatrix);

        const c = colorOptions[Math.floor(Math.random() * 3)];
        instancedMesh.setColorAt(i, c);

        // Horizontal threads: connect every other hex to the next
        if (i < gridSize - 1 && i % 2 === 0) {
          threadVerts.push(xPos, 0, 0, xPos + cellSize, 0, 0);
        }
        // Diagonal thread to next row
        if (rowIndex < rowCount - 1 && i < gridSize - 1 && (i + rowIndex) % 2 === 0) {
          const nextRowXPos = xPos + (rowIndex % 2 === 0 ? cellSize * 0.5 : 0);
          threadVerts.push(xPos, 0, 0, nextRowXPos, 0, cellSize);
        }
      }

      instancedMesh.instanceMatrix.needsUpdate = true;
      if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;

      const row = new THREE.Group();
      row.add(instancedMesh);

      // Single LineSegments for all threads in this row
      if (threadVerts.length > 0) {
        const threadGeom = new THREE.BufferGeometry();
        threadGeom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(threadVerts), 3));
        const threadMat = baseThreadMaterial.clone();
        const threadMesh = new THREE.LineSegments(threadGeom, threadMat);
        row.add(threadMesh);
        row.userData.threadMaterial = threadMat;
      }

      row.position.z = rowIndex * cellSize - (rowDepth / 2);
      row.userData.instancedMesh = instancedMesh;
      row.userData.material = voxelMaterial;
      row.userData.voxelData = voxelData;
      scene.add(row);
      rows.push(row);
    }

    // Depth particles
    const particleCount = 60;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 60;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 60;

      const c = colorOptions[Math.floor(Math.random() * 3)];
      particleColors[i * 3]     = c.r;
      particleColors[i * 3 + 1] = c.g;
      particleColors[i * 3 + 2] = c.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.2,
      transparent: true,
      opacity: 0.3,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    camera.position.y = 8;
    camera.position.z = 20;
    camera.rotation.x = -Math.PI / 8;

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    const targetInterval = 1000 / 30;
    const maxDt = (targetInterval * 2) / 1000;
    let lastFrameTime = 0;

    function animate(currentTime) {
      requestAnimationFrame(animate);

      const elapsed = currentTime - lastFrameTime;
      if (elapsed < targetInterval) return;
      const dt = Math.min(elapsed / 1000, maxDt);
      lastFrameTime = currentTime - (elapsed % targetInterval);

      const time = currentTime * 0.001;
      const speed = 0.5;
      const cameraZ = camera.position.z;

      let minRowZ = Infinity;
      for (let r = 0; r < rows.length; r++) {
        if (rows[r].position.z < minRowZ) minRowZ = rows[r].position.z;
      }

      const pulse = (Math.sin(time * 1.5) + 1) * 0.5;
      const voxelOpacityBase = 0.3 + pulse * 0.2;

      rows.forEach((row) => {
        row.position.z += speed * dt;

        if (row.position.z > cameraZ + 5) {
          row.position.z = minRowZ - cellSize;
          minRowZ = row.position.z;
        } else if (row.position.z < minRowZ) {
          minRowZ = row.position.z;
        }

        const distanceFromCamera = Math.abs(row.position.z - cameraZ);
        const normalizedDistance = distanceFromCamera / 30;
        const opacity = Math.max(0, Math.min(1, 1 - (normalizedDistance * normalizedDistance)));
        const distanceToCamera = Math.min(1, Math.max(0, (row.position.z - (cameraZ - 30)) / 60));

        row.visible = opacity > 0.05;
        if (!row.visible) return;

        row.userData.material.opacity = opacity * voxelOpacityBase;
        if (row.userData.threadMaterial) {
          row.userData.threadMaterial.opacity = opacity * 0.3;
        }

        const im = row.userData.instancedMesh;
        const voxelData = row.userData.voxelData;
        for (let i = 0; i < voxelData.length; i++) {
          const vd = voxelData[i];
          let heightIncrease = vd.xPosition * distanceToCamera * 2;

          if (vd.isEdge) {
            const offset = randomOffsets[vd.edgeIndex];
            const animSpeed = randomSpeeds[vd.edgeIndex];
            const amplitude = randomAmplitudes[vd.edgeIndex];
            heightIncrease += (
              Math.sin(time * animSpeed + offset) * amplitude +
              Math.sin(time * animSpeed * 0.7 + offset * 1.3) * amplitude * 0.7
            ) * vd.edgeFactorPow;
          }

          const scaleY = vd.baseHeight + heightIncrease;
          tempMatrix.makeScale(1, scaleY, 1);
          tempMatrix.setPosition(vd.xPos, 0, 0);
          im.setMatrixAt(i, tempMatrix);
        }
        im.instanceMatrix.needsUpdate = true;
      });

      const particleDelta = (speed * 0.02) * (dt / 0.01667);
      const ppos = particles.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        ppos[i * 3 + 2] += particleDelta;
        if (ppos[i * 3 + 2] > 30) ppos[i * 3 + 2] = -30;
      }
      particles.geometry.attributes.position.needsUpdate = true;
      particles.rotation.y = time * 0.01;

      renderer.render(scene, camera);
    }

    animate(0);
})();
