<template>
    <li class="">
        <router-link
            :to="{ name: 'ThePlantDetail', params: { plantId: plant.id } }"
            class="bg-gray-50 p-2 rounded-xl hover:bg-gray-100 transition-colors block"
        >
        
            <div class="grid grid-cols-[20%_1fr] gap-4 items-center">
                <div class="w-full h-0 pb-[100%] overflow-hidden rounded-xl relative">
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