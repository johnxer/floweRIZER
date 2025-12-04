import { PlantLog } from './plant'
import { Room, SystemRoom, UserRoom } from './room'

export const isSystemRoom = (room: Readonly<Room>): room is SystemRoom => {
    return room.id === 'unassigned'
}

export const isUserRoom = (room: Readonly<Room>): room is UserRoom => {
    return !isSystemRoom(room);
}

export type MovedLog = Extract<PlantLog, {action: 'moved'}>

export const isMovedLog = (log: Readonly<PlantLog>): log is MovedLog => {
    return log.action === 'moved'
}