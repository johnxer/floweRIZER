<template>
    <form
        @submit.prevent="submitForm()"
        novalidate
    >
        <transition
            name="fade"
            mode="out-in"
        >
            <div v-if="isPending">
                Loading...
            </div>
            <div v-else>
                <transition
                    name="fade"
                    mode="out-in"
                >
                    <base-form-error-message
                        v-if="error"
                        :error-message="error"
                    />
                </transition>
                <div class="space-y-4">
                    <base-input-wrapper
                        icon-name="key"
                        :error-text="formErrors.code"
                    >
                        <input
                            type="text"
                            placeholder="Enter code..."
                            class="w-100 py-2 dark:placeholder:text-white/60 placeholder:text-gray-400 placeholder:italic placeholder:font-normal focus:outline-0 font-semibold dark:text-white/80 text-gray-500/80 peer"
                            v-model.trim="form.code"
                            @input="formErrors.code = null"
                        />
                    </base-input-wrapper>
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

                    <base-input-wrapper
                        icon-name="lock"
                        :error-text="formErrors.password"
                    >
                        <input
                            type="password"
                            placeholder="Enter password..."
                            class="w-100 py-2 dark:placeholder:text-white/60 placeholder:text-gray-400 placeholder:italic placeholder:font-normal focus:outline-0 font-semibold dark:text-white/80 text-gray-500/80 peer"
                            v-model.trim="form.password"
                        />
                    </base-input-wrapper>

                    <base-input-wrapper
                        icon-name="lock"
                        :error-text="formErrors.passwordRepeat"
                    >
                        <input
                            type="password"
                            placeholder="Repeat password..."
                            class="w-100 py-2 dark:placeholder:text-white/60 placeholder:text-gray-400 placeholder:italic placeholder:font-normal focus:outline-0 font-semibold dark:text-white/80 text-gray-500/80 peer"
                            v-model.trim="form.passwordRepeat"
                        />
                    </base-input-wrapper>
                </div>

                <base-button class="mt-6">
                    Sign up
                </base-button>
            </div>
        </transition>
    </form>
</template>

<script setup>

import BaseButton from '../Base/BaseButton.vue';
import BaseFormErrorMessage from '../Base/BaseFormErrorMessage.vue';
import BaseInputWrapper from '../Base/BaseInputWrapper.vue';


import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useSignUp } from '../../composables/useAuth';

const {
    error,
    isPending,
    signUpUser,
} = useSignUp()


const form = ref({
    code: '',
    email: '',
    password: '',
    passwordRepeat: ''
})

const router = useRouter()

const formErrors = ref({})

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const signUpCode = import.meta.env.VITE_SIGNUP_CODE

const validateForm = () => {
    formErrors.value = {}

    if (!form.value.code) {
        formErrors.value.code = 'Code cannot be empty'
    } else if (form.value.code !== signUpCode) {
        formErrors.value.code = 'Wrong signup code'
    }

    if (!form.value.email) {
        formErrors.value.email = 'Email cannot be empty'
    } else if (!emailPattern.test(form.value.email)) {
        formErrors.value.email = 'Wrong email format'
    }

    // tady bude validace pres frequency counter

    if (!form.value.password) {
        formErrors.value.password = 'Password cannot be empty'
    } else if (form.value.password < 8) {
        formErrors.value.password = 'Password cannot be shorter than 8 chars'
    }


    if (!form.value.passwordRepeat) {
        formErrors.value.passwordRepeat = 'Cannot be empty'
    }
    else if (form.value.passwordRepeat !== form.value.password) {
        formErrors.value.passwordRepeat = 'Doesnt match the password'
    }



    return Object.keys(formErrors.value).length === 0;
}

const clearForm = () => {
    form.value.code = '';
    form.value.email = '';
    form.value.password = '';
    form.value.passwordRepeat = ''
}



const submitForm = async () => {
    if (!validateForm()) return

    const data = {
        email: form.value.email,
        password: form.value.password,
    }

    const success = await signUpUser(data)

    if (success) {
        router.push({ name: 'TheDashboard' })
        clearForm();
    }
}




</script>
