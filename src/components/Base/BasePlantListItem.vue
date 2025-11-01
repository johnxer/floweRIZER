<template>
    <li
        class="group p-2 rounded-xl flex items-center transition-all duration-600 relative hover:rounded-l-none "
        :class="isWatered ? 'bg-primary-500/20' : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-900'"
    >
        <div
            class="absolute w-[28px] right-[calc(100%-28px)] group-hover:right-full h-full md:w-0 group-hover:md:w-[28px] lg:opacity-0 lg:group-hover:opacity-100 text-xl cursor-move transition-all duration-300 text-gray-700 dark:text-white/50 rounded-l-lg px-1 py-1 flex items-center justify-center"
            :class="isWatered ? 'bg-primary-500/20' : 'bg-gray-200 group-hover:bg-gray-300 dark:bg-gray-800 dark:group-hover:bg-gray-900'"
        >
            <span class="material-symbols-outlined">
                drag_handle
            </span>
        </div>
        <!-- <router-link
            :to="{ name: 'ThePlantDetail', params: { plantId: plant.id } }"
            class="block w-full"
        > -->
        <button
            type="button"
            class="w-full cursor-pointer z-1"
            @click="handleWatering"
        >
            <div class="grid grid-cols-[auto_1fr] gap-3 items-center">
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
                    <div class="inline-flex flex-col items-end justify-center gap-1 text-gray-500">
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

                </div>
            </div>
            <div
                v-if="showMoreDetails"
                class="text-start text-sm"
            >
                <hr class="border-gray-300 my-2 dark:border-gray-700/50" />
                <div class="bg-gray-300/50 dark:bg-gray-900/50 p-4 rounded-xl inset-shadow-sm group-hover:inset-shadow-none group-hover:bg-gray-400/25 dark:group-hover:bg-gray-800/75 transition-all duration-600">
                    {{ plant.desc }}
                </div>
            </div>
        </button>
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
    }
})


const isWatered = ref(false)


const handleWatering = () => {
    isWatered.value = !isWatered.value
}


</script>

<style lang="scss" scoped></style>