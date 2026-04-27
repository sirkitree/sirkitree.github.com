// Background voxel grid (blog pages).
// Per-row InstancedMesh: one draw call per row instead of one per voxel.
// 30fps cap; movement uses real delta-time (clamped so RAF resume after a tab/
// Spaces switch doesn't snap rows forward).
if (window.DISABLE_GRID) {
  console.log('Grid disabled for this page');
} else {
  (async () => {
    const THREE = await import('https://unpkg.com/three@0.136.0/build/three.module.js');

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#grid-canvas'),
        alpha: true,
        antialias: false,
        powerPreference: 'high-performance'
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const gridSize = 40;
    const cellSize = 1;
    const rowCount = gridSize;
    const rowDepth = cellSize * rowCount;
    const edgeDepth = 12;

    const voxelGeometry = new THREE.CylinderGeometry(
        cellSize * 0.5, cellSize * 0.5, cellSize, 6
    );

    const baseMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 1
    });

    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    const randomOffsets = [];
    const randomSpeeds = [];
    const randomAmplitudes = [];
    for (let i = 0; i < rowCount * edgeDepth * 2; i++) {
        randomOffsets.push(Math.random() * Math.PI * 2);
        randomSpeeds.push(0.03 + Math.random() * 0.22);
        randomAmplitudes.push(0.4 + Math.random() * 0.6);
    }

    const rows = [];
    const tempMatrix = new THREE.Matrix4();
    const tempColor = new THREE.Color();

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
        const material = baseMaterial.clone();
        const instancedMesh = new THREE.InstancedMesh(voxelGeometry, material, gridSize);
        instancedMesh.frustumCulled = false;

        const voxelData = new Array(gridSize);

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
                edgeFactorPow = Math.pow(12 - (columnFromEdge / edgeDepth), 0.7);
            }

            voxelData[i] = {
                xPos, baseHeight,
                xPosition: distance,
                isEdge, edgeIndex, edgeFactorPow
            };

            tempMatrix.makeScale(1, baseHeight, 1);
            tempMatrix.setPosition(xPos, 0, 0);
            instancedMesh.setMatrixAt(i, tempMatrix);

            const hue = (baseHeight * 0.1) + 0.95;
            tempColor.setHSL(hue, 0.8, 0.5);
            instancedMesh.setColorAt(i, tempColor);
        }

        instancedMesh.instanceMatrix.needsUpdate = true;
        if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;

        const row = new THREE.Group();
        row.add(instancedMesh);
        row.position.z = rowIndex * cellSize - (rowDepth / 2);
        row.userData.instancedMesh = instancedMesh;
        row.userData.material = material;
        row.userData.voxelData = voxelData;
        scene.add(row);
        rows.push(row);
    }

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

        rows.forEach((row) => {
            row.position.z += speed * dt;

            if (row.position.z > cameraZ + 5) {
                row.position.z = minRowZ - cellSize;
                minRowZ = row.position.z;
            } else if (row.position.z < minRowZ) {
                minRowZ = row.position.z;
            }

            const distanceToCamera = Math.min(1, Math.max(0,
                (row.position.z - (cameraZ - 30)) / 60
            ));

            const distanceFromCamera = Math.abs(row.position.z - cameraZ);
            const normalizedDistance = distanceFromCamera / 30;
            const opacity = Math.max(0, Math.min(1,
                1 - (normalizedDistance * normalizedDistance)
            ));
            row.visible = opacity > 0.01;
            if (!row.visible) return;

            row.userData.material.opacity = opacity;

            const im = row.userData.instancedMesh;
            const voxelData = row.userData.voxelData;
            for (let i = 0; i < voxelData.length; i++) {
                const vd = voxelData[i];
                let heightIncrease = vd.xPosition * distanceToCamera * 2;

                if (vd.isEdge) {
                    const offset = randomOffsets[vd.edgeIndex];
                    const edgeSpeed = randomSpeeds[vd.edgeIndex];
                    const amplitude = randomAmplitudes[vd.edgeIndex];
                    heightIncrease += (
                        Math.sin(time * edgeSpeed + offset) * amplitude +
                        Math.sin(time * edgeSpeed * 0.7 + offset * 1.3) * amplitude * 0.7
                    ) * vd.edgeFactorPow;
                }

                const scaleY = vd.baseHeight + heightIncrease;
                tempMatrix.makeScale(1, scaleY, 1);
                tempMatrix.setPosition(vd.xPos, 0, 0);
                im.setMatrixAt(i, tempMatrix);
            }
            im.instanceMatrix.needsUpdate = true;
        });

        renderer.render(scene, camera);
    }

    animate(0);
  })();
}
