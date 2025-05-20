import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';

// Set up scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#grid-canvas'),
    alpha: true,
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Create voxels
const gridSize = 40;
const cellSize = 1;
// Use a hexagonal prism instead of a cube
const voxelGeometry = new THREE.CylinderGeometry(
    cellSize * 0.5, // radiusTop
    cellSize * 0.5, // radiusBottom
    cellSize,       // height
    6               // radialSegments creates a hexagon
);

// Create edge geometry for outline
const edgeGeometry = new THREE.EdgesGeometry(voxelGeometry);
const edgeMaterial = new THREE.LineBasicMaterial({ 
    color: 0x400000,
    opacity: 0.8,
    transparent: true
});

const voxelMaterial = new THREE.MeshPhongMaterial({
    color: 0x220000,
    transparent: false,
    opacity: 1,
    shininess: 20,
    specular: 0x110000
});

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Create rows of voxels
const rows = [];
const rowCount = gridSize;
const rowDepth = cellSize * gridSize;
const edgeDepth = 12; // Increased to 12 columns from each edge

// Create random offsets for edge animations
const randomOffsets = [];
const randomSpeeds = [];
const randomAmplitudes = [];
for (let i = 0; i < rowCount * edgeDepth * 2; i++) {  // Both edges, multiple columns deep
    randomOffsets.push(Math.random() * Math.PI * 2);
    randomSpeeds.push(0.03 + Math.random() * 0.22); // Even slower for smoother movement
    randomAmplitudes.push(0.4 + Math.random() * 0.6); // Much larger amplitude range
}

for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
    const row = new THREE.Group();
    
    for (let x = -gridSize/2; x < gridSize/2; x++) {
        const voxelGroup = new THREE.Group();
        const voxel = new THREE.Mesh(voxelGeometry, voxelMaterial.clone());
        const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial.clone());
        
        voxelGroup.add(voxel);
        voxelGroup.add(edges);
        
        // Calculate base height using distance from center
        const distance = Math.abs(x / (gridSize/4));
        const baseHeight = Math.max(0.1, distance * 0.8);

        let xPos = x * cellSize;
        if (rowIndex % 2 !== 0) {
            xPos += cellSize * 0.5;
        }
        voxelGroup.position.set(
            xPos,
            0,
            0
        );
        
        voxelGroup.scale.y = baseHeight;
        voxelGroup.userData.baseHeight = baseHeight;
        voxelGroup.userData.xPosition = distance;
        
        // Mark edge columns (multiple deep)
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
                rowIndex * edgeDepth * 2 + // Row offset
                (isLeftSide ? columnFromEdge : edgeDepth + columnFromEdge); // Column position
            
            // Decrease base animation amplitude as we move inward
            voxelGroup.userData.edgeFactor = 12 - (columnFromEdge / edgeDepth);
        }
        
        // Add slight color variation based on height
        const hue = (baseHeight * 0.1) + 0.95;
        voxel.material.color.setHSL(hue, 0.8, 0.5);
        edges.material.color.setHSL(hue, 0.8, 0.6);
        
        row.add(voxelGroup);
    }
    
    row.position.z = rowIndex * cellSize - (rowDepth / 2);
    row.userData.initialZ = row.position.z;
    scene.add(row);
    rows.push(row);
}

// Position camera closer and lower for a more intimate view
camera.position.y = 8;
camera.position.z = 20;
camera.rotation.x = -Math.PI / 8;

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    const time = Date.now() * 0.001;
    const speed = 0.5;

    rows.forEach((row) => {
        row.position.z += speed * 0.016;

        if (row.position.z > camera.position.z + 5) {
            let farthestZ = row.position.z;
            rows.forEach(r => {
                if (r.position.z < farthestZ) {
                    farthestZ = r.position.z;
                }
            });
            row.position.z = farthestZ - cellSize;
        }

        const distanceToCamera = Math.min(1, Math.max(0, 
            (row.position.z - (camera.position.z - 30)) / 60
        ));
        
        row.children.forEach((voxelGroup) => {
            const baseHeight = voxelGroup.userData.baseHeight;
            const xPosition = voxelGroup.userData.xPosition;
            
            let heightIncrease = xPosition * distanceToCamera * 2;
            
            // Add random movement to edge voxels with gradual falloff
            if (voxelGroup.userData.isEdge) {
                const edgeIndex = voxelGroup.userData.edgeIndex;
                const offset = randomOffsets[edgeIndex];
                const speed = randomSpeeds[edgeIndex];
                const amplitude = randomAmplitudes[edgeIndex];
                const edgeFactor = Math.pow(voxelGroup.userData.edgeFactor, 0.7); // Less aggressive falloff
                
                // Combine two sine waves for more organic movement
                heightIncrease += (
                    Math.sin(time * speed + offset) * amplitude +
                    Math.sin(time * speed * 0.7 + offset * 1.3) * amplitude * 0.7
                ) * edgeFactor;
            }
            
            voxelGroup.scale.y = baseHeight + heightIncrease;
            
            // Calculate opacity based on distance
            const maxDistance = 30;
            const distanceFromCamera = Math.abs(row.position.z - camera.position.z);
            const normalizedDistance = distanceFromCamera / maxDistance;
            const opacity = Math.max(0, Math.min(1, 
                1 - (normalizedDistance * normalizedDistance)
            ));
            
            voxelGroup.children.forEach(mesh => {
                if (mesh.material.transparent !== undefined) {
                    mesh.material.transparent = true;
                    mesh.material.opacity = opacity;
                    mesh.material.needsUpdate = true;
                }
            });
        });
    });

    renderer.render(scene, camera);
}

animate(); 