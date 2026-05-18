import { create } from 'zustand';

export type RoomId = 'hero' | 'about' | 'topology' | 'projects' | 'tech' | 'contact';

export interface RoomDef {
  id: RoomId;
  enter: number;
  exit: number;
  label: string;
}

export const rooms: RoomDef[] = [
  { id: 'hero',     enter: 0.00, exit: 0.15, label: 'Hero' },
  { id: 'about',    enter: 0.15, exit: 0.30, label: 'About' },
  { id: 'topology', enter: 0.30, exit: 0.65, label: 'Topology' },
  { id: 'projects', enter: 0.65, exit: 0.80, label: 'Projects' },
  { id: 'tech',     enter: 0.80, exit: 0.90, label: 'Tech Stack' },
  { id: 'contact',  enter: 0.90, exit: 1.00, label: 'Contact' },
];

interface ScrollState {
  scroll: number;
  activeRoom: RoomId;
  portalTarget: string | null;
  savedScroll: number | null;
  setScroll: (s: number) => void;
  startPortal: (target: string) => void;
  clearPortal: () => void;
}

function detectRoom(scroll: number): RoomId {
  for (const room of rooms) {
    if (scroll >= room.enter && scroll < room.exit) return room.id;
  }
  return 'contact';
}

export const useScrollStore = create<ScrollState>((set, get) => ({
  scroll: 0,
  activeRoom: 'hero',
  portalTarget: null,
  savedScroll: null,
  setScroll: (s) => set({ scroll: s, activeRoom: detectRoom(s) }),
  startPortal: (target) => set({ portalTarget: target, savedScroll: get().scroll }),
  clearPortal: () => set({ portalTarget: null }),
}));
