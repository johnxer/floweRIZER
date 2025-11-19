<template>
    <div>
        <base-page-title>
            Plant {{ plantId }}
        </base-page-title>
        <div>

        </div>
    </div>
</template>

<script setup>

import BasePageTitle from '@/components/base/BasePageTitle.vue';

defineProps({
    plantId: {
        type: String,
        required: true
    }
})

</script>

<style lang="scss" scoped></style>