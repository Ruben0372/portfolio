'use client';

import { topologyNodes, topologyEdges } from '@/data/topology';
import { toWorld, activeNodeIndex } from '@/lib/three-utils';
import { useScrollStore } from '@/lib/scroll-store';
import { NodeCluster } from './NodeCluster';
import { EdgeStream } from './EdgeStream';

const worldPositions = topologyNodes.map(toWorld);
const worldPositionMap = Object.fromEntries(
  topologyNodes.map((n, i) => [n.id, worldPositions[i]])
);

export function TopologyCloud() {
  const scroll = useScrollStore((s) => s.scroll);
  const activeIdx = activeNodeIndex(scroll);

  return (
    <group>
      {topologyNodes.map((node, i) => (
        <NodeCluster
          key={node.id}
          center={worldPositions[i]}
          particleCount={node.id === 'relay' ? 150 : 80}
          dimmed={activeIdx >= 0 && activeIdx !== i}
        />
      ))}
      {topologyEdges.map((edge) => {
        const from = worldPositionMap[edge.source];
        const to = worldPositionMap[edge.target];
        if (!from || !to) return null;
        const sourceIdx = topologyNodes.findIndex((n) => n.id === edge.source);
        const targetIdx = topologyNodes.findIndex((n) => n.id === edge.target);
        const isActive = activeIdx === sourceIdx || activeIdx === targetIdx;
        return (
          <EdgeStream
            key={edge.id}
            from={from}
            to={to}
            active={isActive}
          />
        );
      })}
    </group>
  );
}
