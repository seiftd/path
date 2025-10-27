'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface PathNode {
  id: string;
  title: string;
  description: string;
  status: 'not_started' | 'in_progress' | 'completed';
  steps: string[];
  resources: Array<{
    title: string;
    url: string;
    type: 'course' | 'article' | 'book' | 'tool';
  }>;
}

interface TreePath3DProps {
  nodes: PathNode[];
  onNodeClick: (node: PathNode) => void;
  completedNodes: string[];
}

export function TreePath3D({ nodes, onNodeClick, completedNodes }: TreePath3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationRef = useRef<number | null>(null);
  const [selectedNode, setSelectedNode] = useState<PathNode | null>(null);
  const branchesRef = useRef<THREE.Group[]>([]);
  const leavesRef = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f9ff);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 15);
    camera.lookAt(0, 3, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x4ade80, 0.5, 20);
    pointLight.position.set(0, 8, 0);
    scene.add(pointLight);

    // Ground (subtle)
    const groundGeometry = new THREE.CircleGeometry(10, 32);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0xc7f9cc,
      opacity: 0.3,
      transparent: true,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.1;
    ground.receiveShadow = true;
    scene.add(ground);

    // Create Tree Trunk
    const createTrunk = () => {
      const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.5, 4, 16);
      const trunkMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b4513,
        roughness: 0.8,
        metalness: 0.2,
      });
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      trunk.position.y = 2;
      trunk.castShadow = true;
      trunk.receiveShadow = true;
      scene.add(trunk);

      // Add bark texture detail
      const barkDetail = new THREE.Group();
      for (let i = 0; i < 8; i++) {
        const ringGeometry = new THREE.TorusGeometry(0.32, 0.05, 8, 16);
        const ringMaterial = new THREE.MeshStandardMaterial({
          color: 0x654321,
          roughness: 0.9,
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 0.5 + i * 0.5;
        barkDetail.add(ring);
      }
      scene.add(barkDetail);
    };

    // Create Branches
    const createBranches = () => {
      const positions = [
        { x: 0, y: 5, z: 0, angle: 0 },      // Foundation - center top
        { x: -3, y: 4, z: 1, angle: -45 },   // Product - left
        { x: 3, y: 4, z: 1, angle: 45 },     // Marketing - right
        { x: -2, y: 3, z: -1, angle: -30 },  // Operations - left lower
        { x: 2, y: 3, z: -1, angle: 30 },    // Finance - right lower
      ];

      positions.forEach((pos, index) => {
        const branchGroup = new THREE.Group();
        
        // Branch stem
        const branchGeometry = new THREE.CylinderGeometry(0.08, 0.15, 2, 8);
        const branchMaterial = new THREE.MeshStandardMaterial({
          color: 0xa0522d,
          roughness: 0.7,
        });
        const branch = new THREE.Mesh(branchGeometry, branchMaterial);
        branch.rotation.z = (pos.angle * Math.PI) / 180;
        branch.position.set(pos.x / 2, pos.y - 0.5, pos.z / 2);
        branch.castShadow = true;
        branchGroup.add(branch);

        // Create leaves cluster
        const createLeaf = (offsetX: number, offsetY: number, offsetZ: number, index: number) => {
          const isCompleted = completedNodes.includes(nodes[index]?.id);
          
          // Leaf geometry
          const leafGeometry = new THREE.SphereGeometry(0.4, 16, 16);
          const leafMaterial = new THREE.MeshStandardMaterial({
            color: isCompleted ? 0x4ade80 : 0x86efac,
            roughness: 0.4,
            metalness: 0.1,
            emissive: isCompleted ? 0x22c55e : 0x000000,
            emissiveIntensity: isCompleted ? 0.3 : 0,
          });
          const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
          leaf.position.set(pos.x + offsetX, pos.y + offsetY, pos.z + offsetZ);
          leaf.castShadow = true;
          leaf.userData = { nodeIndex: index };
          scene.add(leaf);
          leavesRef.current[index] = leaf;

          // Add glow effect for completed nodes
          if (isCompleted) {
            const glowGeometry = new THREE.SphereGeometry(0.5, 16, 16);
            const glowMaterial = new THREE.MeshBasicMaterial({
              color: 0x4ade80,
              transparent: true,
              opacity: 0.2,
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            leaf.add(glow);
          }
        };

        createLeaf(0, 0, 0, index);
        branchesRef.current[index] = branchGroup;
        scene.add(branchGroup);
      });
    };

    // Add floating particles
    const createParticles = () => {
      const particlesGeometry = new THREE.BufferGeometry();
      const particlesCount = 100;
      const positions = new Float32Array(particlesCount * 3);

      for (let i = 0; i < particlesCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 10;
        positions[i + 1] = Math.random() * 8;
        positions[i + 2] = (Math.random() - 0.5) * 10;
      }

      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const particlesMaterial = new THREE.PointsMaterial({
        color: 0x86efac,
        size: 0.05,
        transparent: true,
        opacity: 0.6,
      });

      const particles = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particles);

      return particles;
    };

    createTrunk();
    createBranches();
    const particles = createParticles();

    // Animation
    let time = 0;
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      time += 0.01;

      // Gentle camera rotation
      camera.position.x = Math.sin(time * 0.1) * 15;
      camera.position.z = Math.cos(time * 0.1) * 15;
      camera.lookAt(0, 3, 0);

      // Animate leaves (breathing effect)
      leavesRef.current.forEach((leaf, index) => {
        if (leaf) {
          leaf.position.y += Math.sin(time + index) * 0.001;
          leaf.rotation.y += 0.005;
        }
      });

      // Animate particles
      particles.rotation.y += 0.0005;
      const positions = particles.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += Math.sin(time + i) * 0.001;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
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
  }, [completedNodes, nodes]);

  return (
    <div className="relative w-full h-[600px]">
      <div ref={mountRef} className="w-full h-full rounded-xl overflow-hidden shadow-2xl" />
      
      {/* Node Labels Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {nodes.map((node, index) => {
          const positions = [
            { x: 50, y: 15 },   // Foundation
            { x: 20, y: 35 },   // Product
            { x: 80, y: 35 },   // Marketing
            { x: 30, y: 55 },   // Operations
            { x: 70, y: 55 },   // Finance
          ];
          const pos = positions[index];
          const isCompleted = completedNodes.includes(node.id);

          return (
            <motion.button
              key={node.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.2 }}
              className="absolute pointer-events-auto"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              onClick={() => onNodeClick(node)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={`px-4 py-2 rounded-full shadow-lg backdrop-blur-sm transition-all ${
                isCompleted 
                  ? 'bg-green-500/90 text-white' 
                  : 'bg-white/90 text-gray-700 hover:bg-green-100/90'
              }`}>
                <div className="flex items-center gap-2">
                  {isCompleted && <CheckCircle className="w-4 h-4" />}
                  <span className="text-sm font-semibold">{node.title}</span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Info Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center"
      >
        <p className="text-sm text-gray-600 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow">
          🌳 شجرة رحلتك التفاعلية ثلاثية الأبعاد
        </p>
      </motion.div>
    </div>
  );
}
