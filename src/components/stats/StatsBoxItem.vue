<template>
    <div class="flex flex-col items-center">
        <div class="text-primary-700 flex items-center gap-2 mb-2">
            <span class="material-symbols-outlined text-3xl">
                {{ icon }}
            </span>
            <base-loader
                v-if="isPending"
                size="xs"
            />
            <span
                v-else
                class="text-xl"
            >
                {{ value }}
            </span>
        </div>
        <div class="text-gray-400 dark:text-neutral-500 text-xs md:text-sm">
            {{ label }}
        </div>
    </div>
</template>

<script setup lang="ts">

import BaseLoader from '@/components/base/BaseLoader.vue';

type Props = {
    icon: string;
    value: number;
    label: string;
    isPending?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    isPending: false
})

</script>


<style lang="scss" scoped></style>