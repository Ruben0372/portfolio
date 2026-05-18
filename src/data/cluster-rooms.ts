// src/data/cluster-rooms.ts
import { scrollSections } from './scroll-sections';
import { topologyNodes } from './topology';

export interface ClusterRoomContent {
  nodeId: string;
  title: string;
  narrative: string;
  media?: {
    type: 'diagram' | 'code' | 'image';
    src: string;
    caption: string;
  };
  details: string[];
}

// Map topology nodes to scroll sections by highlightNodes
function findSection(nodeId: string) {
  return scrollSections.find((s) => s.highlightNodes.includes(nodeId));
}

export const clusterRooms: ClusterRoomContent[] = topologyNodes.map((node) => {
  const section = findSection(node.id);
  return {
    nodeId: node.id,
    title: section?.title ?? node.label,
    narrative: section?.body ?? node.publicCopy,
    media: section?.media
      ? { type: section.media.type, src: section.media.src, caption: section.media.alt }
      : undefined,
    details: node.claims,
  };
});

export function getClusterRoom(nodeId: string): ClusterRoomContent | undefined {
  return clusterRooms.find((r) => r.nodeId === nodeId);
}
