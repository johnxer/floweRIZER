type RoomTypeIcons = 'balcony' | 'fork_spoon' | 'meeting_room' | 'shower' | 'outdoor_garden' | 'hallway' | 'king_bed' | 'crib'

interface Room {
    id: string,
    name: string,
    createdAt: string,
    desc?: string,
    imgSrc?: string,
    log: Array<string>,
    icon: RoomTypeIcons
}