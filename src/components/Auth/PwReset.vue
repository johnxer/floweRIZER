<template>
    <form
        novalidate
        @submit.prevent="submitForm()"
    >
        <transition
            name="fade"
            mode="out-in"
        >
            <base-loader v-if="isPending" />

            <base-form-message-box
                v-else-if="isSuccess"
                message-type="success"
            >
                Password reset link sent! Please check your email.
            </base-form-message-box>
            <div v-else>
                <transition
                    name="fade"
                    mode="out-in"
                >
                    <base-form-message-box
                        v-if="error"
                        message-type="error"
                    >
                        {{ error }}
                    </base-form-message-box>
                </transition>
                <div class="space-y-4">
                    <base-input-wrapper
                        icon-name="email"
                        :error-text="formErrors.email"
                    >
                        <input
                            type="email"
                            placeholder="Enter email..."
                            class="w-100 py-2 dark:placeholder:text-white/60 placeholder:text-gray-400 placeholder:italic placeholder:font-normal focus:outline-0 font-semibold dark:text-white/80 text-gray-500/80 peer"
                            v-model.trim="form.email"
                            @input="formErrors.email = null"
                        />
                    </base-input-wrapper>
                </div>
                <div class="grid grid-cols-[40%_1fr] gap-4 mt-8">
                <base-button
                    class=""
                    type="button"
                    btn-style="notRoundedMd"
                    btn-size="base"
                    btn-color="neutralAlt"
                    @click="handleBack"
                >
                    Cancel
                </base-button>
                <base-button
                    btn-style="notRoundedMd"
                    btn-size="base"
                >
                    Reset password
                </base-button>
    </div>                
            </div>
        </transition>
    </form>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthActions } from '../../composables';
import BaseButton from '../Base/BaseButtons/BaseButton.vue';
import BaseFormMessageBox from '../Base/BaseForm/BaseFormMessageBox.vue';
import BaseInputWrapper from '../Base/BaseForm/BaseInputWrapper.vue';
import BaseLoader from '../Base/BaseLoader.vue';

const router = useRouter()

const {
    error,
    isPending,
    resetEmail,
} = useAuthActions()

const form = ref({
    email: '',
})

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validateForm = () => {
    formErrors.value = {}

    if (!form.value.email) {
        formErrors.value.email = 'Email cannot be empty'
    } else if (!emailPattern.test(form.value.email)) {
        formErrors.value.email = 'Wrong email format'
    }

    return Object.keys(formErrors.value).length === 0
}

const isSuccess = ref(false)

const formErrors = ref({})

const emit = defineEmits(['pw-reset-done'])

const submitForm = async () => {
    isSuccess.value = false
    if (!validateForm()) return;

    const success = await resetEmail(form.value.email)

    if (success) {
        form.value.email = ''
        isSuccess.value = true

        setTimeout(() => {
            emit('pw-reset-done')
        }, 3000);

    }
}

const handleBack = () => {
    emit('pw-reset-done')
}

</script>

<style lang="scss" scoped></style>