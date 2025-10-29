<template>
    <div class="group/card">
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
                class="material-symbols-outlined text-3xl relative top-[-2px] text-primary-500/50 peer-hover:text-primary-600 transition-colors duration-600 cursor-help relative"
                v-tooltip="{
                    content: room.desc,
                    disabled: !room.desc,
                }"
            >
                {{ room.icon }}
                <div class="size-3 absolute top-0 right-0 bg-gray-600 opacity-0 group-hover:opacity-100 text-white rounded-full flex items-center justify-center transition-opacity duration-600" >
                    <span class="material-symbols-outlined text-3xs leading-none align-top">
                        question_mark
                    </span>
                </div>
            </span>
        </div>

        <div
            class="min-h-[120px] lg:min-h-[200px] w-full rounded-xl relative p-2"
            :class="[
                plants?.length || isPending ? 'bg-gray-50' : 'flex flex-col items-center justify-center border border-gray-200 dark:border-gray-800',

            ]"
        >
            <!-- to be styled and used later -->
            <div
                class="size-3 rounded-full absolute top-0 left-0"
                :style="{ 'backgroundColor': room.color }"
            >

            </div>
            <transition
                name="fade"
                mode="out-in"
            >
                <base-loader 
                    v-if="isPending"
                    position-type="absolute"
                />
                <div v-else-if="plants">
                    <transition-group
                        v-if="plants.length"
                        name="fade"
                        tag="ul"
                        class="space-y-2 mb-4"
                    >


                        <base-plant-list-item
                            v-for="plant in plants"
                            :key="plant.id"
                            :plant="plant"
                        >
                        </base-plant-list-item>
                    </transition-group>
                    <div class="w-full">
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
                                @click="toggleModal()"
                                class="mb-2 py-1 pl-1 inline-flex align-top items-center leading-none"
                                :btn-full-width="false"
                                btn-size="custom"
                            >
                                <!-- Add a new plant -->

                                <span class="material-symbols-outlined text-xl mr-1">
                                    add
                                </span><span class="w-0 group-hover/card:w-[42px] overflow-hidden transition-all duration-400 text-sm flex">Plant</span>

                            </base-button>
                            <div class="text-xs text-gray-400 dark:text-gray-600">
                                or drag one from another room
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
        <base-modal
            :modal-toggle="isModalOpen"
            @close-modal="toggleModal"
        >

            <add-new-plant-content
                :room-id="room.id"
                @close-modal="toggleModal"
            />
        </base-modal>
    </div>
</template>

<script setup>
import { ref } from 'vue';

import BaseButton from './BaseButton.vue';
import BaseLoader from './BaseLoader.vue';
import BaseModal from './BaseModal/BaseModal.vue';
import BasePlantListItem from './BasePlantListItem.vue';

import AddNewPlantContent from '../AddNewPlantContent.vue';

import { useGetData } from '../../composables/useGetData';

const props = defineProps({
    room: {
        type: Object,
        required: true
    }
})


const {
    error,
    isPending,
    items: plants
} = useGetData(`rooms/${props.room.id}/plants`)

console.log(props.room.id)
console.log(`rooms/${props.room.id}/plants`)
console.log(plants.value)

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