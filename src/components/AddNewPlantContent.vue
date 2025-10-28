<template>
    <base-modal-content>
        <template #modalTitle>
            Create new plant
        </template>
        <div>
            <form
                @submit.prevent=""
                novalidate
            >

                <div class="space-y-4">
                    <base-input-wrapper-authed
                        field-label="Name"
                        field-id="plant-name"
                    >
                        <input
                            type="text"
                            id="plant-name"
                            placeholder="Enter plant name..."
                            class="px-4 py-2 rounded-xl border-2 border-gray-300 w-full focus:outline-0 focus:border-primary transition-colors duration-600 text-gray-500 dark:text-white/75 dark:border-gray-500"
                        >
                    </base-input-wrapper-authed>
                    <base-input-wrapper-authed
                        field-label="Image"
                        field-id="plant-image"
                    >
                    </base-input-wrapper-authed>
                    <base-input-wrapper-authed
                        field-label="Description"
                        field-id="plant-description"
                    >
                        <textarea
                            id="room-description"
                            placeholder="Enter room description..."
                            class="px-4 py-2 rounded-xl border-2 border-gray-300 w-full read-only:cursor-not-allowed focus:outline-0 read-only:opacity-50 text-gray-500 dark:text-white/75 dark:border-gray-500 h-[100px]"
                        />
                    </base-input-wrapper-authed>
                </div>
                <base-button
                    class="mt-8"
                    btn-style="notRounded"
                    btn-size="base"
                >
                    Create
                </base-button>
            </form>
        </div>
    </base-modal-content>
</template>

<script setup>

import BaseButton from './Base/BaseButton.vue';
import BaseInputWrapperAuthed from './Base/BaseInputWrapperAuthed.vue';
import BaseModalContent from './Base/BaseModal/BaseModalContent.vue';

</script>

<style lang="scss" scoped></style>