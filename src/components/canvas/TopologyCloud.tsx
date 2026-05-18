'use client';

import { useState, useCallback } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import { topologyNodes, topologyEdges } from '@/data/topology';
import { toWorld } from '@/lib/three-utils';
import { useStore } from '@/lib/scroll-store';
import { NodeCluster } from './NodeCluster';
import { EdgeStream } from './EdgeStream';
import { PortalRing } from './PortalRing';

const worldPositions = topologyNodes.map(toWorld);
const worldPositionMap = Object.fromEntries(
  topologyNodes.map((n, i) => [n.id, worldPositions[i]])
);

export function TopologyCloud() {
  const roomIndex = useStore((s) => s.roomIndex);
  const enteringCluster = useStore((s) => s.enteringCluster);
  const insideCluster = useStore((s) => s.insideCluster);
  const exitingCluster = useStore((s) => s.exitingCluster);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const isTopologyRoom = roomIndex === 2 && !insideCluster;
  const showPortals = isTopologyRoom && !enteringCluster && !exitingCluster;

  const handleClick = useCallback((nodeId: string) => {
    if (!showPortals) return;
    const pos = worldPositionMap[nodeId];
    if (pos) useStore.getState().enterCluster(nodeId, pos);
  }, [showPortals]);

  return (
    <group>
      {topologyNodes.map((node, i) => {
        const isEntering = enteringCluster === node.id;
        const isHidden = insideCluster && insideCluster !== node.id;
        const isDimmed = (enteringCluster && !isEntering) || isHidden;

        return (
          <group key={node.id}>
            <NodeCluster
              center={worldPositions[i]}
              particleCount={node.id === 'relay' ? 150 : 80}
              dimmed={!!isDimmed}
              parting={isEntering}
            />
            {/* Invisible click sphere */}
            {showPortals && (
              <mesh
                position={worldPositions[i]}
                onClick={(e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); handleClick(node.id); }}
                onPointerEnter={() => setHoveredNode(node.id)}
                onPointerLeave={() => setHoveredNode(null)}
              >
                <sphereGeometry args={[1.5, 16, 16]} />
                <meshBasicMaterial visible={false} />
              </mesh>
            )}
            <PortalRing
              center={worldPositions[i]}
              visible={showPortals}
              hovered={hoveredNode === node.id}
            />
          </group>
        );
      })}
      {topologyEdges.map((edge) => {
        const from = worldPositionMap[edge.source];
        const to = worldPositionMap[edge.target];
        if (!from || !to) return null;
        return (
          <EdgeStream
            key={edge.id}
            from={from}
            to={to}
            active={false}
          />
        );
      })}
    </group>
  );
}
