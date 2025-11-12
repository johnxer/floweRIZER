<template>
    <div>
        <base-modal
            :modal-toggle="roomsStore.isModalOpenRoom"
            :is-modal-pending="isModalPending"
            @close-modal="roomsStore.closeRoomModal"

        >
            <add-new-room-content
                :room-id="roomsStore.selectedRoomId"
                @close-modal="roomsStore.closeRoomModal"
                @is-pending="handleIsPending"
            >
            </add-new-room-content>
        </base-modal>

        <base-modal
            :modal-toggle="plantsStore.isModalOpenPlant"
            :is-modal-pending="isModalPending"
            @close-modal="plantsStore.closePlantModal"
        >
            <add-new-plant-content
                :room-id="plantsStore.selectedRoomId"
                :plant-id="plantsStore.selectedPlantId"
                @is-pending="handleIsPending"
            />
        </base-modal>
    </div>
</template>

<script setup>

import { ref } from 'vue';
import { usePlantsStore } from '../stores/usePlantsStore';
import { useRoomsStore } from '../stores/useRoomsStore';

import AddNewPlantContent from './AddNewPlantContent.vue';
import AddNewRoomContent from './AddNewRoomContent.vue';

import BaseModal from './Base/BaseModal/BaseModal.vue';

const roomsStore = useRoomsStore()
const plantsStore = usePlantsStore()


const isModalPending = ref(false)

const handleIsPending = (val) => {
    isModalPending.value = val;
}

</script>

<style lang="scss" scoped></style>