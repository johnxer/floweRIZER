<template>
    <li>
        <router-link
            class="text-gray-600 hover:text-primary-500 cursor-pointer transition-colors duration-600 block py-1 md:py-2 flex gap-1 md:gap-2 items-center flex-col md:flex-row text-sm md:text-base"
            :to="{name: linkDestination}"
        >
            <span class="material-symbols-outlined text-2xl md:text-3xl">
                {{ linkIcon }}
            </span>
            {{ linkTitle }}
        </router-link>
    </li>
</template>

<script setup>

defineProps({
    linkDestination: {
        type: String,
        required: true,
    },
    linkTitle: {
        type: String,
        required: true,
    },
    linkIcon: {
        type: String,
        required: true,
    },
})





</script>

<style lang="scss" scoped></style>