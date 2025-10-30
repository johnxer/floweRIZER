<template>
    <li>
        <router-link
            class="text-gray-600 hover:text-primary-500 cursor-pointer transition-colors duration-600 block py-2 flex gap-2 items-center flex-col md:flex-row"
            :to="{name: linkDestination}"
        >
            <span class="material-symbols-outlined text-3xl">
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