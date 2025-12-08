<template>
    <div class="relative">
        <transition
            name="fade"
            mode="out-in"
        >
            <base-loader v-if="props.isPending || isLoadingActions">
                Loading plant's history...
            </base-loader>

            <div v-else-if="props.error">
                {{ props.error }}
            </div>
            <div v-else="props.data">
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
                        <AlertDescription>
                            {{ error }}
                        </AlertDescription>
                    </Alert>
                </transition>

                <base-loader v-if="isPendingUpdate">
                    Updating plant's records...
                </base-loader>

                <ul
                    v-else
                    class="flex flex-col gap-4"
                >
                    <li>
                        <transition
                            name="fade"
                            mode="out-in"
                        >
                            <v-dropdown
                                v-if="isAddRecordShown"
                                trap-focus
                                @show="onShow"
                                @hide="onHide"
                                popper-class="popper-slide-small"
                                class="inline-flex align-top ml-[40px]"
                            >
                                <Button
                                    type="button"
                                    :class="{ '': isOpen }"
                                    variant="secondary"
                                >
                                    <span class="material-symbols-outlined text-lg">add</span>
                                    Add new record
                                </Button>
                                <template #popper>
                                    <base-popover-content>
                                        <template #desc>
                                            <ul class="flex gap-4">
                                                <li>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        v-close-popper="true"
                                                        @click="onSelectAddPhoto"
                                                    >
                                                        <span class="material-symbols-outlined text-lg">
                                                            photo
                                                        </span>
                                                        Photo
                                                    </Button>
                                                </li>
                                                <li>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        v-close-popper="true"
                                                        @click="onSelectAddTextNote"
                                                    >
                                                        <span class="material-symbols-outlined text-lg">
                                                            sticky_note_2
                                                        </span>
                                                        Text note
                                                    </Button>
                                                </li>
                                            </ul>
                                        </template>
                                    </base-popover-content>
                                </template>
                            </v-dropdown>
                            <div
                                v-else
                                class="p-4 rounded-xl shadow-box-lg"
                            >
                                <form
                                    @submit.prevent="onSubmitForm"
                                    novalidate
                                >
                                    <FieldGroup class="gap-6">
                                        <FormField
                                            v-if="isAddPhotoShown"
                                            v-slot="{ componentField }"
                                            name="file"
                                        >
                                            <FormItem>
                                                <FormLabel>
                                                    Image
                                                </FormLabel>
                                                <FormControl>
                                                    <base-upload-button
                                                        input-id="plant-image"
                                                        :show-reset="false"
                                                        @send-file="(file) => {

                                                            componentField.onChange(file);
                                                        }"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        </FormField>
                                        <FormField
                                            v-if="isAddTextNoteShown"
                                            v-slot="{ componentField }"
                                            name="desc"
                                        >
                                            <FormItem>
                                                <FormLabel>
                                                    Description
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Enter plant description..."
                                                        class="resize-none"
                                                        v-bind="componentField"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        </FormField>
                                        <FieldGroup class="grid grid-cols-[30%_1fr] gap-4">
                                            <Button
                                                class="w-full"
                                                variant="ghost"
                                                @click="onCancelAddRecord"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                class="w-full"
                                                :class="{ 'animate-pulse': isPending }"
                                                variant="hover-outline"
                                                :disabled="isPending || !meta.valid"
                                            >
                                                {{ addCustomLogButtonLabel }}
                                            </Button>
                                        </FieldGroup>
                                    </FieldGroup>
                                </form>
                            </div>
                        </transition>
                    </li>
                    <li
                        v-for="action in formattedActions"
                        :key="action.id"
                        class="grid "
                    >
                        <div class="text-gray-400 dark:text-neutral-600 text-xs ml-[40px]">
                            {{ action.formattedDate }}

                        </div>
                        <div class="text-gray-600 dark:text-neutral-500 grid grid-cols-[30px_1fr] gap-[10px] items-start">
                            <span class="size-[30px] text-xl text-gray-400 dark:text-neutral-500 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center shrink-0">
                                <span class="material-symbols-outlined">
                                    {{ action.icon }}
                                </span>
                            </span>
                            <span class="self-center text-sm md:text-base">
                                <span :class="{ 'mt-1 block': action.action === 'custom photo' }">

                                    <span class="inline-flex align-top">
                                        {{ action.action === 'custom note' || action.action === 'custom photo' ? "Plant's" : "Plant" }}
                                    </span>

                                    {{ action.action }}

                                    <template v-if="action.action === 'moved'">
                                        from <strong>{{ action.originName }}</strong>
                                        to <strong>{{ action.targetName }}</strong>
                                    </template>

                                    <template v-else-if="action.action === 'name' || action.action === 'light requirements'">
                                        changed from <strong>{{ action.originalVal }}</strong>
                                        to <strong>{{ action.newVal }}</strong>
                                    </template>

                                </span>
                                <template v-if="action.action == 'custom note' || action.action == 'custom photo'">
                                    <div class="relative">
                                        <template v-if="action.action === 'custom note'">
                                            <div class="mt-2 bg-gray-100 dark:bg-neutral-800 px-4 py-2 rounded-xl">
                                                {{ action.newVal }}
                                            </div>
                                        </template>
                                        <template v-else>
                                            <div class="relative rounded-xl bg-gray-50 dark:bg-neutral-950 h-[200px] flex items-center justify-center overflow-hidden mt-2">
                                                <base-image-wireframe v-if="!loadedImages.has(action.id)" />
                                                <img
                                                    :ref="setImgRef"
                                                    :data-src="action.newVal"
                                                    :alt="props.plantName"
                                                    loading="lazy"
                                                    class="w-full h-full inset-0 object-cover absolute rounded-xl transition-opacity duration-600"
                                                    :class="loadedImages.has(action.id) ? 'opacity-100' : 'opacity-0'"
                                                    @load="onLoad(action.id)"
                                                />

                                            </div>
                                        </template>
                                        <v-dropdown
                                            trap-focus
                                            @show="onShow"
                                            @hide="onHide"
                                            popper-class="popper-slide-small"
                                            class="absolute -top-3 -right-3 md:-top-4 md:-right-4"
                                        >
                                            <button
                                                v-tooltip="{
                                                    content: 'Delete custom record',
                                                    placement: 'top',
                                                    container: 'body'
                                                }"
                                                type="button"
                                                class="rounded-full bg-white dark:bg-neutral-800 p-2 text-xl text-gray-500 hover:text-red-500 dark:text-red-900 transition-all duration-600 cursor-pointer flex items-center justify-center shadow-popover"
                                            >
                                                <span class="material-symbols-outlined"> delete </span>
                                            </button>
                                            <template #popper>
                                                <base-popover-content>
                                                    <template #title>
                                                        Delete this custom record?
                                                    </template>

                                                    <template #desc>
                                                        The custom record will be deleted.
                                                    </template>

                                                    <template #actions>
                                                        <Button
                                                            size="sm"
                                                            variant="secondary"
                                                            class="min-w-1/3"
                                                            v-close-popper="true"
                                                        >
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            class="min-w-3/5"
                                                            v-close-popper="true"
                                                            @click="handleDeleteRecord(action.id)"
                                                        >
                                                            Yes, delete it
                                                        </Button>
                                                    </template>
                                                </base-popover-content>
                                            </template>
                                        </v-dropdown>
                                    </div>
                                </template>

                            </span>

                        </div>
                    </li>
                    <li class="grid">
                        <div class="text-gray-400 dark:text-neutral-600 text-xs ml-[40px]">
                            {{ formattedDate }}
                        </div>
                        <div class="text-gray-600 dark:text-neutral-500 grid grid-cols-[30px_1fr] gap-[10px] items-start">
                            <span class="size-[30px] text-xl text-gray-400 dark:text-neutral-500 bg-gray-100 dark:bg-neutral-800 p-2 rounded-full flex items-center justify-center shrink-0">
                                <span class="material-symbols-outlined">
                                    add
                                </span>
                            </span>
                            <span class="self-center text-sm md:text-base">
                                Plant added
                            </span>
                        </div>
                    </li>
                </ul>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { computed, nextTick, ref, watchEffect } from "vue";

import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import * as z from 'zod';

import { db } from "@/firebase/config";
import { format } from "date-fns";
import { doc, getDoc } from "firebase/firestore";

import BaseUploadButton from '@/components/base/BaseForm/BaseUploadButton.vue';
import BaseImageWireframe from '@/components/base/BaseImageWireframe.vue';
import BaseLoader from '@/components/base/BaseLoader.vue';
import BasePopoverContent from '@/components/base/BasePopoverContent.vue';

import { Button } from '@/components/ui/button';

import {
    Alert,
    AlertDescription
} from '@/components/ui/alert';

import { useStorage, useUpdateData } from "@/composables";

import {
    FieldGroup
} from '@/components/ui/field';

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';

import { Textarea } from '@/components/ui/textarea';

const {
    error: errorUpload,
    url,
    filePath,
    isPending: isPendingUpload,
    uploadImage,
    deleteImageByUrl
} = useStorage()

const {
    error: errorUpdate,
    isPending: isPendingUpdate,
    updateData,
} = useUpdateData()

import { useAuthStore } from "@/stores/useAuthStore";
import { addLog, observeVisibility, resizeImageBitmap } from "@/utils";

const authStore = useAuthStore()

const props = defineProps({
    data: {
        type: Object,
        required: true
    },
    isPending: {
        type: Boolean,
        required: true
    },
    error: {
        type: [Object, null],
        required: false,
        default: null
    },
    roomId: {
        type: String,
        required: true
    },
    plantName: {
        type: String,
        required: true
    }
})

const formattedDate = computed(() => {
    const createdAt = props.data?.createdAt
    return createdAt?.toDate ? format(createdAt.toDate(), 'MMM d, yyyy') : '—'
})

const actionIconMap = {
    watered: {
        icon: 'humidity_high'
    },
    moved: {
        icon: 'arrow_forward'
    },
    name: {
        icon: 'edit'
    },
    icon: {
        icon: 'edit'
    },
    description: {
        icon: 'edit'
    },
    image: {
        icon: 'edit'
    },
    'light requirements': {
        icon: 'sunny'
    },
    'custom photo': {
        icon: 'photo'
    },
    'custom note': {
        icon: 'sticky_note_2'
    }
}

const formattedActions = ref([])

const isLoadingActions = ref(false)

watchEffect(async () => {
    const log = props.data?.log;

    if (!log?.length) {
        formattedActions.value = []
        return
    }

    isLoadingActions.value = true

    const roomIds = [
        ...new Set(
            log.flatMap(r => [r.origin, r.target]).filter(Boolean)
        )
    ]

    const RoomDocument = await Promise.all(
        roomIds.map(id => getDoc(doc(db, `users/${authStore.user?.uid}/rooms/${id}`)))
    )

    const roomMap = new Map()

    RoomDocument.forEach((snap, index) => {
        const id = roomIds[index]
        roomMap.set(id, snap.data()?.name)
    })

    formattedActions.value = log.map(a => {
        const date = a.date?.toDate ? a.date.toDate() : new Date(a.date)

        const roomMoveData = roomMap.get(a.origin) ? {
            originName: roomMap.get(a.origin) ?? null,
            targetName: roomMap.get(a.target) ?? '<room deleted>'
        } : null

        const { origin, target, ...rest } = a

        const action = {
            ...rest,
            icon: actionIconMap[a.action]?.icon || '',
            formattedDate: format(date, 'MMM d, yyyy'),
            ...roomMoveData,
            rawDate: date
        }

        if (a.action === 'custom photo' || a.action === 'custom note') {
            delete action.originalVal
        }

        if (action.originalVal === null) {
            action.originalVal = '<not set>'
        }

        return action
    }).sort((a, b) => b.rawDate - a.rawDate)

    isLoadingActions.value = false
})

const isOpen = ref(false)

const onShow = () => (isOpen.value = true)
const onHide = () => (isOpen.value = false)

const isAddRecordShown = ref(true)
const isAddPhotoShown = ref(false)
const isAddTextNoteShown = ref(false)

const handleAddRecord = () => {
    isAddRecordShown.value = false
}

const onSelectAddPhoto = () => {
    handleAddRecord()
    isAddPhotoShown.value = true
}

const onSelectAddTextNote = () => {
    handleAddRecord()
    isAddTextNoteShown.value = true
}

const isPhoto = computed(() => isAddPhotoShown.value)
const isNote = computed(() => isAddTextNoteShown.value)

const formSchema = computed(() => toTypedSchema(
    z.object({
        desc: isNote.value ? z.string().min(1) : z.string().optional(),
        file: isPhoto.value ? z.any().refine(v => v) : z.any().optional(),
    })
))

const { handleSubmit, setValues, resetForm, meta } = useForm({
    validationSchema: formSchema,
    initialValues: {
        desc: '',
        file: null,
    },
})

const onSubmitForm = handleSubmit(async (values) => {
    let log = []

    const existingLog = props.data?.log || [];


    if (isAddPhotoShown.value) {
        const resizedFile = await resizeImageBitmap(values.file, 400, 400)

        const uploadSuccess = await uploadImage('plants', authStore.user, resizedFile)



        if (uploadSuccess) {
            addLog(log, 'custom photo', null, url.value)
        }
    } else if (isAddTextNoteShown.value) {
        addLog(log, 'custom note', null, values.desc)
    }

    props.data.log = [
        ...existingLog,
        ...log
    ];

    const success = await updateData(props.data, `rooms/${props.roomId}/plants/${props.data.id}`);

    if (success) {
        resetForm()
    }

    isAddPhotoShown.value = false
    isAddTextNoteShown.value = false

    isAddRecordShown.value = true

})

const onCancelAddRecord = () => {
    isAddRecordShown.value = true
    isAddPhotoShown.value = false
    isAddTextNoteShown.value = false
}

const loadedImages = ref(new Set())

const onLoad = (id) => {
    loadedImages.value.add(id)
}

const setImgRef = async (el) => {
    if (!el || !el.dataset.src) return

    await nextTick()
    await observeVisibility(el, { threshold: 0, rootMargin: '300px' })

    if (el.dataset.src) {
        el.src = el.dataset.src
        el.removeAttribute('data-src')
    }
}


const addCustomLogButtonLabel = computed(() => {
    return isAddTextNoteShown.value ? 'Add note' : 'Add photo'
})

const isPending = computed(() => {
    return errorUpload.value || errorUpdate.value
})

const error = computed(() => {
    return errorUpload.value || errorUpdate.value
})

const handleDeleteRecord = async (id) => {
    const updatedLog = props.data.log.filter(log => log.id !== id)

    const data = {
        log: updatedLog
    };

    let successDeleteImage;

    if (props.data.log.find(log => log.id === id)?.action === 'custom photo') {
        successDeleteImage = await deleteImageByUrl(props.data.log.find(log => log.id === id)?.newVal)
    }

    if (!successDeleteImage) {

    }

    const success = await updateData(data, `rooms/${props.roomId}/plants/${props.data.id}`)

    if (success) {
        console.log(
            'cusses'
        )
    }

}

</script>

<style lang="scss" scoped></style>