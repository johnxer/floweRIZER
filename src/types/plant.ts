import { Timestamp } from "firebase/firestore";

export type PlantActions = 'watered' | 'image' | 'description' | 'icon' | 'lightRequirements' | 'customPhoto' | 'customNote' | 'name' | 'moved'

export interface PlantLog {
    action: PlantActions;
    date: string;
    id: string;
    originRoomId?: string;
    targetRoomId?: string;
    originalVal?: string | null; 
    newVal?: string | null
}

export type PlantLightRequirement = 'low' | 'medium' | 'high';

export interface Plant {
    id: string;
    imgSrc?: string;
    name: string;
    desc?: string;
    lightRequirements?: PlantLightRequirement;
    log?: PlantLog[];
    userId: string;
    wateringFrequency?: number;
    lastWateredAt?: string
    createdAt: Timestamp
}

