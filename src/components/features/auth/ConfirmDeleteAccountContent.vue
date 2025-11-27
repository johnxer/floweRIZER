<template>
    <div>
        <base-modal-content>
            <template #modalTitle>
                Delete Account
            </template>
            <div>
                <transition
                    name="fade"
                    mode="out-in"
                >
                    <base-loader
                        v-if="isPending || isPendingDelete"
                        position="static"
                    >
                        Deleting user...
                    </base-loader>
                    <div
                        v-else
                        class="text-gray-600 dark:text-gray-500"
                    >
                        <base-form-message-box
                            v-if="error"
                            message-type="error"
                        >
                            {{ error || errorDelete }}
                        </base-form-message-box>

                        <p class="mb-2">
                            Once your account is deleted, all your personal data, preferences, and saved items will be permanently removed.
                        </p>
                        <p>
                            This action <strong>can't be undone</strong>. Are you absolutely sure?
                        </p>
                        <transition
                            name="fade"
                            mode="out-in"
                        >
                            <div
                                v-if="showPwForm"
                                class="mt-6 rounded-xl bg-gray-100 p-4"
                            >
                                <p class="mb-2">
                                    Please enter your password to confirm deletion.
                                </p>
                                <form
                                    @submit.prevent="submitForm()"
                                    novalidate
                                    class="grid grid-cols-1 md:grid-cols-[60%_1fr] gap-4 items-start"
                                >
                                    <base-input-wrapper-authed
                                        field-id="password"
                                        :errorText="formErrors.password"
                                    >
                                        <base-input
                                            input-type="password"
                                            input-id="password"
                                            input-placeholder="Enter password..."
                                            :input-error="!!formErrors.password"
                                            class="w-full"
                                            v-model.trim="form.password"
                                            @click="formErrors.password = null"
                                        />
                                    </base-input-wrapper-authed>
                                    <base-button
                                        btn-style="notRoundedMd"
                                        btn-size="base"
                                        btn-color="danger"
                                        :btn-full-width="false"
                                        class="min-w-1/2"
                                        @click="handleDeleteUser"
                                    >
                                        Delete account
                                    </base-button>
                                </form>
                            </div>
                            <div
                                class="mt-6 flex justify-between"
                                v-else
                            >
                                <base-button
                                    btn-style="notRoundedMd"
                                    btn-size="base"
                                    btn-color="neutralAlt"
                                    :btn-full-width="false"
                                    class="min-w-1/3"
                                    @click="handleCloseModal"
                                >
                                    Keep my account
                                </base-button>
                                <base-button
                                    btn-style="notRoundedMd"
                                    btn-size="base"
                                    btn-color="danger"
                                    :btn-full-width="false"
                                    class="min-w-1/2"
                                    @click="handleDeleteUser"
                                >
                                    Yes, delete my account
                                </base-button>

                            </div>
                        </transition>
                    </div>
                </transition>
            </div>
        </base-modal-content>
    </div>
</template>

<script setup>
import { ref } from 'vue';

import { useRouter } from 'vue-router';

import BaseButton from '@/components/base/BaseButtons/BaseButton.vue';
import BaseFormMessageBox from '@/components/base/BaseForm/BaseFormMessageBox.vue';
import BaseInput from '@/components/base/BaseForm/BaseInput.vue';
import BaseInputWrapperAuthed from '@/components/base/BaseForm/BaseInputWrapperAuthed.vue';
import BaseLoader from '@/components/base/BaseLoader.vue';
import BaseModalContent from '@/components/base/BaseModal/BaseModalContent.vue';

import { useAuthStore } from '@/stores/useAuthStore';

import { useAuthActions, useDeleteData, useStorage } from '@/composables';
import { auth } from '@/firebase/config';

const {
    error,
    isPending,
    userDelete,
    userReauthenticate
} = useAuthActions()


const {
    error: errorDelete,
    isPending: isPendingDelete,
    deleteUserFirestore
} = useDeleteData()

const {
    error: errorStorage,
    isPending: isPendingStorage,
    deleteDirectory
} = useStorage()

const authStore = useAuthStore()


const emit = defineEmits(['close-modal'])

const router = useRouter()

const form = ref({
    password: ''
})

const formErrors = ref({})

const validateForm = () => {
    formErrors.value = {};
    // tady bude validace pres frequency counter

    if (!form.value.password) {
        formErrors.value.password = 'Password cannot be empty'
    } else if (form.value.password.length < 8) {
        formErrors.value.password = 'Password cannot be shorter than 8 chars'
    }

    return Object.keys(formErrors.value).length === 0
}

const clearForm = () => {
    form.value.password = '';

}

const handleCloseModal = () => {
    emit('close-modal')
}

const showPwForm = ref(false)

const handleDeleteUser = async () => {
    showPwForm.value = true
}

const submitForm = async () => {
    if (!validateForm()) return

    const reAuthed = await userReauthenticate(authStore.user?.email, form.value.password)

    authStore.user = auth.currentUser

    if (!reAuthed) {
        clearForm()
        return
    }

    const [delAvatars, delPlants, delRooms] = await Promise.all([
        deleteDirectory(`avatars/${authStore.user?.uid}`),
        deleteDirectory(`plants/${authStore.user?.uid}`),
        deleteDirectory(`rooms/${authStore.user?.uid}`)
    ]);

    if (!delAvatars || !delPlants || !delRooms) return;

    const docDeleted = await deleteUserFirestore(authStore.user?.uid)

    if (!docDeleted) return

    const authDeleted = await userDelete()

    if (!authDeleted) return

    clearForm()

    showPwForm.value = false

    handleCloseModal()

    router.push({ name: 'NotAuthed' })
}



</script>

<style lang="scss" scoped></style>