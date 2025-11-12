<template>
    <div>
        <base-modal-content>
            <template #modalTitle>
                Delete Account
            </template>
            <div class="text-gray-600 dark:text-gray-500">
                <div class="mb-2">
                    Once your account is deleted, all your personal data, preferences, and saved items will be permanently removed.
                </div>
                <div>
                    This action <strong>can't be undone</strong>. Are you absolutely sure?
                </div>
                <div class="mt-6 flex justify-between">
                    <base-button
                        btn-style="notRounded"
                        btn-size="base"
                        btn-color="neutral"
                        :btn-full-width="false"
                        class="min-w-1/3"
                        @click="handlecloseModal"
                    >
                        Keep My Account
                    </base-button>
                    <base-button
                        btn-style="notRounded"
                        btn-size="base"
                        btn-color="danger"
                        :btn-full-width="false"
                        class="min-w-1/2"
                    >
                        Yes, Delete My Account
                    </base-button>

                </div>
            </div>
        </base-modal-content>
    </div>
</template>

<script setup>
import BaseButton from './BaseButtons/BaseButton.vue';
import BaseModalContent from './BaseModal/BaseModalContent.vue';

const emit = defineEmits(['close-modal'])


const handlecloseModal = () => {
    emit('close-modal')

}





</script>

<style lang="scss" scoped></style>