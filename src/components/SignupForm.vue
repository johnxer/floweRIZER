<template>
    <Card>
        <CardHeader>
            <the-logo-circle :project-title="projectName" />
            <CardTitle>Create an account</CardTitle>
            <CardDescription>
                Enter your information below to create your account
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form>
                <FieldGroup>
                    <Field>
                        <FieldLabel for="key"> Access code </FieldLabel>
                        <Input
                            id="key"
                            type="text"
                            placeholder="Enter code..."
                            v-model.trim="form.code"
                            @input="formErrors.code = null"
                            required
                        />
                    </Field>
                    <Field>
                        <FieldLabel for="email"> Email </FieldLabel>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter email..."
                            v-model.trim="form.email"
                            @input="formErrors.email = null"
                            required
                        />
                        <FieldDescription>
                            We'll use this to contact you. We will not share your email with
                            anyone else.
                        </FieldDescription>
                    </Field>
                    <Field>
                        <FieldLabel for="password"> Password </FieldLabel>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter password..."
                            v-model.trim="form.password"
                            @input="formErrors.password = null"
                            required
                        />
                        <FieldDescription>Must be at least 8 characters long.</FieldDescription>
                    </Field>
                    <Field>
                        <FieldLabel for="confirm-password"> Confirm Password </FieldLabel>
                        <Input
                            id="confirm-password"
                            type="password"
                            placeholder="Repeat password..."
                            v-model.trim="form.passwordRepeat"
                            @input="formErrors.passwordRepeat = null"
                            required
                        />
                        <FieldDescription>Please confirm your password.</FieldDescription>
                    </Field>
                    <FieldGroup>
                        <Field>
                            <Button type="submit"> Create Account </Button>
                            <FieldDescription class="px-6 text-center">
                                Already have an account?
                                <router-link :to="{ name: 'TheLogin' }">Sign in</router-link>
                            </FieldDescription>
                        </Field>
                    </FieldGroup>
                </FieldGroup>
            </form>
        </CardContent>
    </Card>
</template>


<script setup>
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import TheLogoCircle from '@/components/layout/TheLogoCircle.vue';

import { useAuthActions } from '@/composables';

import { ref } from 'vue';
import { useRouter } from 'vue-router';


const {
    error,
    isPending,
    signUpUser,
} = useAuthActions()


const form = ref({
    code: '',
    email: '',
    password: '',
    passwordRepeat: ''
})

const projectName = import.meta.env.VITE_PROJECT_NAME

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
    } else if (form.value.password.length < 8) {
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
        clearForm();

        router.push({ name: 'TheDashboard' })
    }
}


</script>