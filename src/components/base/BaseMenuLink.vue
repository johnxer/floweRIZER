<template>
    <li>
        <router-link
            class="text-foreground hover:text-primary cursor-pointer transition-colors duration-600 py-2 flex gap-2 items-center flex-row text-base"
            :to="{ name: linkDestination }"
        >
            <span class="material-symbols-outlined text-2xl md:text-3xl">
                {{ linkIcon }}
            </span>
            {{ linkTitle }}
        </router-link>
    </li>
</template>

<script setup lang="ts">

type Props = {
    linkDestination: string;
    linkTitle: string;
    linkIcon: string;
    isProfile?: boolean;
}

withDefaults(defineProps<Props>(), {
    isProfile: false,
})

</script>

<style lang="scss" scoped></style>