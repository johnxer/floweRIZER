<template>
    <base-menu-link
        link-destination="TheDashboard"
        link-icon="potted_plant"
        link-title="Dashboard"
        v-close-popper="true"
        class="w-1/3 md:w-full"
        :extra-classes="{ 'reset-is-active': !!isChatActive && isMobile }"
    />
    <base-menu-link
        link-destination="Account"
        link-icon="face"
        link-title="Profile"
        v-close-popper="true"
        :is-profile="true"
        class="w-1/3 md:w-full order-3 md:order-2"
        :extra-classes="{ 'reset-is-active': !!isChatActive && isMobile }"
    />
</template>

<script setup>
import BaseMenuLink from '@/components/base/BaseMenuLink.vue';

import { useMobileStore } from '@/stores/useMobileStore';

defineProps({
    isChatActive: {
        type: Boolean,
        required: false
    }
})

const {
    isMobile
} = useMobileStore()

</script>

<style lang="scss" scoped></style>