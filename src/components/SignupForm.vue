<template>
    <div :class="cn('flex flex-col gap-4', props.class)">
        <the-logo />
        <base-loader
            v-if="isPending"
            :has-bg="true"
            :bg-blur="true"
            position="fixed"
        />
        <Card>
            <CardHeader>
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
                    <span class="material-symbols-outlined">
                        error
                    </span>
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
                                    <Button
                                        type="submit"
                                        variant="hover-outline"
                                    >
                                        Create Account
                                    </Button>
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
    </div>
</template>


<script setup>
import { useRouter } from 'vue-router';

import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import * as z from 'zod';

import BaseLoader from '@/components/base/BaseLoader.vue';

import TheLogo from '@/components/layout/TheLogo.vue';

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


import { useAuthActions } from '@/composables';

import { cn } from '@/lib/utils';

const props = defineProps({
    class: { type: null, required: false },
});

const {
    error,
    isPending,
    signUpUser,
} = useAuthActions()

const router = useRouter()

const signUpCode = import.meta.env.VITE_SIGNUP_CODE

const formSchema = toTypedSchema(z.object({
    email: z.string()
        .min(1, { message: 'Email is required.' })
        .email({ message: 'Invalid email format.' }),
    password: z.string()
        .min(1, { message: 'Password is required.' })
        .min(8, { message: 'Password must be at least 8 characters.' })
        .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter.' })
        .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter.' })
        .regex(/[0-9]/, { message: 'Password must contain at least one number.' })
        .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one special character.' }),
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