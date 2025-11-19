<template>
    <div>
        <teleport to="body">
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
            <base-modal
                :modal-toggle="plantsStore.isModalOpenHistory"
                @close-modal="plantsStore.closeHistoryModal"
            >
                <plant-history-content @close-modal="plantsStore.closeHistoryModal" />
            </base-modal>
            <base-modal
                :modal-toggle="roomsStore.isModalOpenHistory"
                @close-modal="roomsStore.closeHistoryModal"
            >
                <room-history-content @close-modal="roomsStore.closeHistoryModal" />
            </base-modal>
        </teleport>
    </div>
</template>

<script setup>
import { ref } from 'vue';

import BaseModal from '@/components/base/BaseModal/BaseModal.vue';

import AddNewPlantContent from '@/components/features/plants/AddNewPlantContent.vue';
import PlantHistoryContent from '@/components/features/plants/PlantHistoryContent.vue';
import AddNewRoomContent from '@/components/features/rooms/AddNewRoomContent.vue';
import RoomHistoryContent from '@/components/features/rooms/RoomHistoryContent.vue';

import { usePlantsStore } from '@/stores/usePlantsStore';
import { useRoomsStore } from '@/stores/useRoomsStore';

const roomsStore = useRoomsStore()
const plantsStore = usePlantsStore()


const isModalPending = ref(false)

const handleIsPending = (val) => {
    isModalPending.value = val;
}

</script>

<style lang="scss" scoped></style>