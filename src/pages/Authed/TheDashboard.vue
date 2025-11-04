<template>
    <base-container>
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
            <div
                v-else-if="rooms"
                class="grid lg:grid-cols-3 xl:grid-cols-4 gap-10 lg:gap-8 items-stretch"
            >
                <base-room
                    v-for="room in rooms"
                    :key="room.id"
                    :room="room"
                />
                <div class="self-start">
                    <div class="min-h-[30px] mb-2 hidden md:block" />
                    <div class="min-h-[60px] lg:min-h-[200px] w-full relative">
                        <button
                            type="button"
                            class="absolute inset-0 w-full h-full cursor-pointer font-bold text-xl lg:text-2xl border-2 border-dashed border-primary-500 dark:border-primary-700 text-primary-500 dark:text-primary-700 rounded-xl hover:border-primary-700 dark:hover:border-primary-800 hover:text-primary-700 dark:hover:text-primary-800 transition-all duration-600 flex items-center justify-center"
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
    </base-container>
</template>

<script setup>
import { ref } from 'vue';

import AddNewRoomContent from '../../components/AddNewRoomContent.vue';

import BaseContainer from '../../components/Base/BaseContainer.vue';
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