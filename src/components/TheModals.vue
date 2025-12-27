<template>
    <div>
        <teleport to="body">
            <base-modal
                :modal-toggle="uiStore.activeModal === 'room'"
                :is-modal-pending="isModalPending"
                @close-modal="uiStore.closeModal"
            >
                <add-new-room-content
                    v-if="uiStore.activeModal === 'room'"
                    :room-id="uiStore.selectedModalData.roomId"
                    @close-modal="uiStore.closeModal"
                    @is-pending="handleIsPending"
                >
                </add-new-room-content>
            </base-modal>

            <base-modal
                :modal-toggle="uiStore.activeModal === 'plant'"
                :is-modal-pending="isModalPending"
                @close-modal="uiStore.closeModal"
            >
                <add-new-plant-content
                    v-if="uiStore.activeModal === 'plant'"
                    :room-id="uiStore.selectedModalData.roomId"
                    :plant-id="uiStore.selectedModalData.plantId"
                    @is-pending="handleIsPending"
                />
            </base-modal>

            <base-modal
                :modal-toggle="uiStore.activeModal === 'plantDetails'"
                @close-modal="uiStore.closeModal"
            >
                <plant-details-modal
                    v-if="uiStore.activeModal === 'plantDetails'"
                    :room-id="uiStore.selectedModalData.roomId"
                    :plant-id="uiStore.selectedModalData.plantId"
                    @close-modal="uiStore.closeModal"
                />
            </base-modal>

            <base-modal
                :modal-toggle="uiStore.activeModal === 'roomHistory'"
                @close-modal="uiStore.closeModal"
            >
                <room-history-content
                    v-if="uiStore.activeModal === 'roomHistory'"
                    :room-id="uiStore.selectedModalData.roomId"
                    @close-modal="uiStore.closeModal"
                />
            </base-modal>

        </teleport>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import BaseModal from '@/components/base/BaseModal/BaseModal.vue';

import AddNewPlantContent from '@/components/features/plants/AddNewPlantContent.vue';
import PlantDetailsModal from '@/components/features/plants/PlantDetailsModal.vue';
import AddNewRoomContent from '@/components/features/rooms/AddNewRoomContent.vue';
import RoomHistoryContent from '@/components/features/rooms/RoomHistoryContent.vue';

import { useUIStore } from '@/stores/useUIStore';

const uiStore = useUIStore()

const isModalPending = ref(false)

const handleIsPending = (val: boolean) => {
    isModalPending.value = val;
}

</script>

<style lang="scss" scoped></style>