<template>
    <div>
        <transition
            name="fade"
            mode="out-in"
        >
            <base-loader v-if="isPending">
                Loading plant details...
            </base-loader>
            <div v-else-if="error">
                {{ error }}
            </div>

            <div v-else="data">
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
                            :src="data?.imgSrc || PLANT_PLACEHOLDER"
                            class="w-full h-full inset-0 object-cover absolute rounded-xl transition-opacity duration-600"
                            :class="isImageLoaded ? 'opacity-100' : 'opacity-0'"
                            loading="lazy"
                            @load="onLoad"
                        />
                        <h3 class="absolute left-2 top-2 md:left-4 md:top-4 px-4 py-2 bg-black/70 text-white rounded-lg">
                            <div class="text-base mb-2">
                                {{ data?.name }}
                            </div>
                            <div class="flex items-center gap-2 text-xs">
                                <span class="material-symbols-outlined text-base">
                                    water_drop
                                </span>
                                Needs water every {{ data?.wateringFrequency }} days
                            </div>
                        </h3>

                    </div>
                </div>


                <div
                    v-if="data?.desc?.length > 0"
                    class="mt-4 "
                >
                    <p class="text-foreground">
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

<script setup lang="ts">
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



const carouselConfig = {
    itemsToShow: 1,
    wrapAround: true,
    snapAlign: 'start',
    transition: 800,
    transitionEasing: "cubic-bezier(0.4, 0, 0.2, 1)"
}

type Props = {
    data: object;
    isPending: boolean;
    error?: object | null
}

const props = defineProps<Props>()

const showMore = ref<boolean>(false)

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


const images = computed(() => {
    const log = props.data?.log || []
    const logImages = log.filter(item => item.action === 'customPhoto' && item.newVal).map(item => item.newVal)

    return [
        props.data?.imgSrc || PLANT_PLACEHOLDER,
        ...logImages,
    ]
})

const hasCustomPhotos = computed(() => images.value.length > 1);




</script>

<style lang="scss" scoped></style>
