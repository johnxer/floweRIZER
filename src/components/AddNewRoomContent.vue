<template>
    <base-modal-content>
        <template #modalTitle>
            Create new room
        </template>
        <div>
            <div>
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
                                class="px-4 py-2 rounded-xl border-2 border-gray-300 w-full read-only:cursor-not-allowed focus:outline-0 read-only:opacity-50 text-gray-500 dark:text-white/75 dark:border-gray-500 h-[100px] mb-0"
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
        </div>
    </base-modal-content>
</template>

<script setup>

import BaseButton from './Base/BaseButton.vue';
import BaseInputWrapperAuthed from './Base/BaseInputWrapperAuthed.vue';
import BaseModalContent from './Base/BaseModal/BaseModalContent.vue';

</script>

<style lang="scss" scoped></style>