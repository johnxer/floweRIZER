<template>
    <div>
        Room {{ roomId }}
    </div>
</template>

<script setup>
    defineProps({
        roomId: {
            type: String,
            required: true
        },
    })
    

</script>

<style lang="scss" scoped>

</style>