type PlantLigthRequirement = 'low' | 'medium' | 'hight';

interface Plant {
    id: string,
    imgSrc?: string,
    name: string,
    desc?: string,
    lightRequirements?: PlantLigthRequirement,
    log?: Array<string>,
    userId: string,
    wateringFrequency?: number,
    lastWateredAt?: string
}