<template>
    <li class="group bg-gray-50 p-2 rounded-xl hover:bg-gray-100 flex items-center transition-colors duration-600">
        <span class="material-symbols-outlined opacity-0 w-0 group-hover:opacity-100 group-hover:w-4 group-hover:mr-4 text-xl cursor-move transition-all duration-300">
            drag_handle
        </span>
        <router-link
            :to="{ name: 'ThePlantDetail', params: { plantId: plant.id } }"
            class="block w-full"
        >
        
            <div class="grid grid-cols-[30px_1fr] gap-4 items-center">
                <div class="w-full h-0 pb-[100%] overflow-hidden rounded-full relative">
                    <img
                        :src="plant.imgSrc"
                        class="absolute object-cover h-full w-full"
                    />
                </div>
                <div class="text-sm text-gray-700">
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