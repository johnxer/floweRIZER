<template>
    <TransitionRoot
        as="template"
        :show="modalToggle"
    >
        <Dialog
            class="relative z-10"
            @close="() => { if (!props.isModalPending) handlecloseModal() }"
        >
            <TransitionChild
                as="template"
                enter="ease-out duration-300"
                enter-from="opacity-0"
                enter-to=""
                leave="ease-in duration-200"
                leave-from=""
                leave-to="opacity-0"
            >
                <div class="fixed inset-0 bg-gray-500/75 transition-opacity dark:bg-neutral-900/50" />
            </TransitionChild>

            <div class="fixed inset-0 z-10 w-screen overflow-y-auto modal-backdrop">
                <div class="flex min-h-full items-start justify-center p-4 text-center sm:items-center sm:p-0">
                    <TransitionChild
                        as="template"
                        enter="ease-out duration-400"
                        enter-from="opacity-0 -translate-y-20 sm:-translate-y-0 sm:scale-95"
                        enter-to=" translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leave-from=" translate-y-0 sm:scale-100"
                        leave-to="opacity-0 -translate-y-20 sm:-translate-y-0 sm:scale-95"
                    >
                        <DialogPanel
                            class="w-full sm:my-8 py-8 relative"
                            :class="modalSizeValue"
                        >
                            <button
                                type="button"
                                class="absolute top-0 text-3xl text-white dark:text-white/50 right-0 cursor-pointer hover:opacity-50 transiton-opacity duration-600 disabled:opacity-50 disabled:cursor-default"
                                @click="() => { if (!props.isModalPending) handlecloseModal() }"
                                :disabled="props.isModalPending"
                                ref="cancelButtonRef"
                            >
                                <span class="material-symbols-outlined">
                                    close
                                </span>
                            </button>
                            <div class="transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all dark:bg-neutral-900">
                                <div>
                                    <slot />
                                </div>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script setup>

import { computed } from 'vue';

const props = defineProps({
    modalToggle: {
        type: Boolean,
        required: false,
        default: false
    },
    isModalPending: {
        type: Boolean,
        required: false
    },
    modalSize: {
        type: String,
        required: false,
        default: 'lg'
    }
})

import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue';

const emit = defineEmits(['close-modal'])

const handlecloseModal = () => {
    emit('close-modal', false)
}

const sizeMap = {
    sm: 'max-w-sm',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
}


const modalSizeValue = computed(() => {
    return sizeMap[props.modalSize]
})


</script>