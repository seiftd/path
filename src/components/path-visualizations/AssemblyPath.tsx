'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Circle, CheckCircle, Cog, Wrench } from 'lucide-react';

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

interface AssemblyPathProps {
  nodes: PathNode[];
  onNodeClick: (node: PathNode) => void;
  completedNodes: string[];
}

export function AssemblyPath({ nodes, onNodeClick, completedNodes }: AssemblyPathProps) {
  const getNodePosition = (index: number) => {
    const positions = [
      { x: 10, y: 50 },   // Foundation - chassis
      { x: 30, y: 50 },   // Product - engine
      { x: 50, y: 50 },   // Marketing - wheels
      { x: 70, y: 50 },   // Operations - interior
      { x: 90, y: 50 },   // Finance - final assembly
    ];
    return positions[index] || { x: 10, y: 50 };
  };

  const getNodeIcon = (nodeId: string) => {
    const icons: Record<string, JSX.Element> = {
      foundation: <Cog className="w-6 h-6" />,
      product: <Wrench className="w-6 h-6" />,
      marketing: <Circle className="w-6 h-6" />,
      operations: <Cog className="w-6 h-6" />,
      finance: <CheckCircle className="w-6 h-6" />,
    };
    return icons[nodeId] || <Circle className="w-6 h-6" />;
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
      {/* Assembly Line Base */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute top-1/2 left-0 right-0 h-2 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full"
        style={{ transform: 'translateY(-50%)' }}
      />

      {/* Assembly Line Conveyor */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.7 }}
        className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-300 to-blue-500 rounded-full"
        style={{ transform: 'translateY(-50%)' }}
      />

      {/* Assembly Stations */}
      {nodes.map((node, index) => {
        const position = getNodePosition(index);
        const isCompleted = completedNodes.includes(node.id);
        
        return (
          <motion.div
            key={node.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 + index * 0.2 }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
            }}
          >
            {/* Station Platform */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.5, delay: 1.2 + index * 0.2 }}
              className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-20 h-8 bg-gradient-to-b from-gray-200 to-gray-300 rounded-t-lg"
            />

            {/* Station Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNodeClick(node)}
              className={`relative w-16 h-16 rounded-lg border-2 ${getNodeBgColor(node.id)} shadow-lg transition-all duration-300 hover:shadow-xl flex items-center justify-center`}
            >
              {/* Station Icon */}
              <div className={`${getNodeColor(node.id)}`}>
                {isCompleted ? (
                  <CheckCircle className="w-8 h-8" />
                ) : (
                  getNodeIcon(node.id)
                )}
              </div>

              {/* Station Number */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {index + 1}
              </div>

              {/* Progress Indicator */}
              {isCompleted && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 rounded-lg bg-green-200/50"
                />
              )}
            </motion.button>

            {/* Station Label */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <div className="text-xs font-medium text-gray-700 bg-white px-2 py-1 rounded shadow-sm">
                {node.title}
              </div>
            </div>

            {/* Conveyor Belt Movement */}
            {isCompleted && (
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 20, opacity: 1 }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full"
              />
            )}
          </motion.div>
        );
      })}

      {/* Assembly Line Animation */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/2 left-0 w-8 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full opacity-50"
        style={{ transform: 'translateY(-50%)' }}
      />

      {/* Quality Control Lights */}
      <div className="absolute top-4 right-4 flex space-x-2">
        {nodes.map((node, index) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.5 + index * 0.2 }}
            className={`w-3 h-3 rounded-full ${
              completedNodes.includes(node.id) ? 'bg-green-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Factory Environment */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 bg-gradient-to-b from-blue-100/20 to-gray-100/20"
        />
      </div>
    </div>
  );
}
