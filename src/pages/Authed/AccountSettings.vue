<template>
    <base-container>
        <div class="md:max-w-[300px] max-w-full mx-auto space-y-8">
            <account-image />
            <div>
                <account-form @update-in-progress="handleUpdateInProgress" />


                <hr class="border-gray-200 dark:border-gray-800 my-6" />
                <!-- <base-button
                            class="mt-8"
                            btn-style="notRoundedMd"
                            :disabled="isPendingProfileUpdate"
                            btn-size="base"
                            @click="handlePwChange"
                            type="button"
                        >
                            ChangePw
                </base-button> -->
                <Button
                    type="button"
                    :disabled="isPendingProfileUpdate"
                    variant="link-dummy"
                    class="text-red-500 hover:text-red-900 disabled:cursor-not-allowed disabled:text-red-300 dark:disabled:text-red-800 p-0 h-auto"
                    @click="uiStore.openModal('confirmDeleteAccount')"
                >
                    Delete account
                </Button>

            </div>
        </div>
        <teleport to="body">
            <base-modal
                :modal-toggle="uiStore.activeModal === 'confirmDeleteAccount'"
                @close-modal="uiStore.closeModal"
            >
                <confirm-delete-account-content @close-modal="uiStore.closeModal" />
            </base-modal>
        </teleport>
    </base-container>
</template>

<script setup>
import { ref } from 'vue';

import BaseContainer from '@/components/base/BaseContainer.vue';
import BaseModal from '@/components/base/BaseModal/BaseModal.vue';

import AccountForm from '@/components/account/AccountForm.vue';
import AccountImage from '@/components/account/AccountImage.vue';
import ConfirmDeleteAccountContent from '@/components/features/auth/ConfirmDeleteAccountContent.vue';

import { Button } from '@/components/ui/button';

import { useUIStore } from '@/stores/useUIStore';

const uiStore = useUIStore()

const isPendingProfileUpdate = ref(false)

const handleUpdateInProgress = (value) => {
    isPendingProfileUpdate.value = value
}

</script>

<style lang="scss" scoped></style>