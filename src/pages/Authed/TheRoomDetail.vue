<template>
    <div>
        <base-page-title>
            Room {{ roomId }}
        </base-page-title>
        <div>

        </div>
    </div>
</template>

<script setup>
import BasePageTitle from '../../components/Base/BasePageTitle.vue';

defineProps({
    roomId: {
        type: String,
        required: true
    },
})


</script>

<style lang="scss" scoped></style>