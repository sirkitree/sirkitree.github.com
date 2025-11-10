// Quantum Electromagnetic Field Grid - Performance Optimized
// Inspired by: fiber optic meets neural network meets sacred geometry
// This grid is specifically for Quantum Weave pages
console.log('Quantum grid script loading...');

(async () => {
    const THREE = await import('https://cdn.skypack.dev/three@0.136.0');
    console.log('Three.js loaded for quantum grid');

    // Wait for canvas to be available
    const canvas = document.querySelector('#grid-canvas');
    if (!canvas) {
        console.error('Quantum grid: Canvas not found');
        return;
    }

    console.log('Quantum grid: Canvas found, initializing...');

    // Set up scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    // Limit pixel ratio for better performance on retina displays
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Cyberpunk color palette
    const colors = {
      electricBlue: 0x00d4ff,
      violet: 0x9d00ff,
      silver: 0xc0c0ff,
      cyan: 0x00ffff,
      magenta: 0xff00ff,
      deepSpace: 0x000520
    };

    // Grid configuration - reduced for performance
    const gridSize = 30;  // Reduced from 40
    const cellSize = 1;
    const rowCount = 30;  // Reduced from 40
    const rowDepth = cellSize * rowCount;
    const edgeDepth = 8;  // Reduced from 12

    // Create hexagonal voxel geometry (simpler version)
    const voxelGeometry = new THREE.CylinderGeometry(
        cellSize * 0.5,  // radiusTop
        cellSize * 0.5,  // radiusBottom
        cellSize * 0.4,  // height - thinner for node-like appearance
        6,               // radialSegments creates a hexagon
        1                // heightSegments - reduced from default
    );

    // Create edge geometry for glowing hexagon outlines
    const edgeGeometry = new THREE.EdgesGeometry(voxelGeometry);

    // Shared materials (reuse instead of creating new ones)
    const sharedVoxelMaterials = {
      cyan: new THREE.MeshBasicMaterial({
        color: colors.cyan,
        transparent: true,
        opacity: 0.3,
        emissive: colors.cyan,
        emissiveIntensity: 0.5,
        blending: THREE.AdditiveBlending
      }),
      magenta: new THREE.MeshBasicMaterial({
        color: colors.magenta,
        transparent: true,
        opacity: 0.3,
        emissive: colors.magenta,
        emissiveIntensity: 0.5,
        blending: THREE.AdditiveBlending
      }),
      electricBlue: new THREE.MeshBasicMaterial({
        color: colors.electricBlue,
        transparent: true,
        opacity: 0.3,
        emissive: colors.electricBlue,
        emissiveIntensity: 0.5,
        blending: THREE.AdditiveBlending
      })
    };

    const sharedEdgeMaterials = {
      cyan: new THREE.LineBasicMaterial({
        color: colors.electricBlue,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
      }),
      magenta: new THREE.LineBasicMaterial({
        color: colors.violet,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
      }),
      electricBlue: new THREE.LineBasicMaterial({
        color: colors.cyan,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
      })
    };

    const sharedThreadMaterials = {
      electricBlue: new THREE.LineBasicMaterial({
        color: colors.electricBlue,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
      }),
      violet: new THREE.LineBasicMaterial({
        color: colors.violet,
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending
      }),
      silver: new THREE.LineBasicMaterial({
        color: colors.silver,
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending
      })
    };

    // Add atmospheric lighting - reduced to one light for performance
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const mainLight = new THREE.PointLight(colors.cyan, 0.6, 50);
    mainLight.position.set(0, 5, 10);
    scene.add(mainLight);

    // Create random animation parameters
    const randomOffsets = [];
    const randomSpeeds = [];
    const randomAmplitudes = [];
    for (let i = 0; i < rowCount * edgeDepth * 2; i++) {
      randomOffsets.push(Math.random() * Math.PI * 2);
      randomSpeeds.push(0.03 + Math.random() * 0.22);
      randomAmplitudes.push(0.4 + Math.random() * 0.6);
    }

    // Build the hexagonal lattice
    const rows = [];

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      const row = new THREE.Group();

      for (let x = -gridSize/2; x < gridSize/2; x++) {
        const voxelGroup = new THREE.Group();

        // Choose quantum color palette and reuse shared materials
        const colorChoice = Math.random();
        let voxelMaterial, edgeMaterial;
        if (colorChoice < 0.33) {
          voxelMaterial = sharedVoxelMaterials.cyan;
          edgeMaterial = sharedEdgeMaterials.cyan;
        } else if (colorChoice < 0.66) {
          voxelMaterial = sharedVoxelMaterials.magenta;
          edgeMaterial = sharedEdgeMaterials.magenta;
        } else {
          voxelMaterial = sharedVoxelMaterials.electricBlue;
          edgeMaterial = sharedEdgeMaterials.electricBlue;
        }

        // Create hexagonal voxel and edges with shared materials
        const voxel = new THREE.Mesh(voxelGeometry, voxelMaterial);
        const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);

        voxelGroup.add(voxel);
        voxelGroup.add(edges);

        // Calculate base height using distance from center
        const distance = Math.abs(x / (gridSize/4));
        const baseHeight = Math.max(0.1, distance * 0.8);

        // Position with hexagonal offset pattern
        let xPos = x * cellSize;
        if (rowIndex % 2 !== 0) {
          xPos += cellSize * 0.5;
        }

        voxelGroup.position.set(xPos, 0, 0);
        voxelGroup.scale.y = baseHeight;
        voxelGroup.userData.baseHeight = baseHeight;
        voxelGroup.userData.xPosition = distance;

        // Mark edge columns for animation
        const distanceFromEdge = Math.min(
          Math.abs(x + gridSize/2),
          Math.abs(x - (gridSize/2 - 1))
        );
        voxelGroup.userData.isEdge = distanceFromEdge < edgeDepth;
        if (voxelGroup.userData.isEdge) {
          const isLeftSide = x < 0;
          const columnFromEdge = isLeftSide ?
            Math.abs(x + gridSize/2) :
            Math.abs(x - (gridSize/2 - 1));
          voxelGroup.userData.edgeIndex =
            rowIndex * edgeDepth * 2 +
            (isLeftSide ? columnFromEdge : edgeDepth + columnFromEdge);
          voxelGroup.userData.edgeFactor = 8 - (columnFromEdge / edgeDepth);
        }

        row.add(voxelGroup);

        // Add connecting threads - only every other connection for performance
        if (x < gridSize/2 - 1 && x % 2 === 0) {
          const threadGeometry = new THREE.BufferGeometry();
          const positions = new Float32Array(6);
          positions[0] = xPos;
          positions[1] = 0;
          positions[2] = 0;
          positions[3] = xPos + cellSize;
          positions[4] = 0;
          positions[5] = 0;
          threadGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

          const threadMaterialKey = ['electricBlue', 'violet', 'silver'][Math.floor(Math.random() * 3)];
          const thread = new THREE.Line(threadGeometry, sharedThreadMaterials[threadMaterialKey]);
          row.add(thread);
        }

        // Diagonal connections - reduced frequency
        if (rowIndex < rowCount - 1 && x < gridSize/2 - 1 && (x + rowIndex) % 2 === 0) {
          const nextRowXPos = xPos + (rowIndex % 2 === 0 ? cellSize * 0.5 : 0);

          const threadGeometry = new THREE.BufferGeometry();
          const positions = new Float32Array(6);
          positions[0] = xPos;
          positions[1] = 0;
          positions[2] = 0;
          positions[3] = nextRowXPos;
          positions[4] = 0;
          positions[5] = cellSize;
          threadGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

          const threadMaterialKey = ['electricBlue', 'violet', 'silver'][Math.floor(Math.random() * 3)];
          const thread = new THREE.Line(threadGeometry, sharedThreadMaterials[threadMaterialKey]);
          row.add(thread);
        }
      }

      row.position.z = rowIndex * cellSize - (rowDepth / 2);
      row.userData.initialZ = row.position.z;
      scene.add(row);
      rows.push(row);
    }

    // Add depth particles - reduced count for performance
    const particleCount = 60;  // Reduced from 150
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 60;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 60;
      particleSizes[i] = Math.random() * 2 + 0.5;

      const colorChoice = Math.random();
      let color;
      if (colorChoice < 0.4) color = new THREE.Color(colors.cyan);
      else if (colorChoice < 0.7) color = new THREE.Color(colors.magenta);
      else color = new THREE.Color(colors.electricBlue);

      particleColors[i * 3] = color.r;
      particleColors[i * 3 + 1] = color.g;
      particleColors[i * 3 + 2] = color.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
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

    // Position camera (same as original grid)
    camera.position.y = 8;
    camera.position.z = 20;
    camera.rotation.x = -Math.PI / 8;

    // Handle window resize
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Animation loop - optimized
    let lastTime = 0;
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;

    function animate(currentTime) {
      requestAnimationFrame(animate);

      // Throttle to target FPS
      const deltaTime = currentTime - lastTime;
      if (deltaTime < frameInterval) return;
      lastTime = currentTime - (deltaTime % frameInterval);

      const time = currentTime * 0.001;
      const speed = 0.5;

      rows.forEach((row) => {
        row.position.z += speed * 0.016;

        // Wrap around when too far
        if (row.position.z > camera.position.z + 5) {
          let farthestZ = row.position.z;
          rows.forEach(r => {
            if (r.position.z < farthestZ) {
              farthestZ = r.position.z;
            }
          });
          row.position.z = farthestZ - cellSize;
        }

        // Calculate distance-based opacity once per row
        const distanceFromCamera = Math.abs(row.position.z - camera.position.z);
        const normalizedDistance = distanceFromCamera / 30;
        const opacity = Math.max(0, Math.min(1, 1 - (normalizedDistance * normalizedDistance)));
        const distanceToCamera = Math.min(1, Math.max(0, (row.position.z - (camera.position.z - 30)) / 60));

        row.children.forEach((child) => {
          // Handle voxel groups (hexagons)
          if (child.type === 'Group') {
            const baseHeight = child.userData.baseHeight;
            const xPosition = child.userData.xPosition;
            let heightIncrease = xPosition * distanceToCamera * 2;

            // Add edge animations
            if (child.userData.isEdge) {
              const edgeIndex = child.userData.edgeIndex;
              const offset = randomOffsets[edgeIndex];
              const animSpeed = randomSpeeds[edgeIndex];
              const amplitude = randomAmplitudes[edgeIndex];
              const edgeFactor = Math.pow(child.userData.edgeFactor, 0.7);

              heightIncrease += (
                Math.sin(time * animSpeed + offset) * amplitude +
                Math.sin(time * animSpeed * 0.7 + offset * 1.3) * amplitude * 0.7
              ) * edgeFactor;
            }

            child.scale.y = baseHeight + heightIncrease;

            // Simplified pulsing
            const pulse = (Math.sin(time * 1.5 + child.position.x) + 1) * 0.5;

            // Update only visible objects
            if (opacity > 0.05) {
              child.children.forEach(mesh => {
                if (mesh.type === 'Mesh') {
                  mesh.material.opacity = opacity * (0.3 + pulse * 0.2);
                  mesh.material.emissiveIntensity = 0.5 + pulse * 0.5;
                } else {
                  mesh.material.opacity = opacity * 0.8;
                }
              });
            } else {
              child.visible = false;
            }
          }
          // Handle thread lines
          else if (child.type === 'Line') {
            if (opacity > 0.05) {
              child.material.opacity = opacity * 0.3;
              child.visible = true;
            } else {
              child.visible = false;
            }
          }
        });
      });

      // Animate particles - simplified
      const particlePositions = particles.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        particlePositions[i * 3 + 2] += speed * 0.02;

        if (particlePositions[i * 3 + 2] > 30) {
          particlePositions[i * 3 + 2] = -30;
        }
      }
      particles.geometry.attributes.position.needsUpdate = true;
      particles.rotation.y = time * 0.01;  // Slower rotation

      renderer.render(scene, camera);
    }

    console.log('Quantum grid: Animation started');
    animate(0);
  })();
