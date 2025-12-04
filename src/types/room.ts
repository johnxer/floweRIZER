export type RoomActions = 'image' | 'description' | 'icon' | 'name'

export interface RoomLog {
    action: RoomActions;
    date: string;
    id: string;
    originalVal: string | null;
    newVal: string | null
}

export interface SystemRoom {
    id: 'unassigned';
    name: 'Unassigned';
    createdAt: string;
    desc?: undefined;
    imgSrc?: undefined;
    log?: undefined;
    icon?: undefined;
    isSystem: true;
}

export type RoomTypeIcons = 'balcony' | 'fork_spoon' | 'meeting_room' | 'shower' | 'outdoor_garden' | 'hallway' | 'king_bed' | 'crib'

export interface UserRoom {
    id: string;
    name: string;
    createdAt: string;
    desc?: string;
    imgSrc?: string;
    log?: RoomLog[];
    icon: RoomTypeIcons;
    isSystem?: false;
}

export type Room = SystemRoom | UserRoom