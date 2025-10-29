<template>
    <div>
        <base-page-title>
            Dashboard
        </base-page-title>
        <transition
            name="fade"
            mode="out-in"
        >
                <base-loader 
                    v-if="isPending"
                    class="static"
                />

            <!-- <div
                v-if="isPending"
                class="animate-pulse w-full h-full flex items-center justify-center"
            >
                <svg
                    class="size-20 animate-spin text-primary animate-pulse mx-auto"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="2"
                    ></circle>
                    <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
            </div> -->
            <div
                v-else-if="rooms"
                class="grid lg:grid-cols-3 xl:grid-cols-4 gap-10 lg:gap-8"
            >
                <base-room
                    v-for="room in rooms"
                    :key="room.id"
                    :room="room"
                />
                <div class="self-end">
                    <div class="min-h-[60px] lg:min-h-[200px] w-full relative">
                        <button
                            type="button"
                            class="absolute inset-0 w-full h-full cursor-pointer font-bold text-xl lg:text-2xl border-2 border-dashed border-primary-500 text-primary-500 rounded-xl hover:border-primary-700 hover:text-primary-700 transition-all duration-600 flex items-center justify-center"
                            @click="toggleModal"
                        >
                            Add new room
                        </button>
                    </div>
                </div>
            </div>
        </transition>
        <base-modal
            :modal-toggle="isModalOpen"
            @close-modal="toggleModal"
        >
            <add-new-room-content @close-modal="toggleModal" />
        </base-modal>
    </div>
</template>

<script setup>
import { ref } from 'vue';

import AddNewRoomContent from '../../components/AddNewRoomContent.vue';

import BaseLoader from '../../components/Base/BaseLoader.vue';
import BaseModal from '../../components/Base/BaseModal/BaseModal.vue';
import BasePageTitle from '../../components/Base/BasePageTitle.vue';
import BaseRoom from '../../components/Base/BaseRoom.vue';

import { useGetData } from '../../composables/useGetData';

const {
    error,
    isPending,
    items: rooms
} = useGetData('rooms')

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