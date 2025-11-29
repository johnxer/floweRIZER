import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useRoomsStore = defineStore('useRoomsStore', () => {
    const roomIcons = [
        {
            label: 'Terrace',
            icon: 'balcony',
        },
        {
            label: 'Kitchen',
            icon: 'fork_spoon',
        },
        {
            label: 'Living room',
            icon: 'meeting_room',
        },
        {
            label: 'Bathroom',
            icon: 'shower',
        },
        {
            label: 'Garden',
            icon: 'outdoor_garden',
        },
        {
            label: 'Hallway',
            icon: 'hallway',
        },
        {
            label: 'Bedroom',
            icon: 'king_bed',
        },
        {
            label: 'Child bedroom',
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
