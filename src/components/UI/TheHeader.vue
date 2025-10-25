<template>
    <header class="min-h-[60px] px-6 sticky t-0 bg-white shadow-lg flex items-center dark:bg-gray-950 dark:border-b border-gray-800 justify-between">
        <h1 class="font-roboto text-2xl font-bold text-primary flex gap-3">
            <span class="noto-color-emoji-regular">
                🌱
            </span>
            <span class="flex">
                <span class="text-primary-500">{{ firstString }}</span> <span class="text-primary-700">{{ secondString }}</span>
            </span>
        </h1>
        <slot name="center" />
        <!-- <slot name="end"/> -->
        <div>
            <v-dropdown>
                <button class="text-3xl relative cursor-pointer">
                    <span class="material-symbols-outlined">
                        menu
                    </span>
                </button>
                <template #popper>
                    <div class="text-base max-w-[300px] font-normal p-4">
                        <ul>
                            <li>
                                <button
                                    class="text-gray-600 hover:text-red-500 cursor-pointer transition-colors duration-600"
                                    @click="logoutHandle"
                                    v-close-popper="true"
                                >
                                    Log out
                                </button>
                            </li>
                        </ul>
                    </div>
                </template>
            </v-dropdown>
        </div>
    </header>
</template>

<script setup>
import { computed, useSlots } from 'vue';

import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/useAuthStore';

const router = useRouter()

const props = defineProps({
    projectTitle: {
        type: String,
        required: true
    }
})

const {
    user,
    error,
    isPending,
} = storeToRefs(useAuthStore());

const {
    logOutUser,
} = useAuthStore();


const matchString = /[A-Z]/;

const indexTitle = props.projectTitle.search(matchString);

const firstString = props.projectTitle.substring(0, indexTitle)
const secondString = props.projectTitle.substring(indexTitle)

const slots = useSlots()

const isCenterSlotEmpty = computed(() => !slots.center || slots.center().length === 0)
// const isEndSlotEmpty = computed(() => !slots.end || slots.end().length === 0)

console.log(user.value)

const logoutHandle = async () => {
    console.log('aaa');
    const success = await logOutUser();

    if (success) {
        router.push({name: 'NotAuthed'})
    }
}

</script>

<style lang="scss" scoped></style>