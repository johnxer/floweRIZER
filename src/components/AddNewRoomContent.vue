<template>
    <base-modal-content>
        <template #modalTitle>
            Create new room
        </template>
        <div>
            <div>
                <form
                    @submit.prevent="submitForm"
                    novalidate
                >

                    <div class="space-y-4">
                        <base-input-wrapper-authed
                            field-label="Name"
                            field-id="room-name"
                            :errorText="formErrors.name"
                        >
                            <input
                                type="text"
                                id="room-name"
                                placeholder="Enter room name..."
                                class="px-4 py-2 rounded-xl border-2 w-full focus:outline-0 focus:border-primary transition-colors duration-600 text-gray-500 dark:text-white/75"
                                :class="!formErrors.name ? 'border-gray-300 dark:border-gray-500' : 'border-red-300 dark:border-red-900'"
                                v-model.trim="form.name"
                                @input="formErrors.name = null"
                            >
                        </base-input-wrapper-authed>
                        <base-input-wrapper-authed
                            field-label="Icon"
                            field-id="room-icon"
                            :errorText="formErrors.icon"
                        >
                            <select
                                @change="formErrors.icon = null"
                                id="room-icon"
                                class="px-4 py-2 rounded-xl border-2 w-full focus:outline-0 focus:border-primary transition-colors duration-600 text-gray-500 dark:text-white/75 cursor-pointer"
                                :class="!formErrors.icon ? 'border-gray-300 dark:border-gray-500' : 'border-red-300 dark:border-red-900'"
                                v-model="form.icon"
                            >
                                <option
                                    selected
                                    disabled
                                    value=""
                                >Select icon...</option>
                                <option
                                    v-for="icon in icons"
                                    :key="icon.icon"
                                    :value="icon.icon"
                                >
                                    {{ icon.name }}
                                </option>
                            </select>

                        </base-input-wrapper-authed>
                        <base-input-wrapper-authed
                            field-label="Room colour"
                            field-id="room-color"
                        >
                            <div class="rounded-lg overflow-hidden w-[30px] h-[30px] relative border-2 border-gray-300">
                                <input
                                    type="color"
                                    id="room-color"
                                    class="focus:outline-0 border-0 p-0 absolute inset-0 w-full h-full cursor-pointer"
                                    v-model="form.color"
                                >
                            </div>
                        </base-input-wrapper-authed>
                        <base-input-wrapper-authed
                            field-label="Description"
                            field-id="room-description"
                        >
                            <textarea
                                id="room-description"
                                placeholder="Enter room description..."
                                class="px-4 py-2 rounded-xl border-2 border-gray-300 w-full read-only:cursor-not-allowed focus:outline-0 read-only:opacity-50 text-gray-500 dark:text-white/75 dark:border-gray-500 h-[100px] mb-0"
                                v-model.trim="form.desc"
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
                        {{ isPendingBtnText }}
                    </base-button>

                </form>
            </div>
        </div>
    </base-modal-content>
</template>

<script setup>

import { computed, ref } from 'vue';
import { useSendData } from '../composables/useSendData';
import { useRoomStore } from '../stores/useRoomStore';
import BaseButton from './Base/BaseButton.vue';
import BaseInputWrapperAuthed from './Base/BaseInputWrapperAuthed.vue';
import BaseModalContent from './Base/BaseModal/BaseModalContent.vue';


const {
    roomIcons: icons,
    roomDefaultColor: color
} = useRoomStore()

const {
    isPending,
    error,
    sendDataRooms
} = useSendData()


const form = ref({
    name: '',
    icon: '',
    color: color,
    description: ''
})


const formErrors = ref({})

const validateForm = () => {
    formErrors.value = {}

    if (!form.value.name) {
        formErrors.value.name = 'Room name cannot be empty'
    }

    if (!form.value.icon) {
        formErrors.value.icon = 'Room icon has to be selected'
    }

    return Object.keys(formErrors.value).length === 0
}

const clearForm = () => {
    form.value.name = '#99c23b'
    form.value.icon = ''
    form.value.color = color
    form.value.desc = ''
}

const emit = defineEmits(['close-modal'])

const submitForm = async () => {
    if (!validateForm()) return;

    const data = {
        name: form.value.name,
        icon: form.value.icon,
        color: form.value.color,
        desc: form.value.desc,
    }

    console.log(data)

    const success = await sendDataRooms(data)

    if (success) {
        clearForm();

        emit('close-modal')
    }
}


const isPendingBtnText = computed(() => isPending.value ? 'Creating room...' : 'Create room')

</script>

<style lang="scss" scoped>
-webkit-color-swatch-wrapper {
    padding: 0 !important;
}

input {
    ::-webkit-color-swatch-wrapper {
        padding: 0;
    }
}
</style>