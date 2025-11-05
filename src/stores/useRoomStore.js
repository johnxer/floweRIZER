import { defineStore } from "pinia"


export const useRoomStore = defineStore('useRoomStore', () => {
    const roomIcons = [
        {
            name: 'Terrace',
            icon: 'balcony',
        },
        {
            name: 'Kitchen',
            icon: 'fork_spoon',
        },
        {
            name: 'Living room',
            icon: 'meeting_room',

        },
        {
            name: 'Bathroom',
            icon: 'shower',
        }
    ]

    const roomDefaultColor = '#99c23b'

    return {
        roomIcons,
        roomDefaultColor
    }
})