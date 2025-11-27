<template>
    <div>
        <base-modal-content>
            <template #modalTitle>
                Delete Account
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
                        Deleting user...
                    </base-loader>
                    <div
                        v-else
                        class="text-gray-600 dark:text-gray-500"
                    >
                        <Alert
                            v-if="error"
                            variant="destructive"
                            class="mb-6"
                        >
                            <AlertCircleIcon />
                            <AlertDescription>{{ error }}</AlertDescription>
                        </Alert>

                        <p class="mb-2">
                            Once your account is deleted, all your personal data, preferences, and saved items will be permanently removed.
                        </p>
                        <p>
                            This action <strong>can't be undone</strong>. Are you absolutely sure?
                        </p>
                        <transition
                            name="fade"
                            mode="out-in"
                        >
                            <div
                                v-if="showPwForm"
                                class="mt-6 rounded-xl bg-gray-100 p-4"
                            >
                                <p class="mb-2">
                                    Please enter your password to confirm deletion.
                                </p>
                                <form
                                    @submit.prevent="onSubmitForm"
                                    class="grid grid-cols-1 md:grid-cols-[60%_1fr] gap-4 items-start"
                                >
                                    <FormField
                                        v-slot="{ componentField }"
                                        name="password"
                                    >
                                        <FormItem>
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
                                        variant="destructive"
                                        class="min-w-1/2"
                                        @click="handleDeleteUser"
                                    >
                                        Delete account
                                    </Button>
                                </form>
                            </div>
                            <div
                                class="mt-6 flex flex-col md:flex-row justify-between gap-4"
                                v-else
                            >
                                <Button
                                    class="min-w-1/3 order-2 md:order-1"
                                    variant="outline"
                                    @click="handleCloseModal"
                                >
                                    Keep my account
                                </Button>
                                <Button
                                    variant="destructive"
                                    class="min-w-2/3 order-1 md:order-2"
                                    @click="handleDeleteUser"
                                >
                                    Yes, delete my account
                                </Button>

                            </div>
                        </transition>
                    </div>
                </transition>
            </div>
        </base-modal-content>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';

import { useRouter } from 'vue-router';

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

import { AlertCircleIcon } from 'lucide-vue-next';

import {
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';

import { useAuthStore } from '@/stores/useAuthStore';

import { useAuthActions, useDeleteData, useStorage } from '@/composables';
import { auth } from '@/firebase/config';

const {
    error: errorAuth,
    isPending: isPendingAuth,
    userDelete,
    userReauthenticate
} = useAuthActions()


const {
    error: errorDelete,
    isPending: isPendingDelete,
    deleteUserFirestore
} = useDeleteData()

const {
    error: errorStorage,
    isPending: isPendingStorage,
    deleteDirectory
} = useStorage()

const authStore = useAuthStore()


const emit = defineEmits(['close-modal'])

const router = useRouter()


const handleCloseModal = () => {
    emit('close-modal')
}

const showPwForm = ref(false)

const error = computed(() => errorAuth.value || errorDelete.value || errorStorage.value)
const isPending = computed(() => isPendingAuth.value || isPendingDelete.value || isPendingStorage.value)

const handleDeleteUser = async () => {
    showPwForm.value = true
}

const formSchema = toTypedSchema(z.object({
    password: z.string()
        .min(1, { message: 'Password is required.' })
        .min(8, { message: 'Password must be at least 8 characters.' }),
}))

const { handleSubmit } = useForm({
    validationSchema: formSchema,
    initialValues: {
        password: '',
    },
    validateOnBlur: false,
    validateOnChange: false,
    validateOnInput: false,
    validateOnModelUpdate: false,
})

const onSubmitForm = handleSubmit(async (values) => {
    const reAuthed = await userReauthenticate(authStore.user?.email, values.password)

    authStore.user = auth.currentUser

    if (!reAuthed) {
        values.password = ''
        return
    }

    const [delAvatars, delPlants, delRooms] = await Promise.all([
        deleteDirectory(`avatars/${authStore.user?.uid}`),
        deleteDirectory(`plants/${authStore.user?.uid}`),
        deleteDirectory(`rooms/${authStore.user?.uid}`)
    ]);

    if (!delAvatars || !delPlants || !delRooms) return;

    const docDeleted = await deleteUserFirestore(authStore.user?.uid)

    if (!docDeleted) return

    const authDeleted = await userDelete()

    if (!authDeleted) return

    values.password = ''

    showPwForm.value = false

    handleCloseModal()

    router.push({ name: 'TheLogin' })
})



</script>

<style lang="scss" scoped></style>