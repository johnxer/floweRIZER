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
            icon: 'outdoor_garden'
        }
    ];

    const roomDefaultColor = '#99c23b';

    const rooms = ref([])

    const isModalOpenRoom = ref(false);

    const toggleModal = (state) => {
        if (typeof state === 'boolean') {
            isModalOpenRoom.value = state;
        } else {
            isModalOpenRoom.value = !isModalOpenRoom.value;
        }
    };

    const selectedRoomId = ref(null);

    const openAddModal = () => {
        selectedRoomId.value = null;
        toggleModal(true);
    };

    const openEditModal = (roomId) => {
        selectedRoomId.value = roomId;
        toggleModal(true);
    };

    const closeRoomModal = () => {
        toggleModal(false);
        selectedRoomId.value = null;
    };

    return {
        roomIcons,
        roomDefaultColor,
        rooms,
        isModalOpenRoom,
        selectedRoomId,
        openAddModal,
        openEditModal,
        closeRoomModal,
    };
});
