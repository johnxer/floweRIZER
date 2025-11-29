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
                <CardTitle>Login to your account</CardTitle>
                <CardDescription>
                    Enter your email below to login to your account
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
                        @submit.prevent="onSubmitForm"
                        novalidate
                    >
                        <FieldGroup>
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
                                    <div class="flex items-center justify-between">
                                        <FormLabel>Password</FormLabel>
                                        <router-link
                                            :to="{ name: 'PwRecovery' }"
                                            class="text-sm underline-offset-4 hover:underline hover:text-primary transition-all duration-600"
                                        >
                                            Forgot your password?
                                        </router-link>
                                    </div>
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

                            <FieldGroup>
                                <Field>
                                    <Button
                                        type="submit"
                                        variant="hover-outline"
                                        class="w-full"
                                        :disabled="isPending"
                                    >
                                        <span v-if="isPending">Loading...</span>
                                        <span v-else>Login</span>
                                    </Button>

                                    <FieldDescription class="px-6 text-center">
                                        Don't have an account?
                                        <router-link
                                            :to="{ name: 'TheSignup' }"
                                            class="underline underline-offset-4 hover:text-primary"
                                        >
                                            Sign up
                                        </router-link>
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
import { useRouter } from 'vue-router'

import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'

import BaseLoader from '@/components/base/BaseLoader.vue'

import TheLogo from '@/components/layout/TheLogo.vue'

import { Button } from '@/components/ui/button'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

import {
    Field,
    FieldDescription,
    FieldGroup
} from '@/components/ui/field'

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'

import {
    Alert,
    AlertDescription
} from '@/components/ui/alert'


import { Input } from '@/components/ui/input'

import { useAuthActions } from '@/composables'

import { cn } from '@/lib/utils'

const props = defineProps({
    class: { type: null, required: false },
});

const router = useRouter()

const { isPending, error, logInUser } = useAuthActions()

const formSchema = toTypedSchema(z.object({
    email: z.string()
        .min(1, { message: 'Email is required.' })
        .email({ message: 'Invalid email format.' }),
    password: z.string()
        .min(1, { message: 'Password is required.' })
}))

const { handleSubmit } = useForm({
    validationSchema: formSchema,
    initialValues: {
        email: '',
        password: '',
    },
})

const onSubmitForm = handleSubmit(async (values) => {
    const success = await logInUser({
        email: values.email,
        password: values.password
    })

    if (success) {
        router.push({ name: 'TheDashboard' })
    }
})
</script>