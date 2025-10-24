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
                    <div v-if="error">
                        {{ error }}
                    </div>
                </transition>
                <div class="space-y-4">
                    <base-input-wrapper
                        icon-name="email"
                        :error-text="formErrors.email"
                    >
                        <input
                            type="email"
                            placeholder="Enter email..."
                            class="w-100 py-2 dark:placeholder:text-white/60 placeholder:text-gray-400 placeholder:italic placeholder:font-normal focus:outline-0 font-semibold text-white/80 peer"
                            v-model.trim="form.email"
                            @input="formErrors.email = null"
                        />
                    </base-input-wrapper>

                    <base-input-wrapper icon-name="lock" :error-text="formErrors.password">
                        <input
                            type="password"
                            placeholder="Enter password..."
                            class="w-100 py-2 dark:placeholder:text-white/60 placeholder:text-gray-400 placeholder:italic placeholder:font-normal focus:outline-0 font-semibold text-white/80 peer"
                            v-model.trim="form.password"
                        />
                    </base-input-wrapper>

                    <base-input-wrapper icon-name="lock" :error-text="formErrors.passwordRepeat">
                        <input
                            type="password"
                            placeholder="Repeat password..."
                            class="w-100 py-2 dark:placeholder:text-white/60 placeholder:text-gray-400 placeholder:italic placeholder:font-normal focus:outline-0 font-semibold text-white/80 peer"
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
import BaseInputWrapper from '../Base/BaseInputWrapper.vue';


import { ref } from 'vue';
import { useSignUp } from '../../composables/useAuth';

const {
    error,
    isPending,
    newUser,
    signUpUser,
} = useSignUp()


const form = ref({
    email: '',
    password: '',
    passwordRepeat: ''
})


const formErrors = ref({})

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/


const validateForm = () => {
    formErrors.value = {}

    if (!form.value.email) {
        formErrors.value.email = 'Email cannot be empty'
    } else if (!emailPattern.test(form.value.email)) {
        formErrors.value.email = 'Wrong email format'
    }

    if (!form.value.password) {
        formErrors.value.password = 'Password cannot be empty'
    } else if (form.value.password < 8) {
        formErrors.value.password = 'Password cannot be shorter than 8 chars'
    }

    // tady dame validaci pres frequency counter

    if (!form.value.passwordRepeat) {
        formErrors.value.passwordRepeat = 'Cannot be empty'
    }
    else if (form.value.passwordRepeat !== form.value.password) {
        formErrors.value.passwordRepeat = 'Doesnt match the password'
    }



    return Object.keys(formErrors.value).length === 0;
}

const clearForm = () => {
    form.value.email = '';
    form.value.password = '';
    form.value.passwordRepeat = ''
}



const submitForm = () => {
    if (!validateForm()) return

    const data = {
        email: form.value.email,
        password: form.value.password,
        // passwordRepeat: passwordRepeat.value
    }

    console.log(data)

    // signUpUser(data)

    clearForm();


}




</script>
