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
                <div class="relative rounded-xl bg-gray-50 dark:bg-gray-950 h-[400px] flex items-center justify-center overflow-hidden">
                    <transition
                        name="fade"
                        mode="out-in"
                    >
                        <base-loader
                            v-if="!isImageLoaded"
                            position="absolute"
                        />
                    </transition>
                    <img
                        :src="props.data?.imgSrc || PLANT_PLACEHOLDER"
                        class="w-full h-full rounded-xl object-cover"
                        loading="lazy"
                        @load="onLoad"
                    />
                    <h3 class="absolute left-4 top-4 px-4 py-2 bg-black/70 text-white rounded-xl text-base">
                        {{ props.data?.name }}
                    </h3>
                    <div class="absolute left-4 bottom-4 px-4 py-2 bg-black/70 text-white rounded-xl text-base inline-flex align-top items-center gap-2 text-xs">
                        <span class="material-symbols-outlined text-base">
                            water_drop
                        </span>
                        Needs water every {{ props.data?.wateringFrequency }} days
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
import { PLANT_PLACEHOLDER } from '@/constants';

import BaseLoader from '../../base/BaseLoader.vue';

import { computed, ref } from 'vue';


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

</script>

<style lang="scss" scoped></style>
