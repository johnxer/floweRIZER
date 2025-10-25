<template>
    <div>
        Plant {{ roomName }}
    </div>
</template>

<script setup>

    defineProps({
        plantName: {
            type: String,
            required: true
        }
    })

</script>

<style lang="scss" scoped>

</style>