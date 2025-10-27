'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Circle, CheckCircle, Zap, Cpu, Wifi } from 'lucide-react';

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

interface CircuitPathProps {
  nodes: PathNode[];
  onNodeClick: (node: PathNode) => void;
  completedNodes: string[];
}

export function CircuitPath({ nodes, onNodeClick, completedNodes }: CircuitPathProps) {
  const getNodePosition = (index: number) => {
    const positions = [
      { x: 20, y: 30 },   // Foundation - power source
      { x: 50, y: 20 },   // Product - main processor
      { x: 80, y: 30 },   // Marketing - communication module
      { x: 35, y: 60 },   // Operations - control unit
      { x: 65, y: 60 },   // Finance - output module
    ];
    return positions[index] || { x: 20, y: 30 };
  };

  const getNodeIcon = (nodeId: string) => {
    const icons: Record<string, React.ReactElement> = {
      foundation: <Zap className="w-6 h-6" />,
      product: <Cpu className="w-6 h-6" />,
      marketing: <Wifi className="w-6 h-6" />,
      operations: <Circle className="w-6 h-6" />,
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

  const getConnectionPath = (fromIndex: number, toIndex: number) => {
    const fromPos = getNodePosition(fromIndex);
    const toPos = getNodePosition(toIndex);
    
    return {
      x1: fromPos.x,
      y1: fromPos.y,
      x2: toPos.x,
      y2: toPos.y,
    };
  };

  return (
    <div className="relative w-full h-[500px]">
      {/* Circuit Board Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg"
      />

      {/* Circuit Traces */}
      <svg className="absolute inset-0 w-full h-full">
        {nodes.map((_, index) => {
          if (index === 0) return null;
          const connection = getConnectionPath(index - 1, index);
          
          return (
            <motion.path
              key={index}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 1 + index * 0.3 }}
              d={`M ${connection.x1}% ${connection.y1}% L ${connection.x2}% ${connection.y2}%`}
              stroke={completedNodes.includes(nodes[index - 1]?.id) ? '#10b981' : '#6b7280'}
              strokeWidth="3"
              fill="none"
              strokeDasharray="5,5"
            />
          );
        })}
      </svg>

      {/* Circuit Nodes */}
      {nodes.map((node, index) => {
        const position = getNodePosition(index);
        const isCompleted = completedNodes.includes(node.id);
        
        return (
          <motion.div
            key={node.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 + index * 0.2 }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
            }}
          >
            {/* Circuit Node */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNodeClick(node)}
              className={`relative w-16 h-16 rounded-lg border-2 ${getNodeBgColor(node.id)} shadow-lg transition-all duration-300 hover:shadow-xl flex items-center justify-center`}
            >
              {/* Node Icon */}
              <div className={`${getNodeColor(node.id)}`}>
                {isCompleted ? (
                  <CheckCircle className="w-8 h-8" />
                ) : (
                  getNodeIcon(node.id)
                )}
              </div>

              {/* Circuit Connections */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Top connection */}
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-current" />
                {/* Bottom connection */}
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-current" />
                {/* Left connection */}
                <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-1 bg-current" />
                {/* Right connection */}
                <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-1 bg-current" />
              </div>

              {/* Power Indicator */}
              {isCompleted && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full"
                />
              )}
            </motion.button>

            {/* Node Label */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <div className="text-xs font-medium text-gray-700 bg-white px-2 py-1 rounded shadow-sm">
                {node.title}
              </div>
            </div>

            {/* Electric Pulse Animation */}
            {isCompleted && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute inset-0 pointer-events-none"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                  className="absolute inset-0 rounded-lg bg-green-300"
                />
              </motion.div>
            )}
          </motion.div>
        );
      })}

      {/* Circuit Board Grid */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full opacity-20">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#6b7280" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Power Flow Animation */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/2 left-0 w-2 h-2 bg-blue-500 rounded-full opacity-60"
        style={{ transform: 'translateY(-50%)' }}
      />
    </div>
  );
}
