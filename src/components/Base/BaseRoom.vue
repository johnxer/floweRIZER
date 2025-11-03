<template>
    <div class="group/card">
        <div class="text-xl font-semibold text-gray-600 flex items-start gap-2 peer group mb-2 justify-between">
            <router-link
                :to="{ name: 'TheRoomDetail', params: { roomId: room.id } }"
                class="hover:text-primary-600 transition-colors duration-600 flex items-start gap-2"
            >
                <span class="material-symbols-outlined text-3xl relative top-[-2px] text-primary-500/50 peer-hover:text-primary-600 transition-colors duration-600">
                    {{ room.icon }}
                </span>
                {{ room.name }}
                <span class="material-symbols-outlined text-3xl lg:opacity-0 group-hover:opacity-100 group-hover:translate-x-2 text-primary-600/25 transition-all duration-600">
                    arrow_right_alt
                </span>
            </router-link>
            <!-- <span
                class="material-symbols-outlined text-3xl relative top-[-2px] text-primary-500/50 peer-hover:text-primary-600 transition-colors duration-600 cursor-help relative"
                v-tooltip="{
                    content: room.desc,
                    disabled: !room.desc,
                    triggers: ['hover', 'touch']
                }"
            >
                {{ room.icon }}
                <div class="size-3 absolute top-0 right-0 bg-gray-600 md:opacity-0 group-hover:opacity-100 text-white rounded-full flex items-center justify-center transition-opacity duration-600">
                    <span class="material-symbols-outlined text-3xs leading-none align-top">
                        question_mark
                    </span>
                </div>
            </span> -->
            <div class="flex gap-3">
                <button
                    type="button"
                    class="md:opacity-0 group-hover/card:opacity-100 text-2xl text-gray-500 hover:text-red-500 dark:text-red-900 transition-all duration-600 cursor-pointer flex"
                    v-tooltip="{
                        content: 'Edit room',
                        container: 'body'
                    }"
                >
                    <span class="material-symbols-outlined">
                        edit
                    </span>
                </button>
                <v-dropdown
                    trap-focus
                    popper-class="md:w-[400px] px-4"
                    @show="onShow"
                    @hide="onHide"
                >
                    <button
                        type="button"
                        class="md:opacity-0 group-hover/card:opacity-100 text-2xl text-gray-500 hover:text-red-500 dark:text-red-900 transition-all duration-600 cursor-pointer flex"
                        :class="{ 'md:opacity-100 text-red-500 dark:text-red-900': isOpen }"
                        v-tooltip="{
                            content: 'Delete room',
                            container: 'body'
                        }"
                    >
                        <span class="material-symbols-outlined">
                            delete
                        </span>
                    </button>
                    <template #popper>
                        <div class="p-4">
                            <div class="text-lg mb-2 text-gray-700">
                                <strong>
                                    Delete this room?
                                </strong>
                            </div>
                            <div class="text-gray-600 text-sm">
                                The plants linked to it will no longer be associated with any room.
                            </div>
                            <div class="mt-4 flex justify-between">
                                <base-button
                                    btn-style="notRoundedMd"
                                    btn-size="sm"
                                    btn-color="neutral"
                                    :btn-full-width="false"
                                    class="min-w-1/3"
                                    v-close-popper="true"
                                >
                                    Keep This Room
                                </base-button>
                                <base-button
                                    btn-style="notRoundedMd"
                                    btn-size="sm"
                                    btn-color="danger"
                                    :btn-full-width="false"
                                    class="min-w-1/2"
                                    v-close-popper="true"
                                    @click="deleteRoom"
                                >
                                    Yes, Delete This Room
                                </base-button>

                            </div>
                        </div>
                    </template>
                </v-dropdown>
            </div>
        </div>

        <div
            class="min-h-[120px] lg:min-h-[200px] w-full rounded-xl relative p-2"
            :class="[
                plants?.length || isPending ? 'bg-gray-50 dark:bg-gray-900' : 'flex flex-col items-center justify-center border border-gray-200 dark:border-gray-800',

            ]"
        >
            <!-- to be styled and used later -->
            <!-- <div
                class="size-3 rounded-full absolute top-0 left-0"
                :style="{ 'backgroundColor': room.color }"
            >

            </div> -->
            <transition
                name="fade"
                mode="out-in"
            >
                <base-loader
                    v-if="isPending"
                    position-type="absolute"
                />
                <div
                    v-else-if="plants"
                    class="w-full"
                >
                    <transition-group
                        v-if="plants.length"
                        name="fade"
                        tag="ul"
                        class="space-y-2 mb-4"
                    >


                        <base-plant-list-item
                            v-for="plant in displayedPlants"
                            :key="plant.id"
                            :plant="plant"
                            :is-draggable="true"
                        >
                        </base-plant-list-item>
                        <base-button
                            btn-style="notRounded"
                            btn-size="sm"
                            btn-color="neutral"
                            @click="toggleShowAll"
                        >
                            Show {{ displayedLabel }}
                        </base-button>
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
                                class="mb-2 py-1 px-1 md:pr-0 inline-flex align-top items-center leading-none justify-center md:justify-start w-2/5 md:w-auto"
                                :btn-full-width="false"
                                btn-size="custom"
                            >
                                <!-- Add a new plant -->

                                <span class="material-symbols-outlined text-xl mr-1">
                                    add
                                </span><span class="w-auto md:w-0 group-hover/card:w-[42px] overflow-hidden transition-all duration-400 text-sm flex">Plant</span>

                            </base-button>
                            <div
                                v-if="isFirst"
                                class="text-xs text-gray-400 dark:text-gray-600"
                            >
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
import { computed, ref } from 'vue';

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
    },
    isFirst: {
        type: Boolean,
        default: false
    }
})

const {
    error,
    isPending,
    items: plants
} = useGetData(`rooms/${props.room.id}/plants`)

const maxVisible = 3

const showAll = ref(false)
const buttonLabel = ref('more')

const displayedPlants = computed(() => showAll.value ? plants.value : plants.value.slice(0, maxVisible))
const displayedLabel = computed(() => showAll.value ? buttonLabel.value = 'less' : buttonLabel.value = 'more')


const toggleShowAll = () => {
    showAll.value = !showAll.value

}

const isModalOpen = ref(false)

const toggleModal = (state) => {
    if (typeof state === 'boolean') {
        isModalOpen.value = state
    } else {
        isModalOpen.value = !isModalOpen.value
    }
}

const isOpen = ref(false)

const onShow = () => (isOpen.value = true)
const onHide = () => (isOpen.value = false)

</script>

<style lang="scss" scoped></style>