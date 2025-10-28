<template>
    <div>
        <div class="bg-gray-50 px-4 py-3 sm:flex sm:px-6 dark:bg-gray-700/25 text-xl border-b border-gray-200 text-gray-500">
            Create new room

        </div>
        <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <form
                @submit.prevent=""
                novalidate
            >

                <div class="space-y-4">
                    <base-input-wrapper-authed
                        field-label="Name"
                        field-id="room-name"
                    >
                        <input
                            type="text"
                            id="room-name"
                            placeholder="Enter room name..."
                            class="px-4 py-2 rounded-xl border-2 border-gray-300 w-full focus:outline-0 focus:border-primary transition-colors duration-600 text-gray-500 dark:text-white/75 dark:border-gray-500"
                        >
                    </base-input-wrapper-authed>
                    <base-input-wrapper-authed
                        field-label="Icon"
                        field-id="room-icon"
                    >
                        <input
                            type="text"
                            id="room-icon"
                            placeholder="Enter room icon..."
                            class="px-4 py-2 rounded-xl border-2 border-gray-300 w-full focus:outline-0 focus:border-primary transition-colors duration-600 text-gray-500 dark:text-white/75 dark:border-gray-500"
                        >
                    </base-input-wrapper-authed>
                    <base-input-wrapper-authed
                        field-label="Description"
                        field-id="room-description"
                    >
                        <textarea
                            id="room-description"
                            placeholder="Enter room description..."
                            class="px-4 py-2 rounded-xl border-2 border-gray-300 w-full read-only:cursor-not-allowed focus:outline-0 read-only:opacity-50 text-gray-500 dark:text-white/75 dark:border-gray-500 h-[100px]"
                        />
                    </base-input-wrapper-authed>


                </div>
                <base-button class="mt-8">
                    Create
                </base-button>

            </form>
        </div>
    </div>
</template>

<script setup>

import BaseButton from './Base/BaseButton.vue';
import BaseInputWrapperAuthed from './Base/BaseInputWrapperAuthed.vue';

</script>

<style lang="scss" scoped></style>