<template>
    <div
        class="flex items-center"
        :class="{ 'flex-col items-start gap-4': !!existingImageSrc || !!previewUrl }"
    >
        <div
            v-if="!!existingImageSrc || !!previewUrl"
            class="relative w-full h-[200px] rounded-xl"
        >
            <div
                v-if="!isImageLoaded"
                class="bg-gray-200 dark:bg-gray-800 animate-pulse absolute w-full h-full inset-0 rounded-xl flex justify-center"
            >
                <div class="size-8 rounded-full bg-gray-300 dark:bg-gray-900 absolute top-[80px] -ml-[70px]" />
                <div class="absolute bottom-0 flex items-end justify-center w-full pl-[90px]">
                    <div class="w-0 h-0 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-b-[80px] border-b-gray-300 dark:border-b-gray-900 absolute" />
                    <div class="w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[40px] border-b-gray-300 dark:border-b-gray-900 absolute -ml-[160px]" />
                </div>
            </div>
            <img
                :src="existingImageSrc || previewUrl"
                class="w-full h-full inset-0 object-cover absolute rounded-xl"
                :class="isImageLoaded ? 'opacity-100' : 'opacity-0'"
                loading="lazy"
                @load="onLoad"
            />
            <div
                v-if="isImageLoaded"
                class="absolute top-2 right-2 uppercase bg-black/70 text-white dark:text-white/60 text-2xs px-2 py-1 rounded-full"
            >
                Preview
            </div>
        </div>
        <div class="flex gap-2 md:gap-4 flex-col md:flex-row w-full md:w-auto">
            <label
                for="plant-image"
                class="relative border border-2 cursor-pointer transition-all duration-600 disabled:cursor-not-allowed px-4 py-2 text-base rounded-lg cursor-pointer bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-transparent hover:text-gray-400 disabled:bg-gray-500/50 disabled:border-gray-500/0 disabled:hover:text-white inline-block overflow-hidden text-center shrink-0"
            >
                Select image
                <input
                    id="plant-image"
                    type="file"
                    class="hidden"
                    accept="image/png, image/jpeg, image/jpg, image/gif"
                    @change="handleFile"
                >
            </label>
            <div
                v-if="selectFileName"
                class="text-sm text-gray-500 inline-flex align-top gap-1 items-center"
            >
                <span class="material-symbols-outlined text-2xl">
                    image
                </span>
                <span class="text-wrap">
                    {{ selectFileName }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped></style>