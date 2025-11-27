<template>
    <div :class="cn('flex flex-col gap-6', props.class)">
        <Card>
            <div
                v-if="isPending"
                class="absolute inset-[5px] flex items-center justify-center bg-white/60 z-1 backdrop-blur-[5px]"
            >
                <Spinner class="size-20 text-primary" />
            </div>
            <CardHeader>
                <the-logo-circle
                    v-if="projectName"
                    :project-title="projectName"
                />

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
                    <AlertCircleIcon />
                    <AlertDescription>{{ error }}</AlertDescription>
                </Alert>
                <div>
                    <form
                        @submit="onSubmitForm"
                        class="space-y-4"
                    >
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

                        <Button
                            type="submit"
                            class="w-full"
                            :disabled="isPending"
                        >
                            <span v-if="isPending">Loading...</span>
                            <span v-else>Login</span>
                        </Button>

                        <div class="text-center text-sm text-muted-foreground mt-4">
                            Don't have an account?
                            <router-link
                                :to="{ name: 'TheSignup' }"
                                class="underline underline-offset-4 hover:text-primary"
                            >
                                Sign up
                            </router-link>
                        </div>

                    </form>
                </div>
            </CardContent>
        </Card>
    </div>
</template>

<script setup>
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { useRouter } from 'vue-router'
import * as z from 'zod'

import { Button } from '@/components/ui/button'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'

import {
    Alert,
    AlertDescription
} from '@/components/ui/alert'

import { AlertCircleIcon } from 'lucide-vue-next'

import { Spinner } from '@/components/ui/spinner'

import { Input } from '@/components/ui/input'

import TheLogoCircle from '@/components/layout/TheLogoCircle.vue'

import { useAuthActions } from '@/composables'

import { cn } from '@/lib/utils'

const props = defineProps({
    class: { type: null, required: false },
});

const projectName = import.meta.env.VITE_PROJECT_NAME

const router = useRouter()

const { isPending, error, logInUser } = useAuthActions()

const formSchema = toTypedSchema(z.object({
    email: z.string()
        .min(1, { message: 'Email is required.' })
        .email({ message: 'Invalid email format.' }),
    password: z.string()
        .min(1, { message: 'Password is required.' })
        .min(8, { message: 'Password must be at least 8 characters.' }),
}))

const { handleSubmit } = useForm({
    validationSchema: formSchema,
    initialValues: {
        email: '',
        password: '',
    },
    validateOnBlur: false,
    validateOnChange: false,
    validateOnInput: false,
    validateOnModelUpdate: false,
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