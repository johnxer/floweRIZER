<template>
    <div>
        <TransitionRoot
            as="template"
            :show="modalToggle"
        >
            <Dialog
                class="relative z-10"
                @close="closeModalHandle"
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
                    <div class="fixed inset-0 bg-gray-500/75 transition-opacity dark:bg-gray-900/50" />
                </TransitionChild>

                <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <TransitionChild
                            as="template"
                            enter="ease-out duration-300"
                            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enter-to=" translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leave-from=" translate-y-0 sm:scale-100"
                            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <DialogPanel class="w-full max-w-lg sm:my-8 py-8 relative">
                                <button
                                    type="button"
                                    class="absolute top-0 text-2xl text-white right-0 cursor-pointer"
                                    @click="closeModalHandle"
                                    ref="cancelButtonRef"
                                >
                                    <span class="material-symbols-outlined">
                                        close
                                    </span>
                                </button>
                                <div class="transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all dark:bg-gray-800 dark:outline dark:-outline-offset-1 dark:outline-white/10">
                                    <div class="bg-white dark:bg-gray-800">
                                        <slot />
                                    </div>
                                    <!-- <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 dark:bg-gray-700/25">
                                        <slot name="actions"/>
                                    </div> -->
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </TransitionRoot>
    </div>
</template>

<script setup>

const props = defineProps({
    modalToggle: {
        type: Boolean,
        required: false,
        default: false
    }
})

import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue';

const emit = defineEmits(['close-modal'])

const closeModalHandle = () => {
    emit('close-modal', false)
}

</script>