<template>
    <Card>
        <div
            v-if="isPending"
            class="absolute inset-[5px] flex items-center justify-center bg-white/60 z-1 backdrop-blur-[5px]"
        >
            <Spinner class="size-20 text-primary" />
        </div>
        <CardHeader>
            <the-logo-circle :project-title="projectName" />
            <CardTitle>Create an account</CardTitle>
            <CardDescription>
                Enter your information below to create your account
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Alert
                v-if="error"
                variant="destructive"
                class="mb-6"
            >
                <AlertCircleIcon />
                <AlertDescription>{{ error }}</AlertDescription>
            </Alert>
            <div>
                <form
                    @submit="onSubmitForm"
                    novalidate
                >
                    <FieldGroup>
                        <FormField
                            v-slot="{ componentField }"
                            name="code"
                        >
                            <FormItem>
                                <FormLabel>Access code</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Enter code..."
                                        v-bind="componentField"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <FormField
                            v-slot="{ componentField }"
                            name="email"
                        >
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="Enter email..."
                                        v-bind="componentField"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <FormField
                            v-slot="{ componentField }"
                            name="password"
                        >
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="Enter password..."
                                        v-bind="componentField"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>

                        <FormField
                            v-slot="{ componentField }"
                            name="passwordRepeat"
                        >
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="Repeat password..."
                                        v-bind="componentField"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>

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
            </div>
        </CardContent>
    </Card>
</template>


<script setup>

import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { useRouter } from 'vue-router';
import * as z from 'zod';

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
    FieldGroup
} from '@/components/ui/field';

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';

import {
    Alert,
    AlertDescription
} from '@/components/ui/alert';

import { AlertCircleIcon } from 'lucide-vue-next';

import { Spinner } from '@/components/ui/spinner';

import TheLogoCircle from '@/components/layout/TheLogoCircle.vue';

import { useAuthActions } from '@/composables';

const {
    error,
    isPending,
    signUpUser,
} = useAuthActions()

const router = useRouter()

const projectName = import.meta.env.VITE_PROJECT_NAME

const signUpCode = import.meta.env.VITE_SIGNUP_CODE

const formSchema = toTypedSchema(z.object({
    email: z.string()
        .min(1, { message: 'Email is required.' })
        .email({ message: 'Invalid email format.' }),
    password: z.string()
        .min(1, { message: 'Password is required.' })
        .min(8, { message: 'Password must be at least 8 characters.' }),
    passwordRepeat: z.string()
        .min(1, { message: 'Password is required.' })
        .min(8, { message: 'Password must be at least 8 characters.' }),
    code: z.string()
        .min(1, { message: 'Code is required.' })
        .refine((val) => val === signUpCode, {
            message: 'Invalid sign up code. Please check your invitation.',
        })
})
    .refine((data) => data.password === data.passwordRepeat, {
        message: "Passwords do not match",
        path: ["passwordRepeat"],
    }));


const { handleSubmit } = useForm({
    validationSchema: formSchema,
    validateOnMount: false,

    initialValues: {
        code: '',
        email: '',
        password: '',
        passwordRepeat: '',
    },
    validateOnBlur: false,
    validateOnChange: false,
    validateOnInput: false,
    validateOnModelUpdate: false,
})




const onSubmitForm = handleSubmit(async (values) => {
    const success = await signUpUser({
        email: values.email,
        password: values.password,
    })

    if (success) {
        router.push({ name: 'TheDashboard' })
    }
})


</script>