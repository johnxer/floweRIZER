<template>
    <li>
        <router-link
            class="text-foreground hover:text-primary cursor-pointer transition-colors duration-600 py-2 flex gap-2 items-center flex-row text-base"
            :class="extraClasses"
            :to="{ name: linkDestination }"
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
    isProfile: {
        type: Boolean,
        required: false,
        default: false
    },
    extraClasses: {
        type: [String, Object, Array],
        required: false,
        default: ''
    }
})

</script>

<style lang="scss" scoped></style>