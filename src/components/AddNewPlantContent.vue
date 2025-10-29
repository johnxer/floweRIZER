<template>
    <base-modal-content>
        <template #modalTitle>
            Create new plant
        </template>
        <div>
            <form
                @submit.prevent="submitForm"
                novalidate
            >

                <div class="space-y-4">
                    <base-input-wrapper-authed
                        field-label="Name"
                        field-id="plant-name"
                        :errorText="formErrors.name"
                    >
                        <input
                            type="text"
                            id="plant-name"
                            placeholder="Enter plant name..."
                            class="px-4 py-2 rounded-xl border-2 w-full focus:outline-0 focus:border-primary transition-colors duration-600 text-gray-500 dark:text-white/75"
                            :class="!formErrors.name ? 'border-gray-300 dark:border-gray-500' : 'border-red-300 dark:border-red-900'"
                            v-model="form.name"
                            @input="formErrors.name = null"
                        >
                    </base-input-wrapper-authed>
                    <base-input-wrapper-authed
                        field-label="Image"
                        field-id="plant-image"
                    >
                    </base-input-wrapper-authed>
                    <base-input-wrapper-authed
                        field-label="Description"
                        field-id="plant-description"
                    >
                        <textarea
                            id="room-description"
                            placeholder="Enter room description..."
                            class="px-4 py-2 rounded-xl border-2 border-gray-300 w-full read-only:cursor-not-allowed focus:outline-0 read-only:opacity-50 text-gray-500 dark:text-white/75 dark:border-gray-500 h-[100px]"
                            v-model="form.desc"
                        />
                    </base-input-wrapper-authed>
                </div>
                <base-button
                    class="mt-8"
                    :class="{ 'animate-pulse': isPending }"
                    btn-style="notRounded"
                    btn-size="base"
                    :disabled="isPending"
                >
                    Create
                </base-button>
            </form>
        </div>
    </base-modal-content>
</template>

<script setup>

import { ref } from 'vue';
import { useSendData } from '../composables/useSendData';
import BaseButton from './Base/BaseButton.vue';
import BaseInputWrapperAuthed from './Base/BaseInputWrapperAuthed.vue';
import BaseModalContent from './Base/BaseModal/BaseModalContent.vue';

const props = defineProps({
    roomId: {
        type: String,
        required: true,
    }
})

const {
    error,
    isPending,
    sendDataPlants
} = useSendData()

const form = ref({
    name: '',
    imgSrc: '',
    desc: ''
})

const formErrors = ref({})

const validateForm = () => {
    formErrors.value = {}

    if (!form.value.name) {
        formErrors.value.name = "Plant's name cannot be empty"
    }

    return Object.keys(formErrors.value).length === 0
}

const clearForm = () => {
    form.value.name = ''
    form.value.imgSrc = ''
    form.value.desc = ''
}

const emit = defineEmits(['close-modal'])

const submitForm = async () => {
    if (!validateForm()) return

    const data = {
        name: form.value.name,
        imgSrc: form.value.imgSrc,
        desc: form.value.desc,
    }

    const success = await sendDataPlants(data, props.roomId)

    if (success) {
        clearForm()

        emit('close-modal')

        // close modal
    }
}

</script>

<style lang="scss" scoped></style>