<template>
    <form
        novalidate
        @submit.prevent="submitForm()"
    >
        <transition
            name="fade"
            mode="out-in"
        >
            <div v-if="isPending">
                Loading...
            </div>
            <base-form-message-box
                v-else-if="isSuccess"
                message-type="success"
                message-text="Password reset link sent! Please check your email."
            />
            <div v-else>
                <transition
                    name="fade"
                    mode="out-in"
                >
                    <base-form-message-box
                        v-if="error"
                        message-type="error"
                        :message-text="error"
                    />
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
                <base-button class="mt-8">
                    Reset password
                </base-button>
            </div>
        </transition>
    </form>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePwReset } from '../../composables/useAuth';
import BaseButton from '../Base/BaseButton.vue';
import BaseFormMessageBox from '../Base/BaseFormMessageBox.vue';
import BaseInputWrapper from '../Base/BaseInputWrapper.vue';

const router = useRouter()

const {
    error,
    isPending,
    resetEmail,
} = usePwReset()

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

</script>

<style lang="scss" scoped></style>