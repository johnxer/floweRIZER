<template>
    <li
        class="group p-2 rounded-xl transition-all duration-600 relative"
        :class="[
            isWatered ? 'bg-primary-500/20' : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700/75',
        ]"
    >
        <!-- {'hover:rounded-l-none' : isDraggable} -->
        <!-- <div
            v-if="isDraggable"
            class="absolute w-[28px] right-[calc(100%-28px)] group-hover:right-full h-full lg:opacity-0 lg:group-hover:opacity-100 text-xl cursor-move transition-all duration-300 text-gray-700 dark:text-white/50 rounded-l-lg px-1 py-1 flex items-center justify-center"
            :class="isWatered ? 'bg-primary-500/20' : 'bg-gray-200 group-hover:bg-gray-300 dark:bg-gray-800 dark:group-hover:bg-gray-900'"
        >
            <span class="material-symbols-outlined">
                drag_handle
            </span>
        </div> -->
        <!-- <router-link
            :to="{ name: 'ThePlantDetail', params: { plantId: plant.id } }"
            class="block w-full"
        > -->
        <div class="grid grid-cols-[auto_1fr] gap-3 items-center w-full">
            <div class="grid grid-cols-[30px_1fr] gap-3 items-center">
                <div class="w-full h-0 pb-[100%] overflow-hidden rounded-full relative">
                    <img
                        v-if="plant.imgSrc"
                        :src="plant.imgSrc"
                        class="absolute object-cover h-full w-full"
                    />
                    <img
                        v-else
                        src="https://raw.githubusercontent.com/googlefonts/noto-emoji/main/svg/emoji_u1f331.svg"
                        alt="🌱"
                        class="absolute object-cover h-full w-full"
                    />
                </div>
                <div class="text-sm text-gray-700 dark:text-white/50">
                    {{ plant.name }}
                </div>
            </div>
            <div class="flex justify-end">
                <button
                    type="button"
                    class="cursor-pointer border border-gray-200 rounded-lg px-2 py-1 hover:border-gray-300 group-hover:border-gray-300 transition-all duration-600 text-gray-500 hover:text-gray-700"
                    :class="isWatered ? '' : ''"
                    @click="handleWatering"
                >
                    <div class="inline-flex flex-col items-end justify-center gap-1">
                        <span
                            class="material-symbols-outlined w-full text-center text-sm"
                            :class="{ 'text-primary-500': isWatered }"
                        >
                            {{ isWatered ? 'humidity_high' : 'water_drop' }}
                        </span>
                        <span class="text-2xs">
                            {{ isWatered ? '1' : '12' }} days ago
                        </span>
                    </div>
                </button>
            </div>
        </div>
        <div
            v-if="showMoreDetails"
            class="text-start text-sm"
        >

            <div class="bg-gray-200 dark:bg-gray-900/50 p-4 rounded-xl group-hover:bg-gray-300 dark:group-hover:bg-gray-800/75 transition-all duration-600 mt-4">
                <div class="grid grid-cols-[1fr_auto] gap-4">
                    <div>
                        {{ plant.desc }}
                    </div>
                    <div>
                        <ul class="flex items-center gap-4">
                            <li>
                                <button
                                    type="button"
                                    class="flex text-xl text-gray-500 hover:text-primary-500 cursor-pointer transition-colors duration-600"
                                    v-tooltip="{
                                        content: 'Edit',
                                        container: 'body'
                                    }"
                                >
                                    <span class="material-symbols-outlined mb-1 text-">
                                        edit
                                    </span>
                                </button>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    class="flex text-xl text-gray-500 hover:text-primary-500 cursor-pointer transition-colors duration-600"
                                    v-tooltip="{
                                        content: 'Delete',
                                        container: 'body'
                                    }"
                                >
                                    <span class="material-symbols-outlined">
                                        delete
                                    </span>

                                </button>
                            </li>
                        </ul>
                    </div>


                </div>
            </div>

        </div>

        <!-- </router-link> -->
    </li>
</template>

<script setup>
import { ref } from 'vue';


defineProps({
    plant: {
        type: Object,
        required: true
    },
    showMoreDetails: {
        type: Boolean,
        required: false,
        default: false,
    },
    isDraggable: {
        type: Boolean,
        required: false,
        default: false,
    }
})


const isWatered = ref(false)


const handleWatering = () => {
    isWatered.value = !isWatered.value
}


</script>

<style lang="scss" scoped></style>