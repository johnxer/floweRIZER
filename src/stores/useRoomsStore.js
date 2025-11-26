import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useRoomsStore = defineStore('useRoomsStore', () => {
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
        },
        {
            name: 'Garden',
            icon: 'outdoor_garden',
        },
        {
            name: 'Hallway',
            icon: 'hallway',
        },
        {
            name: 'Bedroom',
            icon: 'king_bed',
        },
        {
            name: 'Child bedroom',
            icon: 'crib',
        },
    ];

    const roomDefaultColor = '#99c23b';

    const rooms = ref([]);

    const activeModal = ref(null);
    const selectedRoomId = ref(null);

    const openModal = (name, roomId = null) => {
        selectedRoomId.value = roomId;
        activeModal.value = name;
    };

    const closeModal = () => {
        activeModal.value = null;
        selectedRoomId.value = null;
    };

    const hiddenRooms = ref([]);

    const hideRoomTemp = (roomId) => {
        if (!hiddenRooms.value.includes(roomId)) {
            hiddenRooms.value.push(roomId);
        }
    };

    const showRoom = (roomId) => {
        hiddenRooms.value = hiddenRooms.value.filter((id) => id !== roomId);
    };

    return {
        roomIcons,
        roomDefaultColor,
        rooms,
        activeModal,
        selectedRoomId,
        openModal,
        closeModal,
        hiddenRooms,
        hideRoomTemp,
        showRoom,
    };
});
