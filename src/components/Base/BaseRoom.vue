<template>
    <div>

        <div class="text-xl font-semibold text-gray-600 flex items-start gap-2 peer group mb-2 lg:justify-center">
            <router-link
                :to="{ name: 'TheRoomDetail', params: { roomId: room.id } }"
                class="hover:text-primary-600 transition-colors duration-600 order-2 flex items-start gap-2"
            >
                {{ room.name }}
                <span class="material-symbols-outlined text-3xl order-3 lg:opacity-0 group-hover:opacity-100 group-hover:translate-x-2 text-primary-600/25 transition-all duration-600">
                    arrow_right_alt
                </span>
            </router-link>
            <span
                class="material-symbols-outlined text-3xl relative top-[-2px] text-primary-500/50 peer-hover:text-primary-600 transition-colors duration-600 cursor-help"
                v-tooltip="{
                    content: room.desc,
                    disabled: !room.desc,
                }"
            >
                {{ room.icon }}
            </span>

        </div>




        <div
            class="min-h-[120px] lg:min-h-[200px] w-full"
            :class="room.plants ? 'bg-gray-50 rounded-xl' : 'flex items-center border border-gray-200 dark:border-gray-800 rounded-xl'"
        >
            <div v-if="room.plants">
                <transition-group
                    name="fade"
                    tag="ul"
                    class="p-2 space-y-2"
                >
                    <base-plant-list-item
                        v-for="plant in room.plants"
                        :key="plant.id"
                        :plant="plant"
                    />
                </transition-group>
            </div>
            <div
                v-else
                class="w-full"
            >
                <div class="text-center">
                    <!-- <div class="text-sm text-blue-400/50 flex flex-col items-center justify-center mb-6">
                        <span class="material-symbols-outlined text-3xl">
                            info
                        </span>
                        <span>
                        No plants in the room yet...
                        </span>
                    </div> -->
                    <base-button
                        type="button"
                        @click="toggleModal"
                        class="mb-2 hover:-translate-y-1 inline-block align-top"
                        :btn-full-width="false"
                        btn-size="sm"
                    >
                        Add a new plant
                    </base-button>
                    <div class="text-xs text-gray-400 dark:text-gray-600">
                        or drag one from another room
                    </div>
                </div>
            </div>
        </div>
        <base-modal
            :modal-toggle="isModalOpen"
            @close-modal="toggleModal"
        >

            <add-new-plant-content />
        </base-modal>
    </div>
</template>

<script setup>

import { ref } from 'vue';
import AddNewPlantContent from '../AddNewPlantContent.vue';
import BaseButton from './BaseButton.vue';
import BaseModal from './BaseModal/BaseModal.vue';
import BasePlantListItem from './BasePlantListItem.vue';

defineProps({
    room: {
        type: Object,
        required: true
    }
})

const isModalOpen = ref(false)

const toggleModal = (state) => {
    if (typeof state === 'boolean') {
        isModalOpen.value = state
    } else {
        isModalOpen.value = !isModalOpen.value
    }
}

</script>

<style lang="scss" scoped></style>