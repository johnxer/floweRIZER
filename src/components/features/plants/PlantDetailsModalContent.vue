<template>
    <div>
        <transition
            name="fade"
            mode="out-in"
        >
            <base-loader v-if="props.isPending">
                Loading plant details...
            </base-loader>
            <div v-else-if="props.error">
                {{ props.error }}
            </div>

            <div v-else="props.data">
                <div v-if="hasCustomPhotos">
                    <Carousel
                        v-bind="carouselConfig"
                        class="overflow-hidden rounded-xl"
                    >
                        <Slide
                            v-for="image in images"
                            :key="image"
                        >
                            <!-- <div class="carousel__item"> -->
                            <div class="relative bg-gray-50 dark:bg-gray-950 h-[300px] flex items-center justify-center w-full">
                                <base-image-wireframe v-if="!isImageLoaded" />
                                <img
                                    :src="image"
                                    class="w-full h-full inset-0 object-cover absolute"
                                    :class="isImageLoaded ? 'opacity-100' : 'opacity-0'"
                                    loading="lazy"
                                    @load="onLoad"
                                />
                            </div>
                            <!-- </div> -->
                        </Slide>

                        <template #addons>
                            <Navigation />
                            <Pagination />
                        </template>
                    </Carousel>
                </div>
                <div v-else>
                    <div class="relative rounded-xl bg-gray-50 dark:bg-gray-950 h-[300px] flex items-center justify-center overflow-hidden">
                        <base-image-wireframe v-if="!isImageLoaded" />
                        <img
                            :src="props.data?.imgSrc || PLANT_PLACEHOLDER"
                            class="w-full h-full inset-0 object-cover absolute rounded-xl transition-opacity duration-600"
                            :class="isImageLoaded ? 'opacity-100' : 'opacity-0'"
                            loading="lazy"
                            @load="onLoad"
                        />
                        <h3 class="absolute left-2 top-2 md:left-4 md:top-4 px-4 py-2 bg-black/70 text-white rounded-lg">
                            <div class="text-base mb-2">
                                {{ props.data?.name }}
                            </div>
                            <div class="flex items-center gap-2 text-xs">
                                <span class="material-symbols-outlined text-base">
                                    water_drop
                                </span>
                                Needs water every {{ props.data?.wateringFrequency }} days
                            </div>
                        </h3>

                    </div>
                </div>


                <div
                    v-if="props.data?.desc?.length > 0"
                    class="mt-4 "
                >
                    <p class="text-gray-500 dark:text-gray-500">
                        {{ shortenDesc }}
                    </p>
                    <button
                        v-if="showMoreButton"
                        class="text-primary-500 underline hover:no-underline mt-1 cursor-pointer"
                        @click="toggleShowMore"
                    >
                        {{ showMoreText }}
                    </button>
                </div>

            </div>
        </transition>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';

import { PLANT_PLACEHOLDER } from '@/constants';

import BaseImageWireframe from '@/components/base/BaseImageWireframe.vue';
import BaseLoader from '@/components/base/BaseLoader.vue';

import {
    Carousel,
    Navigation,
    Pagination,
    Slide
} from 'vue3-carousel';

// import 'vue3-carousel/carousel.css';

const carouselConfig = {
    itemsToShow: 1,
    wrapAround: true,
    snapAlign: 'start',
    transition: 800,
    transitionEasing: "cubic-bezier(0.4, 0, 0.2, 1)"
}

const props = defineProps({
    data: {
        type: Object,
        required: true
    },
    isPending: {
        type: Boolean,
        required: true
    },
    error: {
        type: [Object, null],
        required: false,
        default: null
    }
})

const showMore = ref(false)

const toggleShowMore = () => {
    showMore.value = !showMore.value
}

const shortenDesc = computed(() => {
    const desc = props.data?.desc || '';

    if (showMore.value) return desc

    return desc.length > 200 ? desc.substring(0, 200) + '...' : desc
})

const showMoreButton = computed(() => (props.data?.desc?.length || 0) > 200)

const showMoreText = computed(() => `Show ${showMore.value ? 'less' : 'more'}`)

const isImageLoaded = ref(false)

const onLoad = () => {
    isImageLoaded.value = true
}


const hasCustomPhotos = computed(() => {
    const log = props.data?.log || []
    return log.filter(item => item.action === 'custom photo').length > 0
})

const images = computed(() => {
    const log = props.data?.log || []
    const logImages = log.filter(item => item.action === 'custom photo').map(item => item.newVal)

    const allImages = [
        props.data?.imgSrc || PLANT_PLACEHOLDER,
        ...logImages,
    ]

    return allImages
})


</script>

<style lang="scss" scoped></style>
