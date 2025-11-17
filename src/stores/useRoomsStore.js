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
    ];

    const roomDefaultColor = '#99c23b';

    const rooms = ref([]);

    const isModalOpenRoom = ref(false);
    const isModalOpenHistory = ref(false);

    const toggleModal = (state, modalType) => {
        if (typeof state === 'boolean') {
            modalType.value = state;
        } else {
            modalType.value = !modalType.value;
        }
    };

    const selectedRoomId = ref(null);

    const openAddModal = () => {
        selectedRoomId.value = null;
        toggleModal(true, isModalOpenRoom);
    };

    const openEditModal = (roomId) => {
        selectedRoomId.value = roomId;
        toggleModal(true, isModalOpenRoom);
    };

    const openHistoryModal = (roomId) => {
        selectedRoomId.value = roomId;
        toggleModal(true, isModalOpenHistory);
    };

    const closeRoomModal = () => {
        toggleModal(false, isModalOpenRoom);
        selectedRoomId.value = null;
    };

    const closeHistoryModal = () => {
        toggleModal(false, isModalOpenHistory);
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
        isModalOpenRoom,
        selectedRoomId,
        openAddModal,
        openEditModal,
        closeRoomModal,
        isModalOpenHistory,
        openHistoryModal,
        closeHistoryModal,
        hiddenRooms, 
        hideRoomTemp, 
        showRoom
    };
});
