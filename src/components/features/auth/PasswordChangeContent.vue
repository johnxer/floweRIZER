<template>
    <div >
        <base-modal-content>
            <template #modalTitle>
                Change password
            </template>
            <div>
                <transition
                    name="fade"
                    mode="out-in"
                >
                    <base-loader
                        v-if="isPending"
                        position="static"
                    >
                        Changing password...
                    </base-loader>
                    <div
                        v-else-if="isSuccess"
                        class="text-gray-600 dark:text-gray-500"
                    >
                        Password changed successfully.
                        <div class="mt-6">
                            <Button
                                variant="outline"
                                @click="uiStore.closeModal"
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                    <div
                        v-else
                        class="text-gray-600 dark:text-gray-500"
                    >
                        <transition
                            name="fade"
                            mode="out-in"
                        >
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
                        </transition>
                        <form
                            @submit.prevent="onSubmitForm"
                            novalidate
                        >
                            <FieldGroup>
                                <FormField
                                    v-slot="{ componentField }"
                                    name="oldPassword"
                                >
                                    <FormItem>
                                        <FormLabel>Current password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="Enter current password..."
                                                v-bind="componentField"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                </FormField>
                                <FormField
                                    v-slot="{ componentField }"
                                    name="newPassword"
                                >
                                    <FormItem>
                                        <FormLabel>New password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="Enter new password..."
                                                v-bind="componentField"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                </FormField>

                                <FormField
                                    v-slot="{ componentField }"
                                    name="newPasswordRepeat"
                                >
                                    <FormItem>
                                        <FormLabel>Confirm new password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="Repeat new password..."
                                                v-bind="componentField"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                </FormField>

                                <Button type="submit">
                                    Update password
                                </Button>
                            </FieldGroup>
                        </form>
                    </div>
                </transition>
            </div>
        </base-modal-content>
    </div>
</template>

<script setup>

import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import * as z from 'zod';

import BaseLoader from '@/components/base/BaseLoader.vue';
import BaseModalContent from '@/components/base/BaseModal/BaseModalContent.vue';

import { Button } from '@/components/ui/button';

import {
    Alert,
    AlertDescription
} from '@/components/ui/alert';

import {
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
import { useAuthActions } from '@/composables';

import { useAuthStore } from '@/stores/useAuthStore';
import { useUIStore } from '@/stores/useUIStore';

import { auth } from '@/firebase/config';
import { updatePassword } from 'firebase/auth';
import { computed, ref } from 'vue';

const {
    error: errorAuth,
    isPending: isPendingAuth,
    userReauthenticate
} = useAuthActions()

const authStore = useAuthStore()
const uiStore = useUIStore()

const isSuccess = ref(false)

const formSchema = toTypedSchema(z.object({
    oldPassword: z.string()
        .min(1, { message: 'Password is required.' }),
    newPassword: z.string()
        .min(1, { message: 'Password is required.' })
        .min(8, { message: 'Password must be at least 8 characters.' })
        .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter.' })
        .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter.' })
        .regex(/[0-9]/, { message: 'Password must contain at least one number.' })
        .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one special character.' }),
    newPasswordRepeat: z.string()
        .min(1, { message: 'Password is required.' })
        .min(8, { message: 'Password must be at least 8 characters.' }),
})
    .refine((data) => data.newPassword === data.newPasswordRepeat, {
        message: "Passwords do not match",
        path: ["newPasswordRepeat"],
    }));


const { handleSubmit, setFieldValue, resetForm } = useForm({
    validationSchema: formSchema,
    validateOnMount: false,

    initialValues: {
        oldPassword: '',
        newPassword: '',
        newPasswordRepeat: '',
    },
})


const isPendingPwChange = ref(false)
const errorPwChange = ref(null)

const isPending = computed(() => isPendingAuth?.value || isPendingPwChange?.value)
const error = computed(() => errorAuth?.value || errorPwChange?.value)

const onSubmitForm = handleSubmit(async (values) => {
    isPendingPwChange.value = true
    errorPwChange.value = null

    try {
        const reAuthed = await userReauthenticate(
            authStore.user?.email,
            values.oldPassword
        );

        if (!reAuthed) {
            setFieldValue('oldPassword', '');
            return;
        }

        await updatePassword(auth.currentUser, values.newPassword)

        resetForm()

        isSuccess.value = true
        return true
    } catch (error) {
        console.log(error);
        errorPwChange.value = error.message
        return false
    } finally {
        isPendingPwChange.value = false
    }
})


</script>

<style lang="scss" scoped></style>