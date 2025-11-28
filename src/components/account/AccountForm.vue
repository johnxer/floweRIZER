<template>
    <div class="relative">
        <transition
            name="fade"
            mode="out-in"
        >
            <base-loader
                v-if="isPendingProfileUpdate"
                position="absolute"
                bg-color="body"
            />
        </transition>
        <form
            @submit.prevent="onSubmitForm"
            novalidate
        >
            <FieldGroup>
                <FormField
                    v-slot="{ componentField }"
                    name="userName"
                >
                    <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                            <Input
                                type="text"
                                placeholder="Enter username..."
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
                                readonly
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <Button
                    :disabled="isPendingProfileUpdate"
                    size="lg"
                    class="w-full"
                >
                    Save
                </Button>
            </FieldGroup>
        </form>
    </div>
</template>



<script setup>
import { ref } from 'vue';

import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import * as z from 'zod';

import BaseLoader from '@/components/base/BaseLoader.vue';

import { Button } from '@/components/ui/button';

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';


import {
    FieldGroup
} from '@/components/ui/field';

import { Input } from '@/components/ui/input';

import { useAuthStore } from '@/stores/useAuthStore';

import { useAuthActions, useUpdateData } from '@/composables';

const authStore = useAuthStore()

const emit = defineEmits(['update-in-progress'])

const {
    updateProfileData
} = useAuthActions()

const {
    error: errorProfileUpdate,
    isPending: isPendingProfileUpdate,
    updateData,
} = useUpdateData()

// const { userChangePassword } = useAuthActions()

const emailValue = authStore.user?.email;
const userNameValue = authStore.user?.displayName;

// const form = ref({
//     themeColor: '#99c23b'
// })

const isSuccessImage = ref(false)

isSuccessImage.value = false


const formSchema = toTypedSchema(z.object({
    email: z.string().email(),
    userName: z.string().min(1, { message: 'Username is required.' }),
}))

const { handleSubmit } = useForm({
    validationSchema: formSchema,
    initialValues: {
        email: emailValue,
        userName: userNameValue || '',
    },
})

const onSubmitForm = handleSubmit(async (values) => {
    emit('update-in-progress', true)

    const dataProfile = {
        displayName: values.userName,
    }

    const data = {
        // customColor: form.value.themeColor,
        ...dataProfile
    }

    const successProfile = await updateProfileData(dataProfile)
    const successUserDb = await updateData(data)

    if (successProfile && successUserDb) {
        emit('update-in-progress', false)
    }
})

</script>

<style lang="scss" scoped></style>