<template>
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

            <CardTitle>Password recovery</CardTitle>
            <CardDescription>
                Please enter your email address and we will send you a password reset link.
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
            <Alert
                v-else-if="isSuccess"
                variant="success"
                class="mb-6"
            >
                <CheckCircle2Icon />
                <AlertTitle>Password reset link sent! </AlertTitle>
                <AlertDescription>
                    Please check your email.
                </AlertDescription>
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
                    <div class="grid grid-cols-1 md:grid-cols-[30%_1fr] gap-4 items-center">
                        <router-link
                            type="button"
                            class="hover:text-primary transition-all duration-600 block text-center text-sm"
                            :to="{ name: 'TheLogin' }"
                        >
                            Cancel
                        </router-link>

                        <Button
                            type="submit"
                            class=""
                            :disabled="isPending"
                        >
                            <span v-if="isPending">Sending...</span>
                            <span v-else>Reset password</span>
                        </Button>
                    </div>
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

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import {
    Alert,

    AlertDescription,
    AlertTitle,
} from '@/components/ui/alert';

import { AlertCircleIcon, CheckCircle2Icon } from 'lucide-vue-next';

import Spinner from '@/components/base/BaseLoader.vue';

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';

import { Button } from '@/components/ui/button';

import TheLogoCircle from '@/components/layout/TheLogoCircle.vue';
import { useAuthActions } from '@/composables';
import { addDelay } from '@/utils';
import { ref } from 'vue';

const projectName = import.meta.env.VITE_PROJECT_NAME

const router = useRouter()

const {
    error,
    isPending,
    resetEmail,
} = useAuthActions()

const formSchema = toTypedSchema(z.object({
    email: z.string()
        .min(1, { message: 'Email is required.' })
        .email({ message: 'Invalid email format.' }),
}))

const { handleSubmit, } = useForm({
    validationSchema: formSchema,
    initialValues: {
        email: ''
    },
    validateOnBlur: false,
    validateOnChange: false,
    validateOnInput: false,
    validateOnModelUpdate: false,
})

const isSuccess = ref(false)

const onSubmitForm = handleSubmit(async (values) => {
    isSuccess.value = false
    const success = await resetEmail(values.email)

    if (success) {
        isSuccess.value = true

        await addDelay(3000)

        router.push({ name: 'TheLogin' })
    }
})

</script>