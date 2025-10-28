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
                    <base-input-wrapper
                        icon-name="lock"
                        :error-text="formErrors.password"
                    >
                        <input
                            type="password"
                            placeholder="Enter password..."
                            class="w-100 py-2 dark:placeholder:text-white/60 placeholder:text-gray-400 placeholder:italic placeholder:font-normal focus:outline-0 font-semibold dark:text-white/80 text-gray-500/80 peer"
                            v-model.trim="form.password"
                            @input="formErrors.password = null"
                        />
                    </base-input-wrapper>
                </div>
                <base-button class="mt-8">
                    Login
                </base-button>
            </div>
        </transition>
    </form>
</template>

<script setup>
import BaseButton from '../Base/BaseButton.vue';
import BaseFormMessageBox from '../Base/BaseFormMessageBox.vue';
import BaseInputWrapper from '../Base/BaseInputWrapper.vue';


import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useLogIn } from '../../composables/useAuth';

const router = useRouter()


const {
    error,
    isPending,
    logInUser
} = useLogIn()



const form = ref({
    email: '',
    password: ''
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

    return Object.keys(formErrors.value).length === 0
}


const clearForm = () => {
    form.value.email = '';
    form.value.password = '';
}

const submitForm = async () => {
    if (!validateForm()) return

    const data = {
        email: form.value.email,
        password: form.value.password
    }

    const success = await logInUser(data)

    if (success) {
        router.push({ name: 'TheDashboard' })
        clearForm();
    }

}
</script>