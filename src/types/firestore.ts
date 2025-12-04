import type { Chat } from './chat'
import type { Message } from './message'
import type { Plant } from './plant'
import type { Room } from './room'
import type { User } from './user'

export interface CollectionMap {
    plants: Plant;
    rooms: Room;
    users: User;
    chats: Chat;
    messages: Message;
}

export type CollectionName = keyof CollectionMap;

export type CollectionDocument<T extends CollectionName> = CollectionMap[T]