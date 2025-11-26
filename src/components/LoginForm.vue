<template>
    <div :class="cn('flex flex-col gap-6', props.class)">
        <Card>
            <CardHeader>
                <the-logo-circle :project-title="projectName" />
                <CardTitle>Login to your account</CardTitle>
                <CardDescription>
                    Enter your email below to login to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    @submit.prevent="submitForm()"
                    novalidate
                >
                    <FieldGroup>
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
                        </Field>
                        <Field>
                            <div class="flex items-center">
                                <FieldLabel for="password"> Password </FieldLabel>
                                <a
                                    href="#"
                                    class="ml-auto inline-block text-sm underline-offset-4 hover:underline hover:text-primary transition-all duration-600"
                                >
                                    Forgot your password?
                                </a>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter password..."
                                v-model.trim="form.password"
                                @input="formErrors.password = null"
                                required
                            />
                        </Field>
                        <Field>
                            <Button
                                type="submit"
                                variant="default"
                            >
                                Login
                            </Button>
                            <FieldDescription class="text-center">
                                Don't have an account?
                                <router-link :to="{ name: 'TheSignup' }">
                                    Sign up
                                </router-link>
                            </FieldDescription>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    </div>
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

import { cn } from '@/lib/utils';

import { useRouter } from 'vue-router';

import { useAuthActions } from '@/composables';
import { ref } from 'vue';

const props = defineProps({
    class: { type: null, required: false },
});

const projectName = import.meta.env.VITE_PROJECT_NAME


const router = useRouter()

const {
    error,
    isPending,
    logInUser
} = useAuthActions()

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