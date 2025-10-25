<template>
    <li class="group p-2 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-900 flex items-center transition-colors duration-600">
        <span class="material-symbols-outlined lg:opacity-0 lg:group-hover:opacity-100 w-4 lg:w-0 lg:group-hover:w-4 mr-4 lg:mr-0 lg:group-hover:mr-4 text-xl cursor-move transition-all duration-300 text-gray-700 dark:text-white/50">
            drag_handle
        </span>
        <router-link
            :to="{ name: 'ThePlantDetail', params: { plantId: plant.id } }"
            class="block w-full"
        >
        
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
        </router-link>
    </li>
</template>

<script setup>

defineProps({
    plant: {
        type: Object,
        required: true
    }
})

</script>

<style lang="scss" scoped></style>