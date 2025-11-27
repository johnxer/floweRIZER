<template>
    <div class="relative">
        <transition
            name="fade"
            mode="out-in"
        >
            <base-loader
                v-if="isPendingProfileUpdate"
                position="absolute"
                bg-color="body"
            />
        </transition>
        <form
            @submit.prevent="onSubmitForm"
            novalidate
        >
            <div class="space-y-4">
                <base-input-wrapper-authed
                    field-label="Your username"
                    field-id="user-name"
                    :errorText="formErrors.userName"
                >
                    <base-input
                        input-id="user-name"
                        input-placeholder="Enter user name..."
                        :input-error="formErrors.userName"
                        class="w-full"
                        v-model.trim="form.userName"
                        @click="formErrors.userName = null"
                    />
                </base-input-wrapper-authed>
                <base-input-wrapper-authed
                    field-label="Your email"
                    field-label-extra="Cannot be changed"
                    field-id="email"
                >
                    <base-input
                        input-type="email"
                        input-id="email"
                        input-placeholder="Enter email..."
                        class="w-full"
                        readonly
                        v-model.trim="emailValue"
                    />
                </base-input-wrapper-authed>
                <!-- <base-input-wrapper-authed
                    field-label="Theme colour"
                    field-id="theme-color"
                >
                    <div class="rounded-lg overflow-hidden size-[34px] relative border-2 border-gray-300">
                        <input
                            type="color"
                            id="theme-color"
                            class="focus:outline-0 border-0 p-0 absolute inset-0 w-full h-full cursor-pointer"
                            v-model="form.themeColor"
                        >
                    </div>
                </base-input-wrapper-authed> -->
            </div>

            <base-button
                class="mt-8"
                btn-style="notRoundedMd"
                :disabled="isPendingProfileUpdate"
                btn-size="base"
            >
                Save
            </base-button>
        </form>
    </div>
</template>



<script setup>
import { ref } from 'vue';


import BaseButton from '@/components/base/BaseButtons/BaseButton.vue';
import BaseInput from '@/components/base/BaseForm/BaseInput.vue';
import BaseInputWrapperAuthed from '@/components/base/BaseForm/BaseInputWrapperAuthed.vue';
import BaseLoader from '@/components/base/BaseLoader.vue';


import { useAuthStore } from '@/stores/useAuthStore';

import { useAuthActions, useUpdateData } from '@/composables';

const authStore = useAuthStore()

const emit = defineEmits(['update-in-progress'])

const {
    updateProfileData
} = useAuthActions()

const {
    error: errorProfileUpdate,
    isPending: isPendingProfileUpdate,
    updateData,
} = useUpdateData()

// const { userChangePassword } = useAuthActions()

const emailValue = authStore.user?.email;

const form = ref({
    userName: authStore.user?.displayName || '',
    themeColor: '#99c23b'
})

const isSuccessImage = ref(false)

isSuccessImage.value = false

const formErrors = ref({})

const validateForm = () => {
    formErrors.value = {}

    if (!form.value.userName) {
        formErrors.value.userName = 'Username cannot be empty'
    }

    return Object.keys(formErrors.value).length === 0
}

const onSubmitForm = async () => {
    if (!validateForm()) return

    emit('update-in-progress', true)

    const dataProfile = {
        displayName: form.value.userName,
    }

    const data = {
        customColor: form.value.themeColor,
        ...dataProfile
    }

    const successProfile = await updateProfileData(dataProfile)
    const successUserDb = await updateData(data)

    if (successProfile && successUserDb) {
        emit('update-in-progress', false)
    }
}

</script>

<style lang="scss" scoped></style>