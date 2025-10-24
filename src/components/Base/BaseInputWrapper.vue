<template>
    <div>
        <div 
            class="flex flex-row-reverse items-center gap-2 border-b transition"
            :class="{
                'border-primary/50 focus-within:border-primary' : !errorText,
                'border-red-500 dark:border-red-900 focus-within:border-red-500 dark:focus-within:border-red-900' : errorText
            }"
        >
            <slot />
            <span
                v-if="iconName"
                class="material-symbols-outlined transition"
                :class="{
                'text-primary/50 peer-focus:text-primary' : !errorText,
                'text-red-500 dark:text-red-900 focus-within:text-red-300 dark:peer-focus:text-red-700' : errorText
            }"
            >
                {{ iconName }}
            </span>
        </div>
        <transition
            name="fade"
            mode="out-in"
        >
            <div
                v-if="errorText"
                class="text-red-500 dark:text-red-900 text-end"
            >
                {{ errorText }}
            </div>
        </transition>
    </div>
</template>

<script setup>


defineProps({
    iconName: {
        type: String,
        required: false
    },
    errorText: {
        type: String,
        required: false,
    }
})

</script>

<style lang="scss" scoped></style>