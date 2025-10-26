'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface PathNode {
  id: string;
  title: string;
  description: string;
  status: 'not_started' | 'in_progress' | 'completed';
  steps: string[];
}

interface TreePath3DProps {
  nodes: PathNode[];
  theme?: 'agriculture' | 'technology' | 'business';
}

export function TreePath3D({ nodes, theme = 'agriculture' }: TreePath3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Colors based on theme
    const colors = {
      agriculture: {
        primary: 0x4CAF50,    // Green
        secondary: 0x8BC34A,  // Light green
        accent: 0xFF9800,     // Orange
        text: 0x2E7D32       // Dark green
      },
      technology: {
        primary: 0x2196F3,    // Blue
        secondary: 0x64B5F6,  // Light blue
        accent: 0xFF5722,     // Red
        text: 0x1565C0       // Dark blue
      },
      business: {
        primary: 0x9C27B0,    // Purple
        secondary: 0xBA68C8,  // Light purple
        accent: 0xFFC107,     // Yellow
        text: 0x6A1B9A       // Dark purple
      }
    };

    const themeColors = colors[theme];

    // Create tree structure
    const treeGroup = new THREE.Group();
    scene.add(treeGroup);

    // Create trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.5, 4, 8);
    const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8D6E63 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = -2;
    trunk.castShadow = true;
    treeGroup.add(trunk);

    // Create branches and nodes
    const nodePositions: THREE.Vector3[] = [];
    const branchGroup = new THREE.Group();

    nodes.forEach((node, index) => {
      const angle = (index / nodes.length) * Math.PI * 2;
      const radius = 3 + Math.random() * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = 2 + Math.random() * 3;

      const position = new THREE.Vector3(x, y, z);
      nodePositions.push(position);

      // Create branch
      const branchGeometry = new THREE.CylinderGeometry(0.05, 0.1, 2, 6);
      const branchMaterial = new THREE.MeshLambertMaterial({ color: themeColors.secondary });
      const branch = new THREE.Mesh(branchGeometry, branchMaterial);
      
      // Position branch
      const branchDirection = position.clone().normalize();
      branch.position.copy(position.clone().multiplyScalar(0.5));
      branch.lookAt(position);
      branch.rotateX(Math.PI / 2);
      branch.castShadow = true;
      branchGroup.add(branch);

      // Create node sphere
      const nodeGeometry = new THREE.SphereGeometry(0.4, 16, 16);
      const nodeMaterial = new THREE.MeshLambertMaterial({ 
        color: node.status === 'completed' ? themeColors.primary : 
               node.status === 'in_progress' ? themeColors.accent : 0x666666
      });
      const nodeSphere = new THREE.Mesh(nodeGeometry, nodeMaterial);
      nodeSphere.position.copy(position);
      nodeSphere.castShadow = true;
      nodeSphere.receiveShadow = true;
      branchGroup.add(nodeSphere);

      // Add glow effect for active nodes
      if (node.status === 'in_progress') {
        const glowGeometry = new THREE.SphereGeometry(0.6, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({ 
          color: themeColors.accent,
          transparent: true,
          opacity: 0.3
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.copy(position);
        branchGroup.add(glow);
      }

      // Create connection lines
      if (index > 0) {
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, 0),
          position.clone().multiplyScalar(0.3)
        ]);
        const lineMaterial = new THREE.LineBasicMaterial({ 
          color: themeColors.secondary,
          transparent: true,
          opacity: 0.6
        });
        const line = new THREE.Line(lineGeometry, lineMaterial);
        branchGroup.add(line);
      }
    });

    treeGroup.add(branchGroup);

    // Add leaves
    for (let i = 0; i < 50; i++) {
      const leafGeometry = new THREE.SphereGeometry(0.1, 4, 4);
      const leafMaterial = new THREE.MeshLambertMaterial({ 
        color: themeColors.primary,
        transparent: true,
        opacity: 0.7
      });
      const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
      
      const angle = Math.random() * Math.PI * 2;
      const radius = 2 + Math.random() * 3;
      leaf.position.set(
        Math.cos(angle) * radius,
        1 + Math.random() * 4,
        Math.sin(angle) * radius
      );
      leaf.castShadow = true;
      treeGroup.add(leaf);
    }

    // Animation
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      // Rotate tree slowly
      treeGroup.rotation.y += 0.005;
      
      // Animate nodes
      branchGroup.children.forEach((child, index) => {
        if (child instanceof THREE.Mesh && child.geometry.type === 'SphereGeometry') {
          child.rotation.y += 0.01;
          child.scale.setScalar(1 + Math.sin(Date.now() * 0.001 + index) * 0.1);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [nodes, theme]);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-96 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg overflow-hidden"
      style={{ minHeight: '400px' }}
    />
  );
}
