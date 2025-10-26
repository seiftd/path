'use client';

import { motion } from 'framer-motion';
import { Circle, CheckCircle } from 'lucide-react';

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

interface TreePathProps {
  nodes: PathNode[];
  onNodeClick: (node: PathNode) => void;
  completedNodes: string[];
}

export function TreePath({ nodes, onNodeClick, completedNodes }: TreePathProps) {
  const getNodePosition = (index: number) => {
    const positions = [
      { x: 50, y: 20 },   // Foundation - trunk
      { x: 20, y: 40 },   // Product - left branch
      { x: 80, y: 40 },   // Marketing - right branch
      { x: 35, y: 60 },   // Operations - left leaf
      { x: 65, y: 60 },   // Finance - right leaf
    ];
    return positions[index] || { x: 50, y: 20 };
  };

  const getNodeColor = (nodeId: string) => {
    if (completedNodes.includes(nodeId)) {
      return 'text-green-600';
    }
    return 'text-gray-400';
  };

  const getNodeBgColor = (nodeId: string) => {
    if (completedNodes.includes(nodeId)) {
      return 'bg-green-100 border-green-300';
    }
    return 'bg-white border-gray-200';
  };

  return (
    <div className="relative w-full h-[500px]">
      {/* Tree Trunk */}
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: '200px' }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute left-1/2 transform -translate-x-1/2 w-4 bg-gradient-to-b from-amber-600 to-amber-800 rounded-full"
        style={{ top: '60%' }}
      />

      {/* Tree Branches */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute w-32 h-1 bg-gradient-to-r from-amber-600 to-amber-800 rounded-full"
        style={{ top: '45%', left: '20%', transform: 'rotate(-30deg)' }}
      />
      
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute w-32 h-1 bg-gradient-to-r from-amber-600 to-amber-800 rounded-full"
        style={{ top: '45%', right: '20%', transform: 'rotate(30deg)' }}
      />

      {/* Tree Leaves/Blossoms */}
      {nodes.map((node, index) => {
        const position = getNodePosition(index);
        const isCompleted = completedNodes.includes(node.id);
        
        return (
          <motion.div
            key={node.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.5 + index * 0.2 }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
            }}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNodeClick(node)}
              className={`relative w-16 h-16 rounded-full border-2 ${getNodeBgColor(node.id)} shadow-lg transition-all duration-300 hover:shadow-xl`}
            >
              {/* Leaf/Blossom Shape */}
              <div className="absolute inset-0 flex items-center justify-center">
                {isCompleted ? (
                  <CheckCircle className={`w-8 h-8 ${getNodeColor(node.id)}`} />
                ) : (
                  <div className={`w-6 h-6 rounded-full ${getNodeColor(node.id)} bg-current`} />
                )}
              </div>

              {/* Node Label */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <div className="text-xs font-medium text-gray-700 bg-white px-2 py-1 rounded shadow-sm">
                  {node.title}
                </div>
              </div>

              {/* Connection Lines */}
              {index > 0 && (
                <motion.div
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 1.5 + index * 0.2 }}
                  className="absolute w-1 h-1 bg-amber-600 rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              )}
            </motion.button>

            {/* Blossom Effect for Completed Nodes */}
            {isCompleted && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute inset-0 pointer-events-none"
              >
                <div className="absolute inset-0 rounded-full bg-green-200 animate-ping" />
                <div className="absolute inset-1 rounded-full bg-green-100 animate-pulse" />
              </motion.div>
            )}
          </motion.div>
        );
      })}

      {/* Growth Animation */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="w-full h-full bg-gradient-to-b from-green-100/20 to-transparent rounded-full" />
      </motion.div>
    </div>
  );
}
